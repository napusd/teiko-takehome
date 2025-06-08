from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db, init_db, Subject, Overview, Sample, get_overviews, get_subjects, get_samples
from sqlalchemy.exc import SQLAlchemyError

import pandas as pd
import json

# Setup Flask server along with db
app = Flask(__name__)
CORS(app)
init_db(app)

# Directory to get the data
CSV_DATA = './assets/cell-count.csv'

def compute_rel_freq(df):
    cell_types = list(df.columns[-5:])
    for index, row in df.iterrows():
        total_count = sum(list(row[cell_types]))
        for type in cell_types:
            row[type] = row[type]/total_count
        df.loc[index] = row

def process_data():
    df = pd.read_csv(CSV_DATA)
    compute_rel_freq(df)
    cell_types = list(df.columns[-5:])
    responders ={}
    non_responders ={}

    for index, row in df.iterrows():
        if row['condition'] == 'melanoma' and row['sample_type'] == 'PBMC':
            if row['response'] == 'y':
                if row['subject'] not in responders:
                    responders[row['subject']]=row
                else: # We want to get the latest sample of this patient
                    old_sample = responders[row['subject']]['sample']
                    new_sample = row['sample']
                    if new_sample > old_sample:
                        responders[row['subject']]=row
            else:
                if row['subject'] not in non_responders:
                    non_responders[row['subject']]=row
                else: # We want to get the latest sample of  this patient
                    old_sample = non_responders[row['subject']]['sample']
                    new_sample = row['sample']
                    if new_sample > old_sample:
                        non_responders[row['subject']]=row

    data = {type: {'responders':[], 'non-responders':[]} for type in cell_types}

    for k, sample in responders.items():
        for type in cell_types:
            data[type]['responders'].append(sample[type])

    for k, sample in non_responders.items():
        for type in cell_types:
            data[type]['non-responders'].append(sample[type])

    return data

@app.route('/api/db', methods=['GET'])
def get_db_view():
    samples = get_samples()
    overviews = get_overviews()
    subjects = get_subjects()
    data = {'sample':samples, 'overview':overviews, 'subject':subjects}
    return jsonify(data)

@app.route('/api/db/delete', methods=['POST'])
def delete_db_entry():
    try:
        data=request.json
        sample_id = data.get('sample')
        if not sample_id:
            return jsonify({'error': 'Sample ID is required'}), 400
        # Delete from both tables where sample matches
        Sample.query.filter_by(sample_id=sample_id).delete()
        Overview.query.filter_by(sample_id=sample_id).delete()
        db.session.commit()

        return jsonify({'message': f"Sample '{sample_id}' deleted successfully"}), 200
    except SQLAlchemyError as e:
            db.session.rollback()
            print(e)
            return jsonify({'error': str(e)}), 500

@app.route('/api/db/submit', methods=['POST'])
def submit_db_entry():
    try:
        data = request.json
        sample_id = data['sample']
        cell_types = ['b_cell', 'cd8_t_cell', 'cd4_t_cell', 'nk_cell', 'monocyte']
        print(data)

        for type in cell_types:
            sample = Sample.query.filter_by(sample_id=sample_id, cell_type=type).first()
            if sample:
                sample.sample_type = data['sample_type']
                sample.treatment = data['treatment']
                sample.response = data['response']
                sample.time_from_treatment_start = data['time_from_treatment_start']
                sample.population_count = data[type]
            else:
                sample = Sample(
                    sample_id=sample_id,
                    sample_type=data['sample_type'],
                    treatment=data['treatment'],
                    response=data['response'],
                    time_from_treatment_start=data['time_from_treatment_start'],
                    cell_type=type,
                    population_count=data[type]
                )
                db.session.add(sample)

        # Check for existing Overview by sample_id
        overview = Overview.query.filter_by(sample_id=sample_id).first()
        if overview:
            # Update existing Overview
            overview.project_id = data['project']
            overview.subject_id = data['subject']
        else:
            # Create new Overview
            overview = Overview(
                sample_id=sample_id,
                project_id=data['project'],
                subject_id=data['subject']
            )
            db.session.add(overview)

        subject_id = data['subject']
        subject = Subject.query.filter_by(subject_id=subject_id).first()
        if subject:
            subject.condition = data['condition']
            subject.age= data['age']
            subject.sex = data['sex']
        else:
            subject = Subject(
                subject_id=subject_id,
                condition=data['condition'],
                age=data['age'],
                sex=data['sex']
            )
            db.session.add(subject)

        db.session.commit()
        return jsonify({'message': 'Entry submitted successfully'}), 200

    except (KeyError, SQLAlchemyError) as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/plots', methods=['GET'])
def response_plots():

    return jsonify(process_data())
@app.route('/api/db/filter', methods=['POST'])
def filter_data():
    filters = request.json
    print(filters)

    # Start with base queries
    subject_query = db.session.query(Subject)
    sample_query = db.session.query(Sample)
    overview_query = db.session.query(Overview)

    # Apply filters to Subject
    if "condition" in filters and filters["condition"]:
        subject_query = subject_query.filter(Subject.condition.in_(filters["condition"]))
    if "sex" in filters and filters["sex"]:
        subject_query = subject_query.filter(Subject.sex.in_(filters["sex"]))

    subjects = subject_query.all()
    subject_ids = {subject.subject_id for subject in subjects}

    # Apply filters to Sample based on sample_ids and other criteria
    if "response" in filters and filters["response"]:
        sample_query = sample_query.filter(Sample.response.in_(filters["response"]))
    if "treatment" in filters and filters["treatment"]:
        sample_query = sample_query.filter(Sample.treatment.in_(filters["treatment"]))
    if "sample_type" in filters and filters["sample_type"]:
        sample_query = sample_query.filter(Sample.sample_type.in_(filters["sample_type"]))
    # Time range filter
    time_filter = filters.get("time_from_treatment_start", {})
    if isinstance(time_filter, dict):
        start = time_filter.get("start")
        end = time_filter.get("end")
        if start is not None:
            sample_query = sample_query.filter(Sample.time_from_treatment_start >= start)
        if end is not None:
            sample_query = sample_query.filter(Sample.time_from_treatment_start <= end)

    samples = sample_query.all()
    sample_ids = {sample.sample_id for sample in samples}

    # Overview filters
    if "projects" in filters and filters["projects"]:
        overview_query = overview_query.filter(Overview.project_id.in_(filters["projects"]))

    # Apply filters to Overview based on subject_ids
    overview_query = overview_query.filter(Overview.subject_id.in_(subject_ids))
    overview_query = overview_query.filter(Overview.sample_id.in_(sample_ids))
    overviews = overview_query.all()

    # Final filtering: ensure the remaining sample_ids match all criteria
    sample_ids = {overview.sample_id for overview in overviews}
    subject_ids = {o.subject_id for o in overviews}
    subjects = [s for s in subjects if s.subject_id in subject_ids]
    samples = [s for s in samples if s.sample_id in sample_ids]

    return jsonify({
        "sample": [
            {
                "sample_id": s.sample_id,
                "sample_type": s.sample_type,
                "treatment": s.treatment,
                "response": s.response,
                "time_from_treatment_start": s.time_from_treatment_start,
                "cell_type": s.cell_type,
                "population_count": s.population_count,
            } for s in samples
        ],
        "subject": [
            {
                "subject_id": s.subject_id,
                "condition": s.condition,
                "age": s.age,
                "sex": s.sex,
            } for s in subjects
        ],
        "overview": [
            {
                "sample_id": o.sample_id,
                "subject_id": o.subject_id,
                "project_id": o.project_id,
            } for o in overviews
        ]
    })

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(port=5000)

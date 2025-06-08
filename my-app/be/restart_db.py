from database import db, init_db, Subject, Sample, Overview
from flask import Flask
import pandas as pd

# Create a temporary Flask app to use app context
app = Flask(__name__)
init_db(app)
CSV_DATA = './assets/cell-count.csv'


def seed_data():
    df = pd.read_csv(CSV_DATA)
    subjects, samples, overviews = [], [], []
    subject_set = set()
    cell_types = list(df.columns[-5:])
    print(df.columns)
    for index, row in df.iterrows():
        if row['subject'] not in subject_set:
            sbj = row['subject']
            subject_set.add(sbj)
            subjects.append(Subject(subject_id=sbj, condition=row['condition'], age=row['age'], sex=row['sex']))

        overviews.append(Overview(sample_id=row['sample'], subject_id=row['subject'], project_id=row['project']))

        for type in cell_types:
            samples.append(Sample(sample_id=row['sample'], sample_type=row['sample_type'],
                treatment=row['treatment'],
                response=row['response'] if not pd.isnull(row['response']) else None,
                time_from_treatment_start=row['time_from_treatment_start'] if not pd.isnull(row['time_from_treatment_start']) else None,
                cell_type=type,
                population_count=row[type]))


    db.session.bulk_save_objects(subjects)
    db.session.bulk_save_objects(samples)
    db.session.bulk_save_objects(overviews)

    db.session.commit()
    print("Seed data inserted.")

# Drop and recreate the database
with app.app_context():
    db.drop_all()
    db.create_all()
    seed_data()
    print("Database restarted and seeded.")

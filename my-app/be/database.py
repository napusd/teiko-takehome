import os
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data/teiko.db'
    db.init_app(app)

def get_samples():
    samples = Sample.query.all()
    return [{'sample_id': sample.sample_id, 'sample_type': sample.sample_type,
        'treatment': sample.treatment, 'response':sample.response,
        'time_from_treatment_start': sample.time_from_treatment_start,
        'cell_type': sample.cell_type,
        'population_count': sample.population_count} for sample in samples]

def get_subjects():
    subjects = Subject.query.all()
    return [{'subject_id': subject.subject_id, 'condition': subject.condition,
        'age': subject.age, 'sex': subject.sex} for subject in subjects]

def get_overviews():
    overviews = Overview.query.all()
    return [{'sample_id': overview.sample_id,'subject_id': overview.subject_id,
        'project_id': overview.project_id} for overview in overviews]

# Defining Sample model
class Sample(db.Model):
    sample_id = db.Column(db.String(80), primary_key=True)
    sample_type = db.Column(db.String(80), nullable=False)
    treatment = db.Column(db.String(80), nullable=False)
    response = db.Column(db.String(1), nullable=True)
    time_from_treatment_start = db.Column(db.Integer, nullable=True)
    cell_type = db.Column(db.String(80), primary_key=True)
    population_count = db.Column(db.Integer, nullable=False)

# Defining Subject model
class Subject(db.Model):
    subject_id = db.Column(db.String(80), primary_key=True, nullable=False)
    condition = db.Column(db.String(80), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    sex = db.Column(db.String(1), nullable=False)

# Defining Overview model
class Overview(db.Model):
    sample_id = db.Column(db.String(80), primary_key=True)
    subject_id = db.Column(db.String(80), nullable=False)
    project_id = db.Column(db.String(80), nullable=False)

from flask import Flask, request, jsonify
from flask_cors import CORS

import pandas as pd
import json

app = Flask(__name__)
CORS(app)

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

@app.route('/plots', methods=['GET'])
def response_plots():
    return jsonify(process_data())

if __name__ == '__main__':
    app.run(port=5000)

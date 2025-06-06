import pandas as pd


df = pd.read_csv('cell-count.csv')

cell_types = list(df.columns[-5:])

processed_df = []

for index, row in df.iterrows():
    total_count = sum(row[cell_types])
    for type in cell_types:
        processed_row = {'sample':row['sample'],
            'total_count': total_count,
            'population': type,
            'count': row[type],
            'percentage': row[type]/total_count}
        processed_df.append(processed_row)


processed_df = pd.DataFrame(processed_df)
processed_df.to_csv('processed-cell-count.csv', index=False)

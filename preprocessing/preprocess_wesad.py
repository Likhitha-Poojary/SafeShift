import pandas as pd
import pickle
import os

input_folder = '../data/wesad_raw/'
output_file = '../data/wesad.csv'

all_data = []

for file in os.listdir(input_folder):
    if file.endswith('.pkl'):
        with open(os.path.join(input_folder, file), 'rb') as f:
            data = pickle.load(f)
            # Assume data is a dictionary with 'signals'
            df = pd.DataFrame(data['signals'])
            all_data.append(df)

processed = pd.concat(all_data)
processed.to_csv(output_file, index=False)
print("WESAD preprocessing done. Saved to", output_file)

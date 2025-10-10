import pandas as pd

input_file = '../data/affectiveroad_raw/data.csv'
output_file = '../data/affectiveroad.csv'

df = pd.read_csv(input_file)
# Example: select only sensor columns
df = df.iloc[:, 1:]  
df.to_csv(output_file, index=False)
print("AffectiveROAD preprocessing done.")

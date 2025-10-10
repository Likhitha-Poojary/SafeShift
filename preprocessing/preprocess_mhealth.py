import pandas as pd

df = pd.read_csv('../data/mhealth_raw/mhealth.csv')
# Example: simple cleaning
df = df.dropna()
df.to_csv('../data/mhealth.csv', index=False)
print("MHEALTH preprocessing done.")

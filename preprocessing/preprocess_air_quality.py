import pandas as pd

df = pd.read_csv('../data/air_quality_raw/air_quality.csv')
df = df.dropna()
df.to_csv('../data/air_quality.csv', index=False)
print("Air Quality preprocessing done.")

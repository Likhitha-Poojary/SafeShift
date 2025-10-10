import pandas as pd

df = pd.read_csv('../data/har_raw/har.csv')
# Example: keep only numerical features
df = df.select_dtypes(include='number')
df.to_csv('../data/har.csv', index=False)
print("HAR preprocessing done.")

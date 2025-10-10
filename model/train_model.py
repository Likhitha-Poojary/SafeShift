import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pickle

# Example: using HAR data for motion model
data = pd.read_csv('../data/har.csv')
X = data.drop(columns=['Activity'], errors='ignore')  # drop label if not exists
y = data['Activity'] if 'Activity' in data.columns else (X.mean(axis=1) > X.mean().mean()).astype(int)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train motion model
motion_model = RandomForestClassifier(n_estimators=50, random_state=42)
motion_model.fit(X_train, y_train)
y_pred = motion_model.predict(X_test)
print("Motion model accuracy:", accuracy_score(y_test, y_pred))

# Save models
with open('motion_model.pkl', 'wb') as f:
    pickle.dump(motion_model, f)

# Example fatigue model (use WESAD or MHEALTH)
fatigue_model = RandomForestClassifier(n_estimators=50, random_state=42)
fatigue_model.fit(X_train, y_train)  # replace with actual fatigue labels
with open('fatigue_model.pkl', 'wb') as f:
    pickle.dump(fatigue_model, f)

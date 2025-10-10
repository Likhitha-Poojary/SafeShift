from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

# Load models
motion_model = pickle.load(open('../model/motion_model.pkl', 'rb'))
fatigue_model = pickle.load(open('../model/fatigue_model.pkl', 'rb'))

@app.route('/')
def home():
    return "SafeShift Backend Running"

@app.route('/predict_motion', methods=['POST'])
def predict_motion():
    data = request.json
    df = pd.DataFrame([data])
    pred = motion_model.predict(df)
    return jsonify({'motion_prediction': int(pred[0])})

@app.route('/predict_fatigue', methods=['POST'])
def predict_fatigue():
    data = request.json
    df = pd.DataFrame([data])
    pred = fatigue_model.predict(df)
    return jsonify({'fatigue_prediction': int(pred[0])})

if __name__ == "__main__":
    app.run(debug=True)

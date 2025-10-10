# SafeShift Project

## Overview
SafeShift analyzes wearable, health, and environmental sensor data to detect motion anomalies and driver fatigue. It uses ML models, a Flask backend, and a Streamlit dashboard.

## Folder Structure
- `data/` : Raw and processed datasets
- `preprocessing/` : Scripts to process raw datasets
- `model/` : Train and store ML models
- `backend/` : Flask API for predictions
- `dashboard/` : Streamlit app to visualize and interact
- `hardware/` : ESP32 code to simulate sensor input
- `requirements.txt` : Python dependencies

## Instructions
1. Install dependencies: `pip install -r requirements.txt`
2. Preprocess datasets: run scripts in `preprocessing/`
3. Train models: `python model/train_model.py`
4. Start backend: `python backend/app.py`
5. Launch dashboard: `streamlit run dashboard/app.py`
6. Optional: Upload data from ESP32 hardware

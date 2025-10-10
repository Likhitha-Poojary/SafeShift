import streamlit as st
import requests
import pandas as pd

st.title("SafeShift Dashboard")

st.subheader("Motion Prediction")
motion_input = st.text_input("Enter sample motion values (comma separated)")
if st.button("Predict Motion"):
    try:
        values = [float(x) for x in motion_input.split(',')]
        response = requests.post("http://127.0.0.1:5000/predict_motion", json={i: v for i,v in enumerate(values)})
        st.success("Prediction: " + str(response.json()['motion_prediction']))
    except:
        st.error("Invalid input")

st.subheader("Fatigue Prediction")
fatigue_input = st.text_input("Enter sample fatigue values (comma separated)")
if st.button("Predict Fatigue"):
    try:
        values = [float(x) for x in fatigue_input.split(',')]
        response = requests.post("http://127.0.0.1:5000/predict_fatigue", json={i: v for i,v in enumerate(values)})
        st.success("Prediction: " + str(response.json()['fatigue_prediction']))
    except:
        st.error("Invalid input")

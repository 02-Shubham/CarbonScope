from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import pandas as pd
import joblib
from tensorflow.keras.models import load_model
from typing import List

app = FastAPI(title="Daily Emissions Proxy API", version="2.0")

class PredictionRequest(BaseModel):
    past_days_data: List[dict]

    class Config:
        schema_extra = {
            "example": {
                "past_days_data": [
                    {"CO": 1.2, "PM2.5": 55.4, "NO2": 25.1, "SO2": 15.0}
                ] * 30 # Just an example array of 30 days
            }
        }

scaler = None
model = None
feature_cols = None
target_idx = None

@app.on_event("startup")
def load_assets():
    global scaler, model, feature_cols, target_idx
    try:
        scaler = joblib.load('scaler.pkl')
        model = load_model('models/lstm_model.keras')
        df = pd.read_csv('indian_daily_emissions.csv', nrows=1)
        feature_cols = ['CO', 'PM2.5', 'NO2', 'SO2']
        target_idx = feature_cols.index('CO')
        print("Models loaded successfully.")
    except Exception as e:
        print("Model assets not found. Make sure to run train.py first.", e)

@app.post("/predict")
def predict_emission(request: PredictionRequest):
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Model is not loaded. Train the model first.")
        
    past_data = request.past_days_data
    if len(past_data) != 30:
        raise HTTPException(status_code=400, detail="Exactly 30 past days of data are required.")
        
    try:
        df_input = pd.DataFrame(past_data)
        
        missing_cols = [c for c in feature_cols if c not in df_input.columns]
        if missing_cols:
            raise HTTPException(status_code=400, detail=f"Missing feature columns: {missing_cols}")
            
        df_input = df_input[feature_cols]
        scaled_input = scaler.transform(df_input.values)
        X = scaled_input.reshape(1, 30, len(feature_cols))
        
        pred_scaled = model.predict(X)[0][0]
        
        dummy_row = [0] * len(feature_cols)
        dummy_row[target_idx] = pred_scaled
        pred_unscaled = scaler.inverse_transform([dummy_row])[0][target_idx]
        
        return {
            "status": "success",
            "prediction": {
                "predicted_CO_emission_index": float(max(0, pred_unscaled))
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/insights")
def insights():
    try:
        df = pd.read_csv('indian_daily_emissions.csv')
        
        # Calculate recent 30-day trend slope
        recent_co = df['CO'].values[-30:]
        x_days = np.arange(30)
        slope = np.polyfit(x_days, recent_co, 1)[0]
        
        numeric_df = df.select_dtypes(include=[np.number])
        corr = numeric_df.corr()['CO'].sort_values(ascending=False)
        top_factors = list(corr.index[1:3])
        
        return {
            "30_day_trend": "increasing" if slope > 0 else "decreasing",
            "slope": float(slope),
            "major_contributing_factors": top_factors
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Data not available.")

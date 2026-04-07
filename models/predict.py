import numpy as np
import pandas as pd
import joblib
from tensorflow.keras.models import load_model
import matplotlib.pyplot as plt
import os
import datetime

SEQ_LENGTH = 30
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_environment():
    try:
        scaler = joblib.load(os.path.join(BASE_DIR, 'scaler.pkl'))
        model = load_model(os.path.join(BASE_DIR, 'saved_models', 'lstm_model.keras'))
        df = pd.read_csv(os.path.join(BASE_DIR, 'indian_daily_emissions.csv'))
        df['Date'] = pd.to_datetime(df['Date'])
        return scaler, model, df
    except Exception as e:
        print("Error loading environment files:", e)
        return None, None, None

def forecast_future(model, scaler, df, feature_cols, target_idx, num_days=30):
    """
    Auto-regressive daily forecasting for the next robust 30 days.
    """
    last_known_data = df[feature_cols].copy().values[-SEQ_LENGTH:]
    scaled_data = scaler.transform(last_known_data)
    current_input = scaled_data.copy().reshape(1, SEQ_LENGTH, len(feature_cols))
    
    predictions_scaled = []
    
    for _ in range(num_days):
        next_pred = model.predict(current_input, verbose=0)[0][0]
        predictions_scaled.append(next_pred)
        
        # Shift
        new_step = np.copy(current_input[0, -1, :])
        new_step[target_idx] = next_pred 
        
        current_input = np.roll(current_input, -1, axis=1)
        current_input[0, -1, :] = new_step
        
    # Unscale
    predictions_unscaled = []
    dummy_row = [0] * len(feature_cols)
    for p in predictions_scaled:
        dummy = list(dummy_row)
        dummy[target_idx] = p
        inv = scaler.inverse_transform([dummy])[0][target_idx]
        predictions_unscaled.append(max(0, inv)) # Prevent negative CO mathematically
        
    return predictions_unscaled

def generate_insights(df, predictions):
    trend = "increasing" if predictions[-1] > predictions[0] else "decreasing"
    
    numeric_df = df.select_dtypes(include=[np.number])
    corr = numeric_df.corr()['CO'].sort_values(ascending=False)
    top_factors = list(corr.index[1:3])
    
    insights = {
        "30_day_trend": trend,
        "forecast_change_percent": round(((predictions[-1] - predictions[0]) / predictions[0]) * 100, 2),
        "major_correlated_factors": top_factors,
    }
    
    return insights

if __name__ == "__main__":
    scaler, model, df = load_environment()
    if scaler and model and df is not None:
        feature_cols = ['CO', 'PM2.5', 'NO2', 'SO2']
        target_idx = feature_cols.index('CO')
        
        last_date = df['Date'].max()
        next_dates = [last_date + datetime.timedelta(days=i) for i in range(1, 31)]
        
        preds = forecast_future(model, scaler, df, feature_cols, target_idx, num_days=30)
        
        insights = generate_insights(df, preds)
        print("Insights:", insights)
        
        plt.figure(figsize=(10,5))
        plt.plot(df['Date'][-60:], df['CO'][-60:], label='Historical Daily CO')
        plt.plot(next_dates, preds, label='30-Day Forecast', linestyle='--', color='red')
        plt.title('India Daily Emissions 30-Day Forecast (CO)')
        plt.xlabel('Date')
        plt.ylabel('Emissions Index')
        plt.grid(True)
        plt.legend()
        os.makedirs('plots', exist_ok=True)
        plt.savefig('plots/forecast.png')
        print("Forecast plot saved to plots/forecast.png")

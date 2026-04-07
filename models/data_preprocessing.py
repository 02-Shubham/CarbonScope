import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import requests
import io
import os
import joblib

DATA_URL = "https://raw.githubusercontent.com/learning-monk/datasets/master/Indian_cities_daily_pollution_2015-2020.csv"
DATA_FILE = "indian_daily_emissions.csv"

def download_and_clean_data(force_download=False):
    """
    Downloads Indian Daily Emissions proxy dataset, aggregates nationally, and handles missing values.
    """
    if force_download or not os.path.exists(DATA_FILE):
        print("Downloading massive daily dataset...")
        response = requests.get(DATA_URL)
        df_full = pd.read_csv(io.StringIO(response.text))
        
        # Parse Date and sort
        df_full['Date'] = pd.to_datetime(df_full['Date'])
        
        # We want to create a national average proxy for emissions per day.
        # Group by Date and calculate mean for numeric columns
        df_national = df_full.groupby('Date').mean(numeric_only=True).reset_index()
        
        # Sort chronologically just in case
        df_national = df_national.sort_values('Date').reset_index(drop=True)
        
        # Save local copy
        df_national.to_csv(DATA_FILE, index=False)
    else:
        print("Loading local daily dataset...")
        df_national = pd.read_csv(DATA_FILE)
        df_national['Date'] = pd.to_datetime(df_national['Date'])
        
    print(f"Total days tracking: {len(df_national)}")
    print(df_national.tail())

    # Handle missing values: Interpolate is better for time-series, fallback to ffill/bfill
    df_national.interpolate(method='linear', limit_direction='both', inplace=True)
    df_national.ffill(inplace=True)
    df_national.bfill(inplace=True)
    df_national.fillna(0, inplace=True)
    
    # Select our target (CO) and top correlated proxy features (PM2.5, NO2, SO2)
    cols_to_keep = ['Date', 'CO', 'PM2.5', 'NO2', 'SO2']
    df_national = df_national[cols_to_keep]
    
    return df_national

def scale_data(df, feature_cols, scaler_path="scaler.pkl"):
    """
    Scales features to (0, 1) range using MinMaxScaler.
    """
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(df[feature_cols])
    
    joblib.dump(scaler, scaler_path)
    
    df_scaled = pd.DataFrame(scaled_data, columns=feature_cols)
    df_scaled['Date'] = df['Date'].values
    
    return df_scaled, scaler

def create_sequences(df_scaled, feature_cols, target_col='CO', seq_length=30):
    """
    Converts time-series data into sequences. Using 30 days window.
    """
    X, y = [], []
    data_values = df_scaled[feature_cols].values
    target_idx = feature_cols.index(target_col)
    target_values = df_scaled[target_col].values
    
    for i in range(len(data_values) - seq_length):
        X.append(data_values[i:i+seq_length])
        y.append(target_values[i+seq_length])
        
    return np.array(X), np.array(y)

if __name__ == "__main__":
    df = download_and_clean_data(force_download=True)
    feature_columns = [col for col in df.columns if col != 'Date']
    df_scaled, scaler = scale_data(df, feature_columns)
    X, y = create_sequences(df_scaled, feature_columns, target_col='CO', seq_length=30)
    print(f"Dataset successfully built! X shape: {X.shape}, y shape: {y.shape}")

import numpy as np
import pandas as pd
import joblib
from tensorflow.keras.models import load_model
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from data_preprocessing import download_and_clean_data, scale_data, create_sequences

def evaluate_models():
    print("Loading data for evaluation...")
    df = download_and_clean_data(force_download=False)
    feature_columns = [col for col in df.columns if col != 'Date']
    df_scaled, scaler = scale_data(df, feature_columns)
    
    SEQ_LENGTH = 30
    target_idx = feature_columns.index('CO')
    X, y = create_sequences(df_scaled, feature_columns, target_col='CO', seq_length=SEQ_LENGTH)
    
    # Same split as train.py
    train_size = int(len(X) * 0.9)
    X_test, y_test = X[train_size:], y[train_size:]
    
    print(f"Test Set Size: {len(X_test)} days")

    # Load models
    lstm_model = load_model('saved_models/lstm_model.keras')
    transformer_model = load_model('saved_models/transformer_model.keras')

    models = {
        'LSTM': lstm_model,
        'Transformer': transformer_model
    }

    results = {}
    
    for name, model in models.items():
        print(f"Evaluating {name}...")
        y_pred_scaled = model.predict(X_test, verbose=0)
        
        # Calculate metrics on scaled data for relative comparisons
        mse = mean_squared_error(y_test, y_pred_scaled)
        mae = mean_absolute_error(y_test, y_pred_scaled)
        r2 = r2_score(y_test, y_pred_scaled)
        
        results[name] = {'MSE': mse, 'MAE': mae, 'R2': r2}
        
    print("\n" + "="*40)
    print("FINAL EVALUATION METRICS:")
    print("="*40)
    for name, metrics in results.items():
        print(f"--- {name} ---")
        print(f"MSE: {metrics['MSE']:.6f} (Lower = Better)")
        print(f"MAE: {metrics['MAE']:.6f} (Lower = Better)")
        print(f"R-squared: {metrics['R2']:.4f} (Closer to 1 = Better)")
        print("")

    if results['Transformer']['MSE'] < results['LSTM']['MSE']:
        print(">> STATISTICAL WINNER: Transformer natively outperformed the LSTM.")
    else:
        print(">> STATISTICAL WINNER: LSTM demonstrated higher stability and outperformed the Transformer.")

if __name__ == "__main__":
    evaluate_models()

import os
import matplotlib.pyplot as plt
from data_preprocessing import download_and_clean_data, scale_data, create_sequences
from model import build_lstm_model, build_transformer_model
import numpy as np

def plot_history(history, model_name):
    plt.figure(figsize=(10, 6))
    plt.plot(history.history['loss'], label='Train Loss (MSE)')
    if 'val_loss' in history.history:
        plt.plot(history.history['val_loss'], label='Validation Loss (MSE)')
    plt.title(f'{model_name} Training History - Large Sequence')
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.legend()
    plt.grid(True)
    os.makedirs('plots', exist_ok=True)
    plt.savefig(f'plots/{model_name}_loss.png')
    plt.close()

def plot_predictions(y_true, y_pred, model_name, dates_array, scaler, feature_cols, target_idx):
    y_true_unscaled = []
    y_pred_unscaled = []
    
    dummy_row = [0] * len(feature_cols)
    
    for val in y_true:
        row = list(dummy_row)
        row[target_idx] = val
        y_true_unscaled.append(scaler.inverse_transform([row])[0][target_idx])
        
    for val in y_pred:
        row = list(dummy_row)
        row[target_idx] = val[0]
        y_pred_unscaled.append(scaler.inverse_transform([row])[0][target_idx])

    # Plot the last 100 days to keep the graph readable
    plt.figure(figsize=(12, 6))
    plt.plot(dates_array[-100:], y_true_unscaled[-100:], label='Actual Daily Average CO')
    plt.plot(dates_array[-100:], y_pred_unscaled[-100:], label='Predicted Daily CO', linestyle='--')
    plt.title(f'{model_name} - Actual vs Predicted Indian Daily Emissions Proxy (CO)')
    plt.xlabel('Date')
    plt.ylabel('CO Emissions index')
    plt.legend()
    plt.grid(True)
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(f'plots/{model_name}_predictions.png')
    plt.close()

def main():
    print("Step 1: Data Preparation")
    df = download_and_clean_data(force_download=False)
    
    feature_columns = [col for col in df.columns if col != 'Date']
    df_scaled, scaler = scale_data(df, feature_columns)
    
    SEQ_LENGTH = 30
    target_idx = feature_columns.index('CO')
    
    X, y = create_sequences(df_scaled, feature_columns, target_col='CO', seq_length=SEQ_LENGTH)
    
    # 90% Training, 10% Testing to optimize massive time-series learning
    train_size = int(len(X) * 0.9)
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]
    
    test_dates = df['Date'].values[SEQ_LENGTH + train_size:]

    print(f"Training shapes -> X: {X_train.shape}, y: {y_train.shape}")
    print(f"Testing shapes -> X: {X_test.shape}, y: {y_test.shape}")
    
    input_shape = (SEQ_LENGTH, len(feature_columns))

    models_to_train = {
        'LSTM': build_lstm_model(input_shape),
        'Transformer': build_transformer_model(input_shape)
    }

    for name, model in models_to_train.items():
        print(f"\nStep 2: Training {name} Model")
        history = model.fit(
            X_train, y_train,
            epochs=25,          # Lower epochs since dataset is massive
            batch_size=64,      # Larger batch size
            validation_data=(X_test, y_test),
            verbose=1
        )
        
        plot_history(history, name)
        
        print("\nStep 3: Prediction and Visualization")
        y_pred = model.predict(X_test, batch_size=64)
        plot_predictions(y_test, y_pred, name, test_dates, scaler, feature_columns, target_idx)
        
        os.makedirs('saved_models', exist_ok=True)
        model.save(f'saved_models/{name.lower()}_model.keras')
        
    print("\nTraining completed. Models saved to /models. Plots saved to /plots.")

if __name__ == '__main__':
    main()

import torch
import torch.nn as nn
import numpy as np

class CO2Predictor(nn.Module):
    def __init__(self, input_size=1, hidden_layer_size=100, output_size=1):
        super().__init__()
        self.hidden_layer_size = hidden_layer_size
        self.lstm = nn.LSTM(input_size, hidden_layer_size)
        self.linear = nn.Linear(hidden_layer_size, output_size)

    def forward(self, input_seq):
        lstm_out, _ = self.lstm(input_seq.view(len(input_seq), 1, -1))
        predictions = self.linear(lstm_out.view(len(input_seq), -1))
        return predictions[-1]

def generate_prediction(data, future_days=30):
    """
    Simulates model inference for CO2 prediction.
    In a real app, this would load a pre-trained model checkpoint.
    """
    model = CO2Predictor()
    # Mocking state dict loading if needed
    
    # Simple mathematical forecasting for now to ensure reliability
    last_val = data[-1]
    forecast = []
    for i in range(future_days):
        next_val = last_val + np.random.normal(0.015, 0.005) # Average daily increase
        forecast.append(float(next_val))
        last_val = next_val
        
    return forecast

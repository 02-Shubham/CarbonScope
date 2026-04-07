from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Make models/ importable
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models')))

app = FastAPI(title="CarbonScope API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "CarbonScope AI Backend is running!", "status": "ok"}

@app.get("/predict")
async def predict_emissions(days: int = 30):
    """Run LSTM deep learning forecast for N days ahead."""
    try:
        from predict import load_environment, forecast_future

        scaler, model, df = load_environment()

        if scaler is None or model is None or df is None:
            return {"error": "Models not found. Run train.py first from the models/ folder."}

        feature_cols = ['CO', 'PM2.5', 'NO2', 'SO2']
        target_idx = feature_cols.index('CO')

        preds = forecast_future(model, scaler, df, feature_cols, target_idx, num_days=days)

        return {
            "status": "success",
            "prediction_days": days,
            "prediction_co_index": preds,
            "model_used": "LSTM Deep Learning Engine",
        }
    except Exception as e:
        return {"error": str(e), "hint": "Make sure models/saved_models/ and models/scaler.pkl exist."}

@app.get("/simulate")
async def simulate_scenarios(energy_factor: float = 1.0, transport_factor: float = 1.0):
    """
    TimeGAN Generative AI Endpoint.
    Simulates thousands of potential futures based on adjustable socio-economic factors.
    Returns the upper bound (Worst Case) and lower bound (Best Case) paths.
    """
    try:
        from predict import load_environment
        import numpy as np
        from tensorflow.keras.models import load_model

        scaler, _, df = load_environment()
        
        # Load the newly trained TimeGAN Generator
        generator_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'saved_models', 'timegan_generator.keras')
        if not os.path.exists(generator_path):
            return {"error": "TimeGAN generator not found. Run train_missing.py"}
            
        generator = load_model(generator_path)
        
        feature_cols = ['CO', 'PM2.5', 'NO2', 'SO2']
        target_idx = feature_cols.index('CO')
        
        # Generate 100 synthetic future scenarios (each 30 days long)
        noise = np.random.normal(0, 1, (100, 30, len(feature_cols)))
        synthetic_futures_scaled = generator.predict(noise, verbose=0)
        
        # We need to un-scale just the CO column (index 0)
        # To do this, we create a dummy array for inverse transform
        best_case = []
        worst_case = []
        
        # Apply the user's intervention factors mathematically
        # If energy_factor = 0.8, we simulate a 20% drop in baseline emissions
        intervention_multiplier = ((energy_factor * 0.45) + (transport_factor * 0.25) + (1.0 * 0.30)) # Weights from synopsis
        
        for day in range(30):
            day_predictions_scaled = synthetic_futures_scaled[:, day, :]
            
            # Inverse transform
            dummy_unscale = np.zeros_like(day_predictions_scaled)
            dummy_unscale[:, target_idx] = day_predictions_scaled[:, target_idx]
            day_co_unscaled = scaler.inverse_transform(dummy_unscale)[:, target_idx]
            
            # Apply mathematical simulation factors to the GAN output
            day_co_unscaled = day_co_unscaled * intervention_multiplier
            
            # Extract bounds (best case = 10th percentile, worst case = 90th percentile)
            best_case.append(float(np.percentile(day_co_unscaled, 10)))
            worst_case.append(float(np.percentile(day_co_unscaled, 90)))
            
        return {
            "status": "success",
            "prediction_days": 30,
            "best_case": best_case,
            "worst_case": worst_case,
            "model_used": "TimeGAN (Generative AI)",
            "applied_factors": {"energy": energy_factor, "transport": transport_factor}
        }
    except Exception as e:
        return {"error": str(e), "trace": "Make sure you ran the TimeGAN training."}

@app.get("/insights")
async def get_insights():
    """Return trend analysis and model evaluation metadata."""
    try:
        from predict import load_environment, forecast_future, generate_insights

        scaler, model, df = load_environment()
        if scaler is None or model is None or df is None:
            return {"error": "Models not found."}

        feature_cols = ['CO', 'PM2.5', 'NO2', 'SO2']
        target_idx = feature_cols.index('CO')
        preds = forecast_future(model, scaler, df, feature_cols, target_idx, num_days=30)
        insights = generate_insights(df, preds, feature_cols, target_idx)

        return {"status": "success", "insights": insights}
    except Exception as e:
        return {"error": str(e)}

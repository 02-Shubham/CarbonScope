from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
from .services.carbon_interface import CarbonInterfaceService
from .services.open_aq import OpenAQService

# Add models directory to path so we can import our AI scripts
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models')))

app = FastAPI(title="CarbonScope API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

carbon_service = CarbonInterfaceService()
aqi_service = OpenAQService()

@app.get("/")
async def root():
    return {"message": "Welcome to CarbonScope API"}

@app.get("/emissions")
async def get_emissions(country: str = "us", state: str = "ca"):
    data = carbon_service.get_electricity_estimate(country, state)
    return {
        "status": "success",
        "data": data,
        "region": f"{state.upper()}, {country.upper()}"
    }

@app.get("/aqi")
async def get_aqi(city: str = "San Francisco"):
    data = aqi_service.get_latest_measurements(city)
    return {
        "status": "success",
        "data": data,
        "city": city
    }

@app.get("/predict")
async def predict_emissions(days: int = 30):
    # Calling our newly trained Deep Learning Engine (LSTM)
    try:
        from predict import load_environment, forecast_future
        scaler, model, df = load_environment()
        
        if scaler is None or model is None or df is None:
            return {"error": "AI Models not fully trained or found. Check models/ folder."}
            
        feature_cols = ['CO', 'PM2.5', 'NO2', 'SO2']
        target_idx = feature_cols.index('CO')
        
        preds = forecast_future(model, scaler, df, feature_cols, target_idx, num_days=days)
        
        return {
            "status": "success",
            "prediction_days": days,
            "prediction_co_index": preds,
            "model_used": "LSTM Deep Learning Engine"
        }
    except Exception as e:
        return {"error": str(e)}

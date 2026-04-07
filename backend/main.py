from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .services.carbon_interface import CarbonInterfaceService
from .services.open_aq import OpenAQService

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
    # Placeholder for AI model prediction logic
    # In a real scenario, this would call a trained LSTM/GRU model
    import numpy as np
    
    # Mocking a trend with some noise
    base = 415.5
    trend = np.linspace(0, 0.5, days)
    noise = np.random.normal(0, 0.05, days)
    prediction = (base + trend + noise).tolist()
    
    return {
        "prediction": prediction,
        "scenarios": {
            "best_case": (base + trend * 0.5 + noise * 0.5).tolist(),
            "worst_case": (base + trend * 2.0 + noise * 2.0).tolist()
        }
    }

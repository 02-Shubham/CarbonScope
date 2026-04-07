# CarbonScope - Backend API

This directory contains the **FastAPI** server that acts as the orchestration and bridging layer between the UI and the Machine Learning models.

## Architecture & Responsibilities
* **API Endpoints**: Uses FastAPI to expose robust HTTP endpoints handling GET and POST requests.
* **OpenAQ Integration**: Manages telemetry ingestion points for live air-quality statistics fetching.
* **Model Invocation**: Handles the loading and unscaling of TensorFlow models located in `../models/`, preventing synchronous blocking during heavy AI generative calculations.

## Core Endpoints
* `GET /predict?days={int}`
  * Invokes the baseline AutoRegressive LSTM network to retrieve a baseline future forecast path alongside calculated predictive insights.
* `GET /simulate?energy_factor={float}&transport_factor={float}`
  * Engages the Gen-AI **TimeGAN** architecture, passing user-provided socioeconomic factors as mathematical intervention scalars to simulate and return statistical best and worst-case societal pathways.

## Run Instructions
1. We recommend setting up a virtual environment (e.g. `venv` or `conda`).
2. Run the Uvicorn application server:
   ```bash
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```
3. API Documentation automatically generates at `http://127.0.0.1:8000/docs` (Swagger UI).

# CarbonScope

**CarbonScope** is a comprehensive, behavior-driven environmental monitoring and forecasting dashboard. Designed to provide real-time air quality visualization alongside advanced AI-driven generative pathfinding, CarbonScope bridges the gap between historical telemetry and predictive simulation for urban emissions.

![CarbonScope Dashboard UI](/images/ui-preview.png) *(UI Screenshot placeholder)*

## Architecture

CarbonScope relies on a decoupled, microservice-inspired architecture divided into three core pillars:

1. **/frontend**: A rich, map-first interactive UI built with **Next.js**, **React Leaflet**, and **Recharts**. Acts as the presentation layer.
2. **/backend**: A high-performance **FastAPI** server that facilitates data flow between the frontend and the AI inference engine.
3. **/models**: A robust Machine Learning pipeline powered by **TensorFlow** featuring Long Short-Term Memory (LSTM) networking and TimeGAN (Generative Adversarial Networks) architectures.

## Quick Start

### 1. Train the Models
Before running the backend, you must train the models based on the historical datastore.
```bash
cd models
python train.py
# (Optional) python train_missing.py for TimeGAN
```

### 2. Start the FastAPI Backend
```bash
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 3. Start the Next.js Frontend UI
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to interact with the CarbonScope dashboard.

## Overview
Built with a focus on usability, CarbonScope dynamically fetches and scales emissions data, visualizing multi-scenario socio-economic paths through a seamless generative AI simulation layer.

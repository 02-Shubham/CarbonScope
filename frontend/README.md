# CarbonScope - Frontend UI

This folder contains the **Next.js** application that serves as the user interface for CarbonScope. 
It provides the visual presentation layer, dynamic dashboards, and geographical heatmap integrations.

## Tech Stack
* **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
* **Language**: TypeScript
* **Styling**: Vanilla CSS (`globals.css`) alongside modular custom tokens for a sleek, glassmorphic UI.
* **Geospatial**: `react-leaflet` with CartoDB Voyager tiles.
* **Data Visualization**: `recharts` for rendering complex predictive AI arrays.

## Key Features
* **Live Heatmap (`/`)**: A geographical interface mapping real-time PM2.5 levels to live, animated circular nodes for immediate user comprehension of air quality indices. Includes city search capabilities.
* **Analytics Dashboard (`/analytics`)**: Detailed prediction interfaces visualizing 30-day Long Short-Term Memory (LSTM) forecasts.
* **TimeGAN Simulation Matrix**: Interactive UI sliders seamlessly query the AI engine for "Best Case" vs "Worst Case" societal intervention outputs, visually rendering generated tolerance bands in real-time.

## Run Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development hot-reloading server:
   ```bash
   npm run dev
   ```
3. Run linting & formatting (optional):
   ```bash
   npm run lint
   ```

*Note: The frontend expects the FastAPI server to be running actively on `localhost:8000`. Set `NEXT_PUBLIC_API_URL` to override behavior.*

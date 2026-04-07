# CarbonScope - ML Models

This directory encapsulates the Machine Learning and Artificial Intelligence algorithms backing CarbonScope's analytical engine. It handles all dataset ingestion, feature engineering, network training, and model serialization operations.

## Datasets
* `indian_daily_emissions.csv`: The local telemetry datastore storing historical PM2.5, NO₂, SO₂, CO, AQI, and metropolitan area features. Used by all models as the fundamental training anchor.

## Model Layers

### 1. Long Short-Term Memory Network (`train.py` & `predict.py`)
Provides deterministic multi-variate Time-Series forecasting. By applying Auto-Regressive loops, it predicts robust pathways for future environmental pollution over a predefined `30`-day look-ahead window.
* **Outputs**: `.keras` artifacts containing tuned weights, and a `scaler.pkl` to normalize real-world numeric variances.
* **Insights Engine**: Capable of dynamically deducing statistical correlations and overall macro-trends post-forecast.

### 2. TimeGAN architecture (`timegan.py`)
A Generative Adversarial Network architecture adapted for temporally-bound sequences. The TimeGAN explicitly learns the *underlying relationships* across the feature-set, enabling CarbonScope to simulate entirely new, synthetic "alt-histories" or "future paths" that respect real-world volatility and mathematical distributions. 
Used on the frontend for multi-scenario boundary definitions (the Best & Worst Case).

## Run Instructions
Install mathematical dependencies (`tensorflow`, `pandas`, `scikit-learn`, etc).

Execute standard LSTM training:
```bash
python train.py
```

Execute TimeGAN Generative AI training:
```bash
# Requires sufficient RAM / GPU configuration to simulate accurately.
python timegan.py 
```

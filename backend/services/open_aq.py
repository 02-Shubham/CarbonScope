import requests

class OpenAQService:
    def __init__(self):
        self.base_url = "https://api.openaq.org/v2"

    def get_latest_measurements(self, city="San Francisco", country="US"):
        """Get latest AQI measurements for a city."""
        url = f"{self.base_url}/latest"
        params = {
            "city": city,
            "country": country,
            "limit": 1
        }
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching OpenAQ data: {e}")
            return self._get_mock_aqi(city)

    def _get_mock_aqi(self, city):
        return {
            "results": [
                {
                    "city": city,
                    "country": "US",
                    "measurements": [
                        {"parameter": "pm25", "value": 12.5, "unit": "µg/m³"},
                        {"parameter": "no2", "value": 5.1, "unit": "ppm"},
                        {"parameter": "o3", "value": 0.04, "unit": "ppm"}
                    ]
                }
            ]
        }

import os
import requests
from dotenv import load_dotenv

load_dotenv()

class CarbonInterfaceService:
    def __init__(self):
        self.api_key = os.getenv("CARBON_INTERFACE_API_KEY")
        self.base_url = "https://www.carboninterface.com/api/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def get_electricity_estimate(self, country="us", state="ca"):
        """Get carbon emission estimate for electricity consumption."""
        url = f"{self.base_url}/estimates"
        data = {
            "type": "electricity",
            "country": country,
            "state": state,
            "electricity_unit": "mwh",
            "electricity_value": 1
        }
        try:
            # For demonstration, if no API key, return mock data
            if not self.api_key or self.api_key == "your_key_here":
                return self._get_mock_estimate()
            
            response = requests.post(url, headers=self.headers, json=data)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching Carbon Interface data: {e}")
            return self._get_mock_estimate()

    def _get_mock_estimate(self):
        return {
            "data": {
                "id": "mock-electricity-estimate",
                "type": "estimate",
                "attributes": {
                    "country": "us",
                    "state": "ca",
                    "electricity_value": 1.0,
                    "carbon_g": 380000,
                    "carbon_lb": 837.76,
                    "carbon_kg": 380.0,
                    "carbon_mt": 0.38
                }
            }
        }

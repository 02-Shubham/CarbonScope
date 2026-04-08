import os
import requests
from typing import List, Dict, Any

# Load .env if available (works both via uvicorn and direct invocation)
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
except ImportError:
    pass

# OpenAQ v3 parameter IDs
PARAM_PM25 = 2
PARAM_CO   = 9
PARAM_NO2  = 7

OPENAQ_API_KEY = os.getenv("OPENAQ_API_KEY", "")
BASE_URL = "https://api.openaq.org/v3"

# Major Indian cities with their approximate coordinates and display names
INDIAN_CITIES = [
    {"city": "Delhi",      "lat": 28.6139, "lon": 77.2090},
    {"city": "Mumbai",     "lat": 19.0760, "lon": 72.8777},
    {"city": "Pune",       "lat": 18.5204, "lon": 73.8567},
    {"city": "Bengaluru",  "lat": 12.9716, "lon": 77.5946},
    {"city": "Chennai",    "lat": 13.0827, "lon": 80.2707},
    {"city": "Kolkata",    "lat": 22.5726, "lon": 88.3639},
    {"city": "Hyderabad",  "lat": 17.3850, "lon": 78.4867},
    {"city": "Ahmedabad",  "lat": 23.0225, "lon": 72.5714},
    {"city": "Lucknow",    "lat": 26.8467, "lon": 80.9462},
    {"city": "Patna",      "lat": 25.5941, "lon": 85.1376},
    {"city": "Jaipur",     "lat": 26.9124, "lon": 75.7873},
    {"city": "Surat",      "lat": 21.1702, "lon": 72.8311},
    {"city": "Nagpur",     "lat": 21.1458, "lon": 79.0882},
    {"city": "Bhopal",     "lat": 23.2599, "lon": 77.4126},
    {"city": "Chandigarh", "lat": 30.7333, "lon": 76.7794},
    {"city": "Kochi",      "lat": 9.9312,  "lon": 76.2673},
]


class OpenAQService:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "X-API-Key": OPENAQ_API_KEY,
            "Accept": "application/json",
        })

    def _get_locations_near(self, lat: float, lon: float, radius_m: int = 25000, param_id: int = PARAM_PM25) -> List[int]:
        """Find sensor location IDs near a coordinate for a given parameter."""
        try:
            resp = self.session.get(
                f"{BASE_URL}/locations",
                params={
                    "coordinates": f"{lat},{lon}",
                    "radius": radius_m,
                    "parameters_id": param_id,
                    "limit": 5,
                },
                timeout=5,
            )
            if resp.status_code == 200:
                data = resp.json()
                return [loc["id"] for loc in data.get("results", [])]
        except Exception as e:
            print(f"[OpenAQ] _get_locations_near error: {e}")
        return []

    def _get_latest_for_locations(self, location_ids: List[int], param_id: int) -> float | None:
        """Get the latest measurement value for a list of location IDs for a given parameter."""
        if not location_ids:
            return None
        try:
            for loc_id in location_ids:
                resp = self.session.get(
                    f"{BASE_URL}/locations/{loc_id}/latest",
                    timeout=5,
                )
                if resp.status_code == 200:
                    data = resp.json()
                    for measurement in data.get("results", []):
                        if measurement.get("parameter", {}).get("id") == param_id:
                            val = measurement.get("value")
                            if val is not None and val >= 0:
                                return round(float(val), 2)
        except Exception as e:
            print(f"[OpenAQ] _get_latest_for_locations error: {e}")
        return None

    def _classify_status(self, pm25: float) -> str:
        if pm25 > 100:
            return "critical"
        elif pm25 > 50:
            return "warning"
        return "safe"

    def get_india_map_data(self) -> List[Dict[str, Any]]:
        """
        Fetches live PM2.5, CO, and NO2 for major Indian cities using OpenAQ v3.
        Falls back to realistic mock data if the API is unavailable or returns insufficient results.
        """
        if not OPENAQ_API_KEY:
            print("[OpenAQ] No API key found, using fallback data.")
            return self._get_mock_india_map()

        results = []
        for entry in INDIAN_CITIES:
            city = entry["city"]
            lat  = entry["lat"]
            lon  = entry["lon"]
            print(f"[OpenAQ] Fetching data for {city}...")

            try:
                # Find nearby sensor locations for each pollutant
                pm25_locs = self._get_locations_near(lat, lon, param_id=PARAM_PM25)
                co_locs   = self._get_locations_near(lat, lon, param_id=PARAM_CO)
                no2_locs  = self._get_locations_near(lat, lon, param_id=PARAM_NO2)

                pm25 = self._get_latest_for_locations(pm25_locs, PARAM_PM25)
                co   = self._get_latest_for_locations(co_locs,   PARAM_CO)
                no2  = self._get_latest_for_locations(no2_locs,  PARAM_NO2)

                if pm25 is not None:
                    results.append({
                        "city":      city,
                        "latitude":  lat,
                        "longitude": lon,
                        "pm25":      pm25,
                        "co":        co,
                        "no2":       no2,
                        "status":    self._classify_status(pm25),
                        "source":    "live",
                    })
                    print(f"[OpenAQ] {city}: PM2.5={pm25}, CO={co}, NO2={no2}")
                else:
                    print(f"[OpenAQ] {city}: No PM2.5 data found, using fallback.")
                    results.append(self._get_city_fallback(city, lat, lon))

            except Exception as e:
                print(f"[OpenAQ] Exception for {city}: {e}")
                results.append(self._get_city_fallback(city, lat, lon))

        # If fewer than 3 cities have live data, fall back entirely
        live_count = sum(1 for r in results if r.get("source") == "live")
        if live_count < 3:
            print("[OpenAQ] Insufficient live data, using full fallback.")
            return self._get_mock_india_map()

        return results

    def _get_city_fallback(self, city: str, lat: float, lon: float) -> Dict[str, Any]:
        """Per-city fallback entry matching the fallback mock format."""
        mock = {r["city"]: r for r in self._get_mock_india_map()}
        if city in mock:
            return mock[city]
        return {"city": city, "latitude": lat, "longitude": lon, "pm25": 60.0, "co": None, "no2": None, "status": "warning", "source": "fallback"}

    def _get_mock_india_map(self) -> List[Dict[str, Any]]:
        """Realistic fallback data for all 16 cities."""
        return [
            {"city": "Delhi",      "latitude": 28.6139, "longitude": 77.2090, "pm25": 145.2, "co": 58.1, "no2": 42.3, "status": "critical", "source": "fallback"},
            {"city": "Mumbai",     "latitude": 19.0760, "longitude": 72.8777, "pm25": 85.4,  "co": 44.2, "no2": 28.1, "status": "warning",  "source": "fallback"},
            {"city": "Pune",       "latitude": 18.5204, "longitude": 73.8567, "pm25": 54.1,  "co": 38.9, "no2": 18.5, "status": "warning",  "source": "fallback"},
            {"city": "Bengaluru",  "latitude": 12.9716, "longitude": 77.5946, "pm25": 38.2,  "co": 30.1, "no2": 12.4, "status": "safe",     "source": "fallback"},
            {"city": "Chennai",    "latitude": 13.0827, "longitude": 80.2707, "pm25": 42.1,  "co": 31.5, "no2": 15.3, "status": "safe",     "source": "fallback"},
            {"city": "Kolkata",    "latitude": 22.5726, "longitude": 88.3639, "pm25": 110.5, "co": 52.3, "no2": 35.6, "status": "critical", "source": "fallback"},
            {"city": "Hyderabad",  "latitude": 17.3850, "longitude": 78.4867, "pm25": 49.8,  "co": 35.7, "no2": 17.1, "status": "safe",     "source": "fallback"},
            {"city": "Ahmedabad",  "latitude": 23.0225, "longitude": 72.5714, "pm25": 92.0,  "co": 47.0, "no2": 30.2, "status": "warning",  "source": "fallback"},
            {"city": "Lucknow",    "latitude": 26.8467, "longitude": 80.9462, "pm25": 128.4, "co": 55.2, "no2": 39.8, "status": "critical", "source": "fallback"},
            {"city": "Patna",      "latitude": 25.5941, "longitude": 85.1376, "pm25": 135.7, "co": 56.8, "no2": 41.2, "status": "critical", "source": "fallback"},
            {"city": "Jaipur",     "latitude": 26.9124, "longitude": 75.7873, "pm25": 78.3,  "co": 42.1, "no2": 24.6, "status": "warning",  "source": "fallback"},
            {"city": "Surat",      "latitude": 21.1702, "longitude": 72.8311, "pm25": 72.1,  "co": 40.3, "no2": 22.9, "status": "warning",  "source": "fallback"},
            {"city": "Nagpur",     "latitude": 21.1458, "longitude": 79.0882, "pm25": 61.4,  "co": 39.0, "no2": 20.1, "status": "warning",  "source": "fallback"},
            {"city": "Bhopal",     "latitude": 23.2599, "longitude": 77.4126, "pm25": 55.8,  "co": 37.5, "no2": 18.8, "status": "warning",  "source": "fallback"},
            {"city": "Chandigarh", "latitude": 30.7333, "longitude": 76.7794, "pm25": 88.2,  "co": 45.1, "no2": 29.3, "status": "warning",  "source": "fallback"},
            {"city": "Kochi",      "latitude": 9.9312,  "longitude": 76.2673, "pm25": 29.4,  "co": 27.4, "no2": 10.2, "status": "safe",     "source": "fallback"},
        ]

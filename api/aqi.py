"""Vercel serverless function: GET ?lat=..&lon=.. -> {aqi, category, city, country}.

Wraps OpenWeatherMap's Air Pollution API so the API key never reaches the
frontend. Requires OPENWEATHER_API_KEY set as a Vercel environment variable
(Production and Preview) — get a free key at openweathermap.org/api/air-pollution.
The same key also covers OpenWeatherMap's Geocoding API, used here to turn the
coordinates into a city name.

OpenWeatherMap's own "aqi" field is its own simplified 1-5 scale, not the
widely recognised AQI people see on AirNow, IQAir, etc. (US EPA, 0-500). So
instead we take the raw pollutant concentrations OpenWeatherMap also returns
and compute the real US EPA AQI ourselves, using EPA's published breakpoint
tables (PM2.5 breakpoints are the May 2024 revision). This is necessarily an
approximation: EPA's formula is meant for time-averaged monitoring data (24h
for PM, 8h for O3/CO, 1h for SO2/NO2), and all we have is one instantaneous
reading, treated as if it were that average.

Powers the optional "today's air" sky on the Planet plot in My garden, and the
cross-city air comparison. Location is only ever sent here if the person
explicitly opts in on-device; nothing is stored server-side. Pass skipGeo=1 to
skip the reverse-geocoding call when the caller already knows the city name
(used for the fixed reference cities in the comparison, to save a lookup)."""

import json
import os
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler

# EPA AQI breakpoints: (concentration_low, concentration_high, aqi_low, aqi_high).
# PM2.5 is 24-hr avg in µg/m3 (EPA's breakpoints revised May 2024). PM10 is
# 24-hr avg in µg/m3. O3 is 8-hr avg in ppb. CO is 8-hr avg in ppm. SO2 is
# 1-hr avg in ppb (EPA switches to a 24-hr average above 304 ppb, which a
# single reading can't give us, so this is an approximation at the high end).
# NO2 is 1-hr avg in ppb.
AQI_BREAKPOINTS = {
    "pm25": [
        (0.0, 9.0, 0, 50),
        (9.1, 35.4, 51, 100),
        (35.5, 55.4, 101, 150),
        (55.5, 125.4, 151, 200),
        (125.5, 225.4, 201, 300),
        (225.5, 500.4, 301, 500),
    ],
    "pm10": [
        (0, 54, 0, 50),
        (55, 154, 51, 100),
        (155, 254, 101, 150),
        (255, 354, 151, 200),
        (355, 424, 201, 300),
        (425, 604, 301, 500),
    ],
    "o3": [
        (0, 54, 0, 50),
        (55, 70, 51, 100),
        (71, 85, 101, 150),
        (86, 105, 151, 200),
        (106, 200, 201, 300),
    ],
    "co": [
        (0.0, 4.4, 0, 50),
        (4.5, 9.4, 51, 100),
        (9.5, 12.4, 101, 150),
        (12.5, 15.4, 151, 200),
        (15.5, 30.4, 201, 300),
        (30.5, 50.4, 301, 500),
    ],
    "so2": [
        (0, 35, 0, 50),
        (36, 75, 51, 100),
        (76, 185, 101, 150),
        (186, 304, 151, 200),
        (305, 604, 201, 300),
        (605, 1004, 301, 500),
    ],
    "no2": [
        (0, 53, 0, 50),
        (54, 100, 51, 100),
        (101, 360, 101, 150),
        (361, 649, 151, 200),
        (650, 1249, 201, 300),
        (1250, 2049, 301, 500),
    ],
}

# Molar masses (g/mol), to convert OpenWeatherMap's µg/m3 readings to the
# ppm/ppb units EPA's tables use (25°C, 1 atm: molar volume 24.45 L/mol).
_MOLAR_MASS = {"o3": 48.00, "co": 28.01, "so2": 64.07, "no2": 46.0055}

AQI_CATEGORIES = [
    (50, "Good"),
    (100, "Moderate"),
    (150, "Unhealthy for sensitive groups"),
    (200, "Unhealthy"),
    (300, "Very unhealthy"),
    (500, "Hazardous"),
]


def _ugm3_to_ppb(value, pollutant):
    return value * 24.45 / _MOLAR_MASS[pollutant]


def _sub_index(conc, table):
    if conc is None:
        return None
    for c_low, c_high, i_low, i_high in table:
        if c_low <= conc <= c_high:
            return round((i_high - i_low) / (c_high - c_low) * (conc - c_low) + i_low)
    if conc > table[-1][1]:
        return 500
    return None


def _category_for(aqi):
    for ceiling, name in AQI_CATEGORIES:
        if aqi <= ceiling:
            return name
    return "Hazardous"


def compute_aqi(components):
    sub_indexes = []
    if components.get("pm2_5") is not None:
        sub_indexes.append(_sub_index(components["pm2_5"], AQI_BREAKPOINTS["pm25"]))
    if components.get("pm10") is not None:
        sub_indexes.append(_sub_index(components["pm10"], AQI_BREAKPOINTS["pm10"]))
    if components.get("o3") is not None:
        sub_indexes.append(_sub_index(_ugm3_to_ppb(components["o3"], "o3"), AQI_BREAKPOINTS["o3"]))
    if components.get("co") is not None:
        sub_indexes.append(_sub_index(_ugm3_to_ppb(components["co"], "co") / 1000, AQI_BREAKPOINTS["co"]))
    if components.get("so2") is not None:
        sub_indexes.append(_sub_index(_ugm3_to_ppb(components["so2"], "so2"), AQI_BREAKPOINTS["so2"]))
    if components.get("no2") is not None:
        sub_indexes.append(_sub_index(_ugm3_to_ppb(components["no2"], "no2"), AQI_BREAKPOINTS["no2"]))
    sub_indexes = [i for i in sub_indexes if i is not None]
    if not sub_indexes:
        return None, None
    aqi = max(sub_indexes)
    return aqi, _category_for(aqi)


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        qs = urllib.parse.urlparse(self.path).query
        params = urllib.parse.parse_qs(qs)
        try:
            lat = float(params.get("lat", [""])[0])
            lon = float(params.get("lon", [""])[0])
        except (ValueError, IndexError):
            self._send(400, {"error": "Missing or invalid lat/lon."})
            return
        if not (-90 <= lat <= 90 and -180 <= lon <= 180):
            self._send(400, {"error": "Lat/lon out of range."})
            return

        api_key = os.environ.get("OPENWEATHER_API_KEY")
        if not api_key:
            self._send(503, {"error": "Air quality isn't configured yet."})
            return

        url = (
            "https://api.openweathermap.org/data/2.5/air_pollution?"
            + urllib.parse.urlencode({"lat": lat, "lon": lon, "appid": api_key})
        )
        try:
            with urllib.request.urlopen(url, timeout=6) as resp:
                data = json.loads(resp.read())
            components = data["list"][0]["components"]
        except Exception:
            self._send(502, {"error": "Couldn't reach the air quality service just now."})
            return

        aqi, category = compute_aqi(components)
        if aqi is None:
            self._send(502, {"error": "Couldn't work out today's air quality."})
            return

        city = None
        country = None
        if params.get("skipGeo", ["0"])[0] != "1":
            city, country = self._reverse_geocode(lat, lon, api_key)

        self._send(200, {
            "aqi": aqi,
            "category": category,
            "city": city,
            "country": country,
        })

    def _reverse_geocode(self, lat, lon, api_key):
        geo_url = (
            "https://api.openweathermap.org/geo/1.0/reverse?"
            + urllib.parse.urlencode({"lat": lat, "lon": lon, "limit": 1, "appid": api_key})
        )
        try:
            with urllib.request.urlopen(geo_url, timeout=6) as resp:
                results = json.loads(resp.read())
            if results:
                return results[0].get("name"), results[0].get("country")
        except Exception:
            pass
        return None, None

    def _send(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

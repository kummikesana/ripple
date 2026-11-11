"""Vercel serverless function: GET ?lat=..&lon=.. -> {aqi, category, city, country}.

Wraps OpenWeatherMap's Air Pollution API so the API key never reaches the
frontend. Requires OPENWEATHER_API_KEY set as a Vercel environment variable
(Production and Preview) — get a free key at openweathermap.org/api/air-pollution.
The same key also covers OpenWeatherMap's Geocoding API, used here to turn the
coordinates into a city name.

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

CATEGORIES = {1: "Good", 2: "Fair", 3: "Moderate", 4: "Poor", 5: "Very poor"}


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
            aqi = data["list"][0]["main"]["aqi"]
        except Exception:
            self._send(502, {"error": "Couldn't reach the air quality service just now."})
            return

        city = None
        country = None
        if params.get("skipGeo", ["0"])[0] != "1":
            city, country = self._reverse_geocode(lat, lon, api_key)

        self._send(200, {
            "aqi": aqi,
            "category": CATEGORIES.get(aqi, "Unknown"),
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

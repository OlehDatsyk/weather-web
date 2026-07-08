"""
Weather Web Application
------------------------
A production-ready Flask backend that serves a modern, glassmorphism-styled
weather dashboard and exposes a small JSON API used by the frontend to
fetch live weather data from OpenWeatherMap.

Author: Senior Full Stack Developer
"""

import os
from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv

from services.weather_service import get_weather_data, WeatherServiceError

# Load environment variables from .env (if present)
load_dotenv()

app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False


# --------------------------------------------------------------------------
# Page routes
# --------------------------------------------------------------------------
@app.route("/")
def index():
    """Render the main single-page weather dashboard."""
    return render_template("index.html")


# --------------------------------------------------------------------------
# API routes
# --------------------------------------------------------------------------
@app.route("/api/weather", methods=["GET"])
def weather():
    """
    Fetch current weather data for a given city, or for a given lat/lon pair.

    Query params:
        city  (str, optional*) - City name to search for.
        lat   (float, optional*) - Latitude (must be paired with lon).
        lon   (float, optional*) - Longitude (must be paired with lat).
        units (str, optional)  - 'metric' (default), 'imperial', or 'standard'.

        * Either `city` OR both `lat` and `lon` must be provided.

    Returns:
        JSON payload with normalized weather data, or an error message.
    """
    city = request.args.get("city", "").strip()
    lat_raw = request.args.get("lat", "").strip()
    lon_raw = request.args.get("lon", "").strip()
    units = request.args.get("units", "metric").strip().lower()

    if units not in ("metric", "imperial", "standard"):
        units = "metric"

    lat = lon = None
    if lat_raw and lon_raw:
        try:
            lat = float(lat_raw)
            lon = float(lon_raw)
        except ValueError:
            return jsonify({"error": "Latitude and longitude must be valid numbers."}), 400
    elif not city:
        return jsonify({"error": "City name (or coordinates) is required."}), 400

    try:
        data = get_weather_data(city=city or None, units=units, lat=lat, lon=lon)
        return jsonify(data), 200
    except WeatherServiceError as exc:
        return jsonify({"error": str(exc)}), exc.status_code
    except Exception:  # pragma: no cover - safety net for unexpected errors
        return (
            jsonify({"error": "An unexpected error occurred. Please try again later."}),
            500,
        )


@app.route("/api/health", methods=["GET"])
def health():
    """Simple health-check endpoint."""
    return jsonify({"status": "ok"}), 200


# --------------------------------------------------------------------------
# Error handlers
# --------------------------------------------------------------------------
@app.errorhandler(404)
def not_found(_e):
    return jsonify({"error": "Resource not found."}), 404


@app.errorhandler(500)
def server_error(_e):
    return jsonify({"error": "Internal server error."}), 500


# --------------------------------------------------------------------------
# Entrypoint
# --------------------------------------------------------------------------
if __name__ == "__main__":
    debug_mode = os.getenv("FLASK_DEBUG", "True") == "True"
    port = int(os.getenv("PORT", 5000))
    app.run(debug=debug_mode, host="0.0.0.0", port=port)

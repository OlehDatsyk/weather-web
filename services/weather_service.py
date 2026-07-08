"""
services.weather_service
-------------------------
Encapsulates all communication with the OpenWeatherMap "Current Weather
Data" API and normalizes the response into a clean, frontend-friendly
shape.

Keeping this logic isolated from app.py (the Flask routing layer) keeps
the project architecture clean and testable.
"""

import os
import requests

BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
REQUEST_TIMEOUT_SECONDS = 10


class WeatherServiceError(Exception):
    """Raised when weather data cannot be retrieved or parsed."""

    def __init__(self, message, status_code=400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code

    def __str__(self):
        return self.message


def get_weather_data(city=None, units="metric", lat=None, lon=None):
    """
    Fetch and normalize current weather data for the given city, or for a
    given pair of coordinates (used for geolocation-based lookups).

    Args:
        city (str, optional): City name, e.g. "London" or "London,GB".
        units (str): 'metric', 'imperial', or 'standard'.
        lat (float, optional): Latitude, used instead of `city`.
        lon (float, optional): Longitude, used instead of `city`.

    Returns:
        dict: Normalized weather payload.

    Raises:
        WeatherServiceError: On any failure (missing key, network issue,
            city not found, upstream error, etc).
    """
    api_key = os.getenv("OPENWEATHER_API_KEY")

    if not api_key:
        raise WeatherServiceError(
            "Weather API key is not configured. Please set OPENWEATHER_API_KEY "
            "in your .env file (see .env.example).",
            500,
        )

    params = {
        "appid": api_key,
        "units": units,
    }

    if lat is not None and lon is not None:
        params["lat"] = lat
        params["lon"] = lon
    elif city:
        params["q"] = city
    else:
        raise WeatherServiceError("Either a city name or coordinates are required.", 400)

    try:
        response = requests.get(BASE_URL, params=params, timeout=REQUEST_TIMEOUT_SECONDS)
    except requests.exceptions.ConnectTimeout:
        raise WeatherServiceError(
            "The weather service took too long to respond. Please try again.", 504
        )
    except requests.exceptions.ConnectionError:
        raise WeatherServiceError(
            "Unable to connect to the weather service. Check your internet connection.",
            503,
        )
    except requests.exceptions.Timeout:
        raise WeatherServiceError(
            "The weather service took too long to respond. Please try again.", 504
        )
    except requests.exceptions.RequestException:
        raise WeatherServiceError(
            "An error occurred while fetching weather data.", 500
        )

    if response.status_code == 404:
        if city:
            raise WeatherServiceError(
                f'City "{city}" was not found. Please check the spelling and try again.',
                404,
            )
        raise WeatherServiceError("No weather data found for your location.", 404)
    if response.status_code == 401:
        raise WeatherServiceError(
            "Invalid API key. Please check your OPENWEATHER_API_KEY value.", 401
        )
    if response.status_code != 200:
        raise WeatherServiceError(
            "Failed to fetch weather data from the provider. Please try again later.",
            response.status_code if 400 <= response.status_code < 600 else 500,
        )

    try:
        raw = response.json()
    except ValueError:
        raise WeatherServiceError("Received an invalid response from the weather service.", 502)

    return _format_weather_data(raw, units)


def _format_weather_data(raw, units):
    """Transform the raw OpenWeatherMap payload into a flat, UI-ready dict."""
    unit_symbol = "C" if units == "metric" else ("F" if units == "imperial" else "K")
    speed_unit = "m/s" if units in ("metric", "standard") else "mph"

    weather_list = raw.get("weather") or [{}]
    weather_info = weather_list[0]
    main = raw.get("main", {})
    wind = raw.get("wind", {})
    sys_info = raw.get("sys", {})
    coord = raw.get("coord", {})

    icon_code = weather_info.get("icon", "01d")

    return {
        "city": raw.get("name", "Unknown"),
        "country": sys_info.get("country", ""),
        "temperature": round(main.get("temp", 0)),
        "feels_like": round(main.get("feels_like", 0)),
        "temp_min": round(main.get("temp_min", 0)),
        "temp_max": round(main.get("temp_max", 0)),
        "humidity": main.get("humidity", 0),
        "pressure": main.get("pressure", 0),
        "wind_speed": wind.get("speed", 0),
        "wind_deg": wind.get("deg", 0),
        "description": weather_info.get("description", "").title(),
        "main_condition": weather_info.get("main", ""),
        "icon": icon_code,
        "icon_url": f"https://openweathermap.org/img/wn/{icon_code}@4x.png",
        "sunrise": sys_info.get("sunrise"),
        "sunset": sys_info.get("sunset"),
        "timezone": raw.get("timezone", 0),
        "unit_symbol": unit_symbol,
        "speed_unit": speed_unit,
        "coord": coord,
        "visibility": raw.get("visibility", 0),
        "units": units,
    }

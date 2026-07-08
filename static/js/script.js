/**
 * Skyline Weather — Frontend Application Logic
 * ---------------------------------------------
 * Handles:
 *  - Fetching weather data from the Flask backend (/api/weather)
 *  - Rendering loading / error / empty / result states
 *  - Dark mode toggle (persisted in localStorage)
 *  - Metric / Imperial unit toggle
 *  - Geolocation-based lookup
 *  - Small UI animations & interactions
 */

(() => {
  "use strict";

  // ------------------------------------------------------------------
  // DOM references
  // ------------------------------------------------------------------
  const searchForm = document.getElementById("searchForm");
  const cityInput = document.getElementById("cityInput");
  const clearBtn = document.getElementById("clearBtn");
  const geoBtn = document.getElementById("geoBtn");
  const unitToggle = document.getElementById("unitToggle");
  const themeToggle = document.getElementById("themeToggle");
  const sunIcon = document.getElementById("sunIcon");
  const moonIcon = document.getElementById("moonIcon");
  const retryBtn = document.getElementById("retryBtn");

  const loadingState = document.getElementById("loadingState");
  const errorState = document.getElementById("errorState");
  const emptyState = document.getElementById("emptyState");
  const weatherResult = document.getElementById("weatherResult");
  const errorMessage = document.getElementById("errorMessage");

  // Result fields
  const els = {
    cityName: document.getElementById("cityName"),
    countryDate: document.getElementById("countryDate"),
    currentTime: document.getElementById("currentTime"),
    weatherIcon: document.getElementById("weatherIcon"),
    weatherDescription: document.getElementById("weatherDescription"),
    temperature: document.getElementById("temperature"),
    tempUnitLabel: document.getElementById("tempUnitLabel"),
    feelsLike: document.getElementById("feelsLike"),
    feelsLikeUnit: document.getElementById("feelsLikeUnit"),
    tempMax: document.getElementById("tempMax"),
    tempMin: document.getElementById("tempMin"),
    humidity: document.getElementById("humidity"),
    windSpeed: document.getElementById("windSpeed"),
    windUnit: document.getElementById("windUnit"),
    pressure: document.getElementById("pressure"),
    visibility: document.getElementById("visibility"),
    sunrise: document.getElementById("sunrise"),
    sunset: document.getElementById("sunset"),
  };

  // ------------------------------------------------------------------
  // App state
  // ------------------------------------------------------------------
  const state = {
    units: localStorage.getItem("skyline_units") || "metric",
    lastCity: localStorage.getItem("skyline_last_city") || "",
    theme: localStorage.getItem("skyline_theme") || getPreferredTheme(),
  };

  let activeController = null; // for aborting in-flight fetches

  // ------------------------------------------------------------------
  // Init
  // ------------------------------------------------------------------
  function init() {
    applyTheme(state.theme, false);
    applyUnitButtons(state.units);

    if (state.lastCity) {
      cityInput.value = state.lastCity;
      fetchWeather(state.lastCity, state.units);
    }

    bindEvents();
  }

  function bindEvents() {
    searchForm.addEventListener("submit", onSearchSubmit);
    cityInput.addEventListener("input", onCityInput);
    clearBtn.addEventListener("click", onClearInput);
    geoBtn.addEventListener("click", onUseLocation);
    themeToggle.addEventListener("click", onToggleTheme);
    retryBtn.addEventListener("click", onRetry);

    unitToggle.addEventListener("click", (e) => {
      const btn = e.target.closest(".unit-btn");
      if (!btn) return;
      const unit = btn.dataset.unit;
      if (unit === state.units) return;
      state.units = unit;
      localStorage.setItem("skyline_units", unit);
      applyUnitButtons(unit);
      const city = state.lastCity || cityInput.value.trim();
      if (city) fetchWeather(city, unit);
    });
  }

  // ------------------------------------------------------------------
  // Event handlers
  // ------------------------------------------------------------------
  function onSearchSubmit(e) {
    e.preventDefault();
    const city = cityInput.value.trim();

    if (!city) {
      cityInput.parentElement.classList.add("shake");
      cityInput.focus();
      setTimeout(() => cityInput.parentElement.classList.remove("shake"), 400);
      return;
    }

    fetchWeather(city, state.units);
  }

  function onCityInput() {
    clearBtn.classList.toggle("hidden", cityInput.value.length === 0);
  }

  function onClearInput() {
    cityInput.value = "";
    clearBtn.classList.add("hidden");
    cityInput.focus();
  }

  function onRetry() {
    const city = state.lastCity || cityInput.value.trim();
    if (city) fetchWeather(city, state.units);
  }

  function onUseLocation() {
    if (!navigator.geolocation) {
      showError("Geolocation is not supported by your browser.");
      return;
    }

    showLoading();
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchWeatherByCoords(latitude, longitude, state.units);
      },
      () => {
        showError("Unable to retrieve your location. Please allow location access or search manually.");
      },
      { timeout: 10000 }
    );
  }

  function onToggleTheme() {
    const next = state.theme === "dark" ? "light" : "dark";
    applyTheme(next, true);
  }

  // ------------------------------------------------------------------
  // Data fetching
  // ------------------------------------------------------------------
  async function fetchWeather(city, units) {
    showLoading();

    if (activeController) activeController.abort();
    activeController = new AbortController();

    try {
      const url = `/api/weather?city=${encodeURIComponent(city)}&units=${encodeURIComponent(units)}`;
      const response = await fetch(url, { signal: activeController.signal });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to fetch weather data.");
      }

      state.lastCity = data.city;
      localStorage.setItem("skyline_last_city", data.city);
      cityInput.value = data.city;

      renderWeather(data);
    } catch (err) {
      if (err.name === "AbortError") return;
      showError(err.message || "Something went wrong while fetching the weather.");
    }
  }

  async function fetchWeatherByCoords(lat, lon, units) {
    try {
      const url = `/api/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=${encodeURIComponent(units)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not resolve weather for your location. Please try searching by city name instead."
        );
      }

      state.lastCity = data.city;
      localStorage.setItem("skyline_last_city", data.city);
      cityInput.value = data.city;
      renderWeather(data);
    } catch (err) {
      showError(err.message || "Could not resolve weather for your location.");
    }
  }

  // ------------------------------------------------------------------
  // Rendering
  // ------------------------------------------------------------------
  function renderWeather(data) {
    const unitSymbol = data.unit_symbol || (state.units === "imperial" ? "F" : "C");

    els.cityName.textContent = data.city;
    els.countryDate.textContent = `${data.country ? data.country + " · " : ""}${formatDate(data.timezone)}`;
    els.currentTime.textContent = formatTime(data.timezone);

    els.weatherIcon.src = data.icon_url;
    els.weatherIcon.alt = data.description;
    els.weatherDescription.textContent = data.description;

    els.temperature.textContent = data.temperature;
    els.tempUnitLabel.textContent = `°${unitSymbol}`;
    els.feelsLike.textContent = data.feels_like;
    els.feelsLikeUnit.textContent = `°${unitSymbol}`;
    els.tempMax.textContent = data.temp_max;
    els.tempMin.textContent = data.temp_min;

    els.humidity.textContent = data.humidity;
    els.windSpeed.textContent = data.wind_speed;
    els.windUnit.textContent = data.speed_unit || "m/s";
    els.pressure.textContent = data.pressure;
    els.visibility.textContent = (data.visibility / 1000).toFixed(1);

    els.sunrise.textContent = formatUnixTime(data.sunrise, data.timezone);
    els.sunset.textContent = formatUnixTime(data.sunset, data.timezone);

    hideAllStates();
    weatherResult.classList.remove("hidden");
    weatherResult.classList.remove("fade-in");
    // Force reflow to restart animation
    void weatherResult.offsetWidth;
    weatherResult.style.animation = "none";
    void weatherResult.offsetWidth;
    weatherResult.style.animation = "";
  }

  function showLoading() {
    hideAllStates();
    loadingState.classList.remove("hidden");
  }

  function showError(message) {
    hideAllStates();
    errorMessage.textContent = message;
    errorState.classList.remove("hidden");
  }

  function showEmpty() {
    hideAllStates();
    emptyState.classList.remove("hidden");
  }

  function hideAllStates() {
    loadingState.classList.add("hidden");
    errorState.classList.add("hidden");
    emptyState.classList.add("hidden");
    weatherResult.classList.add("hidden");
  }

  // ------------------------------------------------------------------
  // Theme handling
  // ------------------------------------------------------------------
  function getPreferredTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme, persist) {
    state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    sunIcon.classList.toggle("hidden", theme === "dark");
    moonIcon.classList.toggle("hidden", theme !== "dark");
    if (persist) localStorage.setItem("skyline_theme", theme);
  }

  function applyUnitButtons(units) {
    document.querySelectorAll(".unit-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.unit === units);
    });
  }

  // ------------------------------------------------------------------
  // Formatting helpers
  // ------------------------------------------------------------------
  function formatDate(timezoneOffsetSeconds) {
    const now = getLocalTime(timezoneOffsetSeconds);
    return now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  }

  function formatTime(timezoneOffsetSeconds) {
    const now = getLocalTime(timezoneOffsetSeconds);
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });
  }

  function formatUnixTime(unixSeconds, timezoneOffsetSeconds) {
    if (!unixSeconds) return "--";
    const utcMs = unixSeconds * 1000;
    const localMs = utcMs + timezoneOffsetSeconds * 1000;
    const date = new Date(localMs);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });
  }

  function getLocalTime(timezoneOffsetSeconds) {
    // Compute the current UTC timestamp, then shift it by the city's
    // timezone offset (returned by the API, in seconds) to get that
    // city's local wall-clock time.
    const utcNow = new Date();
    const utcMs = utcNow.getTime() + utcNow.getTimezoneOffset() * 60000;
    return new Date(utcMs + timezoneOffsetSeconds * 1000);
  }

  // ------------------------------------------------------------------
  // Boot
  // ------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", init);
})();

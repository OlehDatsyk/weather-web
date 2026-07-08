# 🌤️ Skyline Weather

A beautiful, modern, full-stack weather dashboard built with **Flask** (Python) on the backend
and **vanilla HTML5 / CSS3 / JavaScript** on the frontend. Features a glassmorphism UI, dark
mode, smooth animations, and live weather data from the OpenWeatherMap API.

![Tech](https://img.shields.io/badge/Python-3.9+-blue) ![Tech](https://img.shields.io/badge/Flask-3.0-black) ![Tech](https://img.shields.io/badge/JavaScript-ES6-yellow)

---

## ✨ Features

- 🎨 **Glassmorphism UI** - frosted-glass cards, blurred backgrounds, animated gradient blobs
- 🌗 **Dark Mode** - toggle with persisted preference (localStorage)
- 📱 **Fully Responsive** - CSS Grid + Flexbox layout, mobile-first breakpoints
- 🔍 **Live Search** - search-as-you-type input with clear button and shake-on-empty animation
- 📍 **Geolocation Support** - "Use my location" button for instant local weather
- 🌡️ **Unit Toggle** - switch between °C and °F on the fly
- ⏳ **Loading Spinner** - smooth loading indicator while fetching data
- ⚠️ **Error Handling** - graceful error states with retry button (invalid city, network issues, etc.)
- 🖼️ **Weather Icons** - dynamic icons from OpenWeatherMap matching current conditions
- 📊 **Rich Weather Details** - city, country, temperature, feels like, humidity, pressure,
  wind, visibility, sunrise, sunset, date & time
- 🧱 **Clean Architecture** - Flask routes separated from business logic (`services/` layer)

---

## 🗂️ Project Structure

```
weather-web/
├── app.py # Flask application & routes
├── services/
│   ├── __init__.py
│   └── weather_service.py # OpenWeatherMap API integration & data normalization
├── templates/
│   └── index.html # Main single-page dashboard
├── static/
│   ├── css/
│   │   └── style.css # Glassmorphism styling, dark mode, animations
│   ├── js/
│   │   └── script.js # Fetch API calls, state management, UI logic
│   └── images/ # (optional) static image assets
├── requirements.txt # Python dependencies
├── .env.example # Environment variable template
├── .gitignore
└── README.md
```

---

## 🔧 Prerequisites

- **Python 3.9+** installed
- A free **OpenWeatherMap API key** - sign up at
  [https://home.openweathermap.org/users/sign_up](https://home.openweathermap.org/users/sign_up)
  and grab your key from [API keys](https://home.openweathermap.org/api_keys)
  > ⚠️ New API keys can take up to a couple of hours to activate.
- **Visual Studio Code** (recommended, optional) with the Python extension

---

## 🚀 Installation & Setup

### 1. Open the project in VS Code

```bash
cd weather-web
code .
```

### 2. Create and activate a virtual environment

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows (PowerShell):**
```powershell
python -m venv venv
venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
python -m venv venv
venv\Scripts\activate.bat
```

> In VS Code, once the venv is created, use **Ctrl+Shift+P -> "Python: Select Interpreter"**
> and choose the `venv` interpreter so the editor and terminal stay in sync.

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Copy the example file and add your API key:

```bash
cp .env.example .env      # macOS/Linux
copy .env.example .env    # Windows
```

Then open `.env` and set:

```env
OPENWEATHER_API_KEY=your_actual_api_key_here
FLASK_DEBUG=True
PORT=5000
```

### 5. Run the application

```bash
python app.py
```

You should see output similar to:

```
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

### 6. Open in your browser

Navigate to **http://localhost:5000** - search for any city and enjoy! 🎉

---

## 🖥️ Running via Flask CLI (alternative)

```bash
export FLASK_APP=app.py        # macOS/Linux
set FLASK_APP=app.py           # Windows CMD
$env:FLASK_APP="app.py"        # Windows PowerShell

flask run
```

---

## 🌐 API Reference (internal)

The frontend talks to a small internal API exposed by the Flask backend:

### `GET /api/weather`

| Query Param | Type   | Required | Description                                   |
|-------------|--------|----------|------------------------------------------------|
| `city`      | string | one of `city` or `lat`+`lon` | City name, e.g. `London` or `Paris,FR` |
| `lat`       | float  | with `lon` | Latitude for geolocation-based lookup       |
| `lon`       | float  | with `lat` | Longitude for geolocation-based lookup      |
| `units`     | string | no       | `metric` (default), `imperial`, or `standard` |

**Example:**
```
GET /api/weather?city=London&units=metric
```

**Success response (200):**
```json
{
  "city": "London",
  "country": "GB",
  "temperature": 18,
  "feels_like": 17,
  "temp_min": 15,
  "temp_max": 20,
  "humidity": 62,
  "pressure": 1013,
  "wind_speed": 4.1,
  "description": "Scattered Clouds",
  "icon_url": "https://openweathermap.org/img/wn/03d@4x.png",
  "sunrise": 1717740000,
  "sunset": 1717795200,
  "timezone": 3600
}
```

**Error response (4xx/5xx):**
```json
{ "error": "City \"Xyzabc\" was not found. Please check the spelling and try again." }
```

### `GET /api/health`
Simple health check - returns `{ "status": "ok" }`.

---

## 🛠️ Tech Stack

| Layer      | Technology                                   |
|------------|-----------------------------------------------|
| Backend    | Python 3, Flask, Requests, python-dotenv      |
| Frontend   | HTML5, CSS3 (Grid, Flexbox, CSS Variables), Vanilla JavaScript (Fetch API) |
| Weather Data | [OpenWeatherMap](https://openweathermap.org/) Current Weather API |
| Styling    | Custom glassmorphism design system, Google Fonts (Poppins/Inter) |

---

## 🧯 Troubleshooting

- **"Weather API key is not configured"** - make sure you created a `.env` file (not just
  `.env.example`) and that `OPENWEATHER_API_KEY` is set correctly.
- **"Invalid API key"** - new OpenWeatherMap keys can take up to ~2 hours to activate after
  signup.
- **City not found** - try adding a country code, e.g. `Springfield,US`.
- **Port already in use** - change `PORT` in `.env` or stop the process using port 5000.
- **CSS/JS not updating** - hard refresh the browser (Ctrl+Shift+R / Cmd+Shift+R) to bypass
  cache, or disable cache in DevTools while developing.

---

## 📦 Production Notes

For production deployment, run behind a WSGI server such as Gunicorn instead of the Flask
dev server:

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

Also remember to set `FLASK_DEBUG=False` in your production `.env`.

---

## Quick reference: Windows / PowerShell / VS Code

If you're on Windows and just want the exact command sequence to copy and
paste, use this section.

### First-time setup

```powershell
cd "path\to\weather-web"

python -m venv venv
venv\Scripts\Activate.ps1
```

If activation fails with an execution-policy error, run this once, then
repeat the activate command:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
venv\Scripts\Activate.ps1
```

Your prompt should now start with `(venv)`. Then:

```powershell
pip install -r requirements.txt
pip show flask
copy .env.example .env
code .env
```

In the `.env` file that opens, fill in and **save**:

```
OPENWEATHER_API_KEY=<your real OpenWeatherMap key>
FLASK_DEBUG=True
PORT=5000
```

Make sure there is only **one** `OPENWEATHER_API_KEY=` line, and it is not
still the placeholder text `your_actual_api_key_here`.

Then run the app:

```powershell
python app.py
```

Ctrl+click the printed link, or open **http://localhost:5000** manually.

### Every time you come back later

```powershell
cd "path\to\weather-web"
venv\Scripts\Activate.ps1
python app.py
```

### If you ever edit `.env`

`.env` is only read at startup, so changes won't apply automatically:

1. Click into the terminal running the app.
2. Press `Ctrl+C` to stop it.
3. Run `python app.py` again.
4. Refresh the browser tab.

### Troubleshooting (Windows-specific)

**`source venv/bin/activate` not recognized**
That's macOS/Linux syntax. On Windows PowerShell use `venv\Scripts\Activate.ps1` instead.

**`No module named 'flask'` or similar import errors**
Confirm `(venv)` is shown in your prompt, then run `pip install -r requirements.txt` again - this error usually means `pip install` ran against a different Python than the one running `app.py`.

**"Weather API key is not configured" / "Invalid API key"**
Your `.env` still has the placeholder text, has a duplicate `OPENWEATHER_API_KEY` line, the key hasn't finished activating yet (can take up to a couple of hours), or you edited `.env` without restarting `python app.py`. Fix `.env`, save it, stop the server (`Ctrl+C`), and rerun `python app.py`.

**Port already in use**
Something else is already listening on port 5000. Either stop that process, or change `PORT=5000` to a different value (e.g. `PORT=5050`) in `.env`, save, and restart.

**CSS/JS changes not showing up**
Hard refresh the browser with `Ctrl+Shift+R`, or open DevTools and disable cache while the Network tab is open.

---

## 📄 License

This project is provided as-is for educational and personal use. Weather data is provided by
[OpenWeatherMap](https://openweathermap.org/) under their respective terms of service.

# 🌤️ Skyline Weather - Complete Beginner's Setup & Usage Guide

Welcome! This guide assumes you have **never used Python, Git, VS Code, a terminal, virtual environments, or an API before.** Follow every step in order - nothing is skipped.

---

## Table of Contents

1. [What This App Does](#1-what-this-app-does)
2. [Installing Python](#2-installing-python)
3. [Installing Git](#3-installing-git)
4. [Installing Visual Studio Code](#4-installing-visual-studio-code)
5. [Required VS Code Extensions](#5-required-vs-code-extensions)
6. [Opening the Project in VS Code](#6-opening-the-project-in-vs-code)
7. [Creating a Virtual Environment](#7-creating-a-virtual-environment)
8. [Activating the Virtual Environment](#8-activating-the-virtual-environment)
9. [Installing Dependencies](#9-installing-dependencies)
10. [Creating the .env File & API Key](#10-creating-the-env-file--api-key)
11. [Running the Application](#11-running-the-application)
12. [Testing the Application](#12-testing-the-application)
13. [Using Every Feature](#13-using-every-feature)
14. [Troubleshooting](#14-troubleshooting)
15. [FAQ](#15-faq)
16. [Common Mistakes](#16-common-mistakes)
17. [Security Recommendations](#17-security-recommendations)
18. [Next Learning Steps](#18-next-learning-steps)

---

## 1. What This App Does

Skyline Weather is a small website. You type in a city name, and it shows you the current weather (temperature, humidity, wind, sunrise/sunset, etc.) using live data from a weather service called **OpenWeatherMap**.

It has two parts:
- A **backend** (written in Python, using a framework called **Flask**) that fetches weather data.
- A **frontend** (HTML/CSS/JavaScript) that you see and click around in your browser.

You don't need to understand any of that yet - just follow the steps below.

---

## 2. Installing Python

Python is the programming language this project's backend is written in.

1. Go to **https://www.python.org/downloads/** in your web browser.
2. Click the big **"Download Python 3.x.x"** button (it auto-detects your operating system).
3. Run the installer you downloaded.
   - **Windows:** On the very first installer screen, **check the box that says "Add python.exe to PATH"** before clicking Install. This step is easy to miss and causes most beginner problems.
   - **macOS:** Run the `.pkg` installer and click through with the default options.
4. When installation finishes, verify it worked:
   - **Windows:** Press the `Windows` key, type `cmd`, press Enter to open Command Prompt, then type:
     ```
     python --version
     ```
   - **macOS:** Open **Terminal** (press `Cmd+Space`, type "Terminal", press Enter), then type:
     ```
     python3 --version
     ```
5. You should see something like `Python 3.12.4`. If you see an error instead, see [Troubleshooting](#14-troubleshooting).

---

## 3. Installing Git

Git lets you download and manage code projects. (You may not strictly need it if you already have the project folder, but it's used throughout this guide's troubleshooting and is essential if you ever put this project on GitHub.)

1. Go to **https://git-scm.com/downloads**.
2. Download the installer for your operating system and run it.
3. **Windows:** Click "Next" through all the default options - the defaults are fine for beginners.
4. **macOS:** If you're prompted to install "Command Line Developer Tools," click **Install**.
5. Verify installation by opening your terminal (Command Prompt on Windows, Terminal on macOS) and typing:
   ```
   git --version
   ```
   You should see something like `git version 2.45.0`.

---

## 4. Installing Visual Studio Code

Visual Studio Code (VS Code) is the code editor you'll use to open and run this project.

1. Go to **https://code.visualstudio.com/**.
2. Click **Download**.
3. Run the installer.
   - **Windows:** During install, check the boxes for "Add to PATH" and "Add 'Open with Code' action" if offered - they make life easier later.
   - **macOS:** Drag the app into your Applications folder.
4. Open VS Code once to confirm it launches.

---

## 5. Required VS Code Extensions

Inside VS Code:

1. Click the **Extensions** icon in the left sidebar (it looks like four squares, one detached).
2. Search for and install each of these:
   - **Python** (by Microsoft) - enables Python support, debugging, and IntelliSense.
   - **Pylance** (by Microsoft) - usually installs automatically with the Python extension; improves autocomplete.
3. No other extensions are required for this project.

---

## 6. Opening the Project in VS Code

1. Open VS Code.
2. Go to **File -> Open Folder...** (macOS: **File -> Open...**).
3. Navigate to and select the `weather-web` project folder (the one containing `app.py`).
4. Click **Select Folder** (Windows) or **Open** (macOS).
5. You should now see the file tree on the left, including `app.py`, `services/`, `templates/`, `static/`, etc.

---

## 7. Creating a Virtual Environment

A **virtual environment** is an isolated, private copy of Python just for this project, so its dependencies don't clash with other projects on your computer.

> **Note:** The project folder you received may already include a `venv/` folder and/or `venv.zip`. Those were created on someone else's computer and **will not work correctly on yours** - virtual environments are not portable between machines. Delete or ignore `venv/` and `venv.zip` and create your own fresh one using the steps below.

1. In VS Code, open a terminal: **Terminal -> New Terminal** (or press `` Ctrl+` ``).
2. Make sure the terminal is open in the `weather-web` project folder (it should show `weather-web` in the path).
3. Run:
   - **Windows:**
     ```
     python -m venv venv
     ```
   - **macOS:**
     ```
     python3 -m venv venv
     ```
4. This creates a new folder called `venv` containing a private copy of Python for this project. It may take 10-30 seconds.

---

## 8. Activating the Virtual Environment

"Activating" tells your terminal to use the project's private Python instead of your computer's main Python.

- **Windows (Command Prompt):**
  ```
  venv\Scripts\activate
  ```
- **Windows (PowerShell):**
  ```
  venv\Scripts\Activate.ps1
  ```
  If PowerShell blocks this with a "running scripts is disabled" error, see [Troubleshooting](#14-troubleshooting).
- **macOS (Terminal):**
  ```
  source venv/bin/activate
  ```

**How to know it worked:** your terminal prompt line will now start with `(venv)`, like:
```
(venv) C:\Users\You\weather-web>
```

You'll need to do this **every time** you open a new terminal to work on this project.

---

## 9. Installing Dependencies

Dependencies are the third-party code libraries this project needs (Flask, requests, etc.), listed in `requirements.txt`.

With your virtual environment **activated** (you see `(venv)` in the prompt), run:

```
pip install -r requirements.txt
```

This downloads and installs:
- `Flask` - the web framework that runs the app
- `requests` - used to call the OpenWeatherMap API
- `python-dotenv` - loads your `.env` settings file
- `gunicorn` - a production-grade way to run the app (not required for local testing)

Wait for it to finish - you'll see a line like `Successfully installed Flask-3.0.3 ...`.

---

## 10. Creating the .env File & API Key

The app needs a **weather API key** - a private password-like code that lets it fetch data from OpenWeatherMap.

1. In the project folder, find the file `.env.example`. This is a **template**.
2. Make a copy of it named exactly `.env`:
   - **Windows (Command Prompt):**
     ```
     copy .env.example .env
     ```
   - **macOS (Terminal):**
     ```
     cp .env.example .env
     ```
3. Get your own free API key:
   - Go to **https://home.openweathermap.org/users/sign_up** and create a free account.
   - After confirming your email, go to **https://home.openweathermap.org/api_keys**.
   - Copy the API key shown there (a long string of letters and numbers).
   - ⏳ **New keys can take up to ~1 hour to activate** - this is normal for OpenWeatherMap.
4. Open your new `.env` file in VS Code and replace the existing value after `OPENWEATHER_API_KEY=` with **your own key**:
   ```
   OPENWEATHER_API_KEY=paste_your_own_key_here
   ```

> ⚠️ **Important:** The `.env` file may currently contain a key that isn't yours. Replace it with your own key from your own OpenWeatherMap account before relying on this app, and never share your `.env` file publicly (see [Security Recommendations](#17-security-recommendations)).

---

## 11. Running the Application

With your virtual environment activated and dependencies installed, run:

```
python app.py
```

You should see output similar to:
```
 * Running on http://127.0.0.1:1022
```

Now open your web browser and go to:

```
http://127.0.0.1:1022
```

You should see the Skyline Weather dashboard.

To stop the app, click back into the terminal and press `Ctrl+C`.

**Alternative (easier):** you can also just double-click the provided **`Start App.bat`** (Windows) or **`Start App (Mac).command`** (macOS) file - see the sections at the end of this guide.

---

## 12. Testing the Application

1. With the app running, go to `http://127.0.0.1:1022` in your browser.
2. Type a well-known city name (e.g., "London") into the search box and press Enter.
3. You should see a weather card appear with temperature, description, humidity, wind, etc.
4. Click the **°C / °F** toggle to confirm units switch correctly.
5. Click the **location/geolocation button** and allow location access when your browser prompts you - it should show weather for your current location.
6. Click the **dark mode toggle** (sun/moon icon) to confirm the theme switches and stays saved on reload.
7. As a quick backend health check, visit `http://127.0.0.1:1022/api/health` directly in your browser - you should see:
   ```
   {"status": "ok"}
   ```

---

## 13. Using Every Feature

| Feature | How to Use It |
|---|---|
| **City search** | Type a city name in the search box and press Enter or click the search icon. |
| **Clear search** | Click the ✕ button inside the search box to clear your input. |
| **Use my location** | Click the location/pin icon; allow the browser's location permission prompt. |
| **°C / °F toggle** | Click either unit button near the top - your choice is remembered for next time. |
| **Dark / light mode** | Click the sun/moon icon in the header. Your preference is saved in the browser. |
| **Retry after an error** | If a lookup fails (e.g., city not found), click the "Retry" button shown in the error state. |
| **Weather details shown** | Temperature, "feels like," min/max, humidity, pressure, wind speed & direction, visibility, sunrise, sunset, local date & time. |

---

## 14. Troubleshooting

**`python` is not recognized as a command (Windows)**
Python wasn't added to PATH during install. Reinstall Python and make sure to check "Add python.exe to PATH" on the first installer screen.

**`python3: command not found` (macOS)**
Reinstall Python from python.org, or try `python --version` instead of `python3`.

**PowerShell says "running scripts is disabled on this system"**
Open PowerShell as Administrator and run:
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then try activating the virtual environment again.

**`ModuleNotFoundError: No module named 'flask'`**
Your virtual environment isn't activated, or dependencies weren't installed. Repeat [Section 8](#8-activating-the-virtual-environment) and [Section 9](#9-installing-dependencies).

**The browser shows "Weather API key is not configured"**
Your `.env` file is missing or the API key value is empty. Repeat [Section 10](#10-creating-the-env-file--api-key).

**The browser shows "Invalid API key"**
Your OpenWeatherMap key hasn't activated yet (can take up to ~1 hour after signup) or was typed incorrectly. Double-check you copied it exactly, with no extra spaces.

**"City ... was not found"**
Check the spelling, or add a country code, e.g. `London,GB`.

**Port 1022 already in use**
Another program is using that port. Either close it, or open `.env` and change `PORT=1022` to `PORT=5050` (or any free number), then restart the app.

**Nothing happens when double-clicking `Start App (Mac).command`**
macOS may block the file from running the first time. Right-click the file -> **Open** -> confirm "Open" in the security dialog. You only need to do this once.

---

## 15. FAQ

**Do I need to pay for anything?**
No. OpenWeatherMap's free tier is enough for this project.

**Do I need to keep the terminal window open while using the app?**
Yes - closing it stops the Flask server, and the website will stop working.

**Can I use this on my phone?**
The app runs on your computer; you can access it from your phone's browser if both devices are on the same Wi-Fi network, by visiting `http://<your-computer's-local-IP>:1022` instead of `127.0.0.1`.

**Why does the app ask for my location?**
Only to fetch weather for where you currently are, if you click the "Use my location" button. Location is never sent anywhere except directly into the weather lookup - the app doesn't store or share it.

**Can I deploy this online for others to use?**
Yes, but read [Security Recommendations](#17-security-recommendations) first - some settings need to change for a public deployment.

---

## 16. Common Mistakes

- ❌ Forgetting to activate the virtual environment before running `pip install` or `python app.py` (you won't see `(venv)` in your prompt).
- ❌ Editing `.env.example` instead of `.env` - the app reads from `.env`, not the example file.
- ❌ Committing/sharing your real `.env` file (with your real API key) publicly, e.g., on GitHub.
- ❌ Expecting the weather key to work immediately after signup - it can take up to an hour to activate.
- ❌ Running `python app.py` from the wrong folder (make sure your terminal is inside the `weather-web` folder).
- ❌ Reusing the `venv/` folder that came with the project instead of creating your own (see [Section 7](#7-creating-a-virtual-environment)).

---

## 17. Security Recommendations

- **Get your own API key** and don't rely on any key that came pre-filled in this project - treat any key you didn't personally generate as compromised.
- **Never commit `.env` to Git/GitHub.** It's already listed in `.gitignore`, but always double check with `git status` before your first commit.
- If you ever plan to put this project on GitHub, make sure `.env.example` contains a **fake placeholder value**, not a real key.
- For anything beyond local testing on your own computer, set `FLASK_DEBUG=False` in `.env` - debug mode is meant for development only and should never be left on for anything reachable by others.
- If you deploy this publicly, run it behind `gunicorn` (already included in `requirements.txt`) instead of `python app.py`, and consider adding rate limiting so your API quota can't be exhausted by strangers.

---

## 18. Next Learning Steps

Once you're comfortable running this project, here are good next things to learn:

1. **Python basics** - variables, functions, and control flow (freeCodeCamp, Python's own official tutorial).
2. **Flask fundamentals** - routes, templates, and request handling (Flask's official Quickstart docs).
3. **Git & GitHub** - how to track changes and publish a project (`git init`, `git add`, `git commit`, `git push`).
4. **HTML/CSS/JavaScript basics** - to customize `templates/index.html`, `static/css/style.css`, and `static/js/script.js`.
5. **REST APIs** - how this app talks to OpenWeatherMap, and how you could add other APIs later.
6. **Environment variables & `.env` files** - why secrets are kept out of source code (you've already used this!).

Congratulations - you now have a fully running weather app and the foundation to keep learning. 🌤️

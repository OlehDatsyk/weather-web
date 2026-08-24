@echo off
REM ============================================================================
REM  Skyline Weather - Windows Startup Script
REM  Double-click this file to set up (first run) and launch the app.
REM ============================================================================

setlocal enabledelayedexpansion
title Skyline Weather - Starting...
cd /d "%~dp0"

echo =======================================================
echo   Skyline Weather - Startup (Was made by Oleh Datsyk)
echo =======================================================
echo.

REM ----------------------------------------------------------------------
REM 1. Check Python is installed
REM ----------------------------------------------------------------------
echo [1/6] Checking for Python...
where python >nul 2>nul
if errorlevel 1 (
    echo.
    echo [ERROR] Python was not found on this computer.
    echo         Please install Python from https://www.python.org/downloads/
    echo         During installation, make sure to check "Add python.exe to PATH".
    echo.
    pause
    exit /b 1
)
python --version
echo   Python found.
echo.

REM ----------------------------------------------------------------------
REM 2. Create virtual environment if it doesn't exist
REM ----------------------------------------------------------------------
echo [2/6] Checking for virtual environment...
if not exist "venv\Scripts\activate.bat" (
    echo   No virtual environment found. Creating one now, this may take a moment...
    python -m venv venv
    if errorlevel 1 (
        echo.
        echo [ERROR] Failed to create the virtual environment.
        echo.
        pause
        exit /b 1
    )
    echo   Virtual environment created.
) else (
    echo   Virtual environment already exists.
)
echo.

REM ----------------------------------------------------------------------
REM 3. Activate virtual environment
REM ----------------------------------------------------------------------
echo [3/6] Activating virtual environment...
call "venv\Scripts\activate.bat"
if errorlevel 1 (
    echo.
    echo [ERROR] Failed to activate the virtual environment.
    echo.
    pause
    exit /b 1
)
echo   Virtual environment activated.
echo.

REM ----------------------------------------------------------------------
REM 4. Install / verify dependencies
REM ----------------------------------------------------------------------
echo [4/6] Checking dependencies (this may take a moment on first run)...
python -m pip install --quiet --disable-pip-version-check -r requirements.txt
if errorlevel 1 (
    echo.
    echo [ERROR] Failed to install dependencies from requirements.txt
    echo         Check your internet connection and try again.
    echo.
    pause
    exit /b 1
)
echo   Dependencies are up to date.
echo.

REM ----------------------------------------------------------------------
REM 5. Verify .env file exists
REM ----------------------------------------------------------------------
echo [5/6] Checking for .env configuration file...
if not exist ".env" (
    if exist ".env.example" (
        echo   No .env file found. Creating one from .env.example...
        copy /y ".env.example" ".env" >nul
        echo.
        echo   [ACTION NEEDED] A new .env file was created for you.
        echo   Open it and add your own OpenWeatherMap API key before continuing.
        echo   Get a free key at: https://home.openweathermap.org/api_keys
        echo.
        pause
    ) else (
        echo.
        echo [ERROR] No .env or .env.example file found. Cannot continue.
        echo.
        pause
        exit /b 1
    )
) else (
    echo   .env file found.
)
echo.

REM ----------------------------------------------------------------------
REM 6. Launch the application
REM ----------------------------------------------------------------------
echo [6/6] Starting Skyline Weather...
echo.
echo ============================================================
echo   The app will open at: http://127.0.0.1:8000
echo   Keep this window open while using the app.
echo   Press CTRL+C in this window to stop the server.
echo ============================================================
echo.

start "" "http://127.0.0.1:8000"
python app.py

REM If app.py exits with an error, keep the window open so the user can read it
if errorlevel 1 (
    echo.
    echo ============================================================
    echo   [ERROR] The application stopped unexpectedly.
    echo   Scroll up to read the error message above.
    echo ============================================================
    echo.
)

pause

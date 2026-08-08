#!/bin/bash
# ============================================================================
#  Skyline Weather - macOS Startup Script
#  Double-click this file (in Finder) to set up (first run) and launch the app.
# ============================================================================

# Move into the folder this script lives in
cd "$(dirname "$0")" || exit 1

echo "======================================================="
echo "  Skyline Weather - Startup (Was made by Oleh Datsyk)"
echo "======================================================="
echo ""

# ----------------------------------------------------------------------
# 1. Check Python is installed
# ----------------------------------------------------------------------
echo "[1/6] Checking for Python..."
PYTHON_CMD=""
if command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD="python3"
elif command -v python >/dev/null 2>&1; then
    PYTHON_CMD="python"
fi

if [ -z "$PYTHON_CMD" ]; then
    echo ""
    echo "[ERROR] Python was not found on this computer."
    echo "        Please install Python from https://www.python.org/downloads/"
    echo ""
    read -n 1 -s -r -p "Press any key to close this window..."
    exit 1
fi

"$PYTHON_CMD" --version
echo "  Python found ($PYTHON_CMD)."
echo ""

# ----------------------------------------------------------------------
# 2. Create virtual environment if it doesn't exist
# ----------------------------------------------------------------------
echo "[2/6] Checking for virtual environment..."
if [ ! -f "venv/bin/activate" ]; then
    echo "  No virtual environment found. Creating one now, this may take a moment..."
    "$PYTHON_CMD" -m venv venv
    if [ $? -ne 0 ]; then
        echo ""
        echo "[ERROR] Failed to create the virtual environment."
        echo ""
        read -n 1 -s -r -p "Press any key to close this window..."
        exit 1
    fi
    echo "  Virtual environment created."
else
    echo "  Virtual environment already exists."
fi
echo ""

# ----------------------------------------------------------------------
# 3. Activate virtual environment
# ----------------------------------------------------------------------
echo "[3/6] Activating virtual environment..."
# shellcheck disable=SC1091
source "venv/bin/activate"
if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Failed to activate the virtual environment."
    echo ""
    read -n 1 -s -r -p "Press any key to close this window..."
    exit 1
fi
echo "  Virtual environment activated."
echo ""

# ----------------------------------------------------------------------
# 4. Install / verify dependencies
# ----------------------------------------------------------------------
echo "[4/6] Checking dependencies (this may take a moment on first run)..."
python -m pip install --quiet --disable-pip-version-check -r requirements.txt
if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Failed to install dependencies from requirements.txt"
    echo "        Check your internet connection and try again."
    echo ""
    read -n 1 -s -r -p "Press any key to close this window..."
    exit 1
fi
echo "  Dependencies are up to date."
echo ""

# ----------------------------------------------------------------------
# 5. Verify .env file exists
# ----------------------------------------------------------------------
echo "[5/6] Checking for .env configuration file..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "  No .env file found. Creating one from .env.example..."
        cp ".env.example" ".env"
        echo ""
        echo "  [ACTION NEEDED] A new .env file was created for you."
        echo "  Open it and add your own OpenWeatherMap API key before continuing."
        echo "  Get a free key at: https://home.openweathermap.org/api_keys"
        echo ""
        read -n 1 -s -r -p "Press any key to continue..."
        echo ""
    else
        echo ""
        echo "[ERROR] No .env or .env.example file found. Cannot continue."
        echo ""
        read -n 1 -s -r -p "Press any key to close this window..."
        exit 1
    fi
else
    echo "  .env file found."
fi
echo ""

# ----------------------------------------------------------------------
# 6. Launch the application
# ----------------------------------------------------------------------
echo "[6/6] Starting Skyline Weather..."
echo ""
echo "============================================================"
echo "  The app will open at: http://127.0.0.1:1022"
echo "  Keep this window open while using the app."
echo "  Press CTRL+C in this window to stop the server."
echo "============================================================"
echo ""

# Open the default browser to the app's URL after a short delay
( sleep 2 && open "http://127.0.0.1:1022" ) &

python app.py
STATUS=$?

if [ $STATUS -ne 0 ]; then
    echo ""
    echo "============================================================"
    echo "  [ERROR] The application stopped unexpectedly."
    echo "  Scroll up to read the error message above."
    echo "============================================================"
    echo ""
fi

read -n 1 -s -r -p "Press any key to close this window..."

#!/bin/bash

# Create a virtual environment if it doesn't exist. Otherwise, activate it.
if [[ ! -d ".venv" ]]; then
    python3 -m venv ".venv"
    source ".venv/bin/activate"
    pip install -r requirements.txt 'uvicorn[standard]'
else
    source ".venv/bin/activate"
fi

# Run the app using the port specified in the PORT environment variable.
uvicorn "main:app" --port "${PORT:-8000}"

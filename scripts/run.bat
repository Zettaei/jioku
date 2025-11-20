@echo off
setlocal
set "OLD_DIR=%cd%"

cd /d "%~dp0"

if not exist venv (
    python -m venv venv
)

call venv\Scripts\python.exe -m pip install --upgrade pip
call venv\Scripts\python.exe -m pip install -r ./requirements.txt
call venv\Scripts\python.exe src\main.py

cd /d "%OLD_DIR%"
endlocal

pause
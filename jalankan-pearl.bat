@echo off
setLocal

cd /d "%dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js tidak ditemukan. Silakan insrtal Node.js terlebih dahulu.
    pause
    exit /b
)

if "%~1" neq "" (
    node index.js "%~1"
) else (
    node index.js
)

echo.
pause

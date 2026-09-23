@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if not errorlevel 1 (
  node scripts/launch.mjs %*
  if errorlevel 1 pause
  exit /b
)
if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" (
  "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" scripts/launch.mjs %*
  if errorlevel 1 pause
  exit /b
)
  echo Necesitas Node.js 20 o superior para iniciar la presentacion.
  echo Instala Node.js desde https://nodejs.org y vuelve a abrir este archivo.
  pause
  exit /b 1

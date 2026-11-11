@echo off
title ANACI BG Hub - Pubblica Aggiornamento su VPS
echo ===================================================================
echo   ANACI BG HUB - Sincronizzazione e Deploy su VPS (Coolify)
echo ===================================================================
echo.
cd /d "c:\Progetti\A-017 ANACI BG Hub"

echo [1/2] Invio modifiche su GitHub...
git add -A
git commit -m "Aggiornamento ANACI BG Hub" 2>nul
git push origin main

echo.
echo [2/2] Avvio ricostruzione automatica sulla VPS (187.126.30.207)...
ssh root@187.126.30.207 "/root/deploy_app.sh anacibghub00000000000001"

echo.
echo ===================================================================
echo   Operazione completata! Tra ~30 secondi l'aggiornamento sara' live:
echo   https://anaci.187.126.30.207.sslip.io
echo ===================================================================
pause

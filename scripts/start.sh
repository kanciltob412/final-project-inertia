#!/usr/bin/env bash
set -euo pipefail

# Detect local IPv4 address (macOS/en0 first)
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || (ifconfig | awk '/inet / && $2 != "127.0.0.1" {print $2; exit}'))

if [ -z "$IP" ]; then
  echo "Could not detect local IP address. Servers will still start on 0.0.0.0 but you won't have a LAN URL printed."
else
  echo "Local LAN IP detected: $IP"
  echo "Laravel: http://$IP:8000"
  echo "Vite:    http://$IP:5173"
fi

echo "Starting backend and Vite (dev:all)..."
npm run dev:all

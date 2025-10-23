#!/bin/sh
set -e

# Reemplaza el placeholder __API_KEY__ con el valor de la variable de entorno APIKEY
# en el archivo index.html
sed -i "s|__API_KEY__|${APIKEY}|g" /usr/share/caddy/index.html

# Ejecuta el comando original de Caddy
exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile

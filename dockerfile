# Etapa 1: Construcción de la app de React
FROM node:18-alpine AS builder

# Definimos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos necesarios
COPY package*.json ./

# Instalamos dependencias
RUN npm ci

# Copiamos el resto del código
COPY . .

# Compilamos la app
RUN npm run build


# Etapa 2: Servir con Caddy
FROM caddy:2-alpine

# Copiamos la build de React a la carpeta que servirá Caddy
COPY --from=builder /app/dist /usr/share/caddy

# Copiamos configuración de Caddy (opcional)
# Si quieres redirecciones o headers personalizados, crea un Caddyfile
# y lo copias así:
COPY Caddyfile /etc/caddy/Caddyfile

# Por defecto, Caddy servirá /usr/share/caddy en el puerto 80

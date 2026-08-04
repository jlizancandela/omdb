# Etapa 1: Construcción de la app de React
FROM node:24-alpine AS builder

# Definimos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos necesarios para pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Habilitamos pnpm e instalamos dependencias
RUN corepack enable && pnpm install --frozen-lockfile

# Copiamos el resto del código
COPY . .

# Compilamos la app
RUN pnpm run build


# Etapa 2: Servir con Caddy
FROM caddy:2-alpine

# Copiamos la build de React a la carpeta que servirá Caddy
COPY --from=builder /app/dist /usr/share/caddy

# Copiamos configuración de Caddy (opcional)
# Si quieres redirecciones o headers personalizados, crea un Caddyfile
# y lo copias así:
COPY Caddyfile /etc/caddy/Caddyfile

# Copiamos el entrypoint script
COPY scripts/entrypoint.sh /usr/local/bin/entrypoint.sh

# Hacemos el entrypoint script ejecutable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Exponemos la variable de entorno
ENV APIKEY=""

# Establecemos el entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Por defecto, Caddy servirá /usr/share/caddy en el puerto 80

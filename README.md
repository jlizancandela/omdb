# OMDb Movie Browser

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-3-6E9F18?logo=vitest&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![GitHub Actions](https://github.com/jlizancandela/omdb/actions/workflows/docker-publish.yml/badge.svg)

Aplicación React + TypeScript para buscar películas en OMDb, ver detalles y guardar favoritos.

## Demo

- Demo local: ejecuta `pnpm dev` y abre la aplicación en tu navegador.
- Demo en vivo: pendiente de despliegue.

## Funcionalidades

- Búsqueda con debounce.
- Scroll infinito.
- Caché por consulta y página.
- Eliminación de duplicados.
- Favoritos persistidos.
- Routing entre home, detalle y favoritos.
- Tests automatizados.

## API utilizada

- [Open Movie Database (OMDb)](https://www.omdbapi.com/)

## Configurar la clave de API

1. Crea un archivo `.env` en la raíz del proyecto.
2. Añade tu clave de OMDb:

   ```
   VITE_API_KEY=tu_clave_aqui
   ```

3. Inicia la app:

   ```bash
   pnpm install
   pnpm dev
   ```

## Decisiones técnicas

- Hook personalizado para búsqueda y paginación.
- Intersection Observer para carga incremental.
- Caché en memoria por consulta y página.
- MSW para aislar las pruebas de la API externa.

## Tests

- `pnpm test --run`
- `pnpm build`

## Mejoras futuras

- Unificar el tratamiento de errores HTTP.
- Extraer la caché de `useMovies`.
- Reducir responsabilidades del hook principal.

## Licencia

MIT

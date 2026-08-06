# OMDb Movie Browser

[![ci](https://github.com/jlizancandela/omdb/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/jlizancandela/omdb/actions/workflows/docker-publish.yml) [![License](https://img.shields.io/github/license/jlizancandela/omdb)](https://github.com/jlizancandela/omdb/blob/main/LICENSE) [![Top language](https://img.shields.io/github/languages/top/jlizancandela/omdb)](https://github.com/jlizancandela/omdb) [![Last commit](https://img.shields.io/github/last-commit/jlizancandela/omdb)](https://github.com/jlizancandela/omdb/commits/main) [![Stars](https://img.shields.io/github/stars/jlizancandela/omdb?style=social)](https://github.com/jlizancandela/omdb/stargazers)

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

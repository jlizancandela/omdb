# OMDb Movie Browser

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-3-6E9F18?logo=vitest&logoColor=white)
![Testing Library](https://img.shields.io/badge/Testing_Library-16-E33332?logo=testinglibrary&logoColor=white)
![MSW](https://img.shields.io/badge/MSW-2-FF6A33?logo=mockserviceworker&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white)

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

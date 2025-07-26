# Aplicación React de OMDb

Esta aplicación es un proyecto pequeño que consulta la [Open Movie Database](https://www.omdbapi.com/) para obtener información de películas. Fue creada con Vite y utiliza TypeScript.

## Funcionalidades

- Búsqueda de películas con entrada retrasada (debounce).
- Carga infinita para mostrar más resultados.
- Vista de detalles de una película seleccionada.
- Posibilidad de marcar películas como favoritas.

## Inicio rápido

1. Instala las dependencias con `npm install`.
2. Crea un archivo `.env` en la raíz del proyecto e introduce tu clave de la API:
   ```
   VITE_API_KEY=tu_clave_aqui
   ```
3. Ejecuta el servidor de desarrollo:
   ```
   npm run dev
   ```

Para generar una versión de producción usa `npm run build` y prévisualízala con `npm run preview`.

## Licencia

MIT

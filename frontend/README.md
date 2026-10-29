# GameStore Front – EFI PP1 JavaScript

Aplicación web en React de una tienda de videojuegos (temática elegida: **GameStore**). Es la segunda parte de la Evaluación Final Integradora y consume la API que hicimos en PP1 Python, que está en la raíz de este mismo repositorio.

## Temática y API utilizada

**GameStore** es una tienda de videojuegos donde se puede:

- Ver el catálogo y filtrarlo por nombre, categoría y desarrollador.
- Ver el detalle de cada juego, con su ficha y los datos del desarrollador.
- Agregar juegos al carrito, cambiar cantidades y ver el total.
- Crear y eliminar videojuegos (solo con rol admin).

La API es la **GameStore API**, hecha por nosotros con FastAPI + SQLModel + SQLite. Está en la raíz de este repo y se documenta en el [README principal](../README.md).

| Método | Endpoint | Dónde se usa |
|---|---|---|
| GET | `/videojuegos/?nombre=&categoria_id=&desarrolladores_id=` | Catálogo con filtros |
| GET | `/videojuegos/{id}` | Detalle (trae categoría y desarrollador anidados) |
| POST | `/videojuegos/` | Formulario para crear |
| DELETE | `/videojuegos/{id}` | Botón eliminar del detalle |
| GET | `/categorias/` y `/desarrolladores/` | Selects de filtros y del formulario |

## Integrantes

- Tomás Maluf
- Fabri Gallardo

## Stack

| Pieza | Para qué |
|---|---|
| React + Vite | Aplicación y servidor de desarrollo |
| react-router-dom | Rutas, ruta dinámica y rutas anidadas |
| Tailwind CSS | Estilos |
| Context API | Estado global (carrito y rol de usuario) |
| fetch | Peticiones a la API |

## Cómo correrlo localmente

1. Levantar la **GameStore API** siguiendo el [README principal](../README.md). Tiene que quedar en `http://127.0.0.1:8000` y con al menos una categoría y un desarrollador cargados desde `/docs`.
2. En otra terminal, entrar a la carpeta del frontend (si no clonaste el repo todavía, clonalo primero):

   ```bash
   git clone https://github.com/tmaluf-hub/GameStore.git
   cd GameStore/frontend
   ```

3. Instalar dependencias:

   ```bash
   npm install
   ```

4. Crear un archivo `.env` dentro de `frontend/` con la URL de la API:

   ```
   VITE_API_URL=http://127.0.0.1:8000
   ```

5. Levantar la app:

   ```bash
   npm run dev
   ```

6. Abrir http://localhost:5173

## Rutas

| Ruta | Vista | Tipo |
|---|---|---|
| `/` | Inicio, con el botón para simular rol admin o usuario | Base |
| `/videojuegos` | Catálogo con filtros | Base |
| `/videojuegos/:id` | Detalle de un videojuego | Dinámica |
| `/videojuegos/:id` (index) | Pestaña "Info" | Anidada |
| `/videojuegos/:id/desarrollador` | Pestaña "Desarrollador" | Anidada |
| `/crear` | Formulario para crear videojuego (solo admin) | Base |
| `/carrito` | Carrito | Base |

## Estado global (Context API)

- **CartContext**: carrito con agregar, quitar, cambiar cantidad, vaciar y total. Se guarda en `localStorage` para que no se pierda al recargar.
- **UserContext**: simula el rol del usuario. Con rol admin aparecen "Crear" en el navbar y "Eliminar" en el detalle.

## Estructura del proyecto

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── VideojuegoCard.jsx           # tarjeta reutilizable del catálogo
│   │   ├── VideojuegoDesarrollador.jsx  # subruta "desarrollador"
│   │   └── VideojuegoInfo.jsx           # subruta index
│   ├── context/
│   │   ├── CartContext.jsx
│   │   └── UserContext.jsx
│   ├── pages/
│   │   ├── AgregarVideojuego.jsx
│   │   ├── Carrito.jsx
│   │   ├── Home.jsx
│   │   ├── VideojuegoDetalle.jsx
│   │   └── Videojuegos.jsx
│   ├── App.jsx                          # rutas
│   ├── index.css
│   └── main.jsx
├── vercel.json
└── package.json
```

## Deploy en Vercel

- Link: _(a completar)_
- Como el frontend está en una subcarpeta, en Vercel el **Root Directory** del proyecto es `frontend`.
- La variable de entorno `VITE_API_URL` se configura en Vercel, en **Settings → Environment Variables**.
- `vercel.json` redirige todas las rutas a `index.html`, para que React Router funcione al recargar una página como `/videojuegos/1`.

## Tablero Kanban

_(link a completar)_

## GitFlow usado

- `main` → rama estable.
- `develop` → integra todas las features.
- `feature/*` → una por tarea, mergeadas con `git merge --no-ff`.

`main` y `develop` son las mismas que usa la API, porque las dos partes están en el mismo repo. Las ramas del frontend llevan el prefijo `feature/front-*` para distinguirlas de las de la API:

1. `feature/front-contextos`
2. `feature/front-catalogo`
3. `feature/front-detalle`
4. `feature/front-crear-videojuego`
5. `feature/front-eliminar-videojuego`
6. `feature/front-carrito`
7. `feature/front-deploy`
8. `feature/front-readme`
9. `feature/front-readme-integrantes`

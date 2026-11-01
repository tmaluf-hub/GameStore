
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination

from src.routers.categoria import router as categoria_router
from src.routers.desarrolladores import router as desarrolladores_router
from src.routers.videojuegos import router as videojuegos_router


# Instancia de FastAPI con metadata para /docs
app = FastAPI(
    title="GameStore API",
    description=(
        "API de GameStore – EFI PP1 Python. "
        "Expone CRUD paginado de categorías, desarrolladores y videojuegos."
    ),
    version="1.0.0",
)


# CORS: habilita el frontend de React (Vite usa 5173, Live Server 5500)
# y el frontend publicado en Vercel.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5500",
        "https://game-store-sable-ten.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Incluir los routers de cada recurso
app.include_router(categoria_router)
app.include_router(desarrolladores_router)
app.include_router(videojuegos_router)


# Habilita la paginacion para los endpoints que devuelven Page[...]
add_pagination(app)

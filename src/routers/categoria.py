
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlmodel import Session, select
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate

from src.database import get_session
from src.models.categoria import (
    Categoria,
    CategoriaCreate,
    CategoriaPublic,
    CategoriaUpdate,
)
from src.models.videojuegos import CategoriaPublicNested, Videojuego


# Router de categorias con prefix y tag para /docs
router = APIRouter(prefix="/categorias", tags=["Categorías"])

# Dependencia tipada para la sesion de la base
SessionDep = Annotated[Session, Depends(get_session)]

# Id en la URL con validacion gt=0
IdPath = Annotated[int, Path(gt=0)]

# Respuesta 404 documentada para /docs
NOT_FOUND_RESPONSE = {404: {"description": "Categoría no encontrada"}}


# Crear una categoria
@router.post(
    "/",
    response_model=CategoriaPublic,
    status_code=status.HTTP_201_CREATED,
)
def crear_categoria(data: CategoriaCreate, session: SessionDep):
    categoria = Categoria.model_validate(data)
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria


# Listar categorias paginadas
@router.get("/", response_model=Page[CategoriaPublic])
def listar_categorias(session: SessionDep):
    query = select(Categoria).order_by(Categoria.id)
    return paginate(session, query)


# Traer una categoria por id con sus videojuegos (Nested)
@router.get(
    "/{categoria_id}",
    response_model=CategoriaPublicNested,
    responses=NOT_FOUND_RESPONSE,
)
def obtener_categoria(categoria_id: IdPath, session: SessionDep):
    categoria = session.get(Categoria, categoria_id)
    if categoria is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada",
        )
    return categoria


# Actualizar una categoria (campos opcionales)
@router.put(
    "/{categoria_id}",
    response_model=CategoriaPublic,
    responses=NOT_FOUND_RESPONSE,
)
def actualizar_categoria(
    categoria_id: IdPath,
    data: CategoriaUpdate,
    session: SessionDep,
):
    categoria = session.get(Categoria, categoria_id)
    if categoria is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada",
        )
    # Solo pisa los campos que vinieron en el body
    categoria.sqlmodel_update(data.model_dump(exclude_unset=True))
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria


# Borrar una categoria (bloquea si tiene videojuegos asociados)
@router.delete(
    "/{categoria_id}",
    responses={
        **NOT_FOUND_RESPONSE,
        400: {"description": "No se puede borrar: tiene videojuegos asociados"},
    },
)
def borrar_categoria(categoria_id: IdPath, session: SessionDep):
    categoria = session.get(Categoria, categoria_id)
    if categoria is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada",
        )
    # SQLite no fuerza las FK por defecto: chequeo manual para no dejar huerfanos
    videojuego_asociado = session.exec(
        select(Videojuego).where(Videojuego.categoria_id == categoria_id)
    ).first()
    if videojuego_asociado is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede borrar la categoría: tiene videojuegos asociados",
        )
    session.delete(categoria)
    session.commit()
    return {"detail": "Categoría eliminada correctamente"}

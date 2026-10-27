
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlmodel import Session, select, col
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate

from src.database import get_session
from src.models.categoria import Categoria
from src.models.desarrolladores import Desarrollador
from src.models.videojuegos import (
    Videojuego,
    VideojuegoCreate,
    VideojuegoPublic,
    VideojuegoPublicNested,
    VideojuegoUpdate,
)


# Router de videojuegos
router = APIRouter(prefix="/videojuegos", tags=["Videojuegos"])

# Dependencia tipada para la sesion de la base
SessionDep = Annotated[Session, Depends(get_session)]

# Id en la URL con validacion gt=0
IdPath = Annotated[int, Path(gt=0)]

# Respuesta 404 documentada para /docs
NOT_FOUND_RESPONSE = {404: {"description": "Videojuego no encontrado"}}

# Respuesta 404 cuando no existe categoria o desarrollador al crear/actualizar
FK_NOT_FOUND_RESPONSE = {
    404: {"description": "Categoría o desarrollador no encontrado"}
}


def _validar_fks(
    session: Session,
    categoria_id: int | None,
    desarrolladores_id: int | None,
) -> None:
    # Chequea que las FK existan antes de crear o actualizar
    if categoria_id is not None:
        categoria = session.get(Categoria, categoria_id)
        if categoria is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"La categoría con id {categoria_id} no existe",
            )
    if desarrolladores_id is not None:
        desarrollador = session.get(Desarrollador, desarrolladores_id)
        if desarrollador is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"El desarrollador con id {desarrolladores_id} no existe",
            )


# Crear un videojuego
@router.post(
    "/",
    response_model=VideojuegoPublic,
    status_code=status.HTTP_201_CREATED,
    responses=FK_NOT_FOUND_RESPONSE,
)
def crear_videojuego(data: VideojuegoCreate, session: SessionDep):
    _validar_fks(session, data.categoria_id, data.desarrolladores_id)
    videojuego = Videojuego.model_validate(data)
    session.add(videojuego)
    session.commit()
    session.refresh(videojuego)
    return videojuego


# Listar videojuegos paginados con filtros opcionales (para que los use React)
@router.get("/", response_model=Page[VideojuegoPublic])
def listar_videojuegos(
    session: SessionDep,
    categoria_id: Annotated[int | None, Query(gt=0)] = None,
    desarrolladores_id: Annotated[int | None, Query(gt=0)] = None,
    nombre: Annotated[str | None, Query(min_length=1)] = None,
):
    query = select(Videojuego).order_by(Videojuego.id)
    if categoria_id is not None:
        query = query.where(Videojuego.categoria_id == categoria_id)
    if desarrolladores_id is not None:
        query = query.where(Videojuego.desarrolladores_id == desarrolladores_id)
    if nombre is not None:
        # ilike para busqueda insensible a mayusculas/minusculas
        query = query.where(col(Videojuego.nombre_del_juego).ilike(f"%{nombre}%"))
    return paginate(session, query)


# Traer un videojuego por id con su categoria y desarrollador (Nested)
@router.get(
    "/{videojuego_id}",
    response_model=VideojuegoPublicNested,
    responses=NOT_FOUND_RESPONSE,
)
def obtener_videojuego(videojuego_id: IdPath, session: SessionDep):
    videojuego = session.get(Videojuego, videojuego_id)
    if videojuego is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Videojuego no encontrado",
        )
    return videojuego


# Actualizar un videojuego (campos opcionales, valida FK si vinieron)
@router.put(
    "/{videojuego_id}",
    response_model=VideojuegoPublic,
    responses={**NOT_FOUND_RESPONSE, **FK_NOT_FOUND_RESPONSE},
)
def actualizar_videojuego(
    videojuego_id: IdPath,
    data: VideojuegoUpdate,
    session: SessionDep,
):
    videojuego = session.get(Videojuego, videojuego_id)
    if videojuego is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Videojuego no encontrado",
        )
    datos = data.model_dump(exclude_unset=True)
    # Si el body incluye alguna FK, chequear que exista antes de actualizar
    _validar_fks(
        session,
        datos.get("categoria_id"),
        datos.get("desarrolladores_id"),
    )
    videojuego.sqlmodel_update(datos)
    session.add(videojuego)
    session.commit()
    session.refresh(videojuego)
    return videojuego


# Borrar un videojuego
@router.delete(
    "/{videojuego_id}",
    responses=NOT_FOUND_RESPONSE,
)
def borrar_videojuego(videojuego_id: IdPath, session: SessionDep):
    videojuego = session.get(Videojuego, videojuego_id)
    if videojuego is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Videojuego no encontrado",
        )
    session.delete(videojuego)
    session.commit()
    return {"detail": "Videojuego eliminado correctamente"}

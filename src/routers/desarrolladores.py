
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlmodel import Session, select
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate

from src.database import get_session
from src.models.desarrolladores import (
    Desarrollador,
    DesarrolladorCreate,
    DesarrolladorPublic,
    DesarrolladorUpdate,
)
from src.models.videojuegos import DesarrolladorPublicNested, Videojuego


# Router de desarrolladores
router = APIRouter(prefix="/desarrolladores", tags=["Desarrolladores"])

# Dependencia tipada para la sesion de la base
SessionDep = Annotated[Session, Depends(get_session)]

# Id en la URL con validacion gt=0
IdPath = Annotated[int, Path(gt=0)]

# Respuesta 404 documentada para /docs
NOT_FOUND_RESPONSE = {404: {"description": "Desarrollador no encontrado"}}


# Crear un desarrollador
@router.post(
    "/",
    response_model=DesarrolladorPublic,
    status_code=status.HTTP_201_CREATED,
)
def crear_desarrollador(data: DesarrolladorCreate, session: SessionDep):
    desarrollador = Desarrollador.model_validate(data)
    session.add(desarrollador)
    session.commit()
    session.refresh(desarrollador)
    return desarrollador


# Listar desarrolladores paginados
@router.get("/", response_model=Page[DesarrolladorPublic])
def listar_desarrolladores(session: SessionDep):
    query = select(Desarrollador).order_by(Desarrollador.id)
    return paginate(session, query)


# Traer un desarrollador por id con sus videojuegos (Nested)
@router.get(
    "/{desarrollador_id}",
    response_model=DesarrolladorPublicNested,
    responses=NOT_FOUND_RESPONSE,
)
def obtener_desarrollador(desarrollador_id: IdPath, session: SessionDep):
    desarrollador = session.get(Desarrollador, desarrollador_id)
    if desarrollador is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Desarrollador no encontrado",
        )
    return desarrollador


# Actualizar un desarrollador (campos opcionales)
@router.put(
    "/{desarrollador_id}",
    response_model=DesarrolladorPublic,
    responses=NOT_FOUND_RESPONSE,
)
def actualizar_desarrollador(
    desarrollador_id: IdPath,
    data: DesarrolladorUpdate,
    session: SessionDep,
):
    desarrollador = session.get(Desarrollador, desarrollador_id)
    if desarrollador is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Desarrollador no encontrado",
        )
    # Solo pisa los campos que vinieron en el body
    desarrollador.sqlmodel_update(data.model_dump(exclude_unset=True))
    session.add(desarrollador)
    session.commit()
    session.refresh(desarrollador)
    return desarrollador


# Borrar un desarrollador (bloquea si tiene videojuegos asociados)
@router.delete(
    "/{desarrollador_id}",
    responses={
        **NOT_FOUND_RESPONSE,
        400: {"description": "No se puede borrar: tiene videojuegos asociados"},
    },
)
def borrar_desarrollador(desarrollador_id: IdPath, session: SessionDep):
    desarrollador = session.get(Desarrollador, desarrollador_id)
    if desarrollador is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Desarrollador no encontrado",
        )
    # Chequeo manual de FK para no dejar videojuegos huerfanos
    videojuego_asociado = session.exec(
        select(Videojuego).where(Videojuego.desarrolladores_id == desarrollador_id)
    ).first()
    if videojuego_asociado is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede borrar el desarrollador: tiene videojuegos asociados",
        )
    session.delete(desarrollador)
    session.commit()
    return {"detail": "Desarrollador eliminado correctamente"}


from typing import Annotated, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship


if TYPE_CHECKING:
    from src.models.videojuegos import Videojuego

#modelo BAse: campos y validadciones 
class DesarrolladorBase(SQLModel):
    nombre: Annotated[
        str,
        Field(min_length=2, max_length=100)
    ]

    pais_de_origen: Annotated[
        str,
        Field(min_length=2, max_length=60)
    ]


#modelo principal: tabla de db
class Desarrollador(DesarrolladorBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

    videojuegos: list["Videojuego"] = Relationship(
        back_populates="desarrollador"
    )


#Schema para crear un desarrollador
class DesarrolladorCreate(DesarrolladorBase):
    pass


#Schema para devolver datos al usuario
class DesarrolladorPublic(DesarrolladorBase):
    id: int


#Schema para actualizar un desarrollador (todos los campos opcionales)
class DesarrolladorUpdate(SQLModel):
    nombre: Annotated[
        str | None,
        Field(default=None, min_length=2, max_length=100)
    ] = None

    pais_de_origen: Annotated[
        str | None,
        Field(default=None, min_length=2, max_length=60)
    ] = None
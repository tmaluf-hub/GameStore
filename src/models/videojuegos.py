
from typing import Annotated
from sqlmodel import SQLModel, Field, Relationship

from src.models.categoria import Categoria, CategoriaPublic
from src.models.desarrolladores import Desarrollador, DesarrolladorPublic


#modelo base: campos y validaciones
class VideojuegoBase(SQLModel):
    nombre_del_juego: Annotated[
        str,
        Field(min_length=3, max_length=100)
    ]

    precio: Annotated[
        float, Field(gt=0)
    ]

    desarrolladores_id: Annotated[
        int,
        Field(foreign_key="desarrollador.id", gt=0)
    ]

    categoria_id: Annotated[
        int,
        Field(foreign_key="categoria.id", gt=0)
    ]


#modelo principal: tabla de la bd
class Videojuego(VideojuegoBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

    desarrollador: "Desarrollador" = Relationship(
        back_populates="videojuegos"
    )

    categoria: "Categoria" = Relationship(
        back_populates="videojuegos"
    )


#Schema para crear videojuego
class VideojuegoCreate(VideojuegoBase):
    pass


#Schema para devolver datos al usuario
class VideojuegoPublic(VideojuegoBase):
    id: int


#Schema para devolver datos con las relaciones anidadas
class VideojuegoPublicNested(VideojuegoPublic):
    desarrollador: DesarrolladorPublic
    categoria: CategoriaPublic


#Schema para actualizar un videojuego (todos los campos opcionales, sin foreign_key)
class VideojuegoUpdate(SQLModel):
    nombre_del_juego: Annotated[
        str | None,
        Field(default=None, min_length=3, max_length=100)
    ] = None

    precio: Annotated[
        float | None,
        Field(default=None, gt=0)
    ] = None

    desarrolladores_id: Annotated[
        int | None,
        Field(default=None, gt=0)
    ] = None

    categoria_id: Annotated[
        int | None,
        Field(default=None, gt=0)
    ] = None


#Nested de los otros modelos: viven aca para evitar imports circulares
class CategoriaPublicNested(CategoriaPublic):
    videojuegos: list[VideojuegoPublic] = []


class DesarrolladorPublicNested(DesarrolladorPublic):
    videojuegos: list[VideojuegoPublic] = []

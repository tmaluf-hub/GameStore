
from typing import Annotated, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from src.models.videojuegos import Videojuego
    

#modelo base: campos y validacion
class CategoriaBase(SQLModel):
    nombre_de_categoria: Annotated[
        str,
        Field(min_length=3, max_length=50)
    ]

#modelo Principal: tabla de la bd
class Categoria(CategoriaBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

    videojuegos: list["Videojuego"] = Relationship(
        back_populates="categoria"
    )


#Schema para crear una categoria
class CategoriaCreate(CategoriaBase):
    pass

#Schame para devolver datos al usuario
class CategoriaPublic(CategoriaBase):
    id: int
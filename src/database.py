
from sqlmodel import create_engine, Session

# Ruta de la base de datos SQLite
DATABASE_URL = "sqlite:///./gamestore.db"

# Crear el motor de conexión
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Obtener una sesión de la base de datos
def get_session():
    with Session(engine) as session:
        yield session

import { useState, useEffect, useContext } from "react"
import { Outlet, useParams } from "react-router-dom"
import { Link, NavLink } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { UserContext } from "../context/UserContext"

const API_URL = import.meta.env.VITE_API_URL

export default function VideojuegoDetalle() {

    const { id } = useParams()
    const [videojuego, setVideojuego] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [eliminado, setEliminado] = useState(false)
    const { addToCart, removeFromCart } = useContext(CartContext)
    const { user } = useContext(UserContext)

    useEffect(() => {
        fetch(`${API_URL}/videojuegos/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error(`Error ${res.status}`)
                return res.json()
            })
            .then((data) => {
                setVideojuego(data)
                setError(null)
                setLoading(false)
            })
            .catch(() => {
                setError("No se pudo cargar el videojuego")
                setLoading(false)
            })
    }, [id])

    const handleEliminar = async () => {
        try {
            const res = await fetch(`${API_URL}/videojuegos/${id}`, {
                method: "DELETE",
            })
            if (!res.ok) throw new Error(`Error ${res.status}`)
            removeFromCart(videojuego.id)
            setEliminado(true)
        } catch (err) {
            console.error(err)
            setError("No se pudo eliminar el videojuego")
        }
    }

    if (loading) return <h1 className="text-6xl font-bold">Cargando...</h1>

    if (error) {
        return (
            <div className="max-w-3xl mx-auto pt-6 px-4 w-full">
                <p className="text-red-400 bg-red-950/40 border border-red-800/50 px-4 py-2 rounded-lg">
                    {error}
                </p>
                <Link to="/videojuegos" className="text-sm text-indigo-400 hover:underline mt-2 inline-block">
                    ← Volver al catálogo
                </Link>
            </div>
        )
    }

    if (eliminado) {
        return (
            <div className="max-w-3xl mx-auto pt-6 px-4 w-full">
                <p className="text-green-400 bg-green-950/40 border border-green-800/50 px-4 py-2 rounded-lg">
                    "{videojuego.nombre_del_juego}" se eliminó correctamente
                </p>
                <Link to="/videojuegos" className="text-sm text-indigo-400 hover:underline mt-2 inline-block">
                    ← Volver al catálogo
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto pt-6 px-4 w-full">
            <Link to="/videojuegos" className="text-sm text-indigo-400 hover:underline">← Volver al catálogo</Link>

            <div className="mt-4 bg-zinc-800 p-6 rounded-lg">
                <h1 className="text-3xl font-bold">{videojuego.nombre_del_juego}</h1>
                <p className="text-2xl font-semibold text-green-400 mt-2">${videojuego.precio}</p>
                <p className="text-zinc-400 text-sm mt-1">Categoría: {videojuego.categoria.nombre_de_categoria}</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => addToCart(videojuego)}
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer px-4 py-2 my-2 rounded"
                    >
                        Agregar al carrito
                    </button>

                    {user.admin && (
                        <button
                            onClick={handleEliminar}
                            className="bg-red-600 hover:bg-red-700 cursor-pointer px-4 py-2 my-2 rounded"
                        >
                            Eliminar
                        </button>
                    )}
                </div>
            </div>

            <div
                className="flex gap-4 border-b border-zinc-700 mt-8 mb-4"
            >
                <NavLink
                    to={""}
                    end
                    className={({ isActive }) =>
                        `pb-2 font-medium border-b-2 transition-colors
                    ${isActive ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`
                    }
                >
                    Info
                </NavLink>

                <NavLink
                    to={"desarrollador"}
                    className={({ isActive }) =>
                        `pb-2 font-medium border-b-2 transition-colors
                    ${isActive ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`
                    }
                >
                    Desarrollador
                </NavLink>

            </div>

            <Outlet context={videojuego} />

        </div>
    )
}

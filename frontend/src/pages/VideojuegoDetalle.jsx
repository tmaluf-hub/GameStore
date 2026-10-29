import { useState, useEffect, useContext } from "react"
import { Outlet, useParams } from "react-router-dom"
import { Link, NavLink } from "react-router-dom"
import { CartContext } from "../context/CartContext"

const API_URL = import.meta.env.VITE_API_URL

export default function VideojuegoDetalle() {

    const { id } = useParams()
    const [videojuego, setVideojuego] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { addToCart } = useContext(CartContext)

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

    return (
        <div className="max-w-3xl mx-auto pt-6 px-4 w-full">
            <Link to="/videojuegos" className="text-sm text-indigo-400 hover:underline">← Volver al catálogo</Link>

            <div className="mt-4 bg-zinc-800 p-6 rounded-lg">
                <h1 className="text-3xl font-bold">{videojuego.nombre_del_juego}</h1>
                <p className="text-2xl font-semibold text-green-400 mt-2">${videojuego.precio}</p>
                <p className="text-zinc-400 text-sm mt-1">Categoría: {videojuego.categoria.nombre_de_categoria}</p>
                <button
                    onClick={() => addToCart(videojuego)}
                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer px-4 py-2 my-2 rounded"
                >
                    Agregar al carrito
                </button>
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

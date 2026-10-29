import { useContext } from "react"
import { Link } from "react-router-dom"
import { CartContext } from "../context/CartContext"

export default function VideojuegoCard({ videojuego }) {

    const { addToCart } = useContext(CartContext)

    return (
        <div className="p-4 bg-zinc-800 rounded flex flex-col justify-between">
            <div>
                <h2 className="text-lg font-semibold">{videojuego.nombre_del_juego}</h2>
                <p className="text-green-400 font-semibold mb-4">
                    ${videojuego.precio}
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <Link
                    to={`/videojuegos/${videojuego.id}`}
                    className="px-3 py-2 flex justify-center rounded bg-blue-600 hover:bg-blue-500"
                >
                    Ver detalle
                </Link>

                <button
                    onClick={() => addToCart(videojuego)}
                    className="px-3 py-2 rounded bg-zinc-700 hover:bg-zinc-600 cursor-pointer"
                >
                    Agregar al carrito
                </button>
            </div>
        </div>
    )
}

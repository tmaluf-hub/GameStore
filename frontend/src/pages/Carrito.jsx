import { useContext } from "react"
import { Link } from "react-router-dom"
import { CartContext } from "../context/CartContext"

export default function Carrito() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useContext(CartContext)

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto pt-6 px-4 w-full">
        <h1 className="text-3xl font-bold">Tu carrito está vacío</h1>
        <Link to="/videojuegos" className="text-sm text-indigo-400 hover:underline mt-2 inline-block">
          ← Ver videojuegos
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto pt-6 px-4 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Carrito</h1>
        <button
          onClick={clearCart}
          className="text-sm text-zinc-400 hover:text-red-400 cursor-pointer"
        >
          Vaciar carrito
        </button>
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {cart.map((item) => (
          <li key={item.id} className="flex items-center gap-4 bg-zinc-800 p-4 rounded-lg">
            <div className="flex-1">
              <Link to={`/videojuegos/${item.id}`} className="font-semibold hover:underline">
                {item.nombre_del_juego}
              </Link>
              <p className="text-green-400 font-semibold">${item.precio}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                aria-label="Quitar una unidad"
                className="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 cursor-pointer"
              >
                −
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                aria-label="Agregar una unidad"
                className="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 cursor-pointer"
              >
                +
              </button>
            </div>

            <p className="w-24 text-right font-semibold">
              ${(item.precio * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeFromCart(item.id)}
              aria-label={`Eliminar ${item.nombre_del_juego}`}
              className="text-zinc-400 hover:text-red-400 cursor-pointer"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between mt-6 bg-zinc-800 p-4 rounded-lg">
        <span className="text-lg">Total</span>
        <span className="text-2xl font-bold text-green-400">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  )
}

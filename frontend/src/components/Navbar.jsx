import { useContext } from "react"
import { NavLink } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { UserContext } from "../context/UserContext"

export default function Navbar() {
  const linkStyle = ({ isActive }) => isActive ? "text-blue-400 font-black" : "cursor-pointer text-blue-500 hover:text-blue-400 transition-colors"

  const { totalItems } = useContext(CartContext)

  const { user } = useContext(UserContext)

  return (
    <nav className="flex justify-between items-center bg-slate-900 p-4 shadow-2xl">

      <h1 className="text-xl font-bold text-blue-500 cursor-pointer">GameStore</h1>

      <ul className="flex gap-6 text-sm">
        <NavLink to={"/"} className={linkStyle}>Inicio</NavLink>
        <NavLink to={"/videojuegos"} className={linkStyle}>Videojuegos</NavLink>

        {user.admin && (<NavLink to={"/crear"} className={linkStyle}>Crear</NavLink>)}
      </ul>

      <div className="bg-blue-600 font-bold px-4 py-1 rounded cursor-pointer">
        {totalItems > 0 ? (<p>Carrito: {totalItems}</p>) : (<p>Mi carrito</p>)}
      </div>

    </nav>
  )
}

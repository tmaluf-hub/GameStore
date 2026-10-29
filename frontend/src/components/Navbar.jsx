import { NavLink } from "react-router-dom"

export default function Navbar() {
  const linkStyle = ({ isActive }) => isActive ? "text-blue-400 font-black" : "cursor-pointer text-blue-500 hover:text-blue-400 transition-colors"

  return (
    <nav className="flex justify-between items-center bg-slate-900 p-4 shadow-2xl">

      <h1 className="text-xl font-bold text-blue-500 cursor-pointer">GameStore</h1>

      <ul className="flex gap-6 text-sm">
        <NavLink to={"/"} className={linkStyle}>Inicio</NavLink>
      </ul>

    </nav>
  )
}

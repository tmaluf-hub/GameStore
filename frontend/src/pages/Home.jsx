import { useContext } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../context/UserContext"

export default function Home() {

  const { user, toggleAdmin } = useContext(UserContext)

  return (
    <main className="flex-1 flex flex-col justify-center items-center">
      <h1 className="text-4xl text-blue-500 font-extrabold mb-4">Los mejores videojuegos al mejor precio</h1>
      <p className="text-blue-500 font-semibold mb-6">Explora nuestro catálogo!</p>
      <Link to="/videojuegos" className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded cursor-pointer">Ver videojuegos</Link>

      <button
        onClick={toggleAdmin}
        className="bg-purple-600 text-xs px-4 py-2 rounded-full cursor-pointer font-semibold my-5"
      >
        Simular Rol: {user.admin ? "Admin" : "User Normal"}
      </button>

      {user.admin ? (
        <p className="text-green-400 text-xs bg-green-950/40 border border-green-800/50 px-4 py-2 rounded-lg">
          Modo admin: podés crear y eliminar videojuegos
        </p>
      ) : (
        <p className="text-red-400 text-xs bg-red-950/40 border border-red-800/50 px-4 py-2 rounded-lg">
          Acceso restringido: crear y eliminar solo para admins
        </p>
      )}
    </main>
  )
}

import { useEffect, useState } from "react"
import VideojuegoCard from "../components/VideojuegoCard"

const API_URL = import.meta.env.VITE_API_URL

export default function Videojuegos() {
    const [videojuegos, setVideojuegos] = useState([])
    const [categorias, setCategorias] = useState([])
    const [desarrolladores, setDesarrolladores] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filtros, setFiltros] = useState({
        nombre: "",
        categoria_id: "",
        desarrolladores_id: "",
    })

    // categorias y desarrolladores para los select de los filtros
    useEffect(() => {
        fetch(`${API_URL}/categorias/`)
            .then(res => res.json())
            .then((data) => setCategorias(data.items))
            .catch(() => setError("No se pudo conectar con la API"))

        fetch(`${API_URL}/desarrolladores/`)
            .then(res => res.json())
            .then((data) => setDesarrolladores(data.items))
            .catch(() => setError("No se pudo conectar con la API"))
    }, [])

    // se vuelve a pedir la lista cada vez que cambia un filtro
    useEffect(() => {
        let url = `${API_URL}/videojuegos/?size=100`
        if (filtros.nombre.trim()) url += `&nombre=${filtros.nombre.trim()}`
        if (filtros.categoria_id) url += `&categoria_id=${filtros.categoria_id}`
        if (filtros.desarrolladores_id) url += `&desarrolladores_id=${filtros.desarrolladores_id}`

        fetch(url)
            .then(res => res.json())
            .then((data) => {
                setVideojuegos(data.items)
                setError(null)
                setLoading(false)
            })
            .catch(() => {
                setError("No se pudo conectar con la API")
                setLoading(false)
            })
    }, [filtros])

    const handleChange = (e) => {
        const { name, value } = e.target
        setLoading(true)
        setFiltros((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <div className="max-w-4xl mx-auto pt-6 px-4 w-full">
            <h1 className="text-3xl font-bold mb-4">Catálogo</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-800 p-4 rounded mb-6">
                <input
                    type="text"
                    name="nombre"
                    value={filtros.nombre}
                    onChange={handleChange}
                    placeholder="Buscar por nombre"
                    className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-700"
                />

                <select
                    name="categoria_id"
                    value={filtros.categoria_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-700"
                >
                    <option value="">Todas las categorías</option>
                    {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.nombre_de_categoria}
                        </option>
                    ))}
                </select>

                <select
                    name="desarrolladores_id"
                    value={filtros.desarrolladores_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-700"
                >
                    <option value="">Todos los desarrolladores</option>
                    {desarrolladores.map((desarrollador) => (
                        <option key={desarrollador.id} value={desarrollador.id}>
                            {desarrollador.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {error && (
                <p className="text-red-400 bg-red-950/40 border border-red-800/50 px-4 py-2 rounded-lg mb-4">
                    {error}
                </p>
            )}

            {loading && <p className="text-2xl font-bold">Cargando...</p>}

            {!loading && !error && videojuegos.length === 0 && (
                <p className="text-zinc-400">No se encontraron videojuegos.</p>
            )}

            {!loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {videojuegos.map((videojuego) => (
                        <VideojuegoCard key={videojuego.id} videojuego={videojuego} />
                    ))}
                </div>
            )}
        </div>
    )
}

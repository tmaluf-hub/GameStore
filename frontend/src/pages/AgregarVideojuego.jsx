import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../context/UserContext'

const API_URL = import.meta.env.VITE_API_URL

export default function AgregarVideojuego() {

    const { user } = useContext(UserContext)
    const [form, setForm] = useState({
        nombre_del_juego: "",
        precio: "",
        categoria_id: "",
        desarrolladores_id: "",
    })
    const [errors, setErrors] = useState({})
    const [categorias, setCategorias] = useState([])
    const [desarrolladores, setDesarrolladores] = useState([])
    const [error, setError] = useState(null)
    const [mensaje, setMensaje] = useState(null)

    // categorias y desarrolladores para los select del formulario
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

    if (!user.admin) {
        return (
            <section className='flex-1 flex justify-center items-center'>
                <p className='text-red-600 text-4xl font-bold'>
                    No tienes acceso a este formulario.
                </p>
            </section>
        )
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const validate = () => {
        const newErrors = {}
        const nombre = form.nombre_del_juego.trim()

        if (!nombre) {
            newErrors.nombre_del_juego = "El nombre es obligatorio"
        } else if (nombre.length < 3) {
            newErrors.nombre_del_juego = "El nombre debe tener al menos 3 caracteres"
        } else if (nombre.length > 100) {
            newErrors.nombre_del_juego = "El nombre no puede superar los 100 caracteres"
        }

        if (!form.precio) {
            newErrors.precio = "El precio es obligatorio"
        } else if (Number(form.precio) <= 0) {
            newErrors.precio = "El precio debe ser mayor a 0"
        }

        if (!form.categoria_id) newErrors.categoria_id = "La categoría es obligatoria"

        if (!form.desarrolladores_id) newErrors.desarrolladores_id = "El desarrollador es obligatorio"

        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMensaje(null)
        setError(null)
        const newErrors = validate()

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setErrors({})

        try {
            const res = await fetch(`${API_URL}/videojuegos/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre_del_juego: form.nombre_del_juego.trim(),
                    precio: Number(form.precio),
                    categoria_id: Number(form.categoria_id),
                    desarrolladores_id: Number(form.desarrolladores_id),
                }),
            })
            if (!res.ok) throw new Error(`Error ${res.status}`)
            const data = await res.json()
            setMensaje(`"${data.nombre_del_juego}" se guardó correctamente`)
        } catch (err) {
            console.error(err)
            setError("No se pudo guardar el videojuego")
            return
        }

        setForm({
            nombre_del_juego: "",
            precio: "",
            categoria_id: "",
            desarrolladores_id: "",
        })
    }

    return (
        <section className='flex-1 flex flex-col items-center pt-10 px-4'>
            <p className='text-2xl font-bold mb-6'>Agregar videojuego</p>

            {(categorias.length === 0 || desarrolladores.length === 0) && (
                <p className='text-yellow-400 text-sm mb-4'>
                    Primero cargá al menos una categoría y un desarrollador desde la API (/docs).
                </p>
            )}

            {mensaje && <p className='text-green-400 bg-green-950/40 border border-green-800/50 px-4 py-2 rounded-lg mb-4'>{mensaje}</p>}

            {error && <p className='text-red-400 bg-red-950/40 border border-red-800/50 px-4 py-2 rounded-lg mb-4'>{error}</p>}

            <form onSubmit={handleSubmit} className='w-full max-w-md bg-zinc-800 p-6 rounded '>
                <div>
                    <label className='block text-md mb-1 mt-2'>Nombre</label>
                    {errors.nombre_del_juego && <p className=' text-sm text-red-700 animate-pulse'>{errors.nombre_del_juego}</p>}
                    <input
                        type="text"
                        name="nombre_del_juego"
                        value={form.nombre_del_juego}
                        onChange={handleChange}
                        placeholder='Nombre del juego'
                        className='w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-700'
                    />
                </div>

                <div>
                    <label className='block text-md mb-1 mt-6'>Precio</label>
                    {errors.precio && <p className=' text-sm text-red-700 animate-pulse'>{errors.precio}</p>}
                    <input
                        type="number"
                        name="precio"
                        value={form.precio}
                        onChange={handleChange}
                        placeholder='$1.000'
                        className='w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-700'
                    />
                </div>

                <div>
                    <label className='block text-md mb-1 mt-6'>Categoría</label>
                    {errors.categoria_id && <p className=' text-sm text-red-700 animate-pulse'>{errors.categoria_id}</p>}
                    <select
                        name="categoria_id"
                        value={form.categoria_id}
                        onChange={handleChange}
                        className='w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-700'
                    >
                        <option value="">Elegí una categoría</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nombre_de_categoria}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className='block text-md mb-1 mt-6'>Desarrollador</label>
                    {errors.desarrolladores_id && <p className=' text-sm text-red-700 animate-pulse'>{errors.desarrolladores_id}</p>}
                    <select
                        name="desarrolladores_id"
                        value={form.desarrolladores_id}
                        onChange={handleChange}
                        className='w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-700'
                    >
                        <option value="">Elegí un desarrollador</option>
                        {desarrolladores.map((desarrollador) => (
                            <option key={desarrollador.id} value={desarrollador.id}>
                                {desarrollador.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <button type='submit' className='bg-blue-600 w-full my-4 rounded-lg py-4 cursor-pointer hover:bg-blue-500'>
                    Guardar
                </button>
            </form>
        </section>
    )
}

import { useOutletContext } from "react-router-dom"

export default function VideojuegoInfo() {

    const videojuego = useOutletContext()

    return (
        <div>
            <p className="font-bold pb-2 border-b text-xl">
                Ficha del juego:
            </p>

            <ul className="mt-4 flex flex-col gap-2">
                <li><span className="text-zinc-400">Nombre:</span> {videojuego.nombre_del_juego}</li>
                <li><span className="text-zinc-400">Precio:</span> ${videojuego.precio}</li>
                <li><span className="text-zinc-400">Categoría:</span> {videojuego.categoria.nombre_de_categoria}</li>
                <li><span className="text-zinc-400">Desarrollador:</span> {videojuego.desarrollador.nombre}</li>
            </ul>
        </div>
    )
}

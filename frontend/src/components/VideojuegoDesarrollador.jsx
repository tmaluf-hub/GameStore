import { useOutletContext } from "react-router-dom"

export default function VideojuegoDesarrollador() {

    const videojuego = useOutletContext()

    return (
        <div className="p-4 bg-zinc-800 rounded">
            <p className="text-xl font-bold">
                {videojuego.desarrollador.nombre}
            </p>

            <p className="mt-2 text-zinc-400">
                <label className="underline">País de origen:</label> {videojuego.desarrollador.pais_de_origen}
            </p>
        </div>
    )
}

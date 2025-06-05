import { Tema } from "../../types/jurado.types";

interface Props {
  tema: Tema;
}

export default function ToolTipoBloque({ tema }: Props) {
  return (
    <div className="flex flex-col gap-2 p-2 max-w-60">
      <section>
        <strong>Estado tema: </strong>
        <div className="flex flex-row gap-2 items-center">
          <div className="w-3 h-3 rounded-full bg-green-300" />
          <span className="text-gray-300">Programada</span>
        </div>
      </section>

      <div className="flex flex-col">
        <strong>Codigo: </strong>
        <span className="text-gray-300">{tema.codigo}</span>
      </div>

      <div className="flex flex-col">
        <strong>Titulo: </strong>
        <span className="text-gray-300"> {tema.titulo}</span>
      </div>

      <div className="flex flex-col">
        <strong>Miembros de jurado :</strong>
        {tema?.usuarios
          ?.filter((u) => u.rol?.nombre !== "Tesista")
          .map((a) => (
            <li key={a.idUsario}>
              <span className="text-gray-300">
                {a.nombres} {a.apellidos}
              </span>
              <div className="ml-5 text-gray-300">
                {a.estadoRespuesta === "aceptado" && (
                  <div className="flex flex-row gap-2 items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-green-500 font-medium">Aceptado</span>
                  </div>
                )}
                {a.estadoRespuesta === "esperando_respuesta" && (
                  <div className="flex flex-row gap-2 items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-yellow-500 font-medium">
                      Pendiente
                    </span>
                  </div>
                )}
                {a.estadoRespuesta === "rechazado" && (
                  <div className="flex flex-row gap-2 items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-red-500 font-medium">Rechazado</span>
                  </div>
                )}
              </div>
            </li>
          ))}
      </div>
    </div>
  );
}

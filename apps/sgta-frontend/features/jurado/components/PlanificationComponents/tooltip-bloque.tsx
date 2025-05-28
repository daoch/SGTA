import { Tema } from "../../types/jurado.types";

interface Props {
  expoFind: Tema;
}

export default function ToolTipoBloque({ expoFind }: Props) {
  return (
    <div className="flex flex-col gap-2 p-2 max-w-60">
      <section>
        <strong>Estado planificacion: </strong>
        <div className="flex flex-row ml-2 gap-2 items-center">
          <div className="w-3 h-3 rounded-full bg-green-300" />
          <span>Programada</span>
        </div>
      </section>

      <div className="flex flex-col">
        <strong>Codigo: </strong>
        <span className="ml-2">{expoFind.codigo}</span>
      </div>

      <div className="flex flex-col">
        <strong>Titulo: </strong>
        <span className="ml-2"> {expoFind.titulo}</span>
      </div>

      <div className="flex flex-col">
        <strong>Jurados:</strong>
        <ul>
          {expoFind?.usuarios
            ?.filter((u) => u.rol?.nombre === "Jurado")
            .map((j) => (
              <li className="ml-2" key={j.idUsario}>
                {j.nombres} {j.apellidos}
              </li>
            ))}
        </ul>
      </div>

      <div className="flex flex-col">
        <strong>Asesor:</strong>
        {expoFind?.usuarios
          ?.filter((u) => u.rol?.nombre === "Asesor")
          .map((a) => (
            <span className="ml-2" key={a.idUsario}>
              {a.nombres} {a.apellidos}
            </span>
          ))}
      </div>
    </div>
  );
}

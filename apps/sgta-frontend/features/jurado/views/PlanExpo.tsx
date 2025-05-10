import {
  AreaEspecialidad,
  JornadaExposicionSalas,
} from "../types/jurado.types";

import GeneralPlanificationExpo from "@/features/jurado/components/GeneralPlanificationExpo";
import {
  listarBloquesHorariosExposicion,
  listarJornadasExposicionSalas,
  listarTemasCicloActulXEtapaFormativa,
} from "@/features/jurado/services/data";
import { JornadaExposicionDTO } from "../dtos/JornadExposicionDTO";
type Props = {
  etapaFormativaId: number;
};
export default async function PlanExpo({ etapaFormativaId }: Props) {
  const expos = await listarTemasCicloActulXEtapaFormativa(etapaFormativaId);
  const jornadasSalas = await listarJornadasExposicionSalas(etapaFormativaId);
  const topics: AreaEspecialidad[] = [];
  const roomAvailList: JornadaExposicionDTO[] =
    jornadasSalas.map(transformarJornada);
  const bloquesList = await listarBloquesHorariosExposicion();

  console.log({ jornadasSalas });
  console.log({ roomAvailList });
  

  return (
    <main className="h-screen flex flex-col">
      <div className="py-4">
        <h1
          className="text-blue-900 font-bold text-2xl"
          style={{ color: "#042354" }}
        >
          Planificador de exposiciones
        </h1>
      </div>
      <GeneralPlanificationExpo
        expos={expos}
        topics={topics}
        roomAvailList={roomAvailList}
        bloquesList={bloquesList}
      ></GeneralPlanificationExpo>
    </main>
  );
}

const transformarJornada = (
  data: JornadaExposicionSalas,
): JornadaExposicionDTO => {
  const fechaInicio = new Date(data.datetimeInicio);
  const fechaFin = new Date(data.datetimeFin);

  // De aquí puedes tomar cualquiera de las dos fechas, por ejemplo, `fechaInicio`
  return {
    code: data.jornadaExposicionId, // O cualquier otro campo relevante
    fecha: fechaInicio, // Usamos `dateTimeInicio` como fecha
    horaInicio: fechaInicio.toTimeString().split(" ")[0], // Solo hora
    horaFin: fechaFin.toTimeString().split(" ")[0], // Solo hora
    salasExposicion: data.salasExposicion,
  };
};
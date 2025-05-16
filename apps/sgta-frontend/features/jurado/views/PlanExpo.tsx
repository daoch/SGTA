import { AreaEspecialidad } from "../types/jurado.types";

import GeneralPlanificationExpo from "@/features/jurado/components/PlanificationComponents/GeneralPlanificationExpo";
import {
  getEtapaFormativaIdByExposicionId,
  listarBloquesHorariosExposicion,
  listarEstadoPlanificacionPorExposicion,
  listarJornadasExposicionSalasByExposicion,
  listarTemasCicloActulXEtapaFormativa,
} from "@/features/jurado/services/data";
import { JornadaExposicionDTO } from "../dtos/JornadExposicionDTO";
import { transformarJornada } from "../utils/transformar-jornada";

type Props = {
  exposicionId: number;
};

export default async function PlanExpo({ exposicionId }: Props) {
  const etapaFormativaId =
    await getEtapaFormativaIdByExposicionId(exposicionId);
  const expos = await listarTemasCicloActulXEtapaFormativa(etapaFormativaId);
  const jornadasSalas =
    await listarJornadasExposicionSalasByExposicion(exposicionId);
  const topics: AreaEspecialidad[] = [];
  const roomAvailList: JornadaExposicionDTO[] =
    jornadasSalas.map(transformarJornada);
  const bloquesList = await listarBloquesHorariosExposicion(exposicionId);
  const estadoPlanificacion =
    await listarEstadoPlanificacionPorExposicion(exposicionId);

  return (
    <div className="h-fit w-full flex flex-col gap-4">
      <h1 className="font-bold text-2xl">Planificador de exposiciones</h1>
      <GeneralPlanificationExpo
        expos={expos}
        topics={topics}
        roomAvailList={roomAvailList}
        bloquesList={bloquesList}
        exposicionId={exposicionId}
        estadoPlanificacion={estadoPlanificacion}
      ></GeneralPlanificationExpo>
    </div>
  );
}

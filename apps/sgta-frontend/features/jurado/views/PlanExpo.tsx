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
import BackButton from "@/components/ui/back-button";

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
  const days: JornadaExposicionDTO[] = jornadasSalas.map(transformarJornada);
  const bloquesList = await listarBloquesHorariosExposicion(exposicionId);
  const estadoPlanificacion =
    await listarEstadoPlanificacionPorExposicion(exposicionId);

  return (
    <div className="h-fit w-full flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-primary">
        <BackButton backUrl="/coordinador/exposiciones" />
        <span className="ml-3">Planificador de exposiciones</span>
      </h1>
      <GeneralPlanificationExpo
        temas={expos}
        topics={topics}
        days={days}
        bloques={bloquesList}
        exposicionId={exposicionId}
        estadoPlanificacion={estadoPlanificacion}
      />
    </div>
  );
}

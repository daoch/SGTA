import {
  AreaEspecialidad,
  EstadoPlanificacion,
  Tema,
  TimeSlot,
} from "../types/jurado.types";

import BackButton from "@/components/ui/back-button";
import GeneralPlanificationExpo from "@/features/jurado/components/PlanificationComponents/general-planificacion-expo";
import {
  getEtapaFormativaIdByExposicionId,
  listarAreasConocimientoPorExposicion,
  listarBloquesHorariosExposicion,
  listarEstadoPlanificacionPorExposicion,
  listarJornadasExposicionSalasByExposicion,
  listarTemasCicloActualXEtapaFormativa,
} from "@/features/jurado/services/data";
import { isSameDay } from "date-fns";
import { ExposicionEtapaFormativaDTO } from "../dtos/ExposicionEtapaFormativaDTO";
import { JornadaExposicionDTO } from "../dtos/JornadExposicionDTO";
import { transformarJornada } from "../utils/transformar-jornada";
import { CalendarOff } from "lucide-react";

type Props = {
  exposicionId: number;
};

export default async function PlanExpo({ exposicionId }: Props) {
  const estadoPlanificacion: EstadoPlanificacion =
    await listarEstadoPlanificacionPorExposicion(exposicionId);

  const exposicionEtapaFormativaDTO: ExposicionEtapaFormativaDTO | null =
    await getEtapaFormativaIdByExposicionId(exposicionId);

  const temas = await listarTemasCicloActualXEtapaFormativa(
    exposicionEtapaFormativaDTO?.etapaFormativaId,
    exposicionId,
  );

  const jornadasSalas =
    await listarJornadasExposicionSalasByExposicion(exposicionId);

  const areasEspecialidad: AreaEspecialidad[] =
    await listarAreasConocimientoPorExposicion(exposicionId);

  const daysSinfiltrar: JornadaExposicionDTO[] =
    jornadasSalas.map(transformarJornada);

  const days: JornadaExposicionDTO[] = daysSinfiltrar
    .reduce<JornadaExposicionDTO[]>((acc, curr) => {
      const yaExiste = acc.some((item) => isSameDay(item.fecha, curr.fecha));
      return yaExiste ? acc : [...acc, curr];
    }, [])
    .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

  const bloquesList = await listarBloquesHorariosExposicion(exposicionId);

  const bloquesOrdenados = bloquesList.sort((a: TimeSlot, b: TimeSlot) => {
    return a.key.localeCompare(b.key);
  });

  const temasAsignados: Record<string, Tema> = bloquesList.reduce(
    (acc: Record<string, Tema>, bloque: TimeSlot) => {
      if (bloque.expo?.id != null) {
        acc[bloque.key] = bloque.expo;
      }
      return acc;
    },
    {} as Record<string, Tema>,
  );

  const temasSinAsignar: Tema[] = temas.filter(
    (tema: Tema) =>
      !Object.values(temasAsignados).some(
        (asignado) => asignado.id === tema.id,
      ),
  );
  return (
    <div className="h-fit w-full flex flex-col gap-4">
      {estadoPlanificacion && estadoPlanificacion.nombre != "Sin planificar" ? (
        <>
          <div className="text-3xl font-bold flex gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <BackButton backUrl="/coordinador/exposiciones" />
              <h1 className="text-2xl font-bold">
                {"Planificador de exposiciones"}
              </h1>
            </div>
            <h2 className="text-xl font-bold">
              {`${exposicionEtapaFormativaDTO?.nombreExposicion} / ${exposicionEtapaFormativaDTO?.nombreEtapaFormativa}`}{" "}
            </h2>
          </div>
          <GeneralPlanificationExpo
            temas={temas}
            temasSinAsignar={temasSinAsignar}
            temasAsignados={temasAsignados}
            areasEspecialidad={areasEspecialidad}
            days={days}
            bloques={bloquesOrdenados}
            exposicionId={exposicionId}
            estado={estadoPlanificacion}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <CalendarOff className="w-16 h-16 mb-4" />
          <p className="text-base font-medium">Planificacion no disponible</p>
          <div className="mt-4">
            <BackButton backUrl="/coordinador/exposiciones">
              Regresar
            </BackButton>
          </div>
        </div>
      )}
    </div>
  );
}

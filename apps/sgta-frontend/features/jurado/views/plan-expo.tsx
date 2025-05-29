import { AreaEspecialidad, Tema, TimeSlot } from "../types/jurado.types";

import AppLoading from "@/components/loading/app-loading";
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
import { JornadaExposicionDTO } from "../dtos/JornadExposicionDTO";
import { transformarJornada } from "../utils/transformar-jornada";

type Props = {
  exposicionId: number;
};

export default async function PlanExpo({ exposicionId }: Props) {
  const etapaFormativaId =
    await getEtapaFormativaIdByExposicionId(exposicionId);

  const temas = await listarTemasCicloActualXEtapaFormativa(etapaFormativaId);

  const jornadasSalas =
    await listarJornadasExposicionSalasByExposicion(exposicionId);

  const areasEspecialidad: AreaEspecialidad[] =
    await listarAreasConocimientoPorExposicion(exposicionId);


  const daysSinfiltrar: JornadaExposicionDTO[] =
    jornadasSalas.map(transformarJornada);

  const days: JornadaExposicionDTO[] = daysSinfiltrar.reduce<
    JornadaExposicionDTO[]
  >((acc, curr) => {
    const yaExiste = acc.some((item) => isSameDay(item.fecha, curr.fecha));
    return yaExiste ? acc : [...acc, curr];
  }, []);

  const bloquesList = await listarBloquesHorariosExposicion(exposicionId);
  console.log(bloquesList);

  const bloquesOrdenados = bloquesList.sort((a: TimeSlot, b: TimeSlot) => {
    const parse = (key: string) => {
      const [d, m, y] = key.split("|")[0].split("-").map(Number);
      const [h, min] = key.split("|")[1].split(":").map(Number);
      return new Date(y, m - 1, d, h, min);
    };

    return parse(a.key).getTime() - parse(b.key).getTime();
  });

  const estadoPlanificacion =
    await listarEstadoPlanificacionPorExposicion(exposicionId);

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
      <h1 className="text-3xl font-bold text-primary">
        <BackButton backUrl="/coordinador/exposiciones" />
        <span className="ml-3">Planificador de exposiciones</span>
      </h1>
      {estadoPlanificacion ? (
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
      ) : (
        <AppLoading />
      )}
    </div>
  );
}

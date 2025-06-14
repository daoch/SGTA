"use client";
import type React from "react";
import { ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ExposicionAlumno } from "../../types/exposicion.types";
import {
  getExposicionesEstudiantesByEstudianteId,
  getParametrosByUsuarioId,
} from "../../services/exposicion-service";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useRouter } from "next/navigation";
import {
  CalificacionesJurado,
  CriterioEvaluacion,
} from "../../types/jurado.types";
import { getCalificacionesJuradoByExposicionTemaId } from "../../services/jurado-service";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface DetalleExposicionProps {
  id: string;
  exposicionId: string;
}

const DetalleExposicion: React.FC<DetalleExposicionProps> = ({
  id,
  exposicionId,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [exposicion, setExposicion] = useState<ExposicionAlumno>();
  const [calificaciones, setCalificaciones] = useState<CalificacionesJurado[]>(
    [],
  );

  //JALAMOS LAS EXPOSICIONES DEL ALUMNO
  const fetchExposiciones = async () => {
    setIsLoading(true);
    try {
      const { idToken } = useAuthStore.getState();
      if (!idToken) {
        console.error("No authentication token available");
        return;
      }
      const exposicionesData =
        await getExposicionesEstudiantesByEstudianteId(idToken);
      const exposicionFiltrada = exposicionesData.find(
        (expo: ExposicionAlumno) => expo.exposicionId === Number(exposicionId),
      );
      setExposicion(exposicionFiltrada);
      console.log("Exposición cargada:", exposicionFiltrada);

      //obtenemos las calificaciones del jurado
      const calificacionesData =
        await getCalificacionesJuradoByExposicionTemaId(
          Number(exposicionFiltrada.exposicionId),
        );

      setCalificaciones(calificacionesData);
      console.log("Calificaciones del jurado:", calificacionesData);
    } catch (error) {
      console.error("Error al cargar exposiciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const [cantJuradoMax, setCantJuradoMax] = useState(0);
  const [pesoAsesor, setPesoAsesor] = useState(0);

  const fetchParametrosConfiguracion = async () => {
    try {
      const parametrosConfig = await getParametrosByUsuarioId();
      if (parametrosConfig.length > 0) {
        // const juradoMax = parametrosConfig.find(
        //   (param) => param.parametroConfiguracion.nombre === "Cantidad Jurados",
        // );
        // // Restamos 1 porque el asesor ya estara contando
        // setCantJuradoMax(Number(juradoMax?.valor) - 1);

        const pesoAsesorParam = parametrosConfig.find(
          (param) => param.parametroConfiguracion.nombre === "Peso Asesor",
        );
        setPesoAsesor(Number(pesoAsesorParam?.valor));
        // console.log("Cantidad de jurados:", juradoMax?.valor);
        // console.log("Peso del asesor:", pesoAsesorParam?.valor);
      } else {
        console.warn("No se encontraron parámetros de configuración.");
      }

      console.log("Parametros configuracion:", parametrosConfig);
    } catch (error) {
      console.error("Error fetching parametros configuracion:", error);
    }
  };

  useEffect(() => {
    fetchExposiciones();
    fetchParametrosConfiguracion();
  }, []);

  const calcularNotaFinal = ({
    exposicion,
    calificaciones,
    pesoAsesor,
  }: {
    exposicion: ExposicionAlumno | undefined;
    calificaciones: CalificacionesJurado[];
    pesoAsesor: number;
  }): number => {
    if (!exposicion) return 0;

    //OBTENEMOS A LOS JURADOS
    const jurados = exposicion.miembrosJurado.filter(
      (m) => m.tipo.toLowerCase() === "jurado",
    );
    console.log("Jurados:", jurados);
    //OBTENEMOS AL ASESOR
    const asesor = exposicion.miembrosJurado.find(
      (m) => m.tipo.toLowerCase() === "asesor",
    );
    console.log("Asesor:", asesor);

    const calcularNota = (criterios: CriterioEvaluacion[]) => {
      const sumaNotas = criterios.reduce(
        (acc, crit) => acc + (crit.calificacion ?? 0),
        0,
      );
      const sumaMaxima = criterios.reduce(
        (acc, crit) => acc + crit.nota_maxima,
        0,
      );
      if (sumaMaxima === 0) return 0;
      return (sumaNotas / sumaMaxima) * 20;
    };

    // Recorre todos los miembros del jurado (jurados).
    // Busca en calificaciones la evaluación que corresponda a ese jurado (comparando usuario_id con id_persona).
    // Si la evaluación existe y está calificada (calificado === true), calcula su nota con calcularNota(...).
    // Si no existe o no está calificada, devuelve null.
    // Luego, filtra los null (es decir, ignora a los jurados que no calificaron).
    // Finalmente, convierte el resultado en un arreglo de números (number[]).
    const notasJurados = jurados
      .map((j) => {
        const evalJurado = calificaciones.find(
          (c) => c.usuario_id === j.id_persona,
        );
        return evalJurado && evalJurado.calificado
          ? calcularNota(evalJurado.criterios)
          : null;
      })
      .filter((n) => n !== null) as number[];

    const notaAsesor = (() => {
      if (!asesor) return null;
      const evalAsesor = calificaciones.find(
        (c) => c.usuario_id === asesor.id_persona,
      );
      return evalAsesor && evalAsesor.calificado
        ? calcularNota(evalAsesor.criterios)
        : null;
    })();

    //ESTE ES EL PESO DE LOS JURADOS EN TOTAL
    const pesoTotalJurados = 1 - pesoAsesor;
    let promedioFinal = 0;

    //SI NO HAY CALIFICACION DEL ASESOR, REPARTIMOS EL PESO ENTRE LOS JURADOS
    if (notaAsesor !== null) {
      const pesoPorJurado =
        notasJurados.length > 0 ? pesoTotalJurados / notasJurados.length : 0;
      notasJurados.forEach((nota) => {
        promedioFinal += nota * pesoPorJurado;
      });
      promedioFinal += notaAsesor * pesoAsesor;

      console.log("Nota final con asesor:", promedioFinal);
    } else {
      //si no hay calificacion asesor, repartir el 100% entre los jurados
      const pesoPorJurado =
        notasJurados.length > 0 ? 1 / notasJurados.length : 0;
      notasJurados.forEach((nota) => {
        promedioFinal += nota * pesoPorJurado;
      });

      console.log("Nota final sin asesor:", promedioFinal);
    }

    return promedioFinal; // redondeado
  };

  const router = useRouter();

  return (
    <div>
      <div className="flex h-[60px] pt-[15px] pr-[20px] pb-[10px] items-center gap-[10px] self-stretch">
        <button
          onClick={() => router.back()}
          className="flex items-center text-black hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[#042354] font-montserrat text-[24px] font-semibold leading-[32px] tracking-[-0.144px]">
          Detalle de Exposición
        </h1>
      </div>

      <div className="pt-4">
        {isLoading ? (
          <div className="text-center mt-10">
            <p className="text-gray-500 animate-pulse">
              Cargando detalles de la exposición del alumno...
            </p>
          </div>
        ) : !exposicion ? (
          <div className="text-center text-gray-400 mt-5">
            <p>
              Hubo un error extrayendo los detalles de exposición del alumno.
            </p>
          </div>
        ) : (
          <div>
            <div className="rounded-2xl shadow-sm border p-6 mb-4">
              {/*HEADER*/}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {/*NOMBRE DEL TEMA*/}
                <div>
                  <label className="text-base text-gray-500">
                    Nombre del tema
                  </label>
                  <p className="text-lg font-medium">{exposicion?.titulo}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                {/*CICLO*/}
                <div>
                  <label className="text-base text-gray-500">Ciclo</label>
                  <p className="text-lg font-medium">{exposicion?.ciclo}</p>
                </div>
                {/*TIPO DE EXPOSICION*/}
                <div>
                  <label className="text-base text-gray-500">
                    Tipo de Exposición
                  </label>
                  <p className="text-lg font-medium">
                    {exposicion?.tipoExposicion}
                  </p>
                </div>
                {/*CURSO*/}
                <div>
                  <label className="text-base text-gray-500">Curso</label>
                  <p className="text-lg font-medium">
                    {exposicion?.etapaFormativa}
                  </p>
                </div>
              </div>

              {/*DETALLES DE LA EXPOSICION*/}
              <div className="mb-6">
                {/* <h2 className="text-lg font-semibold mb-4">
                Detalles de la Exposición
              </h2> */}
                <div className="grid grid-cols-4 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Calendar className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-base text-gray-500">Fecha</div>
                      <div className="font-medium">
                        {exposicion.datetimeInicio.toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Clock className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-base text-gray-500">
                        Hora de Inicio
                      </div>
                      <div className="font-medium">
                        {exposicion.datetimeInicio.toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Clock className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-base text-gray-500">Hora de Fin</div>
                      <div className="font-medium">
                        {exposicion.datetimeFin.toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <MapPin className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-base text-gray-500">
                        Sala de Exposición
                      </div>
                      <div className="font-medium">{exposicion.sala}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/*ENLACES*/}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-base text-gray-500 block mb-2">
                    Enlace de la Exposición
                  </label>
                  <a
                    href={exposicion.link_exposicion}
                    target="_blank"
                    className={
                      exposicion.link_exposicion
                        ? " text-blue-500"
                        : " text-black-500"
                    }
                  >
                    {exposicion.link_exposicion || "Aún no disponible"}
                  </a>
                </div>
                <div>
                  <label className="text-base text-gray-500 block mb-2">
                    Enlace de la Grabación
                  </label>
                  <a
                    href={exposicion.link_grabacion}
                    target="_blank"
                    className={
                      exposicion.link_grabacion
                        ? " text-blue-500"
                        : " text-black-500"
                    }
                  >
                    {exposicion.link_grabacion || "Aún no disponible"}
                  </a>
                </div>
              </div>
            </div>

            {/*JURADO*/}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Miembros de Jurados
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {exposicion.miembrosJurado.map((miembro) => {
                  const calificacion = calificaciones.find(
                    (calif) => calif.usuario_id === miembro.id_persona,
                  );

                  const calificado = calificacion
                    ? calificacion.calificado
                    : false;

                  return (
                    <div
                      key={miembro.id_persona}
                      className="border rounded-2xl p-4 flex flex-col items-center text-center shadow-sm"
                    >
                      <div className="bg-gray-100 p-4 rounded-full mb-3">
                        <User className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="font-medium text-base">
                        {miembro.nombre}
                      </h3>
                      <h3 className="font-medium text-base text-gray-500">
                        {miembro.tipo}
                      </h3>
                      <Button
                        asChild
                        // variant={"secondary"}
                        size="default"
                        className="w-full mt-4"
                        disabled={!calificado}
                        variant={calificado ? "default" : "secondary"}
                      >
                        <Link
                          href={
                            calificado
                              ? `/alumno/mi-proyecto/exposiciones/${id}/${exposicion.exposicionId}/observaciones/${miembro.id_persona}`
                              : "#"
                          }
                          className={`${!calificado ? "pointer-events-none text-gray-500" : ""}`}
                        >
                          {calificado
                            ? "Ver Calificación"
                            : "Pendiente de calificar"}
                        </Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <TooltipProvider>
              <div className="mt-4 mb-4 flex items-center gap-1">
                <h2 className="text-lg font-semibold">
                  Promedio de Calificación de la Exposición
                </h2>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center justify-center">
                      <Info className="h-6 w-6 text-muted-foreground ml-1" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-md text-sm leading-snug text-justify">
                    Si en caso uno de los jurados no envía la calificación, se
                    reemplaza con la nota del otro jurado. Si en caso el asesor
                    no envía la nota del estudiante, la nota de los jurados
                    tendrá un peso repartido de manera equitativa.
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            <div>
              <h1 className="text-4xl font-semibold items-center text-[#264753]">
                {calcularNotaFinal({ exposicion, calificaciones, pesoAsesor })}{" "}
                / 20
              </h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalleExposicion;


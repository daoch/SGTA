"use client";
import type React from "react";
import { ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ExposicionAlumno } from "../../types/exposicion.types";
import { getExposicionesEstudiantesByEstudianteId } from "../../services/exposicion-service";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useRouter } from "next/navigation";

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
    } catch (error) {
      console.error("Error al cargar exposiciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExposiciones();
  }, []);

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
                    href={exposicion.linkExposicion}
                    target="_blank"
                    className={
                      exposicion.linkExposicion
                        ? " text-blue-500"
                        : " text-black-500"
                    }
                  >
                    {exposicion.linkExposicion || "No disponible"}
                  </a>
                </div>
                <div>
                  <label className="text-base text-gray-500 block mb-2">
                    Enlace de la Grabación
                  </label>
                  <a
                    href={exposicion.linkGrabacion}
                    target="_blank"
                    className={
                      exposicion.linkGrabacion
                        ? " text-blue-500"
                        : " text-black-500"
                    }
                  >
                    {exposicion.linkGrabacion || "No disponible"}
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
                {exposicion.miembrosJurado.map((miembro) => (
                  <div
                    key={miembro.id_persona}
                    className="border rounded-2xl p-4 flex flex-col items-center text-center shadow-sm"
                  >
                    <div className="bg-gray-100 p-4 rounded-full mb-3">
                      <User className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="font-medium text-base">{miembro.nombre}</h3>
                    <Button
                      asChild
                      // variant={"secondary"}
                      size="default"
                      className="w-full mt-4"
                    >
                      <Link
                        href={`/alumno/mi-proyecto/exposiciones/${id}/${exposicion.exposicionId}/observaciones/${miembro.id_persona}`}
                      >
                        Ver Comentarios
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalleExposicion;


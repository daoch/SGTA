"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  asignarTemaJurado,
  desasignarJuradoTema,
  getExposicionesTema,
} from "../services/jurado-service";
import { TesisDetalleExposicion } from "../types/juradoDetalle.types";
import { Toaster, toast } from "sonner";
import { ArrowLeft, CirclePlus, CircleUserRound, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ModalAsignarMiembroJurado from "./modal-asignar-miembro-jurado";
import { getAllByCarreraId } from "@/features/configuracion/services/configuracion-service";
import { Profesor } from "../types/temas.types";

interface TemasDetalleExposicionesProps {
  temaId: number;
  areasConocimientoId: number[];
}

export const TemasDetalleExposiciones: React.FC<
  TemasDetalleExposicionesProps
> = ({ temaId, areasConocimientoId }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tesis, setTesis] = useState<TesisDetalleExposicion | null>(null);
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJurado, setSelectedJurado] = useState<{
    id: number;
    nombre: string;
  } | null>(null);

  // console.log("Tema ID:", temaId);
  // console.log("Áreas de conocimiento ID:", areasConocimientoId);

  const [cantJuradoMax, setCantJuradoMax] = useState(0);

  useEffect(() => {
    const fetchTesisData = async () => {
      try {
        setLoading(true);
        // Verifica que el ID sea un número válido
        if (isNaN(temaId)) {
          throw new Error("ID de tema inválido");
        }
        const data = await getExposicionesTema(temaId);
        console.log("Datos de la tesis:", data);
        setTesis(data);
      } catch (err) {
        // console.error("Error al cargar datos de la tesis:", err);
        toast.error("No se pudo cargar la información del tema");
      } finally {
        setLoading(false);
      }
    };

    const fetchParametrosConfiguracion = async () => {
      try {
        const carreraId = 1; //ESTO TENEMOS QUE CAMBIAR EVENTUALMENTE
        const parametrosConfig = await getAllByCarreraId(carreraId);
        if (parametrosConfig.length > 0) {
          const juradoMax = parametrosConfig.find(
            (param) =>
              param.parametroConfiguracion.nombre === "Cantidad Jurados",
          );
          // Restamos 1 porque el asesor ya estara contando
          setCantJuradoMax(Number(juradoMax?.valor) - 1);
        } else {
          console.warn("No se encontraron parámetros de configuración.");
        }

        console.log("Parametros configuracion:", parametrosConfig);
      } catch (error) {
        console.error("Error fetching parametros configuracion:", error);
      }
    };

    fetchTesisData();
    fetchParametrosConfiguracion();
  }, []);

  const openConfirmDialog = (jurado: { id: number; nombre: string }) => {
    setSelectedJurado(jurado);
    setShowAlertDialog(true);
  };

  const closeAlertDialog = () => {
    setShowAlertDialog(false);
    setSelectedJurado(null);
  };

  const handleDesasignarJurado = async (juradoId: number) => {
    try {
      const result = await desasignarJuradoTema(juradoId, temaId);

      if (result.success) {
        // Actualizar datos después de desasignar
        const updatedData = await getExposicionesTema(temaId);
        setTesis(updatedData);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Error al desasignar jurado:", err);
      toast.error("No se pudo desasignar al jurado");
    } finally {
      closeAlertDialog();
    }
  };

  const confirmDesasignarJurado = () => {
    if (selectedJurado) {
      handleDesasignarJurado(selectedJurado.id);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[200px]">
        <p className="text-lg text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  if (!tesis) {
    return <p>Tesis no encontrada</p>;
  }

  const handleAsignarTesis = async (profesores: number[]) => {
    try {
      console.log("Profesores seleccionados:", profesores);
      console.log("Tema ID:", temaId);
      // Llamar a la API con el ID del jurado actual y el ID de la tesis seleccionada
      const asignaciones = profesores.map(async (profesorId) => {
        const result = await asignarTemaJurado(profesorId, temaId);

        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }

        return result;
      });

      const resultados = await Promise.all(asignaciones);

      const todasAsignacionesExitosas = resultados.every(
        (result) => result.success,
      );

      if (todasAsignacionesExitosas) {
        const temas = await getExposicionesTema(temaId);
        setTesis(temas);
      } else {
        toast.error("Hubo un problema al asignar algunas tesis.");
      }
    } catch (error) {
      console.error("Error en la asignación:", error);
    }
  };

  return (
    <div>
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar desasignación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea desasignar a{" "}
              <span className="font-medium">{selectedJurado?.nombre}</span> como
              miembro de jurado?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDesasignarJurado}>
              Desasignar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div>
        <div className="grid grid-cols-12 gap-6 mb-6">
          <div className="col-span-3">
            <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-base font-medium leading-[14px]">
              Asesor
            </p>
            <div className="flex items-center mt-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                <CircleUserRound className="h-5 w-5 text-gray-500" />
              </div>
              {tesis.asesores.find((a) => a.tipo === "Asesor")?.nombre ||
                "Sin asesor"}
            </div>
          </div>

          {tesis.asesores.length > 1 && (
            <div className="col-span-3">
              <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-base font-medium leading-[14px]">
                Coasesor
              </p>
              <div className="flex items-center mt-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                  <CircleUserRound className="h-5 w-5 text-gray-500" />
                </div>
                {tesis.asesores.find((a) => a.tipo === "Coasesor")?.nombre ||
                  "Sin coasesor"}
              </div>
            </div>
          )}

          <div className="col-span-12">
            <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-base font-medium leading-[14px]">
              Estudiantes
            </p>
            {tesis.estudiantes.length > 0 ? (
              <div className="flex flex-wrap gap-4 mt-2">
                {tesis.estudiantes.map((estudiante) => (
                  <div key={estudiante.id} className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                      <CircleUserRound className="h-5 w-5 text-gray-500" />
                    </div>
                    <span>{estudiante.nombre}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-2">Sin estudiantes asignados</p>
            )}
          </div>

          <div className="col-span-5">
            <div className="flex items-center space-x-2">
              <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-base font-medium leading-[14px]">
                Miembros de Jurado
              </p>

              {cantJuradoMax - tesis.miembrosJurado.length > 0 && (
                <div>
                  <CirclePlus
                    className="h-6 w-6 text-green-500 cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  />

                  <ModalAsignarMiembroJurado
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    temaId={temaId}
                    areasConocimientoId={areasConocimientoId}
                    cantMiembrosJuradoDisp={
                      cantJuradoMax - tesis.miembrosJurado.length
                    }
                    onAsignar={handleAsignarTesis}
                    miembrosJurado={tesis.miembrosJurado}
                  />
                </div>
              )}
            </div>
            {tesis.miembrosJurado.length > 0 ? (
              <div className="flex flex-wrap gap-4 mt-2">
                {tesis.miembrosJurado.map((jurado) => (
                  <div key={jurado.id} className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                      <CircleUserRound className="h-5 w-5 text-gray-500" />
                    </div>
                    <span>{jurado.nombre}</span>
                    <button
                      onClick={() => openConfirmDialog(jurado)}
                      className="ml-2"
                      aria-label="Desasignar jurado"
                    >
                      <X className="h-4 w-4 text-red-500 cursor-pointer" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-2">
                No hay miembros de jurado asignados al tema
              </p>
            )}
          </div>
        </div>

        {/* Exposiciones  */}
        {tesis.etapaFormativaTesis &&
          tesis.etapaFormativaTesis.map((etapaFormativa) => (
            <div className="mb-8" key={etapaFormativa.id}>
              <h3 className="text-xl font-semibold mb-4 text-[#042354]">
                Exposiciones de {etapaFormativa.nombre}
              </h3>

              {etapaFormativa.exposiciones &&
              etapaFormativa.exposiciones.length > 0 ? (
                etapaFormativa.exposiciones.map((exposicion) => (
                  <div
                    key={exposicion.id}
                    className="border rounded-lg mb-4 overflow-hidden max-w-2xl"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-lg">
                          {exposicion.nombre}
                        </p>
                        <span
                          className={`px-3 py-1 text-base rounded-2xl ${
                            exposicion.estadoExposicion === "completada"
                              ? "bg-[#DCFCE7] text-[#166534]"
                              : exposicion.estadoExposicion === "programada"
                                ? "bg-[#F9D534] text-white"
                                : "bg-[#DCFCE7] text-[#166534]"
                          }`}
                        >
                          {exposicion.estadoExposicion.charAt(0).toUpperCase() +
                            exposicion.estadoExposicion.slice(1)}
                        </span>
                      </div>
                      <div className="text-base text-gray-500 mt-1">
                        <p>
                          {new Date(
                            exposicion.datetimeInicio,
                          ).toLocaleDateString("es-PE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}{" "}
                          -{" "}
                          {new Date(
                            exposicion.datetimeInicio,
                          ).toLocaleTimeString("es-PE", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}{" "}
                          a{" "}
                          {new Date(exposicion.datetimeFin).toLocaleTimeString(
                            "es-PE",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            },
                          )}
                        </p>
                        <p>Sala de exposición: {exposicion.sala}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No se han registrado exposiciones para este curso.
                </p>
              )}
            </div>
          ))}
      </div>

      <Toaster position="bottom-right" richColors />
    </div>
  );
};


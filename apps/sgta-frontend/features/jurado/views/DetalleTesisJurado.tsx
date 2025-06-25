"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { ArrowLeft, CircleUserRound, X } from "lucide-react";
import type { TesisDetalleExposicion } from "@/features/jurado/types/juradoDetalle.types";
import { cn } from "@/lib/utils";
import {
  getExposicionesTema,
  desasignarJuradoTema,
} from "../services/jurado-service";

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

import { Toaster, toast } from "sonner";
import { buscarTemaPorId } from "@/features/temas/types/solicitudes/data";
import { Tema } from "@/features/temas/types/temas/entidades";
import { DetalleTema } from "@/features/temas/components/asesor/detalle-tema-card";
import HistorialTemaCard from "@/features/temas/components/asesor/historial-tema-card";

// Datos de ejemplo (en producción, estos vendrían de una API)

type TabType = "informacion" | "historial" | "exposiciones";

export function DetalleTesisJuradoView() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("informacion");

  const idTema = Number(params?.codigoTesis);
  //llamar al listar usando el idNumerico

  const [tesis, setTesis] = useState<TesisDetalleExposicion | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);
  const [selectedJurado, setSelectedJurado] = useState<{
    id: number;
    nombre: string;
  } | null>(null);
  const [tema, setTema] = useState<Tema | null>(null);

  useEffect(() => {
    const fetchTesisData = async () => {
      try {
        setLoading(true);
        // Verifica que el ID sea un número válido
        if (isNaN(idTema)) {
          throw new Error("ID de tema inválido");
        }
        const data = await getExposicionesTema(idTema);
        console.log("Datos de la tesis:", data);
        setTesis(data);
      } catch (err) {
        // console.error("Error al cargar datos de la tesis:", err);
        toast.error("No se pudo cargar la información del tema");
      } finally {
        setLoading(false);
      }
    };

    const fetchTema = async () => {
      const tema = await buscarTemaPorId(idTema);
      setTema(tema);
      setLoading(false);
    };

    fetchTesisData();
    fetchTema();
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
      const result = await desasignarJuradoTema(juradoId, idTema);

      if (result.success) {
        // Actualizar datos después de desasignar
        const updatedData = await getExposicionesTema(idTema);
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

  return (
    <div>
      {/* Alert Dialog de shadcn/ui */}
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

      <div className="flex h-[60px] pt-[15px] pr-[20px] pb-[10px] items-center gap-[10px] self-stretch">
        <button
          onClick={() => router.back()}
          className="flex items-center text-black hover:underline cursor-pointer"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[#042354] font-montserrat text-[24px] font-semibold leading-[32px] tracking-[-0.144px]">
          Detalle del Tema
        </h1>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b mb-4">
        <button
          className={cn(
            "flex-1 py-2 px-4 text-center",
            activeTab === "informacion"
              ? "bg-white border border-b-0 border-gray-200 rounded-t-lg font-semibold"
              : "bg-gray-50 hover:bg-gray-100",
          )}
          onClick={() => setActiveTab("informacion")}
        >
          Información
        </button>
        <button
          className={cn(
            "flex-1 py-2 px-4 text-center",
            activeTab === "historial"
              ? "bg-white border border-b-0 border-gray-200 rounded-t-lg font-semibold"
              : "bg-gray-50 hover:bg-gray-100",
          )}
          onClick={() => setActiveTab("historial")}
        >
          Historial de Cambios
        </button>
        <button
          className={cn(
            "flex-1 py-2 px-4 text-center",
            activeTab === "exposiciones"
              ? "bg-white border border-b-0 border-gray-200 rounded-t-lg font-semibold"
              : "bg-gray-50 hover:bg-gray-100",
          )}
          onClick={() => setActiveTab("exposiciones")}
        >
          Detalle de Exposiciones
        </button>
      </div>

      {activeTab === "informacion" && (
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <div>
            {tema ? (
              <DetalleTema tema={tema} />
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay tema seleccionado.
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === "historial" && (
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <div>
            {tema ? (
              <HistorialTemaCard idTema={tema.id} />
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay tema seleccionado.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "exposiciones" && (
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
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
                    {tesis.asesores.find((a) => a.tipo === "Coasesor")
                      ?.nombre || "Sin coasesor"}
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
                  <p className="text-gray-500 mt-2">
                    Sin estudiantes asignados
                  </p>
                )}
              </div>

              <div className="col-span-5">
                <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-base font-medium leading-[14px]">
                  Miembros de Jurado
                </p>
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
                    No hay miembros asignados al tema
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
                              {exposicion.estadoExposicion
                                .charAt(0)
                                .toUpperCase() +
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
                              {new Date(
                                exposicion.datetimeFin,
                              ).toLocaleTimeString("es-PE", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </p>
                            <p>Sala de exposición: {exposicion.sala}</p>
                            <div>
                              <p className="mt-2">
                                Miembros del jurado asignados:
                              </p>
                              {exposicion.miembrosJurado.map((jurado) => (
                                <div
                                  key={jurado.id}
                                  className="flex items-center mt-2"
                                >
                                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                                    <CircleUserRound className="h-5 w-5 text-gray-500" />
                                  </div>
                                  <div>
                                    <span>
                                      {jurado.nombres} {jurado.primerApellido}{" "}
                                      {jurado.segundoApellido}
                                    </span>
                                    <span className="text-gray-500 ml-2">
                                      ({jurado.rol})
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
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
        </div>
      )}

      <Toaster position="bottom-right" richColors />
    </div>
  );
}


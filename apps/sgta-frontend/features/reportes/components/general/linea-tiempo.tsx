// src/components/LineaTiempoReporte.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "@/features/auth/types/auth.types";
import { getEntregablesAlumno, getEntregablesAlumnoSeleccionado, getEntregablesConCriterios } from "@/features/reportes/services/report-services";
import type { EntregableCriteriosDetalle, GradesData, StudentData } from "@/features/reportes/types/Entregable.type";
import { addDays, format, isBefore, parseISO } from "date-fns";
import { ClipboardList, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnalisisAcademico } from "./analisis-academico";

// Convierte "no_iniciado" → "No Iniciado", etc.
const humanize = (raw: string) =>
  raw
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");



const currentDate = new Date();

type TimeFilter = "all" | "past" | "upcoming30" | "upcoming90";
type StatusFilter = "all" | "no_iniciado" | "en_proceso" | "terminado" | "no_enviado" | "enviado_a_tiempo" | "enviado_tarde";
type FiltroEstado = "no_iniciado" | "en_proceso" | "terminado" | "no_enviado" | "enviado_a_tiempo" | "enviado_tarde";


interface Criterio {
  id: number;
  nombre: string;
  notaMaxima: number;
  descripcion: string;
  nota: number | null;
}

interface TimelineEvent {
  event: string;
  date: string;
  rawEstadoEntregable: "no_iniciado" | "en_proceso" | "terminado";
  rawEstadoXTema: "no_enviado" | "enviado_a_tiempo" | "enviado_tarde";
  status: "Completado" | "Pendiente" | "En progreso";
  isLate: boolean;
  daysRemaining: number;
  isAtRisk: boolean;
  esEvaluable: boolean;
  nota: number | null;
  criterios: Criterio[];
  entregableId: number;
  temaId: number;
  estadoRevision?: string;
}

interface Props {
  user: User;
  selectedStudentId?: number | null;
}

export function LineaTiempoReporte({ user, selectedStudentId  }: Props) {
  const [activeTab, setActiveTab] = useState<"entregas" | "avances" | "analisis">("entregas");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [isCriteriosModalOpen, setIsCriteriosModalOpen] = useState(false);
  const [selectedCriterios, setSelectedCriterios] = useState<Criterio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para análisis académico
  const [academicData, setAcademicData] = useState<{
    studentData: StudentData;
    gradesData: GradesData;
  } | null>(null);
  const [isLoadingAcademic, setIsLoadingAcademic] = useState(false);

  // Cambiar automáticamente a "entregas" si se selecciona un estudiante y está en "analisis"
  useEffect(() => {
    if (selectedStudentId != null && activeTab === "analisis") {
      setActiveTab("entregas");
    }
  }, [selectedStudentId, activeTab]);

  useEffect(() => {
    const fetchEntregables = async () => {
      setIsLoading(true);
      try {
        const data = selectedStudentId != null
        ? await getEntregablesAlumnoSeleccionado(selectedStudentId)
        : await getEntregablesAlumno();

        type RawEntregable = {
          nombreEntregable: string;
          fechaEnvio: string | null;
          estadoEntregable: "no_iniciado" | "en_proceso" | "terminado";
          estadoXTema: "no_enviado" | "enviado_a_tiempo" | "enviado_tarde";
          esEvaluable: boolean;
          nota: number | null;
          criterios: Criterio[];
          entregableId: number;   
          temaId: number;  
          estadoRevision?: string;
        };

        const rawData = data as RawEntregable[];
        const eventosTransformados: TimelineEvent[] = rawData
          //.filter((item) => item.fechaEnvio !== null)
          .map((item: RawEntregable) => {
            if (item.fechaEnvio) {

              const eventDate = parseISO(item.fechaEnvio!);
              const daysRemaining = Math.ceil(
                (eventDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
              );

              let statusInterno: TimelineEvent["status"] = "Pendiente";
              if (item.estadoEntregable === "terminado") {
                statusInterno = "Completado";
              } else if (item.estadoEntregable === "en_proceso") {
                statusInterno = "En progreso";
              }

              const isLateFlag = item.estadoXTema === "enviado_tarde";

              const fechaFormateada = format(eventDate, "dd-MM-yyyy");

              return {
                event: item.nombreEntregable,
                date: fechaFormateada,
                rawEstadoEntregable: item.estadoEntregable,
                rawEstadoXTema: item.estadoXTema,
                estadoRevision: item.estadoRevision,
                status: statusInterno,
                isLate: isLateFlag,
                daysRemaining,
                isAtRisk: false,
                esEvaluable: item.esEvaluable,
                nota: item.nota,
                criterios: item.criterios || [],
                entregableId: item.entregableId,
                temaId: item.temaId,
              };
            
            } else {
              return {
                event: item.nombreEntregable,
                date: "Fecha no disponible",
                rawEstadoEntregable: item.estadoEntregable,
                rawEstadoXTema: item.estadoXTema,
                estadoRevision: item.estadoRevision,
                status: "Pendiente",
                isLate: false,
                daysRemaining: 0,
                isAtRisk: false,
                esEvaluable: item.esEvaluable,
                nota: item.nota,
                criterios: item.criterios || [],
                entregableId: item.entregableId, 
                temaId: item.temaId,
              };
            }
          });

        // Orden descendente:
        eventosTransformados.sort((a, b) => {
          if (a.date === "Fecha no disponible") return 1;
          if (b.date === "Fecha no disponible") return -1;
          
          const parseDate = (dateStr: string) => {
            if (dateStr.includes("-") && dateStr.length === 10) {
              const [day, month, year] = dateStr.split("-");
              return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            }
            return parseISO(dateStr);
          };
          
          return parseDate(b.date).getTime() - parseDate(a.date).getTime();
        });

        setTimelineEvents(eventosTransformados);
      } catch (error) {
        console.error("Error al obtener entregables:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntregables();
  }, [user, selectedStudentId]);

  // Nuevo useEffect para cargar datos de análisis académico
  useEffect(() => {
    const fetchAcademicData = async () => {
      if (activeTab !== "analisis") return;
      
      setIsLoadingAcademic(true);
      try {
        const entregablesData = await getEntregablesConCriterios();
        
        // Transformar datos de la API al formato esperado por AnalisisAcademico
        const transformedData = transformEntregablesToAcademicData(entregablesData);
        setAcademicData(transformedData);
      } catch (error) {
        console.error("Error al obtener datos de análisis académico:", error);
      } finally {
        setIsLoadingAcademic(false);
      }
    };

    fetchAcademicData();
  }, [activeTab]);

  // Función para transformar los datos de la API
  const transformEntregablesToAcademicData = (entregables: EntregableCriteriosDetalle[]): {
    studentData: StudentData;
    gradesData: GradesData;
  } => {
    // Agrupar entregables por etapa formativa
    const entregablesPorEtapa = new Map<number, EntregableCriteriosDetalle[]>();
    
    entregables.forEach(entregable => {
      if (entregable.etapaFormativaXCicloId) {
        const etapaId = entregable.etapaFormativaXCicloId;
        if (!entregablesPorEtapa.has(etapaId)) {
          entregablesPorEtapa.set(etapaId, []);
        }
        entregablesPorEtapa.get(etapaId)!.push(entregable);
      }
    });

    // Crear stages para el análisis académico
    const stages = Array.from(entregablesPorEtapa.entries()).map(([etapaId, entregablesEtapa]) => {
      const deliverables = entregablesEtapa.map(entregable => {
        // Transformar criterios al formato esperado
        const criteria = entregable.criterios.map(criterio => ({
          name: criterio.criterioNombre,
          grade: criterio.notaCriterio || 0
        }));

        return {
          id: entregable.entregableId.toString(),
          name: entregable.entregableNombre,
          date: entregable.fechaEnvio ? format(parseISO(entregable.fechaEnvio), "dd-MM-yyyy") : "Sin fecha",
          fechaLimite: entregable.fechaFin ? format(parseISO(entregable.fechaFin), "dd-MM-yyyy") : "Sin fecha límite",
          criteria,
          expositionGrade: 0, // No tenemos datos de exposición en la API actual
          finalGrade: entregable.notaGlobal || 0
        };
      });

      return {
        id: etapaId.toString(),
        name: `Etapa ${etapaId}`, // Podríamos obtener el nombre real de la etapa si la API lo proporciona
        period: "2024-1", // Podríamos obtener el período real si la API lo proporciona
        deliverables
      };
    });

    // Crear datos del estudiante
    const studentData: StudentData = {
      name: user?.name ? `${user.name}` : "Estudiante",
      currentStage: stages.length > 0 ? stages[0].name : "Sin etapa asignada",
      totalStages: stages.length
    };

    // Crear datos de calificaciones
    const gradesData: GradesData = {
      stages
    };

    return { studentData, gradesData };
  };

  // Filtrado por tiempo
  const filteredByTime = timelineEvents.filter((event) => {
    // Si la fecha está en formato dd-MM-yyyy, la convertimos para parsearla
    if (event.date === "Fecha no disponible") return true;
    
    let eventDate: Date;
    if (event.date.includes("-") && event.date.length === 10) {
      // Si es formato dd-MM-yyyy, convertirlo a Date
      const [day, month, year] = event.date.split("-");
      eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      eventDate = parseISO(event.date);
    }
    
    switch (timeFilter) {
      case "past":
        return isBefore(eventDate, currentDate);
      case "upcoming30":
        return (
          !isBefore(eventDate, currentDate) &&
          isBefore(eventDate, addDays(currentDate, 30))
        );
      case "upcoming90":
        return (
          !isBefore(eventDate, currentDate) &&
          isBefore(eventDate, addDays(currentDate, 90))
        );
      default:
        return true;
    }
  });

  // Filtrado por estado crudo
  const filteredEvents = filteredByTime.filter((event) => {
    if (statusFilter === "all") return true;
    return (
      statusFilter === event.rawEstadoEntregable ||
      statusFilter === event.rawEstadoXTema
    );
  });

  // Filtrado según pestaña activa
  const displayedEvents = filteredEvents.filter((event) =>
    activeTab === "entregas" ? event.esEvaluable : !event.esEvaluable
  );

  const handleStatusFilterClick = () => {
    setShowStatusFilter(!showStatusFilter);
  };
  const openCriteriosModal = (criterios: Criterio[]) => {
    setSelectedCriterios(criterios);
    setIsCriteriosModalOpen(true);
  };

  return (
    <>
      {/* Pestañas */}
      <div className="flex gap-4 mb-4 border-b border-gray-200">
        {[
          { key: "entregas", label: "Entregas" },
          { key: "avances", label: "Avances" },
          // Solo mostrar análisis académico si no hay estudiante seleccionado
          ...(selectedStudentId == null ? [{ key: "analisis", label: "Análisis Académico" }] : []),
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === tab.key
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      {(activeTab === "entregas" || activeTab === "avances") && (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <CardTitle className="text-lg">Avances y Entregas</CardTitle>
            <div className="flex flex-wrap gap-2 justify-end">
              <Select
                value={timeFilter}
                onValueChange={(v) => setTimeFilter(v as TimeFilter)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por Fechas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Filtrar por Periodos</SelectItem>
                  <SelectItem value="past">Eventos pasados</SelectItem>
                  <SelectItem value="upcoming30">Próximos 30 días</SelectItem>
                  <SelectItem value="upcoming90">Próximos 90 días</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Button variant="outline" onClick={handleStatusFilterClick}>
                  Filtrar por estado
                </Button>
                {showStatusFilter && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border">
                    <div className="p-3 space-y-2">
                      <h4 className="font-medium text-sm">Estado</h4>
                      <div className="space-y-1">
                        {/* Opción "Todos" */}
                        <Button
                          key="all"
                          variant={statusFilter === "all" ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setStatusFilter("all");
                            setShowStatusFilter(false);
                          }}
                        >
                          Todos
                        </Button>

                        {/* Estado del Entregable */}
                        <p className="text-xs font-semibold text-gray-600 mt-2 mb-1 px-1">
                          Estado del Entregable
                        </p>
                        {["no_iniciado", "en_proceso", "terminado"].map((filter) => (
                          <Button
                            key={filter}
                            variant={statusFilter === filter ? "default" : "outline"}
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              setStatusFilter(filter as StatusFilter);
                              setShowStatusFilter(false);
                            }}
                          >
                            {filter === "no_iniciado" && <span className="text-gray-500">No Iniciado</span>}
                            {filter === "en_proceso" && <span className="text-blue-600">En Proceso</span>}
                            {filter === "terminado" && <span className="text-green-600">Terminado</span>}
                          </Button>
                        ))}

                        {/* Estado × Tema */}
                        <p className="text-xs font-semibold text-gray-600 mt-2 mb-1 px-1">
                          Estado × Tema
                        </p>
                        {["no_enviado", "enviado_a_tiempo", "enviado_tarde"].map((filter) => (
                          <Button
                            key={filter}
                            variant={statusFilter === filter ? "default" : "outline"}
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              setStatusFilter(filter as FiltroEstado);
                              setShowStatusFilter(false);
                            }}
                          >
                            {filter === "no_enviado" && <span className="text-red-600">No Enviado</span>}
                            {filter === "enviado_a_tiempo" && <span className="text-green-600">Enviado a Tiempo</span>}
                            {filter === "enviado_tarde" && <span className="text-red-600">Enviado Tarde</span>}
                          </Button>
                        ))}
                      </div>

                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto px-2">
              <div className="relative border-l border-gray-200 ml-3 pl-8 space-y-6 min-w-[300px]">

              {
                isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Cargando…
                </div>
                ) : displayedEvents.length > 0 ? (
                  displayedEvents.map((event, index) => {
                  
                  const textoXTema       = humanize(event.rawEstadoXTema);
                  const textoEntregable  = humanize(event.rawEstadoEntregable);

                  const colorXTema = {
                    no_enviado:      "text-red-600",
                    enviado_a_tiempo:"text-green-600",
                    enviado_tarde:   "text-red-600",
                  }[event.rawEstadoXTema] ?? "";

                  const colorEntregable = {
                    no_iniciado: "text-gray-800",
                    en_proceso:  "text-blue-600",
                    terminado:   "text-green-600",
                  }[event.rawEstadoEntregable] ?? "";

                  const colorRevision = {
                    por_aprobar: "bg-purple-100 text-purple-800",
                    aprobado:    "bg-green-100 text-green-800",
                    observado:   "bg-red-100 text-red-800",
                  }[event.estadoRevision ?? ""] ?? "bg-gray-100 text-gray-800";


                  let circleClass = "bg-gray-300 border-gray-300";
                  if (event.rawEstadoXTema === "enviado_a_tiempo") {
                    circleClass = "bg-green-500 border-green-500";
                  } else if (event.rawEstadoXTema === "enviado_tarde") {
                    circleClass = "bg-red-500 border-red-500";
                  }


                  return (
                    <div key={index} className="relative">
                      <div
                        className={`absolute -left-10 mt-1.5 h-4 w-4 rounded-full border ${circleClass}`}
                      />
                      <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 w-full">
                          <div className="flex-1 min-w-0">
                            <time className="mb-1 text-xs font-normal text-gray-500">
                              {event.date}
                            </time>
                            <div className="text-sm font-medium break-words flex flex-wrap gap-1 max-w-[300px] sm:max-w-[500px]">
                              <span>{event.event}</span>
                              <span
                                className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                  colorXTema === "text-red-600"
                                    ? "bg-red-100 text-red-800"
                                    : colorXTema === "text-green-600"
                                    ? "bg-green-100 text-green-800"
                                    : ""
                                }`}
                              >
                                {textoXTema}
                              </span>
                              <span className={`ml-2 text-xs ${colorEntregable}`}>
                                {textoEntregable}
                              </span>
                              {event.estadoRevision && (
                                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${colorRevision}`}>
                                  {humanize(event.estadoRevision)}
                                </span>
                              )}
                              
                            </div>

                          </div>
                          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-end gap-2 w-full sm:w-auto">
                            <Link
                              href={`/alumno/mi-proyecto/entregables/${event.entregableId}?tema=${event.temaId}`}
                              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="ml-1">Ver detalle</span>
                            </Link>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => openCriteriosModal(event.criterios)}
                            >
                              <ClipboardList className="h-4 w-4" />
                              <span className="ml-1">Ver criterios</span>
                            </Button>
                            {activeTab === "entregas" && (
                              <span className="text-base font-medium">
                                Nota:{" "}
                                <span
                                  className={
                                    event.nota == null
                                      ? "text-black"
                                      : event.nota > 10
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {event.nota ?? "-"}
                                </span>
                              </span>
                            )}

                          </div>
                        </div>
                        
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay eventos que coincidan con los filtros seleccionados
                </div>
              )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "analisis" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Análisis Académico</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAcademic ? (
              <div className="text-center py-8 text-gray-500">
                Cargando análisis académico...
              </div>
            ) : academicData ? (
              <AnalisisAcademico studentData={academicData.studentData} gradesData={academicData.gradesData}/>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No se pudieron cargar los datos de análisis académico
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal de Criterios */}
      <Dialog open={isCriteriosModalOpen} onOpenChange={setIsCriteriosModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">Criterios del Entregable</DialogTitle>
            <DialogDescription>
              A continuación se muestran los criterios, la nota máxima, la descripción y la nota asignada.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
            {selectedCriterios.length > 0 ? (
              selectedCriterios.map((c) => (
                <div key={c.id} className="border rounded-md p-3 bg-white">
                  <p className="font-medium text-sm">{c.nombre}</p>
                  <p className="text-xs text-gray-600">Nota máxima: {c.notaMaxima}</p>
                  <p className="text-xs text-gray-500 mt-1">{c.descripcion}</p>
                  <p className="text-xs mt-1">
                    <span className="font-medium">Nota asignada: </span>
                    {c.nota != null ? c.nota : "Sin nota"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No hay criterios asignados.</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="mt-4 w-full">Cerrar</Button>
            </DialogClose>
          </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
}

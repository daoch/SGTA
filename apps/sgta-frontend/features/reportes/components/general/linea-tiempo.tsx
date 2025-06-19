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
import { addDays, format, isBefore, parseISO } from "date-fns";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { AnalisisAcademico, GradesData, StudentData } from "./analisis-academico";
import type { EntregableCriteriosDetalle } from "@/features/reportes/types/Entregable.type";


// Convierte "no_iniciado" → "No Iniciado", etc.
const humanize = (raw: string) =>
  raw
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");


const currentDate = new Date();

type TimeFilter = "all" | "past" | "upcoming30" | "upcoming90";
type StatusFilter =
  | "all"
  | "no_enviado"
  | "enviado_a_tiempo"
  | "enviado_tarde"
  | "no_iniciado"
  | "en_proceso"
  | "terminado";

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
}

interface Props {
  user: User;
  selectedStudentId?: number | null;
}

export function LineaTiempoReporte({ user, selectedStudentId  }: Props) {

  console.log("Valor de selectedStudentId recibido en línea de tiempo:", selectedStudentId);
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
        };

        const rawData = data as RawEntregable[];
        const eventosTransformados: TimelineEvent[] = rawData
          //.filter((item) => item.fechaEnvio !== null)
          .map((item) => {
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
              const isAtRiskFlag =
                daysRemaining > 0 &&
                daysRemaining <= 3 &&
                statusInterno === "Pendiente" &&
                !isLateFlag;

              return {
                event: item.nombreEntregable,
                date: format(eventDate, "yyyy-MM-dd"),
                rawEstadoEntregable: item.estadoEntregable,
                rawEstadoXTema: item.estadoXTema,
                status: statusInterno,
                isLate: isLateFlag,
                daysRemaining,
                isAtRisk: isAtRiskFlag,
                esEvaluable: item.esEvaluable,
                nota: item.nota,
                criterios: item.criterios || [],
              };
            
            } else {
              return {
                event: item.nombreEntregable,
                date: "Fecha no disponible",
                rawEstadoEntregable: item.estadoEntregable,
                rawEstadoXTema: item.estadoXTema,
                status: "Pendiente",
                isLate: false,
                daysRemaining: 0,
                isAtRisk: false,
                esEvaluable: item.esEvaluable,
                nota: item.nota,
                criterios: item.criterios || [],
              };
            }
          });

        // Orden descendente:
        eventosTransformados.sort(
          (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
        );

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
          date: entregable.fechaEnvio ? format(parseISO(entregable.fechaEnvio), "yyyy-MM-dd") : "Sin fecha",
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
    const eventDate = parseISO(event.date);
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
          { key: "analisis", label: "Análisis Académico" },
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
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg">Avances y Entregas</CardTitle>
            <div className="flex items-center gap-2">
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
                        {(
                          [
                            "all",
                            "no_enviado",
                            "enviado_a_tiempo",
                            "enviado_tarde",
                            "no_iniciado",
                            "en_proceso",
                            "terminado",
                          ] as StatusFilter[]
                        ).map((filter) => (
                          <Button
                            key={filter}
                            variant={
                              statusFilter === filter ? "default" : "outline"
                            }
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              setStatusFilter(filter);
                              setShowStatusFilter(false);
                            }}
                          >
                            {filter === "all" && "Todos"}
                            {filter === "no_enviado" && (
                              <span className="text-red-600">No Enviado</span>
                            )}
                            {filter === "enviado_a_tiempo" && (
                              <span className="text-green-600">Actual</span>
                            )}
                            {filter === "enviado_tarde" && (
                              <span className="text-red-600">Enviado Tarde</span>
                            )}
                            {filter === "no_iniciado" && (
                              <span className="text-gray-500">Pendiente</span>
                            )}
                            {filter === "en_proceso" && (
                              <span className="text-blue-600">En progreso</span>
                            )}
                            {filter === "terminado" && (
                              <span className="text-green-600">Completado</span>
                            )}
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
            <div className="relative border-l border-gray-200 ml-3 pl-8 space-y-6">
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
                        <div className="flex justify-between items-center">
                          <div>
                            <time className="mb-1 text-xs font-normal text-gray-500">
                              {event.date}
                            </time>
                            <h3 className="text-sm font-medium">
                              {event.event}
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
                              {event.isAtRisk && (
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                                  En riesgo ({event.daysRemaining} días)
                                </span>
                              )}
                            </h3>
                          </div>
                          <div className="flex items-center justify-end space-x-4 min-w-[200px]">
                            <Button variant="default" size="sm" className="flex items-center">
                              <Eye className="h-4 w-4" />
                              <span className="ml-1">Ver detalle</span>
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => openCriteriosModal(event.criterios)}
                            >
                              Ver criterios
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

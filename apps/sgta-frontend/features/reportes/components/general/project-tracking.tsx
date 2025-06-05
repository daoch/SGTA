"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/features/auth/types/auth.types";
import { getEntregablesAlumno } from "@/features/reportes/services/report-services";
import { addDays, differenceInDays, format, isBefore, parseISO } from "date-fns";
import { CheckCircle, Clock, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ProjectTrackingProps {
  user: User;
}

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


const getProgressBarColor = (status: string) => {
  if (status === "completed") return "bg-green-500";
  if (status === "overdue") return "bg-red-500";
  return "bg-blue-500";
};

const getProgressBadgeClasses = (status: string) => {
  if (status === "completed") return "bg-green-100 text-green-800";
  if (status === "overdue") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

const getStatusBadgeClasses = (colorXTema: string) => {
  if (colorXTema === "text-red-600") return "bg-red-100 text-red-800";
  if (colorXTema === "text-green-600") return "bg-green-100 text-green-800";
  return "";
};

const getEntregableDisplayValue = (value: string) => {
  switch (value) {
    case "no_enviado": return "Entrega: No enviado";
    case "enviado_a_tiempo": return "Entrega: Enviado a tiempo";
    case "enviado_tarde": return "Entrega: Enviado tarde";
    case "all": return "Estado de Entrega";
    default: return "Estado de Entrega";
  }
};

const getActividadDisplayValue = (value: string) => {
  switch (value) {
    case "no_iniciado": return "Actividad: Pendiente";
    case "en_proceso": return "Actividad: En progreso";
    case "terminado": return "Actividad: Completado";
    case "all": return "Estado de Actividad";
    default: return "Estado de Actividad";
  }
};

export function ProjectTracking({ user }: ProjectTrackingProps) {
  const [timeFilter, setTimeFilter] = useState("all");
  const [entregableFilter, setEntregableFilter] = useState("all");
  const [actividadFilter, setActividadFilter] = useState("all");
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [isCriteriosModalOpen, setIsCriteriosModalOpen] = useState(false);
  const [selectedCriterios, setSelectedCriterios] = useState<Criterio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntregables = async () => {
      try {
        setIsLoading(true);
        const alumnoId = "11"; // Hardcodeado por ahora
        const data = await getEntregablesAlumno(alumnoId);

        const eventosTransformados: TimelineEvent[] = data.map((item: {
          nombreEntregable: string;
          fechaEnvio: string | null;
          estadoEntregable: "no_iniciado" | "en_proceso" | "terminado";
          estadoXTema: "no_enviado" | "enviado_a_tiempo" | "enviado_tarde";
          esEvaluable: boolean;
          nota: number | null;
          criterios: Criterio[];
        }) => {
          const eventDate = item.fechaEnvio ? parseISO(item.fechaEnvio) : null;
          const daysRemaining = eventDate 
            ? Math.ceil((eventDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
            : 0;

          let statusInterno: TimelineEvent["status"] = "Pendiente";
          if (item.estadoEntregable === "terminado") {
            statusInterno = "Completado";
          } else if (item.estadoEntregable === "en_proceso") {
            statusInterno = "En progreso";
          }

          const isLateFlag = item.estadoXTema === "enviado_tarde";
          const isAtRiskFlag =
            eventDate &&
            daysRemaining > 0 &&
            daysRemaining <= 3 &&
            statusInterno === "Pendiente" &&
            !isLateFlag;

          return {
            event: item.nombreEntregable,
            date: eventDate ? format(eventDate, "yyyy-MM-dd") : "Sin fecha",
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
        });

        eventosTransformados.sort((a, b) => {
          if (a.date === "Sin fecha") return 1;
          if (b.date === "Sin fecha") return -1;
          return parseISO(a.date).getTime() - parseISO(b.date).getTime();
        });
        setTimelineEvents(eventosTransformados);
      } catch (error) {
        console.error("Error al obtener entregables:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntregables();
  }, [user]);

  // Fecha actual simulada para el ejemplo
  const currentDate = new Date("2023-04-18");

  // Datos para el diagrama de Gantt
  const ganttActivities = [
    {
      id: 1,
      name: "Propuesta de proyecto",
      startDate: "2023-01-15",
      endDate: "2023-01-30",
      status: "completed",
      progress: 100,
      actualEndDate: "2023-01-28",
    },
    {
      id: 2,
      name: "Marco teórico",
      startDate: "2023-02-01",
      endDate: "2023-02-28",
      status: "completed",
      progress: 100,
      actualEndDate: "2023-02-26",
    },
    {
      id: 3,
      name: "Metodología",
      startDate: "2023-03-01",
      endDate: "2023-04-15",
      status: "overdue",
      progress: 85,
      actualEndDate: null,
    },
    {
      id: 4,
      name: "Implementación",
      startDate: "2023-04-16",
      endDate: "2023-05-31",
      status: "pending",
      progress: 0,
      actualEndDate: null,
    },
    {
      id: 5,
      name: "Resultados y análisis",
      startDate: "2023-06-01",
      endDate: "2023-06-30",
      status: "pending",
      progress: 0,
      actualEndDate: null,
    },
    {
      id: 6,
      name: "Documento final",
      startDate: "2023-07-01",
      endDate: "2023-07-15",
      status: "pending",
      progress: 0,
      actualEndDate: null,
    },
    {
      id: 7,
      name: "Defensa de proyecto",
      startDate: "2023-07-16",
      endDate: "2023-07-30",
      status: "pending",
      progress: 0,
      actualEndDate: null,
    },
  ];

  const timelineEventsWithStatus = timelineEvents.map((event) => {
    const eventDate = event.date !== "Sin fecha" ? parseISO(event.date) : null;
    const daysRemaining = eventDate
      ? Math.ceil((eventDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    const isAtRisk =
      eventDate &&
      daysRemaining > 0 &&
      daysRemaining <= 3 &&
      event.status !== "Completado" &&
      event.status !== "En progreso" &&
      !event.isLate;

    return {
      ...event,
      daysRemaining,
      isAtRisk,
    };
  });

  // Filtrar eventos por tiempo
  const filteredByTime = timelineEventsWithStatus.filter((event) => {
    if (event.date === "Sin fecha") return timeFilter === "all";
    const eventDate = parseISO(event.date);
    switch (timeFilter) {
      case "past":
        return isBefore(eventDate, currentDate);
      case "upcoming30":
        return !isBefore(eventDate, currentDate) && isBefore(eventDate, addDays(currentDate, 30));
      case "upcoming90":
        return !isBefore(eventDate, currentDate) && isBefore(eventDate, addDays(currentDate, 90));
      case "all":
      default:
        return true;
    }
  });

  // Filtrar por estado de entregable y actividad
  const filteredEvents = filteredByTime.filter((event) => {
    const matchesEntregable = entregableFilter === "all" || event.rawEstadoXTema === entregableFilter;
    const matchesActividad = actividadFilter === "all" || event.rawEstadoEntregable === actividadFilter;
    return matchesEntregable && matchesActividad;
  });

  // Función para calcular posiciones del Gantt
  const calculateGanttPositions = () => {
    const projectStart = new Date("2023-01-15");
    const projectEnd = new Date("2023-07-30");
    const totalProjectDays = differenceInDays(projectEnd, projectStart);

    return ganttActivities.map((activity) => {
      const activityStart = new Date(activity.startDate);
      const activityEnd = new Date(activity.endDate);
      const daysFromStart = differenceInDays(activityStart, projectStart);
      const activityDuration = differenceInDays(activityEnd, activityStart);
      const currentProgress = differenceInDays(currentDate, projectStart);

      return {
        ...activity,
        leftPosition: (daysFromStart / totalProjectDays) * 100,
        width: (activityDuration / totalProjectDays) * 100,
        currentPosition: (currentProgress / totalProjectDays) * 100,
      };
    });
  };

  const ganttData = calculateGanttPositions();

  const openCriteriosModal = (criterios: Criterio[]) => {
    setSelectedCriterios(criterios);
    setIsCriteriosModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Seguimiento del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="entregas">
            <TabsList className="mb-4">
              <TabsTrigger value="entregas">Entregas</TabsTrigger>
              <TabsTrigger value="avance">Avance</TabsTrigger>
            </TabsList>

            <TabsContent value="entregas">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Cargando entregables...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por tiempo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los eventos</SelectItem>
                        <SelectItem value="past">Eventos pasados</SelectItem>
                        <SelectItem value="upcoming30">Próximos 30 días</SelectItem>
                        <SelectItem value="upcoming90">Próximos 90 días</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={entregableFilter} onValueChange={setEntregableFilter}>
                      <SelectTrigger className="w-[250px]">
                        <SelectValue>
                          {getEntregableDisplayValue(entregableFilter)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="min-w-[250px]">
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="no_enviado">
                          <span className="text-gray-500">No enviado</span>
                        </SelectItem>
                        <SelectItem value="enviado_a_tiempo">
                          <span className="text-green-600">Enviado a tiempo</span>
                        </SelectItem>
                        <SelectItem value="enviado_tarde">
                          <span className="text-red-600">Enviado tarde</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={actividadFilter} onValueChange={setActividadFilter}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue>
                          {getActividadDisplayValue(actividadFilter)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="no_iniciado">
                          <span className="text-gray-500">Pendiente</span>
                        </SelectItem>
                        <SelectItem value="en_proceso">
                          <span className="text-blue-600">En progreso</span>
                        </SelectItem>
                        <SelectItem value="terminado">
                          <span className="text-green-600">Completado</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative border-l border-gray-200 ml-3 pl-8 space-y-6">
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((event, index) => {
                        // Mapear "estadoXTema" a texto y color
                        let textoXTema = "";
                        let colorXTema = "";
                        if (event.rawEstadoXTema === "no_enviado") {
                          textoXTema = "No Enviado";
                          colorXTema = "text-red-600";
                        } else if (event.rawEstadoXTema === "enviado_a_tiempo") {
                          textoXTema = "Actual";
                          colorXTema = "text-green-600";
                        } else if (event.rawEstadoXTema === "enviado_tarde") {
                          textoXTema = "Enviado Tarde";
                          colorXTema = "text-red-600";
                        }

                        // Mapear "estadoEntregable" a texto y color
                        let textoEntregable = "";
                        let colorEntregable = "";
                        if (event.rawEstadoEntregable === "no_iniciado") {
                          textoEntregable = "Pendiente";
                          colorEntregable = "text-gray-500";
                        } else if (event.rawEstadoEntregable === "en_proceso") {
                          textoEntregable = "En progreso";
                          colorEntregable = "text-blue-600";
                        } else if (event.rawEstadoEntregable === "terminado") {
                          textoEntregable = "Completado";
                          colorEntregable = "text-green-600";
                        }

                        // Determinar la clase del círculo según "estadoXTema"
                        let circleClass = "bg-gray-300 border-gray-300";
                        if (event.rawEstadoXTema === "no_enviado") {
                          circleClass = "bg-gray-300 border-gray-300";
                        } else if (event.rawEstadoXTema === "enviado_a_tiempo") {
                          circleClass = "bg-green-500 border-green-500";
                        } else if (event.rawEstadoXTema === "enviado_tarde") {
                          circleClass = "bg-red-500 border-red-500";
                        }

                        return (
                          <div key={index} className="relative">
                            <div
                              className={`absolute -left-10 mt-1.5 h-4 w-4 rounded-full border ${circleClass}`}
                            ></div>

                            <div>
                              <time className="mb-1 text-xs font-normal text-gray-500">
                                {event.date === "Sin fecha" ? "Fecha no definida" : format(parseISO(event.date), "dd/MM/yyyy")}
                              </time>
                              <h3 className="text-sm font-medium">
                                {event.event}

                                <span
                                  className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getStatusBadgeClasses(colorXTema)}`}
                                >
                                  {textoXTema}
                                </span>

                                {event.isAtRisk && (
                                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                                    En riesgo ({event.daysRemaining} días)
                                  </span>
                                )}
                              </h3>

                              <p className={`text-xs flex items-center ${colorEntregable}`}>
                                <span>{textoEntregable}</span>

                                {event.esEvaluable && (
                                  <span className="ml-2 text-xs font-semibold text-gray-800">
                                    — Nota: {event.nota ?? "-"}
                                  </span>
                                )}

                                {event.criterios && event.criterios.length > 0 && (
                                  <Button
                                    variant="ghost"
                                    className="ml-4 text-gray-800 hover:text-gray-900"
                                    size="sm"
                                    onClick={() => openCriteriosModal(event.criterios)}
                                  >
                                    <span className="text-xs">Ver criterios</span>
                                  </Button>
                                )}
                              </p>
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
                </>
              )}
            </TabsContent>

            <TabsContent value="avance">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Cargando avance del proyecto...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-medium">Cronograma de Actividades</h3>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Completado</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>En progreso</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span>Retrasado</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-300 rounded"></div>
                        <span>Pendiente</span>
                      </div>
                    </div>
                  </div>

                  {/* Diagrama de Gantt */}
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                      {/* Header con fechas */}
                      <div className="flex mb-2">
                        <div className="w-48 text-xs font-medium text-gray-500 py-2">Actividad</div>
                        <div className="flex-1 relative">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Ene 2023</span>
                            <span>Feb 2023</span>
                            <span>Mar 2023</span>
                            <span>Abr 2023</span>
                            <span>May 2023</span>
                            <span>Jun 2023</span>
                            <span>Jul 2023</span>
                          </div>
                          <div className="h-px bg-gray-200"></div>
                        </div>
                        <div className="w-20 text-xs font-medium text-gray-500 py-2 text-center">Estado</div>
                      </div>

                      {/* Filas de actividades */}
                      {ganttData.map((activity) => (
                        <div key={activity.id} className="flex items-center py-2 border-b border-gray-100 last:border-0">
                          <div className="w-48 pr-4">
                            <div className="flex items-center gap-2">
                              {activity.status === "completed" && <CheckCircle className="h-3 w-3 text-green-500" />}
                              {activity.status === "overdue" && <XCircle className="h-3 w-3 text-red-500" />}
                              {activity.status === "pending" && <Clock className="h-3 w-3 text-gray-400" />}
                              <span className="text-sm font-medium truncate">{activity.name}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {format(new Date(activity.startDate), "dd/MM")} -{" "}
                              {format(new Date(activity.endDate), "dd/MM")}
                            </div>
                          </div>

                          <div className="flex-1 relative h-8 bg-gray-50 rounded">
                            {/* Línea de fecha actual */}
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-orange-500 z-20"
                              style={{ left: `${Math.min(activity.currentPosition, 100)}%` }}
                              title="Fecha actual"
                            ></div>

                            {/* Barra de actividad */}
                            <div
                              className="absolute top-1 bottom-1 rounded"
                              style={{
                                left: `${activity.leftPosition}%`,
                                width: `${activity.width}%`,
                                backgroundColor: "#e5e7eb",
                              }}
                            >
                              {/* Barra de progreso */}
                              <div
                                className={`h-full rounded transition-all duration-300 ${getProgressBarColor(activity.status)
                                  }`}
                                style={{ width: `${activity.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="w-20 text-center">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getProgressBadgeClasses(activity.status)
                                }`}
                            >
                              {activity.progress}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-0.5 h-4 bg-orange-500"></div>
                      <span className="font-medium">Línea naranja:</span>
                      <span className="text-gray-600">Fecha actual ({format(currentDate, "dd/MM/yyyy")})</span>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
                    {c.nota ?? "Sin nota"}
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

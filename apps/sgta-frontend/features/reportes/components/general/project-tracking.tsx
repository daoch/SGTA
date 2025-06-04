"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/features/auth/types/auth.types";
import { addDays, differenceInDays, format, isBefore, parseISO } from "date-fns";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ProjectTrackingProps {
  user: User;
}

const getEventStatusClasses = (status: string, isLate: boolean, isAtRisk: boolean) => {
  if (status === "Completado") return "bg-green-500 border-green-500";
  if (status === "En progreso") return "bg-blue-500 border-blue-500";
  if (isLate) return "bg-red-500 border-red-500";
  if (isAtRisk) return "bg-yellow-500 border-yellow-500";
  return "bg-gray-300 border-gray-300";
};

const getEventTextColor = (status: string, isLate: boolean, isAtRisk: boolean) => {
  if (status === "Completado") return "text-green-600";
  if (status === "En progreso") return "text-blue-600";
  if (isLate) return "text-red-600";
  if (isAtRisk) return "text-yellow-600";
  return "text-gray-600";
};

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

const getStatusLabel = (status: string) => {
  switch (status) {
    case "all": return "Todos";
    case "completed": return "Completado";
    case "inProgress": return "En progreso";
    case "pending": return "Pendiente";
    case "late": return "Retrasado";
    default: return "Filtrar por estado";
  }
};

export function ProjectTracking({ user }: ProjectTrackingProps) {
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly");
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowStatusFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Datos de entregas con estado de retraso
  const pendingDeliveries = [
    {
      name: "Metodología",
      dueDate: "15/04/2023",
      isLate: true,
      daysLate: 3,
    },
  ];

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

  const timelineEvents = [
    { date: "15/01/2023", event: "Propuesta de proyecto aprobada", status: "Completado" },
    { date: "30/01/2023", event: "Asignación de asesor: Dr. Rodríguez", status: "Completado" },
    { date: "15/02/2023", event: "Plan de trabajo aprobado", status: "Completado" },
    { date: "01/03/2023", event: "Primera reunión con asesor", status: "Completado" },
    { date: "15/03/2023", event: "Entrega parcial de marco teórico", status: "Completado" },
    { date: "30/03/2023", event: "Revisión de marco teórico", status: "En progreso" },
    { date: "15/04/2023", event: "Entrega de metodología", status: "Pendiente", isLate: true },
    { date: "30/04/2023", event: "Revisión de metodología", status: "Pendiente" },
    { date: "15/05/2023", event: "Avance de implementación", status: "Pendiente" },
    { date: "30/05/2023", event: "Revisión de implementación", status: "Pendiente" },
    { date: "15/06/2023", event: "Entrega de resultados", status: "Pendiente" },
    { date: "30/06/2023", event: "Revisión de resultados", status: "Pendiente" },
    { date: "15/07/2023", event: "Documento final", status: "Pendiente" },
    { date: "30/07/2023", event: "Defensa de proyecto", status: "Pendiente" },
  ].map((event) => {
    const eventDate = parseISO(`${event.date.split("/").reverse().join("-")}T00:00:00`);
    const daysRemaining = Math.ceil((eventDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    const isAtRisk =
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
  const filteredByTime = timelineEvents.filter((event) => {
    const eventDate = parseISO(`${event.date.split("/").reverse().join("-")}T00:00:00`);

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

  // Filtrar eventos por estado
  const filteredEvents = filteredByTime.filter((event) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "completed" && event.status === "Completado") return true;
    if (statusFilter === "inProgress" && event.status === "En progreso") return true;
    if (statusFilter === "pending" && event.status === "Pendiente" && !event.isLate && !event.isAtRisk) return true;
    if (statusFilter === "late" && event.isLate) return true;
    if (statusFilter === "atRisk" && event.isAtRisk) return true;
    return false;
  });

  // Función para manejar el clic en el botón de filtro por estado
  const handleStatusFilterClick = () => {
    setShowStatusFilter(!showStatusFilter);
  };

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

  return (
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

              <div className="relative" ref={filterRef}>
                <Button variant="outline" onClick={handleStatusFilterClick}>
                  {getStatusLabel(statusFilter)}
                </Button>
                {showStatusFilter && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border"
                    style={{
                      maxHeight: "300px",
                      overflowY: "auto",
                      position: "fixed",
                      top: filterRef.current?.getBoundingClientRect().bottom ?? 0,
                      right: window.innerWidth - (filterRef.current?.getBoundingClientRect().right ?? 0)
                    }}
                  >
                    <div className="p-3 space-y-2">
                      <h4 className="font-medium text-sm">Estado</h4>
                      <div className="space-y-1">
                        <Button
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
                        <Button
                          variant={statusFilter === "completed" ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setStatusFilter("completed");
                            setShowStatusFilter(false);
                          }}
                        >
                          Completado
                        </Button>
                        <Button
                          variant={statusFilter === "inProgress" ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setStatusFilter("inProgress");
                            setShowStatusFilter(false);
                          }}
                        >
                          En progreso
                        </Button>
                        <Button
                          variant={statusFilter === "pending" ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setStatusFilter("pending");
                            setShowStatusFilter(false);
                          }}
                        >
                          Pendiente
                        </Button>
                        <Button
                          variant={statusFilter === "late" ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setStatusFilter("late");
                            setShowStatusFilter(false);
                          }}
                        >
                          Retrasado
                        </Button>

                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative border-l border-gray-200 ml-3 pl-8 space-y-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`absolute -left-10 mt-1.5 h-4 w-4 rounded-full border ${getEventStatusClasses(event.status, event.isLate || false, event.isAtRisk || false)
                        }`}
                    ></div>
                    <div>
                      <time className="mb-1 text-xs font-normal text-gray-500">{event.date}</time>
                      <h3 className="text-sm font-medium">
                        {event.event}
                        {event.isLate && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                            Retrasado
                          </span>
                        )}
                        {event.isAtRisk && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                            En riesgo ({event.daysRemaining} días)
                          </span>
                        )}
                      </h3>
                      <p
                        className={`text-xs ${getEventTextColor(event.status, event.isLate || false, event.isAtRisk || false)
                          }`}
                      >
                        {event.status}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay eventos que coincidan con los filtros seleccionados
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="avance">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

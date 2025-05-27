"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDays, isBefore, parseISO } from "date-fns";
import { AlertTriangle, Calendar } from "lucide-react";
import { useState } from "react";

export function StudentReports() {
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly");
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showStatusFilter, setShowStatusFilter] = useState(false);

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

  // Datos del estudiante
  const studentData = {
    name: "Juan Pérez",
    progress: 65,
    currentPhase: "Metodología",
    nextDeadline: "25/04/2023",
    daysRemaining: 7,
    thesis:
      "Implementación de algoritmos de machine learning para detección de fraudes",
    area: "Inteligencia Artificial",
    advisor: {
      name: "Dr. Carlos Rodríguez",
      department: "Departamento de Ciencias de la Computación",
      lastMeeting: "01/04/2023",
    },
    coAdvisor: {
      name: "Mg. María Sánchez",
      department: "Departamento de Ingeniería de Software",
    },
  };

  const timelineEvents = [
    {
      date: "15/01/2023",
      event: "Propuesta de proyecto aprobada",
      status: "Completado",
    },
    {
      date: "30/01/2023",
      event: "Asignación de asesor: Dr. Rodríguez",
      status: "Completado",
    },
    {
      date: "15/02/2023",
      event: "Plan de trabajo aprobado",
      status: "Completado",
    },
    {
      date: "01/03/2023",
      event: "Primera reunión con asesor",
      status: "Completado",
    },
    {
      date: "15/03/2023",
      event: "Entrega parcial de marco teórico",
      status: "Completado",
    },
    {
      date: "30/03/2023",
      event: "Revisión de marco teórico",
      status: "En progreso",
    },
    {
      date: "15/04/2023",
      event: "Entrega de metodología",
      status: "Pendiente",
      isLate: true,
    },
    {
      date: "30/04/2023",
      event: "Revisión de metodología",
      status: "Pendiente",
    },
    {
      date: "15/05/2023",
      event: "Avance de implementación",
      status: "Pendiente",
    },
    {
      date: "30/05/2023",
      event: "Revisión de implementación",
      status: "Pendiente",
    },
    { date: "15/06/2023", event: "Entrega de resultados", status: "Pendiente" },
    {
      date: "30/06/2023",
      event: "Revisión de resultados",
      status: "Pendiente",
    },
    { date: "15/07/2023", event: "Documento final", status: "Pendiente" },
    { date: "30/07/2023", event: "Defensa de proyecto", status: "Pendiente" },
  ].map((event) => {
    // Convertir fecha de string a objeto Date
    const eventDate = parseISO(
      `${event.date.split("/").reverse().join("-")}T00:00:00`,
    );

    // Calcular días restantes
    const daysRemaining = Math.ceil(
      (eventDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Determinar si está en riesgo (menos de 3 días para completar y no está completado ni en progreso)
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
    const eventDate = parseISO(
      `${event.date.split("/").reverse().join("-")}T00:00:00`,
    );

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
      case "all":
      default:
        return true;
    }
  });

  // Filtrar eventos por estado
  const filteredEvents = filteredByTime.filter((event) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "completed" && event.status === "Completado")
      return true;
    if (statusFilter === "inProgress" && event.status === "En progreso")
      return true;
    if (
      statusFilter === "pending" &&
      event.status === "Pendiente" &&
      !event.isLate &&
      !event.isAtRisk
    )
      return true;
    if (statusFilter === "late" && event.isLate) return true;
    if (statusFilter === "atRisk" && event.isAtRisk) return true;
    return false;
  });

  // Calcular progreso general
  const completedEvents = timelineEvents.filter(
    (event) => event.status === "Completado",
  ).length;
  const totalEvents = timelineEvents.length;
  const overallProgress = Math.round((completedEvents / totalEvents) * 100);

  // Verificar si hay entregas retrasadas
  const lateDeliveries = pendingDeliveries.filter(
    (delivery) => delivery.isLate,
  );
  const hasLateDeliveries = lateDeliveries.length > 0;

  // Función para manejar el clic en el botón de filtro por estado
  const handleStatusFilterClick = () => {
    setShowStatusFilter(!showStatusFilter);
  };

  return (
    <div className="space-y-6">
      {/* Alerta de entregas retrasadas */}
      {hasLateDeliveries && (
        <Alert
          variant="destructive"
          className="bg-red-50 border-red-200 text-red-800"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Entregas pendientes con retraso</AlertTitle>
          <AlertDescription>
            Tienes {lateDeliveries.length} entrega(s) con retraso. La entrega de{" "}
            <b>{lateDeliveries[0].name}</b> debió presentarse el{" "}
            {lateDeliveries[0].dueDate} ({lateDeliveries[0].daysLate} días de
            retraso). Por favor, contacta a tu asesor lo antes posible.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Programar Reportes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Programar Envío de Reportes</DialogTitle>
              <DialogDescription>
                Configura la frecuencia con la que deseas recibir reportes
                automáticos en tu correo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Frecuencia de envío
                </label>
                <Select
                  value={scheduleFrequency}
                  onValueChange={setScheduleFrequency}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diario</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Formato de reporte
                </label>
                <Select defaultValue="pdf">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue="usuario@pucp.edu.pe"
                  readOnly
                />
              </div>
              <Button className="w-full mt-4">Guardar configuración</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Estado actual del estudiante - Lado izquierdo */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg">Estado Actual</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex items-start gap-4">
              <div className="relative h-16 w-16 flex-shrink-0">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200">
                  <div
                    className="absolute inset-0 rounded-full border-4 border-t-transparent"
                    style={{
                      borderTopColor: "transparent",
                      borderRightColor: `${studentData.progress < 30
                          ? "#ef4444"
                          : studentData.progress < 70
                            ? "#eab308"
                            : "#22c55e"
                        }`,
                      borderBottomColor: `${studentData.progress < 30
                          ? "#ef4444"
                          : studentData.progress < 70
                            ? "#eab308"
                            : "#22c55e"
                        }`,
                      borderLeftColor: `${studentData.progress < 30
                          ? "#ef4444"
                          : studentData.progress < 70
                            ? "#eab308"
                            : "#22c55e"
                        }`,
                      transform: `rotate(${studentData.progress * 3.6}deg)`,
                    }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {studentData.progress}%
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-medium">{studentData.name}</h3>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Fase actual:</p>
                    <p className="text-sm font-medium">
                      {studentData.currentPhase}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fecha límite:</p>
                    <p className="text-sm font-medium">
                      {studentData.nextDeadline}
                    </p>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progreso general</span>
                    <span>{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-1.5" />
                  <p className="text-xs text-gray-500 mt-1">
                    {completedEvents} de {totalEvents} etapas completadas
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen de proyecto - Lado derecho */}
        <Card>
          <CardHeader className="py- pb-1">
            <CardTitle className="text-lg">Resumen de Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="space-y-2">
              <div>
                <h3 className="text-xs text-gray-500">
                  Proyecto de Fin de Carrera:
                </h3>
                <p className="text-sm font-medium line-clamp-2">
                  {studentData.thesis}
                </p>
                <div className="mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#006699] text-white">
                    {studentData.area}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h3 className="text-xs text-gray-500 mb-1">
                      Asesor principal:
                    </h3>
                    <p className="text-sm font-medium">
                      {studentData.advisor.name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs text-gray-500 mb-1">Co-asesor:</h3>
                    <p className="text-sm font-medium">
                      {studentData.coAdvisor.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Avances y Entregas</CardTitle>
          <div className="flex items-center gap-2">
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

            <div className="relative">
              <Button variant="outline" onClick={handleStatusFilterClick}>
                Filtrar por estado
              </Button>
              {showStatusFilter && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border">
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
                        variant={
                          statusFilter === "completed" ? "default" : "outline"
                        }
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
                        variant={
                          statusFilter === "inProgress" ? "default" : "outline"
                        }
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
                        variant={
                          statusFilter === "pending" ? "default" : "outline"
                        }
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
                        variant={
                          statusFilter === "late" ? "default" : "outline"
                        }
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          setStatusFilter("late");
                          setShowStatusFilter(false);
                        }}
                      >
                        Retrasado
                      </Button>
                      <Button
                        variant={
                          statusFilter === "atRisk" ? "default" : "outline"
                        }
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          setStatusFilter("atRisk");
                          setShowStatusFilter(false);
                        }}
                      >
                        En riesgo
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative border-l border-gray-200 ml-3 pl-8 space-y-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <div key={index} className="relative">
                  <div
                    className={`absolute -left-10 mt-1.5 h-4 w-4 rounded-full border ${event.status === "Completado"
                        ? "bg-green-500 border-green-500"
                        : event.status === "En progreso"
                          ? "bg-blue-500 border-blue-500"
                          : event.isLate
                            ? "bg-red-500 border-red-500"
                            : event.isAtRisk
                              ? "bg-yellow-500 border-yellow-500"
                              : "bg-gray-300 border-gray-300"
                      }`}
                  ></div>
                  <div>
                    <time className="mb-1 text-xs font-normal text-gray-500">
                      {event.date}
                    </time>
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
                      className={`text-xs ${event.status === "Completado"
                          ? "text-green-600"
                          : event.status === "En progreso"
                            ? "text-blue-600"
                            : event.isLate
                              ? "text-red-600"
                              : event.isAtRisk
                                ? "text-yellow-600"
                                : "text-gray-600"
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
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDays, isBefore, parseISO } from "date-fns";
import { ModalProgramarReporte } from "../components/general/modal-programar";
import { LineaTiempoReporte } from "../components/general/linea-tiempo";
export function StudentReports() {

  

  // Datos de entregas con estado de retraso
  const pendingDeliveries = [
    {
      name: "Metodología",
      dueDate: "15/04/2023",
      isLate: true,
      daysLate: 3,
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
        // Convertir fecha de string a objeto Date
        const eventDate = parseISO(`${event.date.split("/").reverse().join("-")}T00:00:00`);

        // Calcular días restantes
        const currentDate = new Date("2023-04-18");
        const daysRemaining = Math.ceil((eventDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

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
  
  // Calcular progreso general
      const completedEvents = timelineEvents.filter((event) => event.status === "Completado").length;
      const totalEvents = timelineEvents.length;
  const overallProgress = Math.round((completedEvents / totalEvents) * 100);
  // Datos del estudiante
  const studentData = {
    name: "Juan Pérez",
    progress: 65,
    currentPhase: "Metodología",
    nextDeadline: "25/04/2023",
    daysRemaining: 7,
    thesis: "Implementación de algoritmos de machine learning para detección de fraudes",
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

  

  // Filtrar eventos por tiempo
  

  return (
    <div className="space-y-6">
      {/* Alerta de entregas retrasadas */}
      {/*hasLateDeliveries && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Entregas pendientes con retraso</AlertTitle>
          <AlertDescription>
            Tienes {lateDeliveries.length} entrega(s) con retraso. La entrega de <b>{lateDeliveries[0].name}</b> debió
            presentarse el {lateDeliveries[0].dueDate} ({lateDeliveries[0].daysLate} días de retraso). Por favor,
            contacta a tu asesor lo antes posible.
          </AlertDescription>
        </Alert>
      )*/}

      <ModalProgramarReporte />

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
                      borderRightColor: `${
                        studentData.progress < 30 ? "#ef4444" : studentData.progress < 70 ? "#eab308" : "#22c55e"
                      }`,
                      borderBottomColor: `${
                        studentData.progress < 30 ? "#ef4444" : studentData.progress < 70 ? "#eab308" : "#22c55e"
                      }`,
                      borderLeftColor: `${
                        studentData.progress < 30 ? "#ef4444" : studentData.progress < 70 ? "#eab308" : "#22c55e"
                      }`,
                      transform: `rotate(${studentData.progress * 3.6}deg)`,
                    }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">{studentData.progress}%</span>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-medium">{studentData.name}</h3>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Fase actual:</p>
                    <p className="text-sm font-medium">{studentData.currentPhase}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fecha límite:</p>
                    <p className="text-sm font-medium">{studentData.nextDeadline}</p>
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
          <CardHeader className="py-3">
            <CardTitle className="text-lg">Resumen de Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-3">
              <div>
                <h3 className="text-xs text-gray-500">Proyecto de Fin de Carrera:</h3>
                <p className="text-sm font-medium line-clamp-2">{studentData.thesis}</p>
                <div className="mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#006699] text-white">{studentData.area}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h3 className="text-xs text-gray-500 mb-1">Asesor principal:</h3>
                    <p className="text-sm font-medium">{studentData.advisor.name}</p>
                  </div>
                  <div>
                    <h3 className="text-xs text-gray-500 mb-1">Co-asesor:</h3>
                    <p className="text-sm font-medium">{studentData.coAdvisor.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <LineaTiempoReporte />
    </div>
  );
}

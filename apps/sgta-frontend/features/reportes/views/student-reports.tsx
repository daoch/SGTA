"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { LineaTiempoReporte } from "../components/general/linea-tiempo";
import { ModalProgramarReporte } from "../components/general/modal-programar";
import { obtenerDetalleTemaAlumno } from "../services/report-services";
import { AlumnoTemaDetalle } from "../types/Alumno.type";

import { useAuth } from "@/features/auth/hooks/use-auth";

export function StudentReports() {
  const [studentData, setStudentData] = useState<AlumnoTemaDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) return;
      try {
        // TODO: Reemplazar con el ID real del usuario logueado
        const data = await obtenerDetalleTemaAlumno(7);
        setStudentData(data);
      } catch (error) {
        console.error("Error al obtener datos del alumno:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  
  if (!user) {
    return <div>Cargando...</div>;
  }
  
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
          
        </Card>

         {/* Resumen de proyecto - Lado derecho */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg">Resumen de Proyecto</CardTitle>
          </CardHeader>
        </Card> 
        
         
         
        
      </div>

      {/* Línea de tiempo */}
      <LineaTiempoReporte user={user} />
    </div>
  );
}

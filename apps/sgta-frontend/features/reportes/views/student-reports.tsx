"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
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
        const data = await obtenerDetalleTemaAlumno();
        setStudentData(data);
      } catch (error) {
        console.error("Error al obtener datos del alumno:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  if (!user || isLoading || !studentData) {
    return <div>Cargando...</div>;
  }

  

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
                        studentData.porcentajeProgreso < 30
                          ? "#ef4444"
                          : studentData.porcentajeProgreso < 70
                          ? "#eab308"
                          : "#22c55e"
                      }`,
                      borderBottomColor: `${
                        studentData.porcentajeProgreso < 30
                          ? "#ef4444"
                          : studentData.porcentajeProgreso < 70
                          ? "#eab308"
                          : "#22c55e"
                      }`,
                      borderLeftColor: `${
                        studentData.porcentajeProgreso < 30
                          ? "#ef4444"
                          : studentData.porcentajeProgreso < 70
                          ? "#eab308"
                          : "#22c55e"
                      }`,
                      transform: `rotate(${studentData.porcentajeProgreso * 3.6}deg)`,
                    }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">{studentData.porcentajeProgreso}%</span>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-medium">{studentData.temaNombre}</h3>
                <p className="text-xs text-gray-500 mt-1">
                    {studentData.entregablesEnviados} de {studentData.totalEntregables} entregables completados
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Siguiente entregable:</p>
                    <p className="text-sm font-medium">{studentData.siguienteEntregableNombre}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fecha límite:</p>
                    <p className="text-sm font-medium">
                      {studentData.siguienteEntregableFechaFin ? 
                        format(new Date(studentData.siguienteEntregableFechaFin), "dd/MM/yyyy") : 
                        "No hay fecha límite"}
                    </p>
                  </div>
                </div>

                {/*<div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progreso general</span>
                    <span>{studentData.porcentajeProgreso}%</span>
                  </div>
                  <Progress value={studentData.porcentajeProgreso} className="h-1.5" />
                  <p className="text-xs text-gray-500 mt-1">
                    {studentData.entregablesEnviados} de {studentData.totalEntregables} entregables completados
                  </p>
                </div>*/}
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
                <p className="text-sm font-medium line-clamp-2">{studentData.temaNombre}</p>
                <div className="mt-1 flex gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#006699] text-white">{studentData.areaNombre}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#0088cc] text-white">{studentData.subAreaNombre}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h3 className="text-xs text-gray-500 mb-1">Asesor principal:</h3>
                    <p className="text-sm font-medium">{studentData.asesorNombre}</p>
                  </div>
                  <div>
                    <h3 className="text-xs text-gray-500 mb-1">Co-asesor:</h3>
                    <p className="text-sm font-medium">{studentData.coasesorNombre}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> 
         
         
        
      </div>

      {/* Línea de tiempo */}
      <LineaTiempoReporte user={user} />
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useEffect, useState } from "react";

import { obtenerDetalleTemaAlumno, obtenerEntregablesConRetraso } from "../services/report-services";

import { AlumnoTemaDetalle } from "../types/Alumno.type";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { AlertTriangle } from "lucide-react";
import { LineaTiempoReporte } from "../components/general/linea-tiempo";
import { OverdueSummary } from "../types/OverdueSummary.type";

const getProgressColor = (progreso: number) => {
  if (progreso < 30) return "#ef4444";
  if (progreso < 70) return "#eab308";
  return "#22c55e";
};

export function StudentReports() {
  const [studentData, setStudentData] = useState<AlumnoTemaDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [overdueSummary, setOverdueSummary] = useState<OverdueSummary | null>(null);
  const [hasError, setHasError] = useState(false); // Nuevo estado para error
  const { user } = useAuth();

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) return;
      try {
        const data = await obtenerDetalleTemaAlumno();
        setStudentData(data);
        setHasError(false);
      } catch (error) {
        setHasError(true); 
        setStudentData(null);
        console.error("Error al obtener datos del alumno:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchOverdueSummary = async () => {
      const data = await obtenerEntregablesConRetraso();
      setOverdueSummary(data);
    };
    
    fetchStudentData();
    fetchOverdueSummary();
  }, [user]);

  if (!user || isLoading) {
    return <div>Cargando...</div>;
  }

  if (hasError || !studentData) {
    return <div>El alumno aun no tiene un tema de tesis asociado</div>;
  }

  return (
    <div className="space-y-6">
      {/* Alerta de entregas retrasadas */}
      {overdueSummary && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Entregas pendientes con retraso</AlertTitle>
          <AlertDescription>
            {overdueSummary.mensajes[0]}
          </AlertDescription>
        </Alert>
      )}


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
                      borderRightColor: getProgressColor(studentData.porcentajeProgreso),
                      borderBottomColor: getProgressColor(studentData.porcentajeProgreso),
                      borderLeftColor: getProgressColor(studentData.porcentajeProgreso),
                      transform: `rotate(${studentData.porcentajeProgreso * 3.6}deg)`,
                    }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">{Math.round(studentData.porcentajeProgreso)}%</span>
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
      {user && <LineaTiempoReporte user={user} />}
    </div>
  );
}

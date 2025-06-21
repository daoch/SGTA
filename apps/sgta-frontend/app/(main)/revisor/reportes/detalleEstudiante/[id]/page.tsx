"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {  ArrowLeft, Check, Clock, User } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

import { LineaTiempoReporte } from "@/features/reportes/components/general/linea-tiempo";
import { findStudentsForReviewer } from "@/features/reportes/services/report-services";
import { AlumnoReviewer } from "@/features/reportes/types/Alumno.type";
import { getEntregablesAlumnoSeleccionado } from "@/features/reportes/services/report-services";

interface Entregable {
  esEvaluable: boolean;
  estadoEntregable: string;
  estadoXTema: string;
}


//export function ReviewerStudentDetails({ studentId }: { studentId: number }) {
//export function ReviewerStudentDetails(){
export default function ReviewerStudentDetails({ params }: { params: Promise<{ id: string }> }) {
  const [students, setStudents] = useState<AlumnoReviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [entregablesEvaluables, setEntregablesEvaluables] = useState<number>(0);
  const [loadingEntregablesEvaluables, setLoadingEntregablesEvaluables] = useState<boolean>(true);
  const [conteoEstados, setConteoEstados] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  //const params = useParams();
  //const studentId = Number(params.studentId);

  const { id } = use(params);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const data: AlumnoReviewer[] = await findStudentsForReviewer(searchQuery);
        setStudents(data);
      } catch (error) {
        console.error("Error loading students:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [searchQuery]);


  //const selectedStudentData = students.find((student) => student.usuarioId === studentId);
  const selectedStudentData = students.find((student) => student.usuarioId === parseInt(id));
  console.log("ID del estudiante:", selectedStudentData?.usuarioId);
  ///const selectedStudentData = students.find((student) => student.usuarioId === studentId);

  useEffect(() => {
    if (!selectedStudentData?.usuarioId) return;

    const fetchEntregables = async () => {
      setLoadingEntregablesEvaluables(true);

      try {
        const entregables = await getEntregablesAlumnoSeleccionado(
          selectedStudentData.usuarioId
        );

        // 1. Nos quedamos solo con los evaluables
        const evaluables = (entregables as Entregable[]).filter((e) => e.esEvaluable === true);
        setEntregablesEvaluables(evaluables.length);

        // 2. Conteo por estadoEntregable y estadoXTema
        const counts: Record<string, number> = {};
        evaluables.forEach((e) => {
          counts[e.estadoEntregable] = (counts[e.estadoEntregable] || 0) + 1;
          counts[e.estadoXTema]     = (counts[e.estadoXTema]     || 0) + 1;
        });
        setConteoEstados(counts);

        console.log("Conteo por estado:", counts);
      } catch (error) {
        console.error("Error al obtener entregables del estudiante:", error);
      } finally {
        setLoadingEntregablesEvaluables(false);
      }
    };

    fetchEntregables();
  }, [selectedStudentData?.usuarioId]);


   


  if (loading) {
    return <div>Cargando estudiantes...</div>;
  }

  

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="flex items-center gap-2 mt-5 mb-4">
        <Link
          href="/revisor/reportes"
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
        >
          <ArrowLeft size={11} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#002855]">Detalles de Entregas</h1>
          <p className="text-gray-600">Revisor - Seguimiento de progreso del estudiante</p>
        </div>
      </div>

      {/* Información del estudiante */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-[#002855] flex items-center justify-center text-white flex-shrink-0">
                  <User className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedStudentData?.nombres} {selectedStudentData?.primerApellido} {selectedStudentData?.segundoApellido}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {/* <Badge variant="outline" className="text-xs">
                        <p> Area hardcodeada</p>
                    </Badge> */}
                    {/* <span className="ml-2 text-xs text-gray-500">{selectedStudentData?.estado}</span> */}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Título del Proyecto:</h3>
                  <p className="text-base text-gray-900">{selectedStudentData?.temaTitulo}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Asesor:</h3>
                    <p className="text-base text-gray-900">{selectedStudentData?.asesor}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Estadísticas del lado derecho */}
            <div className="lg:w-80 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#002855]">{student.progreso ?? 0}%</div>
                  <div className="text-sm text-gray-600">Progreso</div>
                </div> */}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#006699]">
                    {/* Badge Total */}
                    <Badge variant="outline" className="text-sm">
                      {loadingEntregablesEvaluables
                        ? "Cargando..."
                        : `Entregables Total: ${entregablesEvaluables}`}
                    </Badge>

                    {/* Badges por estado (solo si hay conteo > 0) */}
                    {!loadingEntregablesEvaluables &&
                      Object.entries(conteoEstados)
                        .filter(([_, n]) => n > 0)
                        .map(([estado, n]) => (
                          <Badge
                            key={estado}
                            variant="outline"
                            className="text-xs"
                          >
                            {`${estado.replace(/_/g, " ")}: ${n}`}
                          </Badge>
                    ))}

                    {/* {student.entregablesCompletados ?? 0}/{student.entregablesTotales ?? 0} */}
                  </div>
                  <div className="text-sm text-gray-600">Entregables</div>
                </div>
              </div>
              {/* <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-blue-900">Información del Curso</span>
                </div>
                <p className="text-sm text-blue-800">{courseInfo[student.curso as keyof typeof courseInfo]?.name}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Total de {courseInfo[student.curso as keyof typeof courseInfo]?.deliverables} entregables programados
                </p>
              </div> */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de contenido */}
      <Card>
        <CardContent className="py-6">
          {user && (
            <LineaTiempoReporte
              selectedStudentId={selectedStudentData?.usuarioId ?? null}
              user={user}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );

}
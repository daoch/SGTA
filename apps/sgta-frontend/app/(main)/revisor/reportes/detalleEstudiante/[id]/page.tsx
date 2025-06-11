"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { AlertCircle, ArrowLeft, Check, Clock, User } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

import { ConsolidatedView } from "@/features/reportes/components/consolidated-view";
import { LineaTiempoReporte } from "@/features/reportes/components/general/linea-tiempo";
import { findStudentsForReviewer } from "@/features/reportes/services/report-services";
import { AlumnoReviewer } from "@/features/reportes/types/Alumno.type";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completado":
    case "Aprobado":
      return "bg-green-100 text-green-800 border-green-200";
    case "En progreso":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Retrasado":
      return "bg-red-100 text-red-800 border-red-200";
    case "En riesgo":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Aprobado con observaciones":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "En revisión":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completado":
    case "Aprobado":
      return <Check className="h-3 w-3" />;
    case "En progreso":
    case "En revisión":
      return <Clock className="h-3 w-3" />;
    case "Retrasado":
    case "En riesgo":
    case "Aprobado con observaciones":
      return <AlertCircle className="h-3 w-3" />;
    default:
      return null;
  }
};

const courseInfo = {
  PFC1: { name: "Proyecto de Fin de Carrera 1", deliverables: 4 },
  PFC2: { name: "Proyecto de Fin de Carrera 2", deliverables: 3 },
};

//export function ReviewerStudentDetails({ studentId }: { studentId: number }) {
//export function ReviewerStudentDetails(){
export default function ReviewerStudentDetails({ params }: { params: Promise<{ id: string }> }) {
  const [selectedStudent, setSelectedStudent] = useState<number>(0);
  const [students, setStudents] = useState<AlumnoReviewer[]>([]);
  const [student, setStudent] = useState<number>(0);
  const [loading, setLoading] = useState(true);
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
  ///const selectedStudentData = students.find((student) => student.usuarioId === studentId);

   


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
                    <Badge variant="outline" className="text-xs">
                        <p> Area hardcodeada</p>
                    </Badge>
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
                    <Badge variant="outline" className="text-sm">
                      Entregables: 0
                    </Badge>
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
        <CardContent>
          <Tabs defaultValue="timeline">
            <TabsList className="mb-4">
              <TabsTrigger value="timeline">Historial Cronológico</TabsTrigger>
              <TabsTrigger value="consolidated">Reporte Consolidado</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
                {user && (
                  <LineaTiempoReporte
                    selectedStudentId={selectedStudentData?.usuarioId ?? null}
                    user={user}
                  />
                )}
            </TabsContent>
            <TabsContent value="consolidated">
              <ConsolidatedView studentId={selectedStudentData?.usuarioId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

}
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { SeleccionarEstudianteModal } from "../components/general/modal-seleccionar-estudiante";
import { findStudentsForReviewer } from "../services/report-services";
import { AlumnoReviewer } from "../types/Alumno.type";
import { ConsolidatedView } from "../components/consolidated-view";


export function ReviewerReports() {
  const [selectedStudent, setSelectedStudent] = useState<number>(0);
  const [students, setStudents] = useState<AlumnoReviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const data: AlumnoReviewer[] = await findStudentsForReviewer(1, searchQuery);
        
        setStudents(data);
      } catch (error) {
        console.error("Error loading students:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [searchQuery]);

  const selectedStudentData = students.find((student) => student.usuarioId === selectedStudent);

  if (loading) {
    return <div>Cargando estudiantes...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Seleccionar Estudiante</CardTitle>
        </CardHeader>
        <CardContent>
          <SeleccionarEstudianteModal
            students={students}
            selectedStudentId={selectedStudent}
            onSelect={setSelectedStudent}
          />
        </CardContent>
      </Card>

      {selectedStudentData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{selectedStudentData.nombres + ' ' + selectedStudentData.primerApellido + ' ' + selectedStudentData.segundoApellido}</CardTitle>
            <p className="text-sm text-gray-500">{selectedStudentData.temaTitulo}</p>
            <p className="text-sm text-gray-500">Asesor: {selectedStudentData.asesor}</p>
            {selectedStudentData.coasesor && (
              <p className="text-sm text-gray-500">Coasesor: {selectedStudentData.coasesor}</p>
            )}
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="timeline">
              <TabsList className="mb-4">
                <TabsTrigger value="timeline">Historial Cronológico</TabsTrigger>
                <TabsTrigger value="consolidated">Reporte Consolidado</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline">
                {/* Timeline content will be implemented later */}
              </TabsContent>

              <TabsContent value="consolidated">
                <ConsolidatedView studentId={selectedStudent} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

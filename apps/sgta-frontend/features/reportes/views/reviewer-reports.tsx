"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { SeleccionarEstudianteModal } from "../components/general/modal-seleccionar-estudiante";
import { findStudentsForReviewer } from "../services/report-services";
import { AlumnoReviewer } from "../types/Alumno.type";


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
                {/* <div className="relative border-l border-gray-200 ml-3 pl-8 space-y-6">
                  {selectedStudentData.timeline.map((event, index) => (
                    <div key={index} className="relative">
                      <div
                        className={`absolute -left-10 mt-1.5 h-4 w-4 rounded-full border ${
                          event.status === "Aprobado"
                            ? "bg-green-500 border-green-500"
                            : event.status === "Aprobado con observaciones"
                              ? "bg-yellow-500 border-yellow-500"
                              : event.status === "En revisión"
                                ? "bg-blue-500 border-blue-500"
                                : "bg-gray-500 border-gray-500"
                        }`}
                      ></div>
                      <div>
                        <time className="mb-1 text-xs font-normal text-gray-500">{event.date}</time>
                        <h3 className="text-sm font-medium">{event.event}</h3>
                        <p
                          className={`text-xs ${
                            event.status === "Aprobado"
                              ? "text-green-600"
                              : event.status === "Aprobado con observaciones"
                                ? "text-yellow-600"
                                : event.status === "En revisión"
                                  ? "text-blue-600"
                                  : "text-gray-600"
                          }`}
                        >
                          {event.status}
                        </p>
                        <div className="flex items-center mt-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="px-2 h-6 text-xs">
                                <Eye className="h-3 w-3 mr-1" /> Ver detalle
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  {event.event} - {event.date}
                                </DialogTitle>
                                <DialogDescription>
                                  Estado:{" "}
                                  <span
                                    className={`inline-block rounded-full px-2 py-1 text-xs ${
                                      event.status === "Aprobado"
                                        ? "bg-green-100 text-green-800"
                                        : event.status === "Aprobado con observaciones"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {event.status}
                                  </span>
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2">Comentarios:</h4>
                                <p className="text-sm text-gray-700">{event.comments}</p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div> */}
              </TabsContent>

              <TabsContent value="consolidated">
                <div className="space-y-6">
                  {/* {selectedStudentData.deliverables.map((deliverable) => (
                    <Card key={deliverable.id} className="border-l-4 border-l-[#006699]">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{deliverable.title}</CardTitle>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              deliverable.status === "Aprobado"
                                ? "bg-green-100 text-green-800"
                                : deliverable.status === "Aprobado con observaciones"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {deliverable.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Fecha de entrega: {deliverable.date}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <h4 className="text-sm font-medium">Retroalimentación:</h4>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="px-2 h-7">
                                  <Eye className="h-4 w-4 mr-1" /> Ver detalle
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    {deliverable.title} - {deliverable.date}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Estado:{" "}
                                    <span
                                      className={`inline-block rounded-full px-2 py-1 text-xs ${
                                        deliverable.status === "Aprobado"
                                          ? "bg-green-100 text-green-800"
                                          : deliverable.status === "Aprobado con observaciones"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-blue-100 text-blue-800"
                                      }`}
                                    >
                                      {deliverable.status}
                                    </span>
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium mb-2">Retroalimentación completa:</h4>
                                  <p className="text-sm text-gray-700">{deliverable.feedback}</p>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          {deliverable.score !== null && (
                            <div>
                              <h4 className="text-sm font-medium">Calificación:</h4>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-full max-w-[200px] rounded-full bg-gray-200">
                                  <div
                                    className={`h-2 rounded-full ${
                                      deliverable.score < 11
                                        ? "bg-red-500"
                                        : deliverable.score < 14
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                    }`}
                                    style={{ width: `${(deliverable.score / 20) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{deliverable.score}/20</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))} */}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

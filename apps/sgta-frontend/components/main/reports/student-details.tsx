"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { advisorService, Meeting, StudentDetail, TimelineEvent } from "@/features/asesores/services/advisor-service";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Book, Calendar, Clock, Eye, Mail, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface StudentDetailsProps {
  studentId: string;
}

// Función auxiliar para formatear fechas
const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: es });
  } catch (error) {
    return "Fecha no disponible";
  }
};

// Función auxiliar para formatear hora
const formatTime = (timeString: string) => {
  try {
    return format(parseISO(`2000-01-01T${timeString}`), "HH:mm", { locale: es });
  } catch (error) {
    return timeString;
  }
};

export function StudentDetails({ studentId }: StudentDetailsProps) {
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("StudentId recibido:", studentId);

    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentData, timelineData, meetingsData] = await Promise.all([
          advisorService.getStudentDetails(studentId),
          advisorService.getStudentTimeline(studentId),
          advisorService.getStudentMeetings(studentId),
        ]);
        console.log("Datos recibidos:", { studentData, timelineData, meetingsData });
        setStudent(studentData);
        setTimeline(Array.isArray(timelineData) ? timelineData : []);
        setMeetings(Array.isArray(meetingsData) ? meetingsData : []);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setStudent(null);
        setTimeline([]);
        setMeetings([]);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchData();
    } else {
      console.error("No se recibió un studentId válido");
      setLoading(false);
    }
  }, [studentId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[200px]">
      <div className="text-lg">Cargando información del tesista...</div>
    </div>;
  }

  if (!student) {
    return <div className="flex justify-center items-center min-h-[200px]">
      <div className="text-lg text-red-600">No se encontró información del tesista</div>
    </div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/asesor/reportes/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Detalles del Tesista</h1>
        </div>
      </div>

      {/* Primera Card con información básica */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {`${student.nombres} ${student.primerApellido} ${student.segundoApellido}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Información Personal</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Código PUCP:</span>
                  <span className="text-sm font-medium">{student.codigoPucp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Correo:</span>
                  <span className="text-sm font-medium">{student.correoElectronico}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Nivel de Estudios:</span>
                  <span className="text-sm font-medium">{student.nivelEstudios}</span>
                </div>
              </div>
            </div>

            {/* Información del Tema */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Tema de Tesis</h3>
              <div className="space-y-2">
                <p className="text-sm font-medium">{student.tituloTema}</p>
                <p className="text-sm text-gray-600">{student.resumenTema}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {student.areaConocimiento}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {student.subAreaConocimiento}
                  </span>
                </div>
              </div>
            </div>

            {/* Información del Asesor */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Asesoría</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Asesor Principal:</span>
                  <p className="text-sm font-medium">{student.asesorNombre}</p>
                  <p className="text-sm text-gray-500">{student.asesorCorreo}</p>
                </div>
                {student.coasesorNombre && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">Co-asesor:</span>
                    <p className="text-sm font-medium">{student.coasesorNombre}</p>
                    <p className="text-sm text-gray-500">{student.coasesorCorreo}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Estado Actual */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Estado Actual</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Ciclo:</span>
                  <span className="text-sm font-medium">{student.cicloNombre}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Etapa:</span>
                  <span className="text-sm font-medium">{student.etapaFormativaNombre}</span>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-600">Fase Actual:</span>
                  <p className="text-sm font-medium mt-1">{student.faseActual}</p>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        student.entregableActividadEstado === "completado"
                          ? "bg-green-100 text-green-800"
                          : student.entregableActividadEstado === "en_proceso"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {student.entregableActividadEstado === "completado"
                        ? "Completado"
                        : student.entregableActividadEstado === "en_proceso"
                        ? "En Proceso"
                        : "No Iniciado"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs para Entregas, Timeline y Reuniones */}
      <Tabs defaultValue="deliveries">
        <TabsList className="my-4">
          <TabsTrigger value="deliveries">Entregas</TabsTrigger>
          <TabsTrigger value="timeline">Línea de tiempo</TabsTrigger>
          <TabsTrigger value="meetings">Reuniones</TabsTrigger>
        </TabsList>

        <TabsContent value="deliveries">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Entregas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-4 border-b bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500">
                  <div>Fecha límite</div>
                  <div>Entrega</div>
                  <div>Estado</div>
                  <div>Acciones</div>
                </div>
                {timeline.map((event) => (
                  <div key={event.hitoId} className="grid grid-cols-4 border-b px-4 py-3 text-sm last:border-0">
                    <div>{formatDate(event.fechaFin)}</div>
                    <div>{event.nombre}</div>
                    <div>
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs ${
                          event.entregableEnvioEstado === "enviado_a_tiempo"
                            ? "bg-green-100 text-green-800"
                            : event.entregableEnvioEstado === "enviado_tarde"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {event.entregableEnvioEstado === "enviado_a_tiempo"
                          ? "Enviado a tiempo"
                          : event.entregableEnvioEstado === "enviado_tarde"
                          ? "Enviado tarde"
                          : "No enviado"}
                      </span>
                    </div>
                    <div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="px-2 h-7">
                            <Eye className="h-4 w-4 mr-1" /> Ver detalle
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{event.nombre}</DialogTitle>
                            <DialogDescription>
                              Fecha límite: {formatDate(event.fechaFin)}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4 space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Descripción:</h4>
                              <p className="text-sm text-gray-700">{event.descripcion}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Periodo de desarrollo:</h4>
                              <p className="text-sm text-gray-700">
                                {formatDate(event.fechaInicio)} - {formatDate(event.fechaFin)}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Estado de la actividad:</h4>
                              <span
                                className={`inline-block rounded-full px-2 py-1 text-xs ${
                                  event.entregableActividadEstado === "completado"
                                    ? "bg-green-100 text-green-800"
                                    : event.entregableActividadEstado === "en_proceso"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {event.entregableActividadEstado === "completado"
                                  ? "Completado"
                                  : event.entregableActividadEstado === "en_proceso"
                                  ? "En proceso"
                                  : "No iniciado"}
                              </span>
                            </div>
                            {event.esEvaluable && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  Entrega evaluable
                                </span>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Línea de Tiempo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-gray-200 ml-3 pl-8 space-y-6">
                {timeline.map((event) => (
                  <div key={event.hitoId} className="relative">
                    <div
                      className={`absolute -left-10 mt-1.5 h-4 w-4 rounded-full border ${
                        event.entregableEnvioEstado === "enviado_a_tiempo"
                          ? "bg-green-500 border-green-500"
                          : event.entregableEnvioEstado === "enviado_tarde"
                          ? "bg-yellow-500 border-yellow-500"
                          : "bg-red-500 border-red-500"
                      }`}
                    ></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <time className="mb-1 text-xs font-normal text-gray-500">
                          {formatDate(event.fechaInicio)} - {formatDate(event.fechaFin)}
                        </time>
                        {event.esEvaluable && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Evaluable
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-medium">{event.nombre}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.descripcion}</p>
                      <div className="flex gap-2 mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            event.entregableEnvioEstado === "enviado_a_tiempo"
                              ? "bg-green-100 text-green-800"
                              : event.entregableEnvioEstado === "enviado_tarde"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {event.entregableEnvioEstado === "enviado_a_tiempo"
                            ? "Enviado a tiempo"
                            : event.entregableEnvioEstado === "enviado_tarde"
                            ? "Enviado tarde"
                            : "No enviado"}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            event.entregableActividadEstado === "completado"
                              ? "bg-green-100 text-green-800"
                              : event.entregableActividadEstado === "en_proceso"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {event.entregableActividadEstado === "completado"
                            ? "Completado"
                            : event.entregableActividadEstado === "en_proceso"
                            ? "En proceso"
                            : "No iniciado"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Reuniones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-4 border-b bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500">
                  <div>Fecha</div>
                  <div>Duración</div>
                  <div>Estado</div>
                  <div>Notas</div>
                </div>
                {meetings.map((meeting, index) => (
                  <div key={index} className="grid grid-cols-4 border-b px-4 py-3 text-sm last:border-0">
                    <div>{meeting.fecha ? formatDate(meeting.fecha) : "Fecha pendiente"}</div>
                    <div>{meeting.duracion || "Por definir"}</div>
                    <div>
                      <span className="inline-block rounded-full px-2 py-1 text-xs bg-yellow-100 text-yellow-800">
                        Programada
                      </span>
                    </div>
                    <div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="px-2 h-7">
                            <Eye className="h-4 w-4 mr-1" /> Ver detalle
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detalles de la Reunión</DialogTitle>
                            <DialogDescription>
                              {meeting.fecha ? formatDate(meeting.fecha) : "Fecha pendiente"} | {meeting.duracion}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Notas:</h4>
                            <p className="text-sm text-gray-700">{meeting.notas || "Sin notas"}</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
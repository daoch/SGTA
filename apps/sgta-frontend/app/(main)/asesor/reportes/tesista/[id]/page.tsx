"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function TesistaDetailPage() {
  const params = useParams();
  const studentId = params.id as string;

  // Datos simulados del estudiante
  const student = {
    id: studentId,
    name: "Ana Martínez",
    thesis:
      "Implementación de algoritmos de machine learning para detección de fraudes",
    progress: 75,
    status: "En progreso",
    currentPhase: "Avance de implementación",
    nextDeadline: "25/04/2023",
    deliveries: [
      {
        date: "15/01/2023",
        title: "Propuesta",
        status: "Aprobado",
        comments:
          "Buen trabajo, continuar con el desarrollo. La propuesta está bien estructurada y el tema es relevante. Se recomienda acotar un poco más el alcance para asegurar que sea factible en el tiempo disponible. Los objetivos están claros y la justificación es adecuada.",
      },
      {
        date: "28/02/2023",
        title: "Marco teórico",
        status: "Aprobado",
        comments:
          "Incluir más referencias recientes. El marco teórico es sólido pero podría beneficiarse de literatura más actual (últimos 2-3 años). Las definiciones son claras y la estructura es coherente. Revisar la sección 3.2 para mayor claridad.",
      },
      {
        date: "15/03/2023",
        title: "Metodología",
        status: "Aprobado",
        comments:
          "Metodología bien definida. Los métodos seleccionados son apropiados para los objetivos planteados. El diseño experimental es robusto y la selección de variables es adecuada. Considerar incluir más detalles sobre el proceso de validación.",
      },
      {
        date: "10/04/2023",
        title: "Avance de implementación",
        status: "En revisión",
        comments:
          "Pendiente de revisión. El documento fue recibido y será evaluado en los próximos días. Se notificará cuando la revisión esté completa.",
      },
    ],
    daysToNextDelivery: 5,
    area: "Inteligencia Artificial",
    advisor: "Dr. Rodríguez",
    coAdvisor: "Dra. Sánchez",
    startDate: "15/01/2023",
    expectedEndDate: "30/07/2023",
    meetings: [
      {
        date: "01/02/2023",
        duration: "1 hora",
        notes: "Revisión de propuesta y definición de alcance",
      },
      {
        date: "15/02/2023",
        duration: "45 minutos",
        notes: "Discusión de metodología y fuentes bibliográficas",
      },
      {
        date: "01/03/2023",
        duration: "1 hora",
        notes: "Revisión de avance de marco teórico",
      },
      {
        date: "15/03/2023",
        duration: "30 minutos",
        notes: "Feedback sobre marco teórico y siguientes pasos",
      },
      {
        date: "01/04/2023",
        duration: "1 hora",
        notes: "Revisión de metodología y planificación de implementación",
      },
    ],
    nextMeeting: "25/04/2023",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/asesor/reportes/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Detalles del Tesista</h1>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-block px-3 py-1 text-sm rounded-full ${
              student.daysToNextDelivery < 0
                ? "bg-red-100 text-red-800"
                : student.daysToNextDelivery < 3
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
            }`}
          >
            {student.daysToNextDelivery < 0
              ? `Retrasado (${Math.abs(student.daysToNextDelivery)} días)`
              : student.daysToNextDelivery < 3
                ? `En riesgo (${student.daysToNextDelivery} días)`
                : "En progreso"}
          </span>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-[#002855] flex items-center justify-center text-white">
                  <span className="text-lg font-medium">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{student.name}</h2>
                  <p className="text-gray-600">Proyecto de Fin de Carrera</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Título del Proyecto:
                  </h3>
                  <p className="text-base">{student.thesis}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Área:</h3>
                    <p className="text-base">{student.area}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Fase actual:
                    </h3>
                    <p className="text-base">{student.currentPhase}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Asesor:
                    </h3>
                    <p className="text-base">{student.advisor}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Co-asesor:
                    </h3>
                    <p className="text-base">{student.coAdvisor}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Fecha de inicio:
                    </h3>
                    <p className="text-base">{student.startDate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Fecha estimada de fin:
                    </h3>
                    <p className="text-base">{student.expectedEndDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-64 flex flex-col items-center justify-center">
              <div className="relative h-40 w-40">
                <div className="absolute inset-0 rounded-full border-8 border-gray-200">
                  <div
                    className="absolute inset-0 rounded-full border-8 border-t-transparent"
                    style={{
                      borderTopColor: "transparent",
                      borderRightColor: `${
                        student.progress < 30
                          ? "#ef4444"
                          : student.progress < 70
                            ? "#eab308"
                            : "#22c55e"
                      }`,
                      borderBottomColor: `${
                        student.progress < 30
                          ? "#ef4444"
                          : student.progress < 70
                            ? "#eab308"
                            : "#22c55e"
                      }`,
                      borderLeftColor: `${
                        student.progress < 30
                          ? "#ef4444"
                          : student.progress < 70
                            ? "#eab308"
                            : "#22c55e"
                      }`,
                      transform: `rotate(${student.progress * 3.6}deg)`,
                    }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">
                    {student.progress}%
                  </span>
                  <span className="text-sm text-gray-500">Progreso</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm font-medium">Próxima entrega:</p>
                <p className="text-base">{student.nextDeadline}</p>
                <p className="text-sm text-gray-500">
                  {student.daysToNextDelivery < 0
                    ? `${Math.abs(student.daysToNextDelivery)} días de retraso`
                    : `${student.daysToNextDelivery} días restantes`}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="deliveries">
        <TabsList className="mb-4">
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
                  <div>Fecha</div>
                  <div>Entrega</div>
                  <div>Estado</div>
                  <div>Comentarios</div>
                </div>
                {student.deliveries.map((delivery, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 border-b px-4 py-3 text-sm last:border-0"
                  >
                    <div>{delivery.date}</div>
                    <div>{delivery.title}</div>
                    <div>
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs ${
                          delivery.status === "Aprobado"
                            ? "bg-green-100 text-green-800"
                            : delivery.status === "En revisión"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {delivery.status}
                      </span>
                    </div>
                    <div className="text-gray-600">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 h-7"
                          >
                            <Eye className="h-4 w-4 mr-1" /> Ver detalle
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {delivery.title} - {delivery.date}
                            </DialogTitle>
                            <DialogDescription>
                              Estado:{" "}
                              <span
                                className={`inline-block rounded-full px-2 py-1 text-xs ${
                                  delivery.status === "Aprobado"
                                    ? "bg-green-100 text-green-800"
                                    : delivery.status === "En revisión"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {delivery.status}
                              </span>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">
                              Comentarios:
                            </h4>
                            <p className="text-sm text-gray-700">
                              {delivery.comments}
                            </p>
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
                {student.deliveries.map((delivery, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`absolute -left-10 mt-1.5 h-4 w-4 rounded-full border ${
                        delivery.status === "Aprobado"
                          ? "bg-green-500 border-green-500"
                          : delivery.status === "En revisión"
                            ? "bg-blue-500 border-blue-500"
                            : "bg-yellow-500 border-yellow-500"
                      }`}
                    ></div>
                    <div>
                      <time className="mb-1 text-xs font-normal text-gray-500">
                        {delivery.date}
                      </time>
                      <h3 className="text-sm font-medium">{delivery.title}</h3>
                      <p
                        className={`text-xs ${
                          delivery.status === "Aprobado"
                            ? "text-green-600"
                            : delivery.status === "En revisión"
                              ? "text-blue-600"
                              : "text-yellow-600"
                        }`}
                      >
                        {delivery.status}
                      </p>
                      <div className="mt-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="px-2 h-6 text-xs"
                            >
                              <Eye className="h-3 w-3 mr-1" /> Ver detalle
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                {delivery.title} - {delivery.date}
                              </DialogTitle>
                              <DialogDescription>
                                Estado:{" "}
                                <span
                                  className={`inline-block rounded-full px-2 py-1 text-xs ${
                                    delivery.status === "Aprobado"
                                      ? "bg-green-100 text-green-800"
                                      : delivery.status === "En revisión"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {delivery.status}
                                </span>
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">
                                Comentarios:
                              </h4>
                              <p className="text-sm text-gray-700">
                                {delivery.comments}
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
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
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">
                    Próxima reunión programada:
                  </h3>
                  <span className="text-sm font-medium">
                    {student.nextMeeting}
                  </span>
                </div>

                <div className="rounded-md border">
                  <div className="grid grid-cols-3 border-b bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500">
                    <div>Fecha</div>
                    <div>Duración</div>
                    <div>Notas</div>
                  </div>
                  {student.meetings.map((meeting, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 border-b px-4 py-3 text-sm last:border-0"
                    >
                      <div>{meeting.date}</div>
                      <div>{meeting.duration}</div>
                      <div>{meeting.notes}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

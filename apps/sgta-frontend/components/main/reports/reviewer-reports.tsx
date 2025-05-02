"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ReviewerReports() {
  const [selectedStudent, setSelectedStudent] = useState("1")

  const students = [
    {
      id: "1",
      name: "Ana Martínez",
      thesis: "Implementación de algoritmos de machine learning para detección de fraudes",
      advisor: "Dr. Rodríguez",
      timeline: [
        {
          date: "15/01/2023",
          event: "Propuesta de tema",
          status: "Aprobado",
          comments:
            "Tema relevante y bien definido. La propuesta está bien estructurada y el tema es relevante. Se recomienda acotar un poco más el alcance para asegurar que sea factible en el tiempo disponible. Los objetivos están claros y la justificación es adecuada.",
        },
        {
          date: "01/02/2023",
          event: "Asignación de asesor",
          status: "Completado",
          comments:
            "Dr. Rodríguez asignado como asesor. El asesor tiene experiencia en el área de machine learning y detección de fraudes, lo que lo hace idóneo para guiar este trabajo.",
        },
        {
          date: "15/02/2023",
          event: "Plan de trabajo",
          status: "Aprobado",
          comments:
            "Cronograma realista y bien estructurado. El plan de trabajo presenta una distribución adecuada de las actividades en el tiempo disponible. Los hitos están bien definidos y son alcanzables.",
        },
        {
          date: "28/02/2023",
          event: "Marco teórico",
          status: "Aprobado con observaciones",
          comments:
            "Incluir más referencias recientes sobre algoritmos de detección. El marco teórico es sólido pero podría beneficiarse de literatura más actual (últimos 2-3 años). Las definiciones son claras y la estructura es coherente.",
        },
        {
          date: "15/03/2023",
          event: "Metodología",
          status: "Aprobado",
          comments:
            "Metodología adecuada para los objetivos planteados. Los métodos seleccionados son apropiados para los objetivos planteados. El diseño experimental es robusto y la selección de variables es adecuada.",
        },
        {
          date: "10/04/2023",
          event: "Avance de implementación",
          status: "En revisión",
          comments:
            "Pendiente de revisión. El documento fue recibido y será evaluado en los próximos días. Se notificará cuando la revisión esté completa.",
        },
      ],
      deliverables: [
        {
          id: "1",
          title: "Propuesta de tema",
          date: "15/01/2023",
          status: "Aprobado",
          feedback:
            "La propuesta está bien estructurada y el tema es relevante. Se recomienda acotar un poco más el alcance. Los objetivos están claros y bien definidos. La justificación demuestra la relevancia del tema en el contexto actual. La metodología propuesta es adecuada para abordar el problema.",
          score: 18,
        },
        {
          id: "2",
          title: "Marco teórico",
          date: "28/02/2023",
          status: "Aprobado con observaciones",
          feedback:
            "El marco teórico es completo, pero se sugiere incluir referencias más recientes sobre algoritmos de detección de fraudes. La estructura es coherente y las definiciones son claras. Se recomienda profundizar en la sección sobre evaluación de modelos de machine learning.",
          score: 16,
        },
        {
          id: "3",
          title: "Metodología",
          date: "15/03/2023",
          status: "Aprobado",
          feedback:
            "La metodología está bien definida y es adecuada para los objetivos planteados. El diseño experimental es robusto y la selección de variables es adecuada. Los métodos de validación son apropiados para evaluar el rendimiento de los algoritmos.",
          score: 17,
        },
        {
          id: "4",
          title: "Avance de implementación",
          date: "10/04/2023",
          status: "En revisión",
          feedback:
            "Pendiente de revisión. El documento fue recibido y será evaluado en los próximos días. Se notificará cuando la revisión esté completa.",
          score: null,
        },
      ],
    },
    {
      id: "2",
      name: "Carlos López",
      thesis: "Desarrollo de un sistema de recomendación basado en contenido",
      advisor: "Dra. Sánchez",
      timeline: [
        {
          date: "20/01/2023",
          event: "Propuesta de tema",
          status: "Aprobado",
          comments:
            "Tema interesante y con aplicaciones prácticas. La propuesta aborda un tema relevante en el campo de los sistemas de recomendación. Los objetivos están bien planteados aunque podrían ser más específicos.",
        },
        {
          date: "05/02/2023",
          event: "Asignación de asesor",
          status: "Completado",
          comments:
            "Dra. Sánchez asignada como asesora. La asesora tiene amplia experiencia en sistemas de recomendación y minería de datos, lo que la hace idónea para guiar este trabajo.",
        },
        {
          date: "20/02/2023",
          event: "Plan de trabajo",
          status: "Aprobado con observaciones",
          comments:
            "Ajustar tiempos de implementación. El plan es adecuado, pero se sugiere ajustar los tiempos de implementación para hacerlos más realistas considerando la complejidad del sistema propuesto.",
        },
        {
          date: "05/03/2023",
          event: "Marco teórico",
          status: "Aprobado con observaciones",
          comments:
            "Profundizar en algoritmos de filtrado colaborativo. El marco teórico es bueno, pero debe profundizar en algoritmos de filtrado colaborativo y su comparación con métodos basados en contenido.",
        },
        {
          date: "02/04/2023",
          event: "Metodología",
          status: "En revisión",
          comments: "Pendiente de revisión. El documento fue recibido y será evaluado en los próximos días.",
        },
      ],
      deliverables: [
        {
          id: "1",
          title: "Propuesta de tema",
          date: "20/01/2023",
          status: "Aprobado",
          feedback:
            "La propuesta es interesante y tiene aplicaciones prácticas. Se recomienda definir mejor los objetivos específicos. La justificación demuestra la relevancia del tema en el contexto actual de sistemas de recomendación.",
          score: 17,
        },
        {
          id: "2",
          title: "Plan de trabajo",
          date: "20/02/2023",
          status: "Aprobado con observaciones",
          feedback:
            "El plan es adecuado, pero se sugiere ajustar los tiempos de implementación para hacerlos más realistas considerando la complejidad del sistema propuesto. El cronograma debe ser más detallado en la fase de evaluación.",
          score: 15,
        },
        {
          id: "3",
          title: "Marco teórico",
          date: "05/03/2023",
          status: "Aprobado con observaciones",
          feedback:
            "El marco teórico es bueno, pero debe profundizar en algoritmos de filtrado colaborativo y su comparación con métodos basados en contenido. Las referencias son adecuadas pero se sugiere ampliar la sección sobre evaluación de sistemas de recomendación.",
          score: 16,
        },
        {
          id: "4",
          title: "Metodología",
          date: "02/04/2023",
          status: "En revisión",
          feedback: "Pendiente de revisión",
          score: null,
        },
      ],
    },
  ]

  const selectedStudentData = students.find((student) => student.id === selectedStudent)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Seleccionar Estudiante</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Seleccionar estudiante" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} - {student.thesis.substring(0, 30)}...
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedStudentData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{selectedStudentData.name}</CardTitle>
            <p className="text-sm text-gray-500">{selectedStudentData.thesis}</p>
            <p className="text-sm text-gray-500">Asesor: {selectedStudentData.advisor}</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="timeline">
              <TabsList className="mb-4">
                <TabsTrigger value="timeline">Historial Cronológico</TabsTrigger>
                <TabsTrigger value="consolidated">Reporte Consolidado</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline">
                <div className="relative border-l border-gray-200 ml-3 pl-8 space-y-6">
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
                </div>
              </TabsContent>

              <TabsContent value="consolidated">
                <div className="space-y-6">
                  {selectedStudentData.deliverables.map((deliverable) => (
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
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

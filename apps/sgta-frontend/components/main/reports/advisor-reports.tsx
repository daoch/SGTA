"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

export function AdvisorReports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [progressFilter, setProgressFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly");
  const [showProgressFilter, setShowProgressFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  const students = [
    {
      id: "1",
      name: "Ana Martínez",
      thesis: "Implementación de algoritmos de machine learning para detección de fraudes",
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
    },
    {
      id: "2",
      name: "Carlos López",
      thesis: "Desarrollo de un sistema de recomendación basado en contenido",
      progress: 45,
      status: "En progreso",
      currentPhase: "Metodología",
      nextDeadline: "20/04/2023",
      deliveries: [
        {
          date: "20/01/2023",
          title: "Propuesta",
          status: "Aprobado",
          comments:
            "Tema interesante con aplicaciones prácticas. La propuesta está bien estructurada aunque se recomienda definir mejor los objetivos específicos. El cronograma es realista y la metodología propuesta es adecuada.",
        },
        {
          date: "05/03/2023",
          title: "Marco teórico",
          status: "Aprobado con observaciones",
          comments:
            "Profundizar en algoritmos de filtrado. El marco teórico es bueno, pero debe profundizar en algoritmos de filtrado colaborativo y su comparación con métodos basados en contenido. Las referencias son adecuadas pero se sugiere ampliar la sección sobre evaluación de sistemas de recomendación.",
        },
        {
          date: "02/04/2023",
          title: "Metodología",
          status: "En revisión",
          comments:
            "Pendiente de revisión. El documento fue recibido y será evaluado en los próximos días. Se notificará cuando la revisión esté completa.",
        },
      ],
      daysToNextDelivery: 2,
    },
    {
      id: "3",
      name: "María Rodríguez",
      thesis: "Análisis de sentimientos en redes sociales",
      progress: 30,
      status: "Con retraso",
      currentPhase: "Marco teórico",
      nextDeadline: "13/04/2023",
      deliveries: [
        {
          date: "10/01/2023",
          title: "Propuesta",
          status: "Aprobado",
          comments:
            "Tema relevante con potencial impacto. La propuesta aborda un tema de actualidad y está bien justificada. Se sugiere delimitar mejor el alcance en términos de redes sociales a analizar y el período de tiempo.",
        },
        {
          date: "15/03/2023",
          title: "Marco teórico",
          status: "Con observaciones",
          comments:
            "Revisar estado del arte. El marco teórico necesita una actualización significativa para incluir los avances más recientes en análisis de sentimientos. La sección sobre procesamiento de lenguaje natural es demasiado general y debe ser más específica.",
        },
      ],
      daysToNextDelivery: -5,
    },
    {
      id: "4",
      name: "Juan Pérez",
      thesis: "Diseño de una arquitectura de microservicios para sistemas educativos",
      progress: 90,
      status: "En progreso",
      currentPhase: "Resultados preliminares",
      nextDeadline: "28/04/2023",
      deliveries: [
        {
          date: "05/01/2023",
          title: "Propuesta",
          status: "Aprobado",
          comments:
            "Excelente propuesta, bien estructurada y con objetivos claros. La justificación es sólida y el cronograma es realista. El enfoque metodológico es apropiado para el problema planteado.",
        },
        {
          date: "10/02/2023",
          title: "Marco teórico",
          status: "Aprobado",
          comments:
            "Muy completo y bien fundamentado. El marco teórico abarca todos los aspectos relevantes de la arquitectura de microservicios y su aplicación en sistemas educativos. Las referencias son actuales y pertinentes.",
        },
        {
          date: "05/03/2023",
          title: "Metodología",
          status: "Aprobado",
          comments:
            "Bien estructurado con enfoque claro. La metodología propuesta es adecuada para el desarrollo de la arquitectura. Los criterios de evaluación están bien definidos y son medibles.",
        },
        {
          date: "01/04/2023",
          title: "Implementación",
          status: "Aprobado",
          comments:
            "Buen avance, código bien documentado. La implementación sigue las mejores prácticas de desarrollo. Se recomienda mejorar las pruebas unitarias y de integración.",
        },
        {
          date: "20/04/2023",
          title: "Resultados preliminares",
          status: "En revisión",
          comments:
            "Pendiente de revisión. El documento fue recibido y será evaluado en los próximos días. Se notificará cuando la revisión esté completa.",
        },
      ],
      daysToNextDelivery: 10,
    },
  ];

  // Filter students based on filters
  const filteredStudents = students.filter((student) => {
    // Filter by name/search
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.thesis.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by progress
    const matchesProgress =
      progressFilter === "all" ||
      (progressFilter === "low" && student.progress < 30) ||
      (progressFilter === "medium" && student.progress >= 30 && student.progress < 70) ||
      (progressFilter === "high" && student.progress >= 70);

    // Filter by status
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "onTrack" && student.status === "En progreso" && student.daysToNextDelivery >= 3) ||
      (statusFilter === "atRisk" &&
        student.status === "En progreso" &&
        student.daysToNextDelivery < 3 &&
        student.daysToNextDelivery >= 0) ||
      (statusFilter === "delayed" && (student.status === "Con retraso" || student.daysToNextDelivery < 0));

    return matchesSearch && matchesProgress && matchesStatus;
  });

  // Calcular estadísticas del asesor
  const totalStudents = students.length;
  // const studentsInProgress = students.filter((student) => student.status === "En progreso").length;
  const studentsWithDelay = students.filter(
    (student) => student.status === "Con retraso" || student.daysToNextDelivery < 0,
  ).length;
  const studentsAtRisk = students.filter(
    (student) => student.status === "En progreso" && student.daysToNextDelivery < 3 && student.daysToNextDelivery >= 0,
  ).length;
  // const studentsCompleted = students.filter((student) => student.status === "Completado").length;
  const averageProgress = Math.round(students.reduce((sum, student) => sum + student.progress, 0) / totalStudents);

  // Función para manejar el clic en el botón de filtro por progreso
  const handleProgressFilterClick = () => {
    setShowProgressFilter(!showProgressFilter);
    setShowStatusFilter(false);
  };

  // Función para manejar el clic en el botón de filtro por estado
  const handleStatusFilterClick = () => {
    setShowStatusFilter(!showStatusFilter);
    setShowProgressFilter(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
          <CardTitle className="text-lg">Resumen de Asesorías</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Programar Reportes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Programar Envío de Reportes</DialogTitle>
              <DialogDescription>
                Configura la frecuencia con la que deseas recibir reportes automáticos en tu correo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Frecuencia de envío</label>
                <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diario</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Formato de reporte</label>
                <Select defaultValue="pdf">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Correo electrónico</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue="asesor@pucp.edu.pe"
                  readOnly
                />
              </div>
              <Button className="w-full mt-4">Guardar configuración</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                <div className="text-3xl font-bold text-[#002855]">{totalStudents}</div>
                <div className="text-sm text-gray-500">Total de tesistas</div>
              </div>
              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                <div className="text-3xl font-bold text-[#006699]">{averageProgress}%</div>
                <div className="text-sm text-gray-500">Progreso promedio</div>
              </div>
              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{studentsWithDelay}</div>
                <div className="text-sm text-gray-500">Con retraso</div>
              </div>
              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">{studentsAtRisk}</div>
                <div className="text-sm text-gray-500">En riesgo</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Carga actual</span>
                <span>{totalStudents}/10 tesistas</span>
              </div>
              <Progress value={totalStudents * 10} className="h-2" />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nombre o tema de proyecto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="relative">
                <Button variant="outline" onClick={handleProgressFilterClick}>
                  Filtrar por progreso
                </Button>
                {showProgressFilter && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border">
                    <div className="p-3 space-y-2">
                      <h4 className="font-medium text-sm">Progreso</h4>
                      <div className="space-y-1">
                        <Button
                          variant={progressFilter === "all" ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setProgressFilter("all");
                            setShowProgressFilter(false);
                          }}
                        >
                          Todos
                        </Button>
                        <Button
                          variant={progressFilter === "low" ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setProgressFilter("low");
                            setShowProgressFilter(false);
                          }}
                        >
                          Bajo (&lt;30%)
                        </Button>
                        <Button
                          variant={progressFilter === "medium" ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setProgressFilter("medium");
                            setShowProgressFilter(false);
                          }}
                        >
                          Medio (30-70%)
                        </Button>
                        <Button
                          variant={progressFilter === "high" ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setProgressFilter("high");
                            setShowProgressFilter(false);
                          }}
                        >
                          Alto (&gt;70%)
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <Button variant="outline" onClick={handleStatusFilterClick}>
                  Filtrar por estado
                </Button>
                {showStatusFilter && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border">
                    <div className="p-3 space-y-2">
                      <h4 className="font-medium text-sm">Estado</h4>
                      <div className="space-y-1">
                        <Button
                          variant={statusFilter === "all" ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setStatusFilter("all");
                            setShowStatusFilter(false);
                          }}
                        >
                          Todos
                        </Button>
                        <Button
                          variant={statusFilter === "onTrack" ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setStatusFilter("onTrack");
                            setShowStatusFilter(false);
                          }}
                        >
                          En progreso normal
                        </Button>
                        <Button
                          variant={statusFilter === "atRisk" ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setStatusFilter("atRisk");
                            setShowStatusFilter(false);
                          }}
                        >
                          En riesgo (&lt;3 días)
                        </Button>
                        <Button
                          variant={statusFilter === "delayed" ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setStatusFilter("delayed");
                            setShowStatusFilter(false);
                          }}
                        >
                          Con retraso
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="border overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200">
                    <div
                      className="absolute inset-0 rounded-full border-4 border-t-transparent"
                      style={{
                        borderTopColor: "transparent",
                        borderRightColor: `${
                          student.progress < 30 ? "#ef4444" : student.progress < 70 ? "#eab308" : "#22c55e"
                        }`,
                        borderBottomColor: `${
                          student.progress < 30 ? "#ef4444" : student.progress < 70 ? "#eab308" : "#22c55e"
                        }`,
                        borderLeftColor: `${
                          student.progress < 30 ? "#ef4444" : student.progress < 70 ? "#eab308" : "#22c55e"
                        }`,
                        transform: `rotate(${student.progress * 3.6}deg)`,
                      }}
                    ></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">{student.progress}%</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-medium">{student.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1 mt-0.5">
                        Proyecto:{" "}
                        {student.thesis.length > 50 ? `${student.thesis.substring(0, 50)}...` : student.thesis}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 whitespace-nowrap">
                      {student.daysToNextDelivery < 0 ? (
                        <>
                          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                            Retrasado
                          </span>
                          <span className="text-xs text-red-800 ml-1">({Math.abs(student.daysToNextDelivery)}d)</span>
                        </>
                      ) : student.daysToNextDelivery < 3 ? (
                        <>
                          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            En riesgo
                          </span>
                          <span className="text-xs text-yellow-800 ml-1">({student.daysToNextDelivery}d)</span>
                        </>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                          En progreso
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Fase actual:</p>
                      <p className="text-sm font-medium">{student.currentPhase}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fecha límite:</p>
                      <p className="text-sm font-medium">{student.nextDeadline}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <Link href={`/asesor/reportes/tesista/${student.id}`} passHref>
                      <Button variant="outline" size="sm" className="gap-1" asChild>
                        <a>
                          <ExternalLink className="h-3.5 w-3.5" /> Ver detalles
                        </a>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border">
          <p className="text-gray-500">No se encontraron tesistas que coincidan con los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
}

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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { advisorService, Student } from "@/features/asesores/services/advisor-service";
import { Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AdvisorReports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [progressFilter, setProgressFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly");
  const [showProgressFilter, setShowProgressFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await advisorService.getAdvisorStudents("1");
        console.log("Datos recibidos:", data);
        setStudents(data);
      } catch (error) {
        console.error("Error al cargar los tesistas:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);


  const renderStudentStatus = (estado: string) => {
    switch (estado) {
      case "retrasado":
        return (
          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
            Retrasado
          </span>
        );
      case "pendiente":
        return (
          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
            Pendiente
          </span>
        );
      case "enviado_a_tiempo":
        return (
          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
            En progreso
          </span>
        );
      default:
        return (
          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
            Sin estado
          </span>
        );
    }
  };

  // Filter students based on filters
  const filteredStudents = students.filter((student) => {
    const fullName = `${student.nombres} ${student.primerApellido} ${student.segundoApellido}`.toLowerCase();
    // Filter by name/search
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      student.entregableActualNombre.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by progress
    const matchesProgress =
      progressFilter === "all" ||
      (progressFilter === "low" && student.entregableActualEstado === "no_iniciado") ||
      (progressFilter === "medium" && student.entregableActualEstado === "en_proceso") ||
      (progressFilter === "high" && student.entregableActualEstado === "completado");

    // Filter by status
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "onTrack" && student.entregableEnvioEstado === "enviado_a_tiempo") ||
      (statusFilter === "atRisk" && student.entregableEnvioEstado === "pendiente") ||
      (statusFilter === "delayed" && student.entregableEnvioEstado === "retrasado");

    return matchesSearch && matchesProgress && matchesStatus;
  });

  // Calcular estadísticas del asesor
  const totalStudents = students.length;
  const studentsWithDelay = students.filter(
    (student) => student.entregableEnvioEstado === "retrasado"
  ).length;
  const studentsAtRisk = students.filter(
    (student) => student.entregableEnvioEstado === "pendiente"
  ).length;
  const averageProgress = Math.round(
    students.filter(student => student.entregableActualEstado === "completado").length / totalStudents * 100
  );

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

  if (loading) {
    return <div className="flex justify-center items-center min-h-[200px]">
      <div className="text-lg">Cargando reportes del asesor...</div>
    </div>;
  }

  return (
    <div className="py-6">
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
                <label htmlFor="schedule-frequency" className="text-sm font-medium">Frecuencia de envío</label>
                <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                  <SelectTrigger id="schedule-frequency">
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
                <label htmlFor="report-format" className="text-sm font-medium">Formato de reporte</label>
                <Select defaultValue="pdf">
                  <SelectTrigger id="report-format">
                    <SelectValue placeholder="Selecciona formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="email-input" className="text-sm font-medium">Correo electrónico</label>
                <input
                  id="email-input"
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

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-[#002855] mb-4 px-1">Tesistas asignados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((student) => (
            <Card key={student.tesistaId} className="border overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-medium">
                          {`${student.nombres} ${student.primerApellido} ${student.segundoApellido}`}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-1 mt-0.5">
                          Entregable actual: {student.entregableActualNombre}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 whitespace-nowrap">
                        {renderStudentStatus(student.entregableEnvioEstado)}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Fase actual:</p>
                        <p className="text-sm font-medium">{student.entregableActualNombre}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fecha límite:</p>
                        <p className="text-sm font-medium">
                          {new Date(student.entregableActualFechaFin).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Link href={`/asesor/reportes/tesista/${student.tesistaId}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="h-3.5 w-3.5" /> Ver detalles
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border">
          <p className="text-gray-500">No se encontraron tesistas que coincidan con los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
}

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
import { cn } from "@/lib/utils";
import { Calendar, ExternalLink, LayoutGrid, Table } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface CircularProgressProps {
  value: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

function CircularProgress({ value, size = "md", showLabel = true }: CircularProgressProps) {
  const circumference = 2 * Math.PI * 45; // radio 45 para el círculo SVG
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20"
  };

  const fontSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className={cn("relative", sizeClasses[size])}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          className="stroke-gray-200"
          strokeWidth="10%"
          fill="none"
        />
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          className="stroke-[#002855] transition-all duration-300 ease-in-out"
          strokeWidth="10%"
          fill="none"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>
      {showLabel && (
        <div className={cn("absolute inset-0 flex items-center justify-center", fontSize[size])}>
          <span className="font-semibold">{value}%</span>
        </div>
      )}
    </div>
  );
}

export function AdvisorReports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [progressFilter, setProgressFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly");
  const [showProgressFilter, setShowProgressFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const progressFilterRef = useRef<HTMLDivElement>(null);
  const statusFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await advisorService.getAdvisorStudents("5");
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (progressFilterRef.current && !progressFilterRef.current.contains(event.target as Node)) {
        setShowProgressFilter(false);
      }
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target as Node)) {
        setShowStatusFilter(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getProgressFilterLabel = () => {
    switch (progressFilter) {
      case "low":
        return "Bajo (<30%)";
      case "medium":
        return "Medio (30-70%)";
      case "high":
        return "Alto (>70%)";
      default:
        return "Todos";
    }
  };

  const getStatusFilterLabel = () => {
    switch (statusFilter) {
      case "onTrack":
        return "En progreso normal";
      case "atRisk":
        return "En riesgo";
      case "delayed":
        return "Con retraso";
      default:
        return "Todos";
    }
  };

  const renderStudentStatus = (estado: string) => {
    switch (estado) {
      case "no_iniciado":
        return (
          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
            No iniciado
          </span>
        );
      case "en_progreso":
        return (
          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
            En progreso
          </span>
        );
      case "terminado":
        return (
          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
            Terminado
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
    
    // Filtro por nombre/búsqueda
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      student.entregableActualNombre.toLowerCase().includes(searchQuery.toLowerCase());

    // Calcular el progreso del estudiante (ejemplo: basado en el estado actual)
    let studentProgress = 0;
    switch (student.entregableActualEstado) {
      case "no_iniciado":
        studentProgress = 0;
        break;
      case "en_proceso":
        studentProgress = 50;
        break;
      case "terminado":
        studentProgress = 100;
        break;
    }

    // Filtro por progreso
    const matchesProgress =
      progressFilter === "all" ||
      (progressFilter === "low" && studentProgress < 30) ||
      (progressFilter === "medium" && studentProgress >= 30 && studentProgress <= 70) ||
      (progressFilter === "high" && studentProgress > 70);

    // Filtro por estado
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "onTrack" && student.entregableEnvioEstado === "enviado_a_tiempo") ||
      (statusFilter === "atRisk" && student.entregableEnvioEstado === "no_enviado") ||
      (statusFilter === "delayed" && student.entregableEnvioEstado === "enviado_tarde");

    return matchesSearch && matchesProgress && matchesStatus;
  });

  // Calcular estadísticas del asesor
  const totalStudents = students.length;
  const studentsWithDelay = students.filter(
    (student) => student.entregableEnvioEstado === "enviado_tarde"
  ).length;
  const studentsAtRisk = students.filter(
    (student) => student.entregableEnvioEstado === "no_enviado"
  ).length;
  
  // Contar estudiantes por etapa de carrera
  const studentsInPFC1 = students.filter(
    (student) => student.etapaFormativaNombre === "Proyecto de fin de carrera 1"
  ).length;
  const studentsInPFC2 = students.filter(
    (student) => student.etapaFormativaNombre === "Proyecto de fin de carrera 2"
  ).length;

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
            <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                <div className="text-3xl font-bold text-[#002855]">{totalStudents}</div>
                <div className="text-sm text-gray-500">Total de tesistas</div>
              </div>
              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{studentsWithDelay}</div>
                <div className="text-sm text-gray-500">Con retraso</div>
              </div>
              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                <div className="text-3xl font-bold text-[#006699]">{studentsInPFC1}</div>
                <div className="text-sm text-gray-500">Proyecto de Fin de Carrera 1</div>
              </div>
              <div className="bg-[#F5F5F5] p-4 rounded-lg">
                <div className="text-3xl font-bold text-[#006699]">{studentsInPFC2}</div>
                <div className="text-sm text-gray-500">Proyecto de Fin de Carrera 2</div>
              </div>
            </div>



          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-[#002855] mb-4 px-1">Tesistas asignados</h2>

        <div className="flex items-center space-x-4 mb-4">
          <Input
            placeholder="Buscar por nombre o fase..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <div className="relative" ref={progressFilterRef}>
            <Button
              variant="outline"
              onClick={handleProgressFilterClick}
              className={`whitespace-nowrap ${showProgressFilter ? "bg-gray-100" : ""}`}
            >
              Progreso: {getProgressFilterLabel()}
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

          <div className="relative" ref={statusFilterRef}>
            <Button
              variant="outline"
              onClick={handleStatusFilterClick}
              className={`whitespace-nowrap ${showStatusFilter ? "bg-gray-100" : ""}`}
            >
              Estado: {getStatusFilterLabel()}
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

          <div className="border rounded-md flex shrink-0">
            <Button
              variant="ghost"
              onClick={() => setViewMode("grid")}
              className={`gap-2 rounded-r-none ${viewMode === "grid" ? "bg-gray-100" : ""}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => setViewMode("table")}
              className={`gap-2 rounded-l-none border-l ${viewMode === "table" ? "bg-gray-100" : ""}`}
            >
              <Table className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map((student) => (
              <Card key={student.tesistaId} className="border overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-6">
                    <div className="shrink-0 pt-1">
                      <CircularProgress
                        value={student.entregableActualEstado === "terminado" ? 100 : 
                               student.entregableActualEstado === "en_proceso" ? 50 : 0}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-lg font-semibold text-[#002855]">
                            {`${student.nombres} ${student.primerApellido} ${student.segundoApellido}`}
                          </h2>
                          <h3 className="text-base font-medium text-gray-800 mt-1 line-clamp-2">
                            {student.tituloTema}
                          </h3>
                          <p className="text-sm text-gray-600 mt-2">
                            {student.carrera} • {student.etapaFormativaNombre}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 whitespace-nowrap">
                          {renderStudentStatus(student.entregableActualEstado)}
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
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tesista</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Carrera</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Etapa</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Título de Tesis</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Entregable Actual</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Fecha Límite</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Progreso</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.tesistaId} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-sm">
                          {`${student.nombres} ${student.primerApellido} ${student.segundoApellido}`}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {student.carrera}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {student.etapaFormativaNombre}
                    </td>
                    <td className="px-4 py-3 text-sm max-w-xs">
                      <div className="line-clamp-2">
                        {student.tituloTema}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {student.entregableActualNombre}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(student.entregableActualFechaFin).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {renderStudentStatus(student.entregableActualEstado)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-32">
                        <Progress 
                          value={student.entregableActualEstado === "terminado" ? 100 : 
                                 student.entregableActualEstado === "en_proceso" ? 50 : 0} 
                          className="h-2"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link href={`/asesor/reportes/tesista/${student.tesistaId}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="h-3.5 w-3.5" /> Ver detalles
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border">
          <p className="text-gray-500">No se encontraron tesistas que coincidan con los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
}

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { advisorService, Student } from "@/features/asesores/services/advisor-service";
import { cn } from "@/lib/utils";
import { Calendar, ExternalLink, LayoutGrid, Table } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Constants
const PROGRESS_MAPPING = {
  no_iniciado: 0,
  en_proceso: 50,
  terminado: 100,
} as const;

// Types
type FilterType = "all" | "low" | "medium" | "high";
type ActivityFilterType = "all" | "no_iniciado" | "en_proceso" | "terminado";
type DeliveryFilterType = "all" | "no_enviado" | "enviado_a_tiempo" | "enviado_tarde";
type CareerFilterType = "all" | string;
type StageFilterType = "all" | string;
type ViewMode = "grid" | "table";

// Utility functions
const getStudentProgress = (estado: string): number => 
  PROGRESS_MAPPING[estado as keyof typeof PROGRESS_MAPPING] || 0;

const getFullName = (student: Student): string =>
  `${student.nombres} ${student.primerApellido} ${student.segundoApellido}`;

const renderStatusTag = (estado: string, type: "activity" | "delivery") => {
  if (type === "activity") {
    switch (estado) {
      case "no_iniciado":
        return <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">No iniciado</span>;
      case "en_proceso":
        return <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">En proceso</span>;
      case "terminado":
        return <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">Terminado</span>;
      default:
        return <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">Sin estado</span>;
    }
  } else {
    switch (estado) {
      case "no_enviado":
        return <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">No enviado</span>;
      case "enviado_a_tiempo":
        return <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">A tiempo</span>;
      case "enviado_tarde":
        return <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-800">Tarde</span>;
      default:
        return <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">Sin estado</span>;
    }
  }
};

// Reusable components
interface CircularProgressProps {
  value: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

function CircularProgress({ value, size = "md", showLabel = true }: CircularProgressProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  const sizeClasses = { sm: "w-12 h-12", md: "w-16 h-16", lg: "w-20 h-20" };
  const fontSize = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  return (
    <div className={cn("relative", sizeClasses[size])}>
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="50%" cy="50%" r="45%" className="stroke-gray-200" strokeWidth="10%" fill="none" />
        <circle
          cx="50%" cy="50%" r="45%"
          className="stroke-[#002855] transition-all duration-300 ease-in-out"
          strokeWidth="10%" fill="none"
          style={{ strokeDasharray: circumference, strokeDashoffset: strokeDashoffset }}
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

interface FilterDropdownProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onSelect: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function FilterDropdown({ label, value, options, onSelect, isOpen, onToggle, containerRef }: FilterDropdownProps) {
  return (
    <div className="relative" ref={containerRef}>
      <Button variant="outline" onClick={onToggle} className={`whitespace-nowrap ${isOpen ? "bg-gray-100" : ""}`}>
        {label}: {options.find(opt => opt.value === value)?.label || "Todos"}
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border">
          <div className="p-3 space-y-2">
            <h4 className="font-medium text-sm">{label}</h4>
            <div className="space-y-1">
              {options.map((option) => (
                <Button
                  key={option.value}
                  variant={value === option.value ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    onSelect(option.value);
                    onToggle();
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdvisorReports() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [progressFilter, setProgressFilter] = useState<FilterType>("all");
  const [activityFilter, setActivityFilter] = useState<ActivityFilterType>("all");
  const [deliveryFilter, setDeliveryFilter] = useState<DeliveryFilterType>("all");
  const [careerFilter, setCareerFilter] = useState<CareerFilterType>("all");
  const [stageFilter, setStageFilter] = useState<StageFilterType>("all");
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly");
  const [showProgressFilter, setShowProgressFilter] = useState(false);
  const [showActivityFilter, setShowActivityFilter] = useState(false);
  const [showDeliveryFilter, setShowDeliveryFilter] = useState(false);
  const [showCareerFilter, setShowCareerFilter] = useState(false);
  const [showStageFilter, setShowStageFilter] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const progressFilterRef = useRef<HTMLDivElement>(null);
  const activityFilterRef = useRef<HTMLDivElement>(null);
  const deliveryFilterRef = useRef<HTMLDivElement>(null);
  const careerFilterRef = useRef<HTMLDivElement>(null);
  const stageFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await advisorService.getAdvisorStudents();
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
      if (activityFilterRef.current && !activityFilterRef.current.contains(event.target as Node)) {
        setShowActivityFilter(false);
      }
      if (deliveryFilterRef.current && !deliveryFilterRef.current.contains(event.target as Node)) {
        setShowDeliveryFilter(false);
      }
      if (careerFilterRef.current && !careerFilterRef.current.contains(event.target as Node)) {
        setShowCareerFilter(false);
      }
      if (stageFilterRef.current && !stageFilterRef.current.contains(event.target as Node)) {
        setShowStageFilter(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter logic
  const filteredStudents = students.filter((student) => {
    const fullName = getFullName(student).toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                         student.tituloTema.toLowerCase().includes(searchQuery.toLowerCase());

    const studentProgress = getStudentProgress(student.entregableActualEstado);
    const matchesProgress = progressFilter === "all" ||
      (progressFilter === "low" && studentProgress < 30) ||
      (progressFilter === "medium" && studentProgress >= 30 && studentProgress <= 70) ||
      (progressFilter === "high" && studentProgress > 70);

    const matchesActivity = activityFilter === "all" || student.entregableActualEstado === activityFilter;
    const matchesDelivery = deliveryFilter === "all" || student.entregableEnvioEstado === deliveryFilter;
    const matchesCareer = careerFilter === "all" || student.carrera === careerFilter;
    const matchesStage = stageFilter === "all" || student.etapaFormativaNombre === stageFilter;

    return matchesSearch && matchesProgress && matchesActivity && matchesDelivery && matchesCareer && matchesStage;
  });

  // Statistics
  const stats = {
    total: students.length,
    delayed: students.filter(s => s.entregableEnvioEstado === "enviado_tarde").length,
    pfc1: students.filter(s => s.etapaFormativaNombre === "Proyecto de fin de carrera 1").length,
    pfc2: students.filter(s => s.etapaFormativaNombre === "Proyecto de fin de carrera 2").length,
  };

  // Filter options
  const progressOptions = [
    { value: "all", label: "Todos" },
    { value: "low", label: "Bajo (<30%)" },
    { value: "medium", label: "Medio (30-70%)" },
    { value: "high", label: "Alto (>70%)" },
  ];

  const activityOptions = [
    { value: "all", label: "Todos" },
    { value: "no_iniciado", label: "No iniciado" },
    { value: "en_proceso", label: "En proceso" },
    { value: "terminado", label: "Terminado" },
  ];

  const deliveryOptions = [
    { value: "all", label: "Todos" },
    { value: "no_enviado", label: "No enviado" },
    { value: "enviado_a_tiempo", label: "A tiempo" },
    { value: "enviado_tarde", label: "Enviado tarde" },
  ];

  // Dynamic options from student data
  const uniqueCareers = Array.from(new Set(students.map(s => s.carrera))).sort();
  const careerOptions = [
    { value: "all", label: "Todas las carreras" },
    ...uniqueCareers.map(career => ({ value: career, label: career }))
  ];

  const uniqueStages = Array.from(new Set(students.map(s => s.etapaFormativaNombre))).sort();
  const stageOptions = [
    { value: "all", label: "Todas las etapas" },
    ...uniqueStages.map(stage => ({ value: stage, label: stage }))
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg">Cargando reportes del asesor...</div>
      </div>
    );
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
          <div className="grid grid-cols-4 gap-4">
            {[
              { value: stats.total, label: "Total de tesistas", color: "text-[#002855]" },
              { value: stats.delayed, label: "Con retraso", color: stats.delayed === 0 ? "text-green-600" : "text-red-600" },
              { value: stats.pfc1, label: "Proyecto de Fin de Carrera 1", color: "text-[#006699]" },
              { value: stats.pfc2, label: "Proyecto de Fin de Carrera 2", color: "text-[#006699]" },
            ].map((stat, index) => (
              <div key={index} className="bg-[#F5F5F5] p-4 rounded-lg">
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-[#002855] mb-4 px-1">Tesistas asignados</h2>

        <div className="flex items-center space-x-1 mb-4">
          <Input
            placeholder="Buscar por nombre de tesista o título de tesis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[250px]"
          />
          <FilterDropdown
            label="Progreso"
            value={progressFilter}
            options={progressOptions}
            onSelect={(value) => setProgressFilter(value as FilterType)}
            isOpen={showProgressFilter}
            onToggle={() => {
              setShowProgressFilter(!showProgressFilter);
              setShowActivityFilter(false);
              setShowDeliveryFilter(false);
              setShowCareerFilter(false);
              setShowStageFilter(false);
            }}
            containerRef={progressFilterRef}
          />
          <FilterDropdown
            label="Actividad"
            value={activityFilter}
            options={activityOptions}
            onSelect={(value) => setActivityFilter(value as ActivityFilterType)}
            isOpen={showActivityFilter}
            onToggle={() => {
              setShowActivityFilter(!showActivityFilter);
              setShowProgressFilter(false);
              setShowDeliveryFilter(false);
              setShowCareerFilter(false);
              setShowStageFilter(false);
            }}
            containerRef={activityFilterRef}
          />
          <FilterDropdown
            label="Entrega"
            value={deliveryFilter}
            options={deliveryOptions}
            onSelect={(value) => setDeliveryFilter(value as DeliveryFilterType)}
            isOpen={showDeliveryFilter}
            onToggle={() => {
              setShowDeliveryFilter(!showDeliveryFilter);
              setShowProgressFilter(false);
              setShowActivityFilter(false);
              setShowCareerFilter(false);
              setShowStageFilter(false);
            }}
            containerRef={deliveryFilterRef}
          />
          <FilterDropdown
            label="Carrera"
            value={careerFilter}
            options={careerOptions}
            onSelect={(value) => setCareerFilter(value as CareerFilterType)}
            isOpen={showCareerFilter}
            onToggle={() => {
              setShowCareerFilter(!showCareerFilter);
              setShowProgressFilter(false);
              setShowActivityFilter(false);
              setShowDeliveryFilter(false);
              setShowStageFilter(false);
            }}
            containerRef={careerFilterRef}
          />
          <FilterDropdown
            label="Etapa"
            value={stageFilter}
            options={stageOptions}
            onSelect={(value) => setStageFilter(value as StageFilterType)}
            isOpen={showStageFilter}
            onToggle={() => {
              setShowStageFilter(!showStageFilter);
              setShowProgressFilter(false);
              setShowActivityFilter(false);
              setShowDeliveryFilter(false);
              setShowCareerFilter(false);
            }}
            containerRef={stageFilterRef}
          />
          <div className="border rounded-md flex shrink-0">
            {[
              { mode: "grid" as const, icon: LayoutGrid },
              { mode: "table" as const, icon: Table },
            ].map(({ mode, icon: Icon }) => (
              <Button
                key={mode}
                variant="ghost"
                onClick={() => setViewMode(mode)}
                className={`gap-2 ${mode === "table" ? "rounded-l-none border-l" : "rounded-r-none"} ${
                  viewMode === mode ? "bg-gray-100" : ""
                }`}
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>
        
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredStudents.map((student) => {
              const progress = getStudentProgress(student.entregableActualEstado);
              return (
                <Card key={student.tesistaId} className="border overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 pt-1">
                        <CircularProgress value={progress} size="sm" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-lg font-semibold text-[#002855]">
                              {getFullName(student)}
                            </h2>
                            <h3 className="text-base font-medium text-gray-800 mt-1 line-clamp-2">
                              {student.tituloTema}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {student.carrera} • {student.etapaFormativaNombre}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-500">Fase actual:</p>
                            <p className="text-sm font-medium mt-0.5">{student.entregableActualNombre}</p>
                            <div className="flex gap-1 mt-1">
                              {renderStatusTag(student.entregableActualEstado, "activity")}
                              {renderStatusTag(student.entregableEnvioEstado, "delivery")}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Fecha límite:</p>
                            <p className="text-sm font-medium mt-0.5">
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
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Tesista", "Carrera", "Etapa", "Título de Tesis", 
                    "Entregable Actual", "Fecha Límite", "Estado Actividad", "Estado Entrega", "Progreso"
                  ].map((header, index) => (
                    <th key={index} className="px-4 py-8 text-left text-sm font-medium text-gray-600">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => {
                  const progress = getStudentProgress(student.entregableActualEstado);
                  return (
                    <tr 
                      key={student.tesistaId} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/asesor/reportes/tesista/${student.tesistaId}`)}
                    >
                      <td className="px-4 py-8">
                        <div className="font-medium text-sm">{getFullName(student)}</div>
                      </td>
                      <td className="px-4 py-8 text-sm">{student.carrera}</td>
                      <td className="px-4 py-8 text-sm">{student.etapaFormativaNombre}</td>
                      <td className="px-4 py-8 text-sm max-w-xs">
                        <div className="line-clamp-2">{student.tituloTema}</div>
                      </td>
                      <td className="px-4 py-8 text-sm">
                        {student.entregableActualNombre}
                      </td>
                      <td className="px-4 py-8 text-sm">
                        {new Date(student.entregableActualFechaFin).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-8">
                        {renderStatusTag(student.entregableActualEstado, "activity")}
                      </td>
                      <td className="px-4 py-8">
                        {renderStatusTag(student.entregableEnvioEstado, "delivery")}
                      </td>
                      <td className="px-4 py-8">
                        <div className="text-sm font-medium">{progress}%</div>
                      </td>
                    </tr>
                  );
                })}
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

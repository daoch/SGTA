"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { advisorService, Meeting, StudentDetail, TimelineEvent } from "@/features/asesores/services/advisor-service";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Book, BookOpen, Calendar, ChevronDown, ChevronsUpDown, ChevronUp, Clock, Filter, GraduationCap, Mail, Tag, User, X } from "lucide-react";
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

// Types for sorting
type SortField = "fechaFin" | "nombre" | "entregableActividadEstado" | "entregableEnvioEstado";
type MeetingSortField = "fecha" | "duracion" | "estado";
type SortDirection = "asc" | "desc" | null;

// Types for filtering
type FilterState = {
  entregableActividadEstado: string[];
  entregableEnvioEstado: string[];
};

type MeetingFilterState = {
  estado: string[];
};

export function StudentDetails({ studentId }: StudentDetailsProps) {
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Sorting state for deliveries
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  // Sorting state for meetings
  const [meetingSortField, setMeetingSortField] = useState<MeetingSortField | null>(null);
  const [meetingSortDirection, setMeetingSortDirection] = useState<SortDirection>(null);

  // Filtering state
  const [filters, setFilters] = useState<FilterState>({
    entregableActividadEstado: [],
    entregableEnvioEstado: [],
  });

  const [meetingFilters, setMeetingFilters] = useState<MeetingFilterState>({
    estado: [],
  });

  // Filter options
  const activityStatusOptions = [
    { value: "completado", label: "Completado" },
    { value: "en_proceso", label: "En proceso" },
    { value: "no_iniciado", label: "No iniciado" },
  ];

  const deliveryStatusOptions = [
    { value: "enviado_a_tiempo", label: "Enviado a tiempo" },
    { value: "enviado_tarde", label: "Enviado tarde" },
    { value: "no_enviado", label: "No enviado" },
  ];

  const meetingStatusOptions = [
    { value: "programada", label: "Programada" },
  ];

  // Filter functions
  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const handleMeetingFilterChange = (filterType: keyof MeetingFilterState, value: string) => {
    setMeetingFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      entregableActividadEstado: [],
      entregableEnvioEstado: [],
    });
  };

  const clearAllMeetingFilters = () => {
    setMeetingFilters({
      estado: [],
    });
  };

  // Sorting functions for deliveries
  const handleSort = (field: SortField) => {
    let direction: SortDirection = "asc";
    
    if (sortField === field && sortDirection === "asc") {
      direction = "desc";
    } else if (sortField === field && sortDirection === "desc") {
      direction = null;
    }
    
    setSortField(direction ? field : null);
    setSortDirection(direction);
  };

  // Sorting functions for meetings
  const handleMeetingSort = (field: MeetingSortField) => {
    let direction: SortDirection = "asc";
    
    if (meetingSortField === field && meetingSortDirection === "asc") {
      direction = "desc";
    } else if (meetingSortField === field && meetingSortDirection === "desc") {
      direction = null;
    }
    
    setMeetingSortField(direction ? field : null);
    setMeetingSortDirection(direction);
  };

  // Sort icon components
  const SortIcon = ({ field, currentField, currentDirection }: { field: string; currentField: string | null; currentDirection: SortDirection }) => {
    if (currentField !== field) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }
    if (currentDirection === "asc") {
      return <ChevronUp className="h-4 w-4 text-gray-600" />;
    }
    if (currentDirection === "desc") {
      return <ChevronDown className="h-4 w-4 text-gray-600" />;
    }
    return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
  };

  // Filter dropdown component
  const FilterDropdown = ({ 
    options, 
    selectedValues, 
    onFilterChange, 
    label 
  }: { 
    options: Array<{value: string, label: string}>, 
    selectedValues: string[], 
    onFilterChange: (value: string) => void,
    label: string 
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX
      });
      setIsOpen(!isOpen);
    };

    return (
      <div className="relative">
        <button
          onClick={handleButtonClick}
          className={`p-1 rounded hover:bg-gray-200 transition-colors ${selectedValues.length > 0 ? "text-blue-600" : "text-gray-400"}`}
        >
          <Filter className="h-4 w-4" />
        </button>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)} />
            <div 
              className="fixed bg-white border border-gray-200 rounded-md shadow-xl min-w-48 max-h-80 overflow-y-auto z-[9999]"
              style={{
                top: buttonPosition.top,
                left: buttonPosition.left
              }}
            >
              <div className="p-2 border-b text-xs font-medium text-gray-700 bg-gray-50">{label}</div>
              <div className="py-1">
                {options.map((option) => (
                  <label key={option.value} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option.value)}
                      onChange={() => onFilterChange(option.value)}
                      className="mr-2 accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              {selectedValues.length > 0 && (
                <div className="border-t p-2 bg-gray-50">
                  <button
                    onClick={() => {
                      selectedValues.forEach(value => onFilterChange(value));
                      setIsOpen(false);
                    }}
                    className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  // Function to sort and filter timeline
  const getSortedAndFilteredTimeline = () => {
    const filtered = timeline.filter(event => {
      const activityMatch = filters.entregableActividadEstado.length === 0 || 
        filters.entregableActividadEstado.includes(event.entregableActividadEstado);
      const deliveryMatch = filters.entregableEnvioEstado.length === 0 || 
        filters.entregableEnvioEstado.includes(event.entregableEnvioEstado);
      
      return activityMatch && deliveryMatch;
    });
    
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        let aValue: string | Date;
        let bValue: string | Date;

        switch (sortField) {
          case "fechaFin":
            aValue = new Date(a.fechaFin);
            bValue = new Date(b.fechaFin);
            break;
          case "nombre":
            aValue = a.nombre.toLowerCase();
            bValue = b.nombre.toLowerCase();
            break;
          case "entregableActividadEstado":
            aValue = a.entregableActividadEstado;
            bValue = b.entregableActividadEstado;
            break;
          case "entregableEnvioEstado":
            aValue = a.entregableEnvioEstado;
            bValue = b.entregableEnvioEstado;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    } else {
      // Default sort by date descending
      filtered.sort((a, b) => {
        const dateA = new Date(a.fechaFin);
        const dateB = new Date(b.fechaFin);
        return dateB.getTime() - dateA.getTime();
      });
    }
    
    return filtered;
  };

  // Function to sort and filter meetings
  const getSortedAndFilteredMeetings = () => {
    const filtered = meetings.filter(meeting => {
      const statusMatch = meetingFilters.estado.length === 0 || 
        meetingFilters.estado.includes("programada"); // All meetings are "programada" for now
      
      return statusMatch;
    });
    
    if (meetingSortField && meetingSortDirection) {
      filtered.sort((a, b) => {
        let aValue: string | Date;
        let bValue: string | Date;

        switch (meetingSortField) {
          case "fecha":
            if (!a.fecha && !b.fecha) return 0;
            if (!a.fecha) return 1;
            if (!b.fecha) return -1;
            aValue = new Date(a.fecha);
            bValue = new Date(b.fecha);
            break;
          case "duracion":
            aValue = a.duracion || "";
            bValue = b.duracion || "";
            break;
          case "estado":
            aValue = "programada"; // All meetings have same status for now
            bValue = "programada";
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return meetingSortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return meetingSortDirection === "asc" ? 1 : -1;
        return 0;
      });
    } else {
      // Default sort by date descending
      filtered.sort((a, b) => {
        if (!a.fecha && !b.fecha) return 0;
        if (!a.fecha) return 1;
        if (!b.fecha) return -1;
        const dateA = new Date(a.fecha);
        const dateB = new Date(b.fecha);
        return dateB.getTime() - dateA.getTime();
      });
    }
    
    return filtered;
  };

  const sortedAndFilteredTimeline = getSortedAndFilteredTimeline();
  const sortedAndFilteredMeetings = getSortedAndFilteredMeetings();

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(filterArray => filterArray.length > 0);
  const hasActiveMeetingFilters = Object.values(meetingFilters).some(filterArray => filterArray.length > 0);

  useEffect(() => {
    console.log("StudentId recibido:", studentId);

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const studentIdNumber = parseInt(studentId, 10);
        
        // Primero obtenemos los datos del estudiante
        const studentData = await advisorService.getStudentDetails(studentIdNumber);
        console.log("Datos del estudiante recibidos:", studentData);
        setStudent(studentData);

        // Luego intentamos obtener el timeline y las reuniones
        try {
          const timelineData = await advisorService.getStudentTimeline(studentIdNumber);
          console.log("Datos del timeline recibidos:", timelineData);
          setTimeline(Array.isArray(timelineData) ? timelineData : []);
        } catch (timelineError) {
          console.error("Error al cargar el timeline:", timelineError);
          setTimeline([]);
        }

        try {
          const meetingsData = await advisorService.getStudentMeetings(studentIdNumber);
          console.log("Datos de reuniones recibidos:", meetingsData);
          setMeetings(Array.isArray(meetingsData) ? meetingsData : []);
        } catch (meetingsError) {
          console.error("Error al cargar las reuniones:", meetingsError);
          setMeetings([]);
        }

      } catch (error) {
        console.error("Error al cargar los datos del estudiante:", error);
        setError(error instanceof Error ? error.message : "Error desconocido al cargar los datos del estudiante");
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchData();
    } else {
      console.error("No se recibió un studentId válido");
      setError("No se recibió un ID de tesista válido");
      setLoading(false);
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg">Cargando información del tesista...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[200px] gap-2">
        <div className="text-lg text-red-600">No se encontró información del tesista</div>
        <div className="text-sm text-gray-600">ID del tesista: {studentId}</div>
      </div>
    );
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

      {/* Primera Card - Información del Tesista */}
      <Card className="mb-6">
        <CardHeader className="">
          <CardTitle className="text-xl">
            {`${student.nombres} ${student.primerApellido} ${student.segundoApellido}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="">
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

            {/* Información del Asesor */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Asesoría</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {student.coasesorNombre ? "Asesor Principal:" : "Asesor:"}
                  </span>
                  <span className="text-sm font-medium">{student.asesorNombre}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Correo:</span>
                  <span className="text-sm font-medium">{student.asesorCorreo}</span>
                </div>
                {student.coasesorNombre && (
                  <>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Co-asesor:</span>
                      <span className="text-sm font-medium">{student.coasesorNombre}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Correo:</span>
                      <span className="text-sm font-medium">{student.coasesorCorreo}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Segunda Card - Información de la Tesis */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Información de la Tesis</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información del Tema */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Tema de Tesis</h3>
              <div className="space-y-2">
                <p className="text-sm font-medium">{student.tituloTema}</p>
                <p className="text-sm text-gray-600">{student.resumenTema}</p>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Área:</span>
                    <span className="text-sm font-medium">{student.areaConocimiento}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Subárea:</span>
                    <span className="text-sm font-medium">{student.subAreaConocimiento}</span>
                  </div>
                </div>
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
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Historial de Entregas</CardTitle>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                    Limpiar filtros ({Object.values(filters).flat().length})
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white table-fixed">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th 
                        className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 select-none w-28"
                        onClick={() => handleSort("fechaFin")}
                      >
                        <div className="flex items-center justify-between">
                          Fecha límite
                          <SortIcon field="fechaFin" currentField={sortField} currentDirection={sortDirection} />
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 select-none w-44"
                        onClick={() => handleSort("nombre")}
                      >
                        <div className="flex items-center justify-between">
                          Entrega
                          <SortIcon field="nombre" currentField={sortField} currentDirection={sortDirection} />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-48">Descripción</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-40">
                        <div className="flex items-center gap-2">
                          <FilterDropdown
                            options={activityStatusOptions}
                            selectedValues={filters.entregableActividadEstado}
                            onFilterChange={(value) => handleFilterChange("entregableActividadEstado", value)}
                            label="Filtrar por Estado de Actividad"
                          />
                          <div 
                            className="cursor-pointer hover:bg-gray-100 select-none flex items-center gap-1"
                            onClick={() => handleSort("entregableActividadEstado")}
                          >
                            Estado de Actividad
                            <SortIcon field="entregableActividadEstado" currentField={sortField} currentDirection={sortDirection} />
                          </div>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-36">
                        <div className="flex items-center gap-2">
                          <FilterDropdown
                            options={deliveryStatusOptions}
                            selectedValues={filters.entregableEnvioEstado}
                            onFilterChange={(value) => handleFilterChange("entregableEnvioEstado", value)}
                            label="Filtrar por Estado de Entrega"
                          />
                          <div 
                            className="cursor-pointer hover:bg-gray-100 select-none flex items-center gap-1"
                            onClick={() => handleSort("entregableEnvioEstado")}
                          >
                            Estado de Entrega
                            <SortIcon field="entregableEnvioEstado" currentField={sortField} currentDirection={sortDirection} />
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAndFilteredTimeline.length > 0 ? (
                      sortedAndFilteredTimeline.map((event) => (
                        <tr key={event.hitoId} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900 w-28">
                            {formatDate(event.fechaFin)}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 w-44">
                            {event.nombre}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 w-48">
                            <div className="break-words leading-tight">
                              {event.descripcion}
                            </div>
                          </td>
                          <td className="px-4 py-3 w-40">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
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
                          </td>
                          <td className="px-4 py-3 w-36">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
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
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          <p>No hay entregas registradas</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Línea de Tiempo</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {sortedAndFilteredTimeline.length > 0 ? (
                <div className="relative border-l border-gray-200 ml-3 pl-8 space-y-6">
                  {sortedAndFilteredTimeline.map((event) => (
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
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay eventos en la línea de tiempo</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Historial de Reuniones</CardTitle>
                {hasActiveMeetingFilters && (
                  <button
                    onClick={clearAllMeetingFilters}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                    Limpiar filtros ({Object.values(meetingFilters).flat().length})
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-md border">
                <div className="grid border-b bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500" style={{gridTemplateColumns: "150px 120px 150px 1fr"}}>
                  <div 
                    className="cursor-pointer hover:bg-gray-100 px-2 py-1 -mx-2 -my-1 rounded select-none"
                    onClick={() => handleMeetingSort("fecha")}
                  >
                    <div className="flex items-center justify-between">
                      Fecha
                      <SortIcon field="fecha" currentField={meetingSortField} currentDirection={meetingSortDirection} />
                    </div>
                  </div>
                  <div 
                    className="cursor-pointer hover:bg-gray-100 px-2 py-1 -mx-2 -my-1 rounded select-none"
                    onClick={() => handleMeetingSort("duracion")}
                  >
                    <div className="flex items-center justify-between">
                      Duración
                      <SortIcon field="duracion" currentField={meetingSortField} currentDirection={meetingSortDirection} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FilterDropdown
                      options={meetingStatusOptions}
                      selectedValues={meetingFilters.estado}
                      onFilterChange={(value) => handleMeetingFilterChange("estado", value)}
                      label="Filtrar por Estado"
                    />
                    <div 
                      className="cursor-pointer hover:bg-gray-100 px-2 py-1 -mx-2 -my-1 rounded select-none flex items-center gap-1"
                      onClick={() => handleMeetingSort("estado")}
                    >
                      Estado
                      <SortIcon field="estado" currentField={meetingSortField} currentDirection={meetingSortDirection} />
                    </div>
                  </div>
                  <div>Notas</div>
                </div>
                {sortedAndFilteredMeetings.length > 0 ? (
                  sortedAndFilteredMeetings.map((meeting, index) => (
                    <div key={index} className="grid border-b px-4 py-3 text-sm last:border-0" style={{gridTemplateColumns: "150px 120px 150px 1fr"}}>
                      <div>{meeting.fecha ? formatDate(meeting.fecha) : "Fecha pendiente"}</div>
                      <div>{meeting.duracion || "Por definir"}</div>
                      <div>
                        <span className="inline-block rounded-full px-2 py-1 text-xs bg-yellow-100 text-yellow-800">
                          Programada
                        </span>
                      </div>
                      <div className="text-gray-700 break-words">
                        {meeting.notas || "Sin notas"}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <p>No hay reuniones programadas</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
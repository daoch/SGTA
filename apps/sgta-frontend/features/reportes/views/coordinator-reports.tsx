"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { BarChartHorizontal, ChevronDown, ChevronsUpDown, ChevronUp, Download, FileSpreadsheet, Loader2, PieChart, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  obtenerDesempenoAsesores,
  obtenerDistribucionAsesores,
  obtenerDistribucionJurados,
  obtenerTemasPorArea,
  obtenerTendenciasTemas
} from "../services/report-services";

import { ExportModal, type ExportConfig } from "../components/export-modal";
import type {
  AdvisorDistribution,
  JurorDistribution,
  AdvisorPerformance as ServiceAdvisorPerformance,
  TopicArea as ServiceTopicArea,
  TopicTrend
} from "../types/coordinator-reports.type";
import { ExcelExportBackendService } from "../services/excel-export-backend.service";

// Componente de loading centrado
const CenteredLoading = ({ height = "400px" }: { height?: string }) => (
  <div className="flex items-center justify-center" style={{ height }}>
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      <span className="text-sm text-gray-500">Cargando...</span>
    </div>
  </div>
);

type AdvisorPerformance = {
  name: string;
  department: string;
  progress: number;
  students: number;
};

type Distribution = { name: string; count: number; department: string };

type LineChartDatum = { name: string; [key: string]: number | string };

type TopicArea = { area: string; count: number };

export function CoordinatorReports() {
  const { user } = useAuth();
  const [semesterFilter, setSemesterFilter] = useState("2025-1");
  const [themeAreaChartType, setThemeAreaChartType] = useState("horizontal-bar"); // 'horizontal-bar', 'pie'
  const [selectedTopicsChart, setSelectedTopicsChart] = useState("areas"); // 'areas', 'trends'

  // Data for thesis topics by area
  const [thesisTopicsByArea, setThesisTopicsByArea] = useState<TopicArea[]>([]);
  const [loadingTopicsByArea, setLoadingTopicsByArea] = useState(false);

  // Transformar datos para gráfico de líneas
  const [lineChartData, setLineChartData] = useState<LineChartDatum[]>([]);
  const [loadingLineChart, setLoadingLineChart] = useState(false);

  // Data for advisor distribution
  const [advisorDistribution, setAdvisorDistribution] = useState<Distribution[]>([]);
  const [loadingAdvisorDistribution, setLoadingAdvisorDistribution] = useState(false);

  // Data for jury distribution
  const [juryDistribution, setJuryDistribution] = useState<Distribution[]>([]);
  const [loadingJuryDistribution, setLoadingJuryDistribution] = useState(false);

  // Data for advisor performance
  const [advisorPerformance, setAdvisorPerformance] = useState<AdvisorPerformance[]>([]);
  const [loadingAdvisorPerformance, setLoadingAdvisorPerformance] = useState(false);

  // Ordenamiento para la tabla comparativa
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc"
  });

  // Filtros para la tabla comparativa
  const [searchFilter, setSearchFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState<string[]>([]);
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);

  // Nuevos estados para filtros de desempeño
  const [performanceSearchFilter, setPerformanceSearchFilter] = useState<string[]>([]);
  const [performanceAreaFilter, setPerformanceAreaFilter] = useState<string[]>([]);
  const [isPerformanceAreaDropdownOpen, setIsPerformanceAreaDropdownOpen] = useState(false);
  const [isPerformanceAdvisorDropdownOpen, setIsPerformanceAdvisorDropdownOpen] = useState(false);

  // Estado para el modal de exportación
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Función para normalizar texto sin tildes
  const normalizeText = (text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // Lógica de filtrado para el desempeño de asesores
  const uniquePerformanceAreas = Array.from(new Set(advisorPerformance.map(advisor => advisor.department))).sort();
  const uniquePerformanceAdvisors = Array.from(new Set(advisorPerformance.map(advisor => advisor.name))).sort();
  
  const filteredAdvisors = advisorPerformance.filter(advisor => {
    const matchesSearch = performanceSearchFilter.length === 0 || 
      performanceSearchFilter.includes(advisor.name);
    
    const matchesArea = performanceAreaFilter.length === 0 || 
      performanceAreaFilter.includes(advisor.department);

    return matchesSearch && matchesArea;
  });

  // Colores para el gráfico de pastel
  const COLORS = ["#002855", "#006699", "#0088cc", "#00aaff", "#33bbff", "#66ccff", "#99ddff"];

  // Función para exportar reporte
  const handleExport = async (config: ExportConfig) => {
    setIsExporting(true);
    try {
      await ExcelExportBackendService.exportToExcel(semesterFilter, config);
      // Mostrar notificación de éxito
      console.log("Reporte exportado exitosamente");
    } catch (error) {
      console.error("Error al exportar:", error);
      // Mostrar notificación de error
      alert("Error al exportar el reporte. Por favor, inténtalo de nuevo.");
    } finally {
      setIsExporting(false);
    }
  };

  // Función para manejar ordenamiento
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Función para obtener el ícono de ordenamiento
  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="h-4 w-4" />;
    }
    return sortConfig.direction === "asc" ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  // Función para obtener áreas únicas de los datos
  const getUniqueAreas = () => {
    const areas = new Set<string>();
    advisorDistribution.forEach(advisor => areas.add(advisor.department));
    juryDistribution.forEach(jury => areas.add(jury.department));
    return Array.from(areas).sort();
  };

  // Función para manejar cambios en filtro de área (checkbox)
  const handleAreaFilterChange = (area: string, checked: boolean) => {
    if (checked) {
      setAreaFilter(prev => [...prev, area]);
    } else {
      setAreaFilter(prev => prev.filter(a => a !== area));
    }
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchFilter("");
    setAreaFilter([]);
  };

  // Efecto para cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isAreaDropdownOpen && !target.closest("[data-area-dropdown]")) {
        setIsAreaDropdownOpen(false);
      }
      if (isPerformanceAreaDropdownOpen && !target.closest("[data-performance-area-dropdown]")) {
        setIsPerformanceAreaDropdownOpen(false);
      }
      if (isPerformanceAdvisorDropdownOpen && !target.closest("[data-performance-advisor-dropdown]")) {
        setIsPerformanceAdvisorDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAreaDropdownOpen, isPerformanceAreaDropdownOpen, isPerformanceAdvisorDropdownOpen]);

  const [selectedDistributionChart, setSelectedDistributionChart] = useState("advisors");

  // Descripciones para tooltips
  const topicsDescriptions = {
    areas: "Muestra la cantidad de temas de tesis distribuidos por área de conocimiento",
    trends: "Visualiza la evolución histórica de temas por área a través de los años"
  };

  const distributionDescriptions = {
    advisors: "Cantidad de tesistas asignados como asesorados por cada docente",
    jury: "Número de veces que cada docente ha participado como jurado",
    comparison: "Cantidad de veces que cada docente ha participado como asesor y como jurado"
  };

  useEffect(() => {
    // Solo ejecutar si el usuario está disponible
    if (!user) return;

    const fetchTopicsAreas = async () => {
      try {
        setLoadingTopicsByArea(true);
        const data = await obtenerTemasPorArea(semesterFilter);
        const normalized = data.map((item: ServiceTopicArea) => ({
          area: item.areaName,
          count: item.topicCount,
        }));
        setThesisTopicsByArea(normalized);
      } catch (error) {
        console.log("Error al cargar los temas por area:", error);
        setThesisTopicsByArea([]);
      } finally {
        setLoadingTopicsByArea(false);
      }
    };

    const fetchAdvisorsDistribution = async () => {
      try {
        setLoadingAdvisorDistribution(true);
        const data = await obtenerDistribucionAsesores(semesterFilter);
        setAdvisorDistribution(data.map((item: AdvisorDistribution) => ({
          name: item.teacherName,
          count: item.count,
          department: item.areaName,
        })));
      } catch (error) {
        console.log("Error al cargar las distribuciones por asesor:", error);
      } finally {
        setLoadingAdvisorDistribution(false);
      }
    };

    const fetchJurorsDistribution = async () => {
      try {
        setLoadingJuryDistribution(true);
        const data = await obtenerDistribucionJurados(semesterFilter);
        setJuryDistribution(data.map((item: JurorDistribution) => ({
          name: item.teacherName,
          count: item.count,
          department: item.areaName,
        })));
      } catch (error) {
        console.log("Error al cargar las distribuciones por jurado:", error);
      } finally {
        setLoadingJuryDistribution(false);
      }
    };

    const fetchAdvisorPerformance = async () => {
      try {
        setLoadingAdvisorPerformance(true);
        const data = await obtenerDesempenoAsesores(semesterFilter);
        setAdvisorPerformance(
          data.map((item: ServiceAdvisorPerformance) => ({
            name: item.advisorName,
            department: item.areaName,
            progress: item.performancePercentage,
            students: item.totalStudents,
          }))
        );
      } catch (error) {
        console.log("Error al cargar el desempeño:", error);
        setAdvisorPerformance([]);
      } finally {
        setLoadingAdvisorPerformance(false);
      }
    };

    fetchTopicsAreas();
    fetchAdvisorsDistribution();
    fetchJurorsDistribution();
    fetchAdvisorPerformance();
  }, [semesterFilter, user?.id]);

  const findTopicCount = (responseData: TopicTrend[], year: number, area: string) => {
    const found = responseData.find(item => item.year === year && item.areaName === area);
    return found ? found.topicCount : 0;
  };


  useEffect(() => {
    // Solo ejecutar si el usuario está disponible
    if (!user?.id) return;

    const transformTrendsData = (responseData: TopicTrend[]) => {
      const years = Array.from(new Set(responseData.map(item => item.year))).sort((a, b) => a - b);
      const areas = Array.from(new Set(responseData.map(item => item.areaName)));

      return years.map(year => {
        const entry: { name: string; [key: string]: string | number } = { name: year.toString() };
        areas.forEach(area => {
          entry[area] = findTopicCount(responseData, year, area);
        });
        return entry;
      });
    };

    const fetchTopicTrends = async () => {
      try {
        setLoadingLineChart(true);
        const data = await obtenerTendenciasTemas();
        setLineChartData(transformTrendsData(data));
      } catch (error) {
        console.error("Error al cargar los temas por area:", error);
      } finally {
        setLoadingLineChart(false);
      }
    };
    fetchTopicTrends();
  }, [user?.id]);


  const areaNames = lineChartData.length > 0
    ? Object.keys(lineChartData[0]).filter(key => key !== "name")
    : [];
  const areaColors = ["#002855", "#006699", "#0088cc", "#00aaff", "#33bbff", "#66ccff", "#99ddff"];

  function toTitleCase(input:string) {
    const str = String(input ?? "");
    const lowerWords = ["de", "la", "del", "y", "en", "a", "el", "los", "las", "por", "con", "para"];
    return str
      .split(" ")
      .map((word: string, idx: number) => {
        if (idx !== 0 && lowerWords.includes(word.toLowerCase())) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }

  const renderTopicsAreaChart = () => {
    if (loadingTopicsByArea) {
      return <CenteredLoading />;
    }

    if (thesisTopicsByArea.length === 0) {
      return <div className="text-center text-gray-500 py-8 text-base">No hay datos para este ciclo.</div>;
    }

    if (themeAreaChartType === "horizontal-bar") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <RechartsBarChart
            layout="vertical"
            data={thesisTopicsByArea}
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="area" tickFormatter={toTitleCase} />
            <Tooltip />
            <Bar dataKey="count" fill="#006699" />
          </RechartsBarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <RechartsPieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Pie
            data={thesisTopicsByArea}
            cx="45%"
            cy="50%"
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            outerRadius={130}
            fill="#8884d8"
            dataKey="count"
          >
            {thesisTopicsByArea.map((entry, index) => (
              <Cell key={entry.area} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name, props) => [
              `${value} temas`, 
              toTitleCase(props.payload.area)
            ]}
            labelFormatter={() => ""}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ 
              paddingRight: "50px"
            }}
            payload={thesisTopicsByArea.map((item, index) => ({
              id: item.area,
              type: "square",
              value: `${toTitleCase(item.area)} (${item.count})`,
              color: COLORS[index % COLORS.length],
            }))}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    );
  };

  const renderTrendsChart = () => {
    if (loadingLineChart) {
      return <CenteredLoading />;
    }

    if (lineChartData.length === 0) {
      return <div className="text-center text-gray-500 py-8 text-base">No hay datos para este ciclo.</div>;
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <RechartsLineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tickFormatter={toTitleCase} />
          <YAxis />
          <Tooltip />
          <Legend />
          {areaNames.map((area, idx) => (
            <Line
              key={area}
              type="monotone"
              dataKey={area}
              stroke={areaColors[idx % areaColors.length]}
              activeDot={{ r: 8 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    );
  };

  const renderAdvisorDistribution = () => {
    if (loadingAdvisorDistribution) {
      return <CenteredLoading />;
    }

    if (advisorDistribution.length === 0) {
      return <div className="text-center text-gray-500 py-8 text-base">No hay datos para este ciclo.</div>;
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <RechartsBarChart
          layout="vertical"
          data={advisorDistribution}
          margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis 
            type="category" 
            dataKey="name" 
            tickFormatter={toTitleCase}
            width={80}
          />
          <Tooltip />
          <Bar dataKey="count" fill="#006699" />
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  };

  const renderJuryDistribution = () => {
    if (loadingJuryDistribution) {
      return <CenteredLoading />;
    }

    if (juryDistribution.length === 0) {
      return <div className="text-center text-gray-500 py-8 text-base">No hay datos para este ciclo.</div>;
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <RechartsBarChart
          layout="vertical"
          data={juryDistribution}
          margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis 
            type="category" 
            dataKey="name" 
            tickFormatter={toTitleCase}
            width={80}
          />
          <Tooltip />
          <Bar dataKey="count" fill="#002855" />
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  };

  const renderDistributionContent = () => {
    switch (selectedDistributionChart) {
      case "advisors":
        return renderAdvisorDistribution();
      case "jury":
        return renderJuryDistribution();
      default:
        return (
          <div>
            {advisorDistribution.length === 0 && juryDistribution.length === 0 ? (
              <div className="text-center text-gray-500 py-8 text-base">
                No hay información de carga para este ciclo.
              </div>
            ) : (
              <>
                {/* Barra de búsqueda y filtros */}
                <div className="mb-2 flex flex-col sm:flex-row gap-4 px-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre de docente..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full pl-10 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    />
                  </div>
                  <div className="relative" style={{ width: "280px", minWidth: "280px", maxWidth: "280px" }} data-area-dropdown>
                    <button
                      type="button"
                      onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <span className="text-gray-700">
                        {areaFilter.length === 0 
                          ? "Filtrar por áreas" 
                          : `${areaFilter.length} área${areaFilter.length > 1 ? "s" : ""} seleccionada${areaFilter.length > 1 ? "s" : ""}`
                        }
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isAreaDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isAreaDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                        <div className="p-3">
                          <div className="text-sm font-medium text-gray-700 mb-2">Seleccionar áreas:</div>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {getUniqueAreas().map((area) => (
                              <label key={area} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                <input
                                  type="checkbox"
                                  checked={areaFilter.includes(area)}
                                  onChange={(e) => handleAreaFilterChange(area, e.target.checked)}
                                  className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{toTitleCase(area)}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón limpiar filtros - espacio pequeño reservado */}
                <div className="flex justify-end mb-4 px-6" style={{ height: "20px" }}>
                  {(searchFilter || areaFilter.length > 0) && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={clearFilters}
                      className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 h-5 flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      Limpiar filtros
                    </Button>
                  )}
                </div>

                <div className="overflow-x-auto px-6 pb-4">
                  <table className="w-full min-w-[600px] border-collapse bg-white rounded-lg shadow-sm">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th 
                          className="px-6 py-4 text-left text-base font-medium text-gray-600 cursor-pointer hover:bg-gray-100 select-none transition-colors"
                          onClick={() => handleSort("name")}
                        >
                          <div className="flex items-center justify-between">
                            <span>Docente</span>
                            <span className="text-sm">{getSortIcon("name")}</span>
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-base font-medium text-gray-600 cursor-pointer hover:bg-gray-100 select-none transition-colors"
                          onClick={() => handleSort("department")}
                        >
                          <div className="flex items-center justify-between">
                            <span>Área</span>
                            <span className="text-sm">{getSortIcon("department")}</span>
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-center text-base font-medium text-gray-600 cursor-pointer hover:bg-gray-100 select-none transition-colors"
                          onClick={() => handleSort("advisorCount")}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span>Asesor</span>
                            <span className="text-sm">{getSortIcon("advisorCount")}</span>
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-center text-base font-medium text-gray-600 cursor-pointer hover:bg-gray-100 select-none transition-colors"
                          onClick={() => handleSort("juryCount")}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span>Jurado</span>
                            <span className="text-sm">{getSortIcon("juryCount")}</span>
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-center text-base font-medium text-gray-600 cursor-pointer hover:bg-gray-100 select-none transition-colors"
                          onClick={() => handleSort("total")}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span>Total</span>
                            <span className="text-sm">{getSortIcon("total")}</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(() => {
                        // Crear una lista combinada de todos los docentes únicos
                        const allTeachers = new Map<string, { name: string; department: string; advisorCount: number; juryCount: number }>();
                        
                        // Agregar asesores
                        advisorDistribution.forEach((advisor) => {
                          allTeachers.set(advisor.name, {
                            name: advisor.name,
                            department: advisor.department,
                            advisorCount: advisor.count,
                            juryCount: 0
                          });
                        });
                        
                        // Agregar o actualizar con información de jurados
                        juryDistribution.forEach((jury) => {
                          if (allTeachers.has(jury.name)) {
                            // Si ya existe como asesor, actualizar el conteo de jurado
                            const existing = allTeachers.get(jury.name)!;
                            existing.juryCount = jury.count;
                          } else {
                            // Si solo es jurado, agregarlo con 0 asesorías
                            allTeachers.set(jury.name, {
                              name: jury.name,
                              department: jury.department,
                              advisorCount: 0,
                              juryCount: jury.count
                            });
                          }
                        });

                        // Convertir a array
                        let teachersList = Array.from(allTeachers.values());

                        // Aplicar filtros de búsqueda y área
                        teachersList = teachersList.filter((teacher) => {
                          const matchesSearch = !searchFilter || 
                            normalizeText(teacher.name).includes(normalizeText(searchFilter));
                          
                          const matchesArea = areaFilter.length === 0 || 
                            areaFilter.includes(teacher.department);

                          return matchesSearch && matchesArea;
                        });

                        // Aplicar ordenamiento
                        if (sortConfig.key) {
                          teachersList.sort((a, b) => {
                            let aValue: string | number;
                            let bValue: string | number;

                            switch (sortConfig.key) {
                              case "name":
                                aValue = a.name.toLowerCase();
                                bValue = b.name.toLowerCase();
                                break;
                              case "department":
                                aValue = a.department.toLowerCase();
                                bValue = b.department.toLowerCase();
                                break;
                              case "advisorCount":
                                aValue = a.advisorCount;
                                bValue = b.advisorCount;
                                break;
                              case "juryCount":
                                aValue = a.juryCount;
                                bValue = b.juryCount;
                                break;
                              case "total":
                                aValue = a.advisorCount + a.juryCount;
                                bValue = b.advisorCount + b.juryCount;
                                break;
                              default:
                                return 0;
                            }

                            if (aValue < bValue) {
                              return sortConfig.direction === "asc" ? -1 : 1;
                            }
                            if (aValue > bValue) {
                              return sortConfig.direction === "asc" ? 1 : -1;
                            }
                            return 0;
                          });
                        } else {
                          // Ordenamiento por defecto: por nombre
                          teachersList.sort((a, b) => a.name.localeCompare(b.name));
                        }

                        return teachersList.map((teacher) => {
                          const total = teacher.advisorCount + teacher.juryCount;

                          return (
                            <tr key={`${teacher.name}-${teacher.department}`} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 text-base font-medium text-gray-900">{toTitleCase(teacher.name)}</td>
                              <td className="px-6 py-4 text-base text-gray-600">{toTitleCase(teacher.department)}</td>
                              <td className="px-6 py-4 text-base text-center text-gray-900">{teacher.advisorCount}</td>
                              <td className="px-6 py-4 text-base text-center text-gray-900">{teacher.juryCount}</td>
                              <td className="px-6 py-4 text-base text-center font-semibold text-gray-900">{total}</td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        );
    }
  };

  const renderPerformanceContent = () => {
    if (loadingAdvisorPerformance) {
      return <CenteredLoading />;
    }

    if (advisorPerformance.length === 0) {
      return <div className="text-center text-gray-500 py-8 text-base">No hay datos para este ciclo.</div>;
    }

    return (
      <>
        {/* Filtros */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1" data-performance-advisor-dropdown>
            <button
              type="button"
              onClick={() => setIsPerformanceAdvisorDropdownOpen(!isPerformanceAdvisorDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <span className="text-gray-700">
                {performanceSearchFilter.length === 0 
                  ? "Seleccionar asesores" 
                  : `${performanceSearchFilter.length} asesor${performanceSearchFilter.length > 1 ? "es" : ""} seleccionado${performanceSearchFilter.length > 1 ? "s" : ""}`
                }
              </span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isPerformanceAdvisorDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {isPerformanceAdvisorDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="p-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Seleccionar asesores:</div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {uniquePerformanceAdvisors.map((advisor) => (
                      <label key={advisor} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={performanceSearchFilter.includes(advisor)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPerformanceSearchFilter(prev => [...prev, advisor]);
                            } else {
                              setPerformanceSearchFilter(prev => prev.filter(a => a !== advisor));
                            }
                          }}
                          className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{toTitleCase(advisor)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="relative" style={{ width: "280px", minWidth: "280px", maxWidth: "280px" }} data-performance-area-dropdown>
            <button
              type="button"
              onClick={() => setIsPerformanceAreaDropdownOpen(!isPerformanceAreaDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <span className="text-gray-700">
                {performanceAreaFilter.length === 0 
                  ? "Filtrar por áreas" 
                  : `${performanceAreaFilter.length} área${performanceAreaFilter.length > 1 ? "s" : ""} seleccionada${performanceAreaFilter.length > 1 ? "s" : ""}`
                }
              </span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isPerformanceAreaDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {isPerformanceAreaDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="p-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Seleccionar áreas:</div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uniquePerformanceAreas.map((area) => (
                      <label key={area} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={performanceAreaFilter.includes(area)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPerformanceAreaFilter(prev => [...prev, area]);
                            } else {
                              setPerformanceAreaFilter(prev => prev.filter(a => a !== area));
                            }
                          }}
                          className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{toTitleCase(area)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {(performanceSearchFilter.length > 0 || performanceAreaFilter.length > 0) && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setPerformanceSearchFilter([]);
                setPerformanceAreaFilter([]);
              }}
              className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 h-full flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Grid de tarjetas de desempeño */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
          {filteredAdvisors.map((advisor) => (
            <div key={`${advisor.name}-${advisor.department}`} className="space-y-1">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-medium">{toTitleCase(advisor.name)}</h3>
                  <p className="text-sm text-gray-500">{toTitleCase(advisor.department)}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold">{advisor.progress}%</span>
                  <span className="text-sm text-gray-500 ml-1">({advisor.students} tesistas)</span>
                </div>
              </div>
              <Progress
                value={advisor.progress}
                className="h-3 bg-gray-200"
                indicatorClassName="bg-[#002855]"
              />
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="topics">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="text-base">
            <TabsTrigger value="topics" className="text-base">Temas y Áreas</TabsTrigger>
            <TabsTrigger value="distribution" className="text-base">Distribución de Jurados y Asesores</TabsTrigger>
            <TabsTrigger value="performance" className="text-base">Desempeño de Asesores</TabsTrigger>
          </TabsList>
          <div className="flex gap-3 items-center">
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger className="w-[160px] text-base">
                <SelectValue placeholder="Seleccionar ciclo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-1" className="text-base">2025-1</SelectItem>
                <SelectItem value="2024-2" className="text-base">2024-2</SelectItem>
                <SelectItem value="2024-1" className="text-base">2024-1</SelectItem>
                <SelectItem value="2023-2" className="text-base">2023-2</SelectItem>
                <SelectItem value="2023-1" className="text-base">2023-1</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="gap-2 text-base"
              disabled={isExporting}
              onClick={() => setIsExportModalOpen(true)}
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isExporting ? "Exportando..." : "Exportar"}
            </Button>
          </div>
        </div>
        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Visualización de Temas</CardTitle>
                <Select value={selectedTopicsChart} onValueChange={setSelectedTopicsChart}>
                  <SelectTrigger className="w-[280px] text-base">
                    <SelectValue placeholder="Seleccionar visualización" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="areas" className="text-base">Distribución de Temas por Área</SelectItem>
                    <SelectItem value="trends" className="text-base">Tendencias de Temas por Año</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-base text-gray-600 pt-2">{topicsDescriptions[selectedTopicsChart as keyof typeof topicsDescriptions]}</p>
            </CardHeader>
            <CardContent className="p-0">
              {selectedTopicsChart === "areas" ? (
                <div>
                  <div className="flex items-center justify-end gap-1 px-4 py-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${themeAreaChartType === "horizontal-bar" ? "bg-gray-100" : ""}`}
                      onClick={() => setThemeAreaChartType("horizontal-bar")}
                      title="Gráfico de barras horizontal"
                    >
                      <BarChartHorizontal className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${themeAreaChartType === "pie" ? "bg-gray-100" : ""}`}
                      onClick={() => setThemeAreaChartType("pie")}
                      title="Gráfico circular"
                    >
                      <PieChart className="h-4 w-4" />
                    </Button>
                  </div>
                  {renderTopicsAreaChart()}
                </div>
              ) : (
                <div>
                  {renderTrendsChart()}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Distribución de Carga</CardTitle>
                <Select value={selectedDistributionChart} onValueChange={setSelectedDistributionChart}>
                  <SelectTrigger className="w-[280px] text-base">
                    <SelectValue placeholder="Seleccionar visualización" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="advisors" className="text-base">Asesores por Docente</SelectItem>
                    <SelectItem value="jury" className="text-base">Jurados por Docente</SelectItem>
                    <SelectItem value="comparison" className="text-base">Asesorías vs Jurado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-base text-gray-600 pt-2">{distributionDescriptions[selectedDistributionChart as keyof typeof distributionDescriptions]}</p>
            </CardHeader>
            <CardContent className="p-0">
              {renderDistributionContent()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Desempeño de Asesores</CardTitle>
              <p className="text-base text-gray-600 pt-2">
                Promedio de avance de tesistas por asesor
              </p>
            </CardHeader>
            <CardContent className="px-6">
              {renderPerformanceContent()}
              {advisorPerformance.length > 0 && (
                <div className="mt-8 -mx-6">
                  <div className="px-6">
                    <h3 className="text-base font-medium mb-6">Comparativa de Eficiencia</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={Math.max(450, filteredAdvisors.length * 60 + 50)}>
                    <RechartsBarChart layout="vertical" data={filteredAdvisors} margin={{top: 20, right: 30, left: 30, bottom: 60}}>
                      <CartesianGrid strokeDasharray="3 3"/>
                      <XAxis xAxisId="left" type="number" orientation="bottom" stroke="#002855" tick={{fontSize: 15}} allowDecimals={false} label={{ value: "Progreso (%)", position: "insideBottom", offset: -10, style: { textAnchor: "middle", fontSize: "14px", fill: "#002855" } }}/>
                      <XAxis xAxisId="right" type="number" orientation="top" stroke="#006699" tick={{fontSize: 15}} allowDecimals={false} label={{ value: "Número de Tesistas", position: "insideTop", offset: -15, style: { textAnchor: "middle", fontSize: "14px", fill: "#006699" } }}/>
                      <YAxis type="category" dataKey="name" tickFormatter={toTitleCase} tick={{fontSize: 15}} width={130}/>
                      <Tooltip/>
                      <Legend wrapperStyle={{fontSize: "15px", marginTop: "25px", paddingTop: "15px"}}/>
                      <Bar xAxisId="left" dataKey="progress" name="Progreso (%)" fill="#002855"/>
                      <Bar xAxisId="right" dataKey="students" name="Tesistas" fill="#006699"/>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Exportación */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>

  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { ciclosService } from "@/features/configuracion/services/etapa-formativa-ciclo";
import { useIsMobile } from "@/hooks/use-mobile";
import { BarChartHorizontal, ChevronDown, ChevronsUpDown, ChevronUp, Download, Loader2, PieChart, Search, X } from "lucide-react";
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
import { ExcelExportBackendService } from "../services/excel-export-backend.service";
import type {
  AdvisorDistribution,
  JurorDistribution,
  AdvisorPerformance as ServiceAdvisorPerformance,
  TopicArea as ServiceTopicArea,
  TopicTrend
} from "../types/coordinator-reports.type";

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
  const isMobile = useIsMobile();
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [themeAreaChartType, setThemeAreaChartType] = useState("horizontal-bar"); // 'horizontal-bar', 'pie'
  const [selectedTopicsChart, setSelectedTopicsChart] = useState("areas"); // 'areas', 'trends'
  const [selectedEtapaFormativa, setSelectedEtapaFormativa] = useState("all"); // Filtro para etapa formativa
  const [yearRangeStart, setYearRangeStart] = useState<string>("all"); // Año de inicio del rango
  const [yearRangeEnd, setYearRangeEnd] = useState<string>("all"); // Año de fin del rango

  // Data for thesis topics by area
  const [thesisTopicsByArea, setThesisTopicsByArea] = useState<TopicArea[]>([]);
  const [loadingTopicsByArea, setLoadingTopicsByArea] = useState(false);

  // Estados para ciclos
  const [ciclos, setCiclos] = useState<{id: number, semestre: string, anio: number, activo: boolean}[]>([]);
  const [loadingCiclos, setLoadingCiclos] = useState(false);

  // Años únicos disponibles
  const availableYears = Array.from(new Set(ciclos.map(ciclo => ciclo.anio))).sort((a, b) => b - a);
  
  // Semestres disponibles para el año seleccionado
  const availableSemesters = selectedYear 
    ? ciclos.filter(ciclo => ciclo.anio === parseInt(selectedYear)).map(ciclo => ciclo.semestre).sort()
    : [];

  // Filtro combinado para compatibilidad con el resto del código
  const semesterFilter = selectedYear && selectedSemester ? `${selectedYear}-${selectedSemester}` : "";

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
  
  // Estados para búsqueda en filtros
  const [advisorSearchTerm, setAdvisorSearchTerm] = useState("");
  const [areaSearchTerm, setAreaSearchTerm] = useState("");

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
        setAreaSearchTerm("");
      }
      if (isPerformanceAdvisorDropdownOpen && !target.closest("[data-performance-advisor-dropdown]")) {
        setIsPerformanceAdvisorDropdownOpen(false);
        setAdvisorSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAreaDropdownOpen, isPerformanceAreaDropdownOpen, isPerformanceAdvisorDropdownOpen]);

  const [selectedDistributionChart, setSelectedDistributionChart] = useState("advisors");
  const [activeTab, setActiveTab] = useState("topics");

  // Descripciones para tooltips
  const topicsDescriptions = {
    areas: "Muestra la cantidad de temas de tesis distribuidos por área de conocimiento",
    trends: "Visualiza la evolución histórica de temas por área a través de los años. Puede filtrarse por etapa formativa específica."
  };

  const distributionDescriptions = {
    advisors: "Cantidad de tesistas asignados como asesorados por cada docente",
    jury: "Número de veces que cada docente ha participado como jurado",
    comparison: "Cantidad de veces que cada docente ha participado como asesor y como jurado"
  };

  useEffect(() => {
    // Solo ejecutar si el usuario está disponible
    if (!user) return;

    const fetchCiclos = async () => {
      try {
        setLoadingCiclos(true);
        const data = await ciclosService.getAll();
        // Filtrar solo los ciclos activos
        const ciclosActivos = data.filter((ciclo: {activo: boolean}) => ciclo.activo === true);
        setCiclos(ciclosActivos);
        // Si no hay año/semestre seleccionado y hay ciclos disponibles, seleccionar el primero
        if (!selectedYear && !selectedSemester && ciclosActivos.length > 0) {
          const primerCiclo = ciclosActivos[0];
          setSelectedYear(primerCiclo.anio.toString());
          setSelectedSemester(primerCiclo.semestre);
        }
      } catch (error) {
        console.log("Error al cargar los ciclos:", error);
        setCiclos([]);
      } finally {
        setLoadingCiclos(false);
      }
    };

    fetchCiclos();
  }, [user]);

  useEffect(() => {
    // Resetear semestre si no está disponible para el año seleccionado
    if (selectedYear && selectedSemester && !availableSemesters.includes(selectedSemester)) {
      setSelectedSemester("");
    }
  }, [selectedYear, availableSemesters, selectedSemester]);

  useEffect(() => {
    // Solo ejecutar si el usuario está disponible y hay un ciclo seleccionado
    if (!user || !semesterFilter) return;

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


  // Estado para las etapas formativas disponibles
  const [availableEtapasFormativas, setAvailableEtapasFormativas] = useState<string[]>([]);
  // Estado para los años disponibles en los datos de tendencias
  const [trendsAvailableYears, setTrendsAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    // Solo ejecutar si el usuario está disponible
    if (!user?.id) return;

    const transformTrendsData = (responseData: TopicTrend[], etapaFormativaFilter: string = "all", startYear?: number, endYear?: number) => {
      let years = Array.from(new Set(responseData.map(item => item.year))).sort((a, b) => a - b);
      
      // Filtrar años por rango si se especifica
      if (startYear && endYear) {
        years = years.filter(year => year >= startYear && year <= endYear);
      }
      
      const areas = Array.from(new Set(responseData.map(item => item.areaName)));

      return years.map(year => {
        const entry: { name: string; [key: string]: string | number } = { name: year.toString() };
        areas.forEach(area => {
          if (etapaFormativaFilter === "all") {
            // Usar el topicCount total como antes
            entry[area] = findTopicCount(responseData, year, area);
          } else {
            // Filtrar por etapa formativa específica
            const found = responseData.find(item => item.year === year && item.areaName === area);
            if (found && found.etapasFormativasCount) {
              entry[area] = found.etapasFormativasCount[etapaFormativaFilter] || 0;
            } else {
              entry[area] = 0;
            }
          }
        });
        return entry;
      });
    };

    const fetchTopicTrends = async () => {
      try {
        setLoadingLineChart(true);
        const data = await obtenerTendenciasTemas();
        
        // Extraer todas las etapas formativas únicas
        const etapasSet = new Set<string>();
        data.forEach(item => {
          if (item.etapasFormativasCount) {
            Object.keys(item.etapasFormativasCount).forEach(etapa => etapasSet.add(etapa));
          }
        });
        setAvailableEtapasFormativas(Array.from(etapasSet).sort());
        
        // Extraer años únicos de los datos de tendencias
        const yearsInData = Array.from(new Set(data.map(item => item.year))).sort((a, b) => a - b);
        setTrendsAvailableYears(yearsInData);
        
        // Aplicar filtros
        const startYear = yearRangeStart !== "all" ? parseInt(yearRangeStart) : undefined;
        const endYear = yearRangeEnd !== "all" ? parseInt(yearRangeEnd) : undefined;
        setLineChartData(transformTrendsData(data, selectedEtapaFormativa, startYear, endYear));
      } catch (error) {
        console.error("Error al cargar los temas por area:", error);
      } finally {
        setLoadingLineChart(false);
      }
    };
    fetchTopicTrends();
  }, [user?.id, selectedEtapaFormativa, yearRangeStart, yearRangeEnd]);

  // Efecto para validar el rango de años
  useEffect(() => {
    if (yearRangeStart !== "all" && yearRangeEnd !== "all") {
      const startYear = parseInt(yearRangeStart);
      const endYear = parseInt(yearRangeEnd);
      if (startYear > endYear) {
        // Si el año de inicio es mayor que el de fin, ajustar automáticamente
        setYearRangeEnd(yearRangeStart);
      }
    }
  }, [yearRangeStart, yearRangeEnd]);

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
      return <div className="text-center text-gray-500 py-8 text-sm sm:text-base">No hay datos para este ciclo.</div>;
    }

    if (themeAreaChartType === "horizontal-bar") {
      return (
        <ResponsiveContainer width="100%" height={Math.max(150, thesisTopicsByArea.length * 80)}>
          <RechartsBarChart
            layout="vertical"
            data={thesisTopicsByArea}
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number"
              label={{ 
                value: "Cantidad de temas", 
                position: "insideBottom", 
                offset: -5, 
                style: { textAnchor: "middle", fontSize: "12px", fill: "#4b5563" } 
              }}
            />
            <YAxis type="category" dataKey="area" tickFormatter={toTitleCase} />
            <Tooltip 
              formatter={(value, name) => [`${value}`, "Total"]}
              labelFormatter={(label) => toTitleCase(label)}
            />
            <Bar dataKey="count" fill="#006699" />
          </RechartsBarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={isMobile ? 620 : 500}>
        <RechartsPieChart margin={{ 
          top: 20, 
          right: isMobile ? 25 : 20, 
          bottom: isMobile ? 160 : 100, 
          left: isMobile ? 25 : 20 
        }}>
          <Pie
            data={thesisTopicsByArea}
            cx="50%"
            cy={isMobile ? "32%" : "40%"}
            labelLine={false}
            label={({ percent }) => {
              const percentValue = (percent * 100).toFixed(0);
              // Solo mostrar porcentaje si es mayor a 3% para evitar superposición
              return parseFloat(percentValue) > 3 ? `${percentValue}%` : "";
            }}
            outerRadius={isMobile ? 85 : 140}
            fill="#8884d8"
            dataKey="count"
          >
            {thesisTopicsByArea.map((entry, index) => (
              <Cell key={entry.area} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white border border-gray-300 rounded-md p-2 shadow-lg">
                    <p className="font-medium text-xs sm:text-sm">{toTitleCase(data.area)}</p>
                    <p className="text-blue-600 text-xs sm:text-sm">
                      Total: {data.count}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            layout={isMobile ? "vertical" : "horizontal"}
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ 
              paddingTop: isMobile ? "20px" : "20px",
              paddingLeft: isMobile ? "15px" : "0px",
              paddingRight: isMobile ? "15px" : "0px",
              fontSize: isMobile ? "11px" : "14px",
              lineHeight: isMobile ? "1.8" : "1.5",
              textAlign: "center",
              width: "100%",
              maxWidth: "100%"
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
      return <div className="text-center text-gray-500 py-8 text-sm sm:text-base">No hay datos para este ciclo.</div>;
    }

    return (
      <ResponsiveContainer width="100%" height={500}>
        <RechartsLineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tickFormatter={toTitleCase} />
          <YAxis domain={[0, "dataMax + 5"]} allowDecimals={false} />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white border border-gray-300 rounded-md p-3 shadow-lg">
                    <p className="font-medium text-sm">Año: {label}</p>
                    <p className="text-xs text-gray-600 mb-1">
                      {selectedEtapaFormativa === "all" 
                        ? "Todas las etapas formativas" 
                        : `Etapa: ${toTitleCase(selectedEtapaFormativa)}`
                      }
                    </p>
                    {(yearRangeStart !== "all" || yearRangeEnd !== "all") && (
                      <p className="text-xs text-gray-500 mb-2">
                        Rango: {yearRangeStart !== "all" ? yearRangeStart : "Inicio"} - {yearRangeEnd !== "all" ? yearRangeEnd : "Fin"}
                      </p>
                    )}
                    {payload.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm">
                          {toTitleCase(String(entry.dataKey))}: {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend formatter={(value) => toTitleCase(String(value))} />
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
      return <div className="text-center text-gray-500 py-8 text-sm sm:text-base">No hay datos para este ciclo.</div>;
    }

    return (
      <ResponsiveContainer width="100%" height={Math.max(150, advisorDistribution.length * 80)}>
        <RechartsBarChart
          layout="vertical"
          data={advisorDistribution}
          margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            allowDecimals={false}
            label={{ 
              value: "Número de Tesistas", 
              position: "insideBottom", 
              offset: -5, 
              style: { textAnchor: "middle", fontSize: "12px", fill: "#4b5563" } 
            }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            tickFormatter={toTitleCase}
            width={80}
          />
          <Tooltip 
            formatter={(value, name) => [`${value}`, "Total"]}
            labelFormatter={(label) => toTitleCase(label)}
          />
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
      return <div className="text-center text-gray-500 py-8 text-sm sm:text-base">No hay datos para este ciclo.</div>;
    }

    return (
      <ResponsiveContainer width="100%" height={Math.max(150, juryDistribution.length * 80)}>
        <RechartsBarChart
          layout="vertical"
          data={juryDistribution}
          margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            allowDecimals={false}
            label={{ 
              value: "Cantidad de veces que ha sido jurado", 
              position: "insideBottom", 
              offset: -5, 
              style: { textAnchor: "middle", fontSize: "12px", fill: "#4b5563" } 
            }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            tickFormatter={toTitleCase}
            width={80}
          />
          <Tooltip 
            formatter={(value, name) => [`${value}`, "Total"]}
            labelFormatter={(label) => toTitleCase(label)}
          />
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
              <div className="text-center text-gray-500 py-8 text-sm sm:text-base">
                No hay información de carga para este ciclo.
              </div>
            ) : (
              <>
                {/* Barra de búsqueda y filtros */}
                <div className="mb-2 flex flex-col sm:flex-row gap-4 px-4 sm:px-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre de docente..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full pl-10 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div className="relative w-full sm:w-[280px] sm:min-w-[280px] sm:max-w-[280px]" data-area-dropdown>
                    <button
                      type="button"
                      onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <div className="flex justify-end mb-4 px-4 sm:px-6" style={{ height: "20px" }}>
                  {(searchFilter || areaFilter.length > 0) && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 h-5 flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      <span className="hidden sm:inline">Limpiar filtros</span>
                      <span className="sm:hidden">Limpiar</span>
                    </Button>
                  )}
                </div>

                <div className="overflow-x-auto px-4 sm:px-6 pb-4">
                  <table className="w-full min-w-[600px] border-collapse bg-white rounded-lg shadow-sm">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th 
                          className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-base font-medium text-gray-600 cursor-pointer hover:bg-gray-100 select-none transition-colors"
                          onClick={() => handleSort("name")}
                        >
                          <div className="flex items-center justify-between">
                            <span>Docente</span>
                            <span className="text-xs sm:text-sm">{getSortIcon("name")}</span>
                          </div>
                        </th>
                        <th 
                          className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-base font-medium text-gray-600 cursor-pointer hover:bg-gray-100 select-none transition-colors"
                          onClick={() => handleSort("department")}
                        >
                          <div className="flex items-center justify-between">
                            <span>Área del docente</span>
                            <span className="text-xs sm:text-sm">{getSortIcon("department")}</span>
                          </div>
                        </th>
                        <th 
                          className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-base font-medium text-gray-600 cursor-pointer hover:bg-gray-100 select-none transition-colors"
                          onClick={() => handleSort("advisorCount")}
                        >
                          <div className="flex items-center justify-center gap-1 sm:gap-2">
                            <span>Asesor</span>
                            <span className="text-xs sm:text-sm">{getSortIcon("advisorCount")}</span>
                          </div>
                        </th>
                        <th 
                          className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-base font-medium text-gray-600 cursor-pointer hover:bg-gray-100 select-none transition-colors"
                          onClick={() => handleSort("juryCount")}
                        >
                          <div className="flex items-center justify-center gap-1 sm:gap-2">
                            <span>Jurado</span>
                            <span className="text-xs sm:text-sm">{getSortIcon("juryCount")}</span>
                          </div>
                        </th>
                        <th 
                          className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-base font-medium text-gray-600 cursor-pointer hover:bg-gray-100 select-none transition-colors"
                          onClick={() => handleSort("total")}
                        >
                          <div className="flex items-center justify-center gap-1 sm:gap-2">
                            <span>Total</span>
                            <span className="text-xs sm:text-sm">{getSortIcon("total")}</span>
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
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-base font-medium text-gray-900">{toTitleCase(teacher.name)}</td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-base text-gray-600">{toTitleCase(teacher.department)}</td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-base text-center text-gray-900">{teacher.advisorCount}</td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-base text-center text-gray-900">{teacher.juryCount}</td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-base text-center font-semibold text-gray-900">{total}</td>
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
      return <div className="text-center text-gray-500 py-8 text-sm sm:text-base">No hay datos para este ciclo.</div>;
    }

    return (
      <>
        {/* Filtros */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1" data-performance-advisor-dropdown>
            <button
              type="button"
              onClick={() => setIsPerformanceAdvisorDropdownOpen(!isPerformanceAdvisorDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <span className="text-gray-700 truncate">
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
                  <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Seleccionar asesores:</div>
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Buscar asesor..."
                      value={advisorSearchTerm}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setAdvisorSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {uniquePerformanceAdvisors
                      .filter(advisor => 
                        advisorSearchTerm === "" || normalizeText(advisor).includes(normalizeText(advisorSearchTerm))
                      )
                      .map((advisor) => (
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
                          <span className="text-xs sm:text-sm text-gray-700">{toTitleCase(advisor)}</span>
                        </label>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="relative w-full sm:w-[280px] sm:min-w-[280px] sm:max-w-[280px]" data-performance-area-dropdown>
            <button
              type="button"
              onClick={() => setIsPerformanceAreaDropdownOpen(!isPerformanceAreaDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <span className="text-gray-700 truncate">
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
                  <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Seleccionar áreas:</div>
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Buscar área..."
                      value={areaSearchTerm}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setAreaSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uniquePerformanceAreas
                      .filter(area => 
                        areaSearchTerm === "" || normalizeText(area).includes(normalizeText(areaSearchTerm))
                      )
                      .map((area) => (
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
                          <span className="text-xs sm:text-sm text-gray-700">{toTitleCase(area)}</span>
                        </label>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botón limpiar filtros */}
        {(performanceSearchFilter.length > 0 || performanceAreaFilter.length > 0) && (
          <div className="flex justify-end mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setPerformanceSearchFilter([]);
                setPerformanceAreaFilter([]);
                setAdvisorSearchTerm("");
                setAreaSearchTerm("");
              }}
              className="text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              <span className="hidden sm:inline">Limpiar filtros</span>
              <span className="sm:hidden">Limpiar</span>
            </Button>
          </div>
        )}

        {/* Grid de tarjetas de desempeño */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
          {filteredAdvisors.map((advisor) => (
            <div key={`${advisor.name}-${advisor.department}`} className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-medium truncate">{toTitleCase(advisor.name)}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">{toTitleCase(advisor.department)}</p>
                </div>
                <div className="text-right sm:text-right flex-shrink-0">
                  <span className="text-base sm:text-lg font-bold">{advisor.progress}%</span>
                  <span className="text-xs sm:text-sm text-gray-500 ml-1">({advisor.students} tesistas)</span>
                </div>
              </div>
              <Progress
                value={advisor.progress}
                className="h-2 sm:h-3 bg-gray-200"
                indicatorClassName="bg-[#002855]"
              />
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <Tabs defaultValue="topics" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
          <TabsList className="text-sm sm:text-base w-full sm:w-auto">
            <TabsTrigger value="topics" className="text-xs sm:text-base flex-1 sm:flex-none">
              <span className="hidden sm:inline">Temas y Áreas</span>
              <span className="sm:hidden">Temas</span>
            </TabsTrigger>
            <TabsTrigger value="distribution" className="text-xs sm:text-base flex-1 sm:flex-none">
              <span className="hidden sm:inline">Distribución de Jurados y Asesores</span>
              <span className="sm:hidden">Distribución</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-xs sm:text-base flex-1 sm:flex-none">
              <span className="hidden sm:inline">Desempeño de Asesores</span>
              <span className="sm:hidden">Desempeño</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Ocultar dropdowns cuando está en pestaña "topics" y gráfico "trends" */}
            {!(activeTab === "topics" && selectedTopicsChart === "trends") && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={selectedYear} onValueChange={(value) => {
                  setSelectedYear(value);
                  setSelectedSemester(""); // Reset semestre cuando cambia el año
                }}>
                  <SelectTrigger className="w-full sm:w-[100px] text-sm sm:text-base">
                    <SelectValue placeholder={loadingCiclos ? "Cargando..." : "Año"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {availableYears.length > 0 ? (
                      availableYears.map((year) => (
                        <SelectItem key={year} value={year.toString()} className="text-sm sm:text-base">
                          {year}
                        </SelectItem>
                      ))
                    ) : !loadingCiclos ? (
                      <div className="px-2 py-1 text-sm text-gray-500">
                        No hay años disponibles
                      </div>
                    ) : null}
                  </SelectContent>
                </Select>

                <Select 
                  value={selectedSemester} 
                  onValueChange={setSelectedSemester}
                  disabled={!selectedYear || loadingCiclos}
                >
                  <SelectTrigger className="w-full sm:w-[100px] text-sm sm:text-base">
                    <SelectValue placeholder={!selectedYear ? "Año" : "Ciclo"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {availableSemesters.length > 0 ? (
                      availableSemesters.map((semester) => (
                        <SelectItem key={semester} value={semester} className="text-sm sm:text-base">
                          {semester}
                        </SelectItem>
                      ))
                    ) : selectedYear ? (
                      <div className="px-2 py-1 text-sm text-gray-500">
                        No hay semestres disponibles
                      </div>
                    ) : null}
                  </SelectContent>
                </Select>
              </div>
            )}

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
            <CardHeader className="pb-2 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-base sm:text-lg">Visualización de Temas</CardTitle>
                <Select value={selectedTopicsChart} onValueChange={setSelectedTopicsChart}>
                  <SelectTrigger className="w-full sm:w-[280px] text-sm sm:text-base">
                    <SelectValue placeholder="Seleccionar visualización" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="areas" className="text-sm sm:text-base">Distribución de Temas por Área</SelectItem>
                    <SelectItem value="trends" className="text-sm sm:text-base">Tendencias de Temas por Año</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm sm:text-base text-gray-600 pt-2">{topicsDescriptions[selectedTopicsChart as keyof typeof topicsDescriptions]}</p>
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
                      <PieChart className="h-20 w-20" />
                    </Button>
                  </div>
                  {renderTopicsAreaChart()}
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 px-4 py-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Rango de años:</label>
                      <Select value={yearRangeStart} onValueChange={setYearRangeStart}>
                        <SelectTrigger className="w-[100px] text-sm">
                          <SelectValue placeholder="Desde" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all" className="text-sm">Todos</SelectItem>
                          {trendsAvailableYears
                            .filter(year => yearRangeEnd === "all" || year <= parseInt(yearRangeEnd))
                            .map((year) => (
                              <SelectItem key={year} value={year.toString()} className="text-sm">
                                {year}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-gray-500">-</span>
                      <Select value={yearRangeEnd} onValueChange={setYearRangeEnd}>
                        <SelectTrigger className="w-[100px] text-sm">
                          <SelectValue placeholder="Hasta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all" className="text-sm">Todos</SelectItem>
                          {trendsAvailableYears
                            .filter(year => yearRangeStart === "all" || year >= parseInt(yearRangeStart))
                            .map((year) => (
                              <SelectItem key={year} value={year.toString()} className="text-sm">
                                {year}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Etapa Formativa:</label>
                      <Select value={selectedEtapaFormativa} onValueChange={setSelectedEtapaFormativa}>
                        <SelectTrigger className="w-[280px] text-sm">
                          <SelectValue placeholder="Seleccionar etapa formativa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all" className="text-sm">Todas las etapas</SelectItem>
                          {availableEtapasFormativas.map((etapa) => (
                            <SelectItem key={etapa} value={etapa} className="text-sm">
                              {toTitleCase(etapa)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {renderTrendsChart()}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader className="pb-2 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-base sm:text-lg">Distribución de Carga</CardTitle>
                <Select value={selectedDistributionChart} onValueChange={setSelectedDistributionChart}>
                  <SelectTrigger className="w-full sm:w-[280px] text-sm sm:text-base">
                    <SelectValue placeholder="Seleccionar visualización" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="advisors" className="text-sm sm:text-base">Asesores por Docente</SelectItem>
                    <SelectItem value="jury" className="text-sm sm:text-base">Jurados por Docente</SelectItem>
                    <SelectItem value="comparison" className="text-sm sm:text-base">Asesorías vs Jurado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm sm:text-base text-gray-600 pt-2">{distributionDescriptions[selectedDistributionChart as keyof typeof distributionDescriptions]}</p>
            </CardHeader>
            <CardContent className="p-0">
              {renderDistributionContent()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader className="pb-2 px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Desempeño de Asesores</CardTitle>
              <p className="text-sm sm:text-base text-gray-600 pt-2">
                Promedio de avance de tesistas por asesor
              </p>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {renderPerformanceContent()}
              {advisorPerformance.length > 0 && (
                <div className="mt-8 -mx-4 sm:-mx-6">
                  <div className="px-4 sm:px-6">
                    <h3 className="text-sm sm:text-base font-medium mb-6">Comparativa de Eficiencia</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={Math.max(600, filteredAdvisors.length * 80)}>
                    <RechartsBarChart layout="vertical" data={filteredAdvisors} margin={{top: 40, right: 50, left: 30, bottom: 80}}>
                      <CartesianGrid strokeDasharray="3 3"/>
                      <XAxis 
                        xAxisId="students" 
                        type="number" 
                        orientation="bottom" 
                        stroke="#006699" 
                        tick={{fontSize: 12}} 
                        allowDecimals={false}
                        label={{ 
                          value: "Número de Tesistas", 
                          position: "insideBottom", 
                          offset: -5, 
                          style: { textAnchor: "middle", fontSize: "12px", fill: "#006699" } 
                        }}
                      />
                      <XAxis 
                        xAxisId="progress" 
                        type="number" 
                        orientation="top" 
                        stroke="#0ea5e9" 
                        tick={{fontSize: 12}} 
                        allowDecimals={false} 
                        domain={[0, 100]}
                        label={{ 
                          value: "Progreso (%)", 
                          position: "insideTop", 
                          offset: -5, 
                          style: { textAnchor: "middle", fontSize: "12px", fill: "#0ea5e9" } 
                        }}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        tickFormatter={toTitleCase} 
                        tick={{fontSize: 12}} 
                        width={100}
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === "Progreso (%)") {
                            return value === 0 ? ["Sin progreso", name] : [`${value}%`, name];
                          } else if (name === "Tesistas") {
                            return value === 0 ? ["Sin tesistas", name] : [value, name];
                          }
                          return [value, name];
                        }}
                      />
                      <Legend wrapperStyle={{fontSize: "12px", marginTop: "50px", paddingTop: "50px"}}/>
                      <Bar 
                        xAxisId="progress" 
                        dataKey="progress" 
                        name="Progreso (%)" 
                        fill="#0ea5e9"
                        shape={(props: {x?: number, y?: number, width?: number, height?: number, fill?: string, progress?: number}) => {
                          if (props.progress === 0) {
                            // Crear un pequeño círculo para valores 0
                            const { x = 0, y = 0, height = 0 } = props;
                            const circleRadius = 4;
                            const circleX = x + circleRadius;
                            const circleY = y + height / 2;
                            return (
                              <g>
                                <circle 
                                  cx={circleX} 
                                  cy={circleY} 
                                  r={circleRadius} 
                                  fill="#e5e7eb" 
                                  stroke="#9ca3af" 
                                  strokeWidth={1.5}
                                  strokeDasharray="2,2"
                                />
                              </g>
                            );
                          }
                          // Filtrar solo las props válidas para rect
                          const { x, y, width, height, fill } = props;
                          return <rect x={x} y={y} width={width} height={height} fill={fill} />;
                        }}
                      />
                      <Bar 
                        xAxisId="students" 
                        dataKey="students" 
                        name="Tesistas" 
                        fill="#006699"
                        shape={(props: {x?: number, y?: number, width?: number, height?: number, fill?: string, students?: number}) => {
                          if (props.students === 0) {
                            // Crear un pequeño círculo para valores 0
                            const { x = 0, y = 0, height = 0 } = props;
                            const circleRadius = 4;
                            const circleX = x + circleRadius;
                            const circleY = y + height / 2;
                            return (
                              <g>
                                <circle 
                                  cx={circleX} 
                                  cy={circleY} 
                                  r={circleRadius} 
                                  fill="#e5e7eb" 
                                  stroke="#9ca3af" 
                                  strokeWidth={1.5}
                                  strokeDasharray="2,2"
                                />
                              </g>
                            );
                          }
                          // Filtrar solo las props válidas para rect
                          const { x, y, width, height, fill } = props;
                          return <rect x={x} y={y} width={width} height={height} fill={fill} />;
                        }}
                      />
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

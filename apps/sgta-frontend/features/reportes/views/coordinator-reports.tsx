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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { BarChartHorizontal, Calendar, ChevronDown, ChevronsUpDown, ChevronUp, Download, FileSpreadsheet, Loader2, PieChart, Search, X } from "lucide-react";
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
  const [semesterFilter, setSemesterFilter] = useState("2025-1");
  const [themeAreaChartType, setThemeAreaChartType] = useState("horizontal-bar"); // 'horizontal-bar', 'pie'
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly");

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

  // Colores para el gráfico de pastel
  const COLORS = ["#002855", "#006699", "#0088cc", "#00aaff", "#33bbff", "#66ccff", "#99ddff"];

  // Función para exportar reporte
  const handleExport = (format: string) => {
    // Aquí iría la lógica para exportar el reporte
    alert(`Exportando reporte en formato ${format}...`);
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

  // Función para normalizar texto sin tildes
  const normalizeText = (text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
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

  // Efecto para cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isAreaDropdownOpen && !target.closest("[data-area-dropdown]")) {
        setIsAreaDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAreaDropdownOpen]);

  const [selectedTopicsChart, setSelectedTopicsChart] = useState("areas");
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
        {advisorPerformance.map((advisor) => (
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

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-base">
                  <Calendar className="h-4 w-4" />
                  Programar Reportes
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-lg">Programar Envío de Reportes</DialogTitle>
                  <DialogDescription className="text-base">
                    Configura la frecuencia con la que deseas recibir reportes automáticos en tu correo.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-frequency" className="text-base">Frecuencia de envío</Label>
                    <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                      <SelectTrigger id="schedule-frequency" className="text-base">
                        <SelectValue placeholder="Selecciona frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily" className="text-base">Diario</SelectItem>
                        <SelectItem value="weekly" className="text-base">Semanal</SelectItem>
                        <SelectItem value="monthly" className="text-base">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-format" className="text-base">Formato de reporte</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger id="report-format" className="text-base">
                        <SelectValue placeholder="Selecciona formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf" className="text-base">PDF</SelectItem>
                        <SelectItem value="excel" className="text-base">Excel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-input" className="text-base">Correo electrónico</Label>
                    <input
                      id="email-input"
                      type="email"
                      className="w-full px-3 py-2 border rounded-md text-base"
                      defaultValue="coordinador@pucp.edu.pe"
                      readOnly
                    />
                  </div>
                  <Button className="w-full mt-4 text-base">Guardar configuración</Button>
                </div>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 text-base">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("pdf")} className="text-base">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar como PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("excel")} className="text-base">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Exportar como Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <p className="text-sm text-gray-600 pt-2">{topicsDescriptions[selectedTopicsChart as keyof typeof topicsDescriptions]}</p>
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
              <p className="text-sm text-gray-600 pt-2">{distributionDescriptions[selectedDistributionChart as keyof typeof distributionDescriptions]}</p>
            </CardHeader>
            <CardContent className="p-0">
              {renderDistributionContent()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Desempeño de Asesores</CardTitle>
              <p className="text-sm text-gray-600 pt-2">
                Promedio de avance de tesistas por asesor
              </p>
            </CardHeader>
            <CardContent className="px-6 py-4">
              {renderPerformanceContent()}
              {advisorPerformance.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-base font-medium mb-4">Comparativa de Eficiencia</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={advisorPerformance} margin={{top: 5, right: 30, left: 20, bottom: 20}}>
                      <CartesianGrid strokeDasharray="3 3"/>
                      <XAxis dataKey="name" tickFormatter={toTitleCase} height={60} angle={0} textAnchor="end" tick={{fontSize: 13}}/>
                      <YAxis yAxisId="left" orientation="left" stroke="#002855" tick={{fontSize: 13}} label={{ value: "Progreso (%)", angle: -90, position: "insideLeft" }} allowDecimals={false}/>
                      <YAxis yAxisId="right" orientation="right" stroke="#006699" tick={{fontSize: 13}} label={{ value: "Tesistas", angle: 90, position: "insideRight" }} allowDecimals={false}/>
                      <Tooltip/>
                      <Legend wrapperStyle={{fontSize: "13px", marginTop: "10px"}}/>
                      <Bar yAxisId="left" dataKey="progress" name="Progreso (%)" fill="#002855"/>
                      <Bar yAxisId="right" dataKey="students" name="Tesistas" fill="#006699"/>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>

  );
}

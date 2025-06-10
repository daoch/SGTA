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
import { BarChartHorizontal, Calendar, Download, FileSpreadsheet, PieChart } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
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
  YAxis,
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
  const [themeAreaChartType, setThemeAreaChartType] = useState("vertical-bar"); // 'horizontal-bar', 'vertical-bar', 'pie'
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

  // Colores para el gráfico de pastel
  const COLORS = ["#002855", "#006699", "#0088cc", "#00aaff", "#33bbff", "#66ccff", "#99ddff"];

  // Función para exportar reporte
  const handleExport = (format: string) => {
    // Aquí iría la lógica para exportar el reporte
    alert(`Exportando reporte en formato ${format}...`);
  };


  const [selectedTopicsChart, setSelectedTopicsChart] = useState("areas");
  const [selectedDistributionChart, setSelectedDistributionChart] = useState("advisors");

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
          department: item.department,
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
          department: item.department,
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
      return <div>Cargando...</div>;
    }

    if (thesisTopicsByArea.length === 0) {
      return <div className="text-center text-gray-500 py-8">No hay datos para este ciclo.</div>;
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

    if (themeAreaChartType === "vertical-bar") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <RechartsBarChart
            data={thesisTopicsByArea}
            margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="area"
              tickFormatter={toTitleCase}
              angle={0}
              textAnchor="middle"
              height={40}
              interval={0}
              tick={{ fontSize: 14 }}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#002855" />
          </RechartsBarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <RechartsPieChart>
          <Pie
            data={thesisTopicsByArea}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="count"
          >
            {thesisTopicsByArea.map((entry, index) => (
              <Cell key={entry.area} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
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
      return <div>Cargando...</div>;
    }

    if (lineChartData.length === 0) {
      return <div className="text-center text-gray-500 py-8">No hay datos para este ciclo.</div>;
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
      return <div>Cargando...</div>;
    }

    if (advisorDistribution.length === 0) {
      return <div className="text-center text-gray-500 py-8">No hay datos para este ciclo.</div>;
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <RechartsBarChart
          data={advisorDistribution}
          margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tickFormatter={toTitleCase}
            angle={0}
            textAnchor="middle"
            height={60}
            interval={0}
            tick={{ fontSize: 14 }}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#006699" />
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  };

  const renderJuryDistribution = () => {
    if (loadingJuryDistribution) {
      return <div>Cargando...</div>;
    }

    if (juryDistribution.length === 0) {
      return <div className="text-center text-gray-500 py-8">No hay datos para este ciclo.</div>;
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <RechartsBarChart
          layout="vertical"
          data={juryDistribution}
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={toTitleCase} />
          <YAxis type="category" dataKey="name" />
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
          <div className="p-4">
            {advisorDistribution.length === 0 && juryDistribution.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No hay información de carga para este ciclo.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left text-sm font-medium text-gray-500">Docente</th>
                      <th className="py-2 text-left text-sm font-medium text-gray-500">Departamento</th>
                      <th className="py-2 text-left text-sm font-medium text-gray-500">Asesorías</th>
                      <th className="py-2 text-left text-sm font-medium text-gray-500">Jurado</th>
                      <th className="py-2 text-left text-sm font-medium text-gray-500">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {advisorDistribution.map((advisor) => {
                      const juryCount = juryDistribution.find((j) => j.name === advisor.name)?.count ?? 0;
                      const total = advisor.count + juryCount;

                      return (
                        <tr key={`${advisor.name}-${advisor.department}`} className="border-b">
                          <td className="py-1.5 text-sm font-medium">{toTitleCase(advisor.name)}</td>
                          <td className="py-1.5 text-sm">{toTitleCase(advisor.department)}</td>
                          <td className="py-1.5 text-sm">{advisor.count}</td>
                          <td className="py-1.5 text-sm">{juryCount}</td>
                          <td className="py-1.5 text-sm font-medium">{total}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
    }
  };

  const renderPerformanceContent = () => {
    if (loadingAdvisorPerformance) {
      return <div>Cargando...</div>;
    }

    if (advisorPerformance.length === 0) {
      return <div className="text-center text-gray-500 py-8">No hay datos para este ciclo.</div>;
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
        {advisorPerformance.map((advisor) => (
          <div key={`${advisor.name}-${advisor.department}`} className="space-y-1">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium">{toTitleCase(advisor.name)}</h3>
                <p className="text-xs text-gray-500">{toTitleCase(advisor.department)}</p>
              </div>
              <div className="text-right">
                <span className="text-base font-bold">{advisor.progress}%</span>
                <span className="text-xs text-gray-500 ml-1">({advisor.students} tesistas)</span>
              </div>
            </div>
            <Progress
              value={advisor.progress}
              className="h-2.5 bg-gray-200"
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
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value="topics">Temas y Áreas</TabsTrigger>
            <TabsTrigger value="distribution">Distribución de Jurados y Asesores</TabsTrigger>
            <TabsTrigger value="performance">Desempeño de Asesores</TabsTrigger>
          </TabsList>
          <div className="flex gap-2 items-center">
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Seleccionar ciclo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-1">2025-1</SelectItem>
                <SelectItem value="2024-2">2024-2</SelectItem>
                <SelectItem value="2024-1">2024-1</SelectItem>
                <SelectItem value="2023-2">2023-2</SelectItem>
                <SelectItem value="2023-1">2023-1</SelectItem>
              </SelectContent>
            </Select>

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
                    <Label htmlFor="schedule-frequency">Frecuencia de envío</Label>
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
                    <Label htmlFor="report-format">Formato de reporte</Label>
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
                    <Label htmlFor="email-input">Correo electrónico</Label>
                    <input
                      id="email-input"
                      type="email"
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue="coordinador@pucp.edu.pe"
                      readOnly
                    />
                  </div>
                  <Button className="w-full mt-4">Guardar configuración</Button>
                </div>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar como PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("excel")}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Exportar como Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-2">
              <CardTitle className="text-base">Visualización de Temas</CardTitle>
              <Select value={selectedTopicsChart} onValueChange={setSelectedTopicsChart}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Seleccionar visualización" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="areas">Distribución de Temas por Área</SelectItem>
                  <SelectItem value="trends">Tendencias de Temas por Año</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="p-0">
              {selectedTopicsChart === "areas" ? (
                <div>
                  <div className="flex items-center justify-end gap-1 px-4 py-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-7 w-7 ${themeAreaChartType === "horizontal-bar" ? "bg-gray-100" : ""}`}
                      onClick={() => setThemeAreaChartType("horizontal-bar")}
                      title="Gráfico de barras horizontal"
                    >
                      <BarChartHorizontal className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-7 w-7 ${themeAreaChartType === "vertical-bar" ? "bg-gray-100" : ""}`}
                      onClick={() => setThemeAreaChartType("vertical-bar")}
                      title="Gráfico de barras vertical"
                    >
                      <BarChart className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-7 w-7 ${themeAreaChartType === "pie" ? "bg-gray-100" : ""}`}
                      onClick={() => setThemeAreaChartType("pie")}
                      title="Gráfico circular"
                    >
                      <PieChart className="h-3.5 w-3.5" />
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
            <CardHeader className="flex flex-row items-center justify-between py-2">
              <CardTitle className="text-base">Distribución de Carga</CardTitle>
              <Select value={selectedDistributionChart} onValueChange={setSelectedDistributionChart}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Seleccionar visualización" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="advisors">Distribución de Asesores por Docente</SelectItem>
                  <SelectItem value="jury">Distribución de Jurados por Docente</SelectItem>
                  <SelectItem value="comparison">Comparativa de Carga: Asesorías vs Jurado</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="p-0">
              {renderDistributionContent()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader className="py-2">
              <CardTitle className="text-base">Desempeño de Asesores</CardTitle>
              <p className="text-xs text-gray-600 mt-1">
                Promedio de avance de tesistas por asesor. Este indicador muestra la efectividad de cada asesor en guiar
                a sus estudiantes hacia la culminación de sus tesis.
              </p>
            </CardHeader>
            <CardContent className="p-4">
              {renderPerformanceContent()}
              {advisorPerformance.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium mb-4">Comparativa de Eficiencia</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={advisorPerformance} margin={{top: 5, right: 30, left: 20, bottom: 20}}>
                      <CartesianGrid strokeDasharray="3 3"/>
                      <XAxis dataKey="name" tickFormatter={toTitleCase} height={60} angle={0} textAnchor="end"/>
                      <YAxis yAxisId="left" orientation="left" stroke="#002855" tick={{fontSize: 12}} label={{ value: "Progreso (%)", angle: -90, position: "insideLeft" }} allowDecimals={false}/>
                      <YAxis yAxisId="right" orientation="right" stroke="#006699" tick={{fontSize: 12}} label={{ value: "Tesistas", angle: 90, position: "insideRight" }} allowDecimals={false}/>
                      <Tooltip/>
                      <Legend wrapperStyle={{fontSize: "12px", marginTop: "10px"}}/>
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

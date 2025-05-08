"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Bar,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Download, FileSpreadsheet, BarChartHorizontal, PieChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
    setLoadingTopicsByArea(true);
    fetch(`http://localhost:5001/api/v1/reports/topics-areas?usuarioId=3&ciclo=${semesterFilter}`)
      .then(res => res.json())
      .then(data => {
        // Normaliza los datos aquí
        const arr = Array.isArray(data) ? data : [];
        const normalized = arr.map((item: { areaName: string; topicCount: number }) => ({
          area: item.areaName,
          count: item.topicCount,
        }));
        setThesisTopicsByArea(normalized);
      })
      .finally(() => setLoadingTopicsByArea(false));
  }, [semesterFilter]);

  useEffect(() => {
    setLoadingAdvisorDistribution(true);
    fetch(`http://localhost:5001/api/v1/reports/advisors-distribution?usuarioId=3&ciclo=${semesterFilter}`)
      .then(res => res.json())
      .then((data: { teacherName: string; count: number; department: string }[]) => {
        setAdvisorDistribution(data.map(item => ({
          name: item.teacherName,
          count: item.count,
          department: item.department,
        })));
      })
      .finally(() => setLoadingAdvisorDistribution(false));
  }, [semesterFilter]);

  useEffect(() => {
    setLoadingJuryDistribution(true);
    fetch(`http://localhost:5001/api/v1/reports/jurors-distribution?usuarioId=3&ciclo=${semesterFilter}`)
      .then(res => res.json())
      .then((data: { teacherName: string; count: number; department: string }[]) => {
        setJuryDistribution(data.map(item => ({
          name: item.teacherName,
          count: item.count,
          department: item.department,
        })));
      })
      .finally(() => setLoadingJuryDistribution(false));
  }, [semesterFilter]);

  useEffect(() => {
    setLoadingLineChart(true);
    fetch(`http://localhost:5001/api/v1/reports/topics-trends?usuarioId=3`)
      .then(res => res.json())
      .then((data: { areaName: string; year: number; topicCount: number }[]) => {
        // 1. Obtener todos los años y áreas únicos
        const years = Array.from(new Set(data.map(item => item.year))).sort();
        const areas = Array.from(new Set(data.map(item => item.areaName)));

        // 2. Construir la estructura para recharts
        const result = years.map(year => {
          const entry: any = { name: year.toString() };
          areas.forEach(area => {
            // Busca si hay un registro para este año y área
            const found = data.find(item => item.year === year && item.areaName === area);
            entry[area] = found ? found.topicCount : 0;
          });
          return entry;
        });

        setLineChartData(result);
      })
      .finally(() => setLoadingLineChart(false));
  }, []);

  useEffect(() => {
    setLoadingAdvisorPerformance(true);
    fetch(`http://localhost:5001/api/v1/reports/advisors/performance?usuarioId=3&ciclo=${semesterFilter}`)
      .then(res => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setAdvisorPerformance(
          arr.map((item) => ({
            name: item.advisorName,
            department: item.areaName,
            progress: item.performancePercentage,
            students: item.totalStudents,
          }))
        );
      })
      .finally(() => setLoadingAdvisorPerformance(false));
  }, [semesterFilter]);

  const areaNames = lineChartData.length > 0
    ? Object.keys(lineChartData[0]).filter(key => key !== "name")
    : [];
  const areaColors = ["#002855", "#006699", "#0088cc", "#00aaff", "#33bbff", "#66ccff", "#99ddff"];

  function toTitleCase(str: string) {
    if (typeof str !== "string") str = String(str ?? "");
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
              {selectedTopicsChart === "areas" && (
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

                  {loadingTopicsByArea ? (
                    <div>Cargando...</div>
                  ) : thesisTopicsByArea.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No hay datos para este ciclo.</div>
                  ) : (
                    <>
                      {themeAreaChartType === "horizontal-bar" && (
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
                      )}

                      {themeAreaChartType === "vertical-bar" && (
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
                      )}

                      {themeAreaChartType === "pie" && (
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
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                      )}
                    </>
                  )}
                </div>
              )}

              {selectedTopicsChart === "trends" && (
                <div>
                  {loadingLineChart ? (
                    <div>Cargando...</div>
                  ) : lineChartData.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No hay datos para este ciclo.</div>
                  ) : (
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
                  )}
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
              {selectedDistributionChart === "advisors" && (
                loadingAdvisorDistribution ? (
                  <div>Cargando...</div>
                ) : advisorDistribution.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No hay datos para este ciclo.</div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <RechartsBarChart
                      layout="vertical"
                      data={advisorDistribution}
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={toTitleCase} />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#006699" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                )
              )}

              {selectedDistributionChart === "jury" && (
                loadingJuryDistribution ? (
                  <div>Cargando...</div>
                ) : juryDistribution.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No hay datos para este ciclo.</div>
                ) : (
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
                )
              )}

              {selectedDistributionChart === "comparison" && (
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
                          {advisorDistribution.map((advisor, index) => {
                            const juryCount = juryDistribution.find((j) => j.name === advisor.name)?.count || 0;
                            const total = advisor.count + juryCount;

                            return (
                              <tr key={index} className="border-b">
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
              )}
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
              {loadingAdvisorPerformance ? (
                <div>Cargando...</div>
              ) : advisorPerformance.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No hay datos para este ciclo.</div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                  {advisorPerformance.map((advisor, index) => (
                    <div key={index} className="space-y-1">
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
              )}

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
         
                <div>
                  <h3 className="text-sm font-medium mb-2">Comparativa de Eficiencia</h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <RechartsBarChart data={advisorPerformance} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tickFormatter={toTitleCase} />
                      <YAxis yAxisId="left" orientation="left" stroke="#002855" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#006699" tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: "10px" }} />
                      <Bar yAxisId="left" dataKey="progress" name="Progreso (%)" fill="#002855" />
                      <Bar yAxisId="right" dataKey="students" name="Tesistas" fill="#006699" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

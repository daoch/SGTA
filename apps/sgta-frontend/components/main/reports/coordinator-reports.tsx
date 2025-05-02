"use client";

import { useState } from "react";
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

export function CoordinatorReports() {
  const [semesterFilter, setSemesterFilter] = useState("2025-1");
  const [themeAreaChartType, setThemeAreaChartType] = useState("vertical-bar"); // 'horizontal-bar', 'vertical-bar', 'pie'
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly");

  // Data for thesis topics by area
  const thesisTopicsByArea = [
    { area: "Inteligencia Artificial", count: 15 },
    { area: "Desarrollo Web", count: 12 },
    { area: "Seguridad Informática", count: 8 },
    { area: "Bases de Datos", count: 7 },
    { area: "Redes", count: 5 },
    { area: "Computación Gráfica", count: 4 },
    { area: "Sistemas Embebidos", count: 3 },
  ];

  // Data for thesis topics by year
  // const thesisTopicsByYear = [
  //   { year: 2019, ai: 8, web: 10, security: 5, databases: 6, networks: 4, graphics: 3, embedded: 2 },
  //   { year: 2020, ai: 10, web: 11, security: 6, databases: 7, networks: 5, graphics: 3, embedded: 2 },
  //   { year: 2021, ai: 12, web: 12, security: 7, databases: 6, networks: 5, graphics: 4, embedded: 3 },
  //   { year: 2022, ai: 14, web: 12, security: 8, databases: 7, networks: 5, graphics: 4, embedded: 3 },
  //   { year: 2023, ai: 15, web: 12, security: 8, databases: 7, networks: 5, graphics: 4, embedded: 3 },
  // ];

  // Transformar datos para gráfico de líneas
  const lineChartData = [
    {
      name: "2019",
      "Inteligencia Artificial": 8,
      "Desarrollo Web": 10,
      Seguridad: 5,
      "Bases de Datos": 6,
      Redes: 4,
      Gráficos: 3,
      Embebidos: 2,
    },
    {
      name: "2020",
      "Inteligencia Artificial": 10,
      "Desarrollo Web": 11,
      Seguridad: 6,
      "Bases de Datos": 7,
      Redes: 5,
      Gráficos: 3,
      Embebidos: 2,
    },
    {
      name: "2021",
      "Inteligencia Artificial": 12,
      "Desarrollo Web": 12,
      Seguridad: 7,
      "Bases de Datos": 6,
      Redes: 5,
      Gráficos: 4,
      Embebidos: 3,
    },
    {
      name: "2022",
      "Inteligencia Artificial": 14,
      "Desarrollo Web": 12,
      Seguridad: 8,
      "Bases de Datos": 7,
      Redes: 5,
      Gráficos: 4,
      Embebidos: 3,
    },
    {
      name: "2023",
      "Inteligencia Artificial": 15,
      "Desarrollo Web": 12,
      Seguridad: 8,
      "Bases de Datos": 7,
      Redes: 5,
      Gráficos: 4,
      Embebidos: 3,
    },
  ];

  // Data for advisor distribution
  const advisorDistribution = [
    { name: "Dr. Rodríguez", count: 8, department: "Ciencias de la Computación" },
    { name: "Dra. Sánchez", count: 6, department: "Inteligencia Artificial" },
    { name: "Dr. García", count: 5, department: "Desarrollo de Software" },
    { name: "Dr. López", count: 4, department: "Seguridad Informática" },
    { name: "Dra. Martínez", count: 4, department: "Bases de Datos" },
    { name: "Dr. Pérez", count: 3, department: "Redes y Comunicaciones" },
    { name: "Dra. Gómez", count: 2, department: "Computación Gráfica" },
  ];

  // Data for jury distribution
  const juryDistribution = [
    { name: "Dr. Rodríguez", count: 12, department: "Ciencias de la Computación" },
    { name: "Dra. Sánchez", count: 10, department: "Inteligencia Artificial" },
    { name: "Dr. García", count: 9, department: "Desarrollo de Software" },
    { name: "Dr. López", count: 8, department: "Seguridad Informática" },
    { name: "Dra. Martínez", count: 7, department: "Bases de Datos" },
    { name: "Dr. Pérez", count: 6, department: "Redes y Comunicaciones" },
    { name: "Dra. Gómez", count: 5, department: "Computación Gráfica" },
  ];

  // Data for advisor performance
  const advisorPerformance = [
    { name: "Dr. Rodríguez", department: "Ciencias de la Computación", progress: 78, students: 8 },
    { name: "Dra. Sánchez", department: "Inteligencia Artificial", progress: 65, students: 6 },
    { name: "Dr. García", department: "Desarrollo de Software", progress: 72, students: 5 },
    { name: "Dr. López", department: "Seguridad Informática", progress: 45, students: 4 },
    { name: "Dra. Martínez", department: "Bases de Datos", progress: 68, students: 4 },
    { name: "Dr. Pérez", department: "Redes y Comunicaciones", progress: 55, students: 3 },
    { name: "Dra. Gómez", department: "Computación Gráfica", progress: 82, students: 2 },
  ];

  // Colores para el gráfico de pastel
  const COLORS = ["#002855", "#006699", "#0088cc", "#00aaff", "#33bbff", "#66ccff", "#99ddff"];

  // Función para exportar reporte
  const handleExport = (format) => {
    // Aquí iría la lógica para exportar el reporte
    alert(`Exportando reporte en formato ${format}...`);
  };

  // Modificar la estructura de las pestañas "topics" y "distribution" para incluir selectores de gráficos
  // En la pestaña "topics", reemplazar la estructura de grid por un selector y un solo gráfico a la vez

  // 1. Añadir nuevos estados para controlar qué gráfico se muestra
  const [selectedTopicsChart, setSelectedTopicsChart] = useState("areas");
  const [selectedDistributionChart, setSelectedDistributionChart] = useState("advisors");

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
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

      <Tabs defaultValue="topics">
        <TabsList className="mb-2">
          <TabsTrigger value="topics">Temas y Áreas</TabsTrigger>
          <TabsTrigger value="distribution">Distribución de Jurados y Asesores</TabsTrigger>
          <TabsTrigger value="performance">Desempeño de Asesores</TabsTrigger>
        </TabsList>

        {/* 2. Reemplazar el contenido de la pestaña "topics" con un selector y gráficos condicionales */}
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

                  {themeAreaChartType === "horizontal-bar" && (
                    <ResponsiveContainer width="100%" height={400}>
                      <RechartsBarChart
                        layout="vertical"
                        data={thesisTopicsByArea}
                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="area" />
                        <Tooltip />
                        <Bar dataKey="count" fill="#006699" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  )}

                  {themeAreaChartType === "vertical-bar" && (
                    <ResponsiveContainer width="100%" height={400}>
                      <RechartsBarChart data={thesisTopicsByArea} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="area" angle={-45} textAnchor="end" height={70} />
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
                            value: `${item.area} (${item.count})`,
                            color: COLORS[index % COLORS.length],
                          }))}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              )}

              {selectedTopicsChart === "trends" && (
                <div>
                  <ResponsiveContainer width="100%" height={400}>
                    <RechartsLineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Inteligencia Artificial" stroke="#002855" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="Desarrollo Web" stroke="#006699" />
                      <Line type="monotone" dataKey="Seguridad" stroke="#0088cc" />
                      <Line type="monotone" dataKey="Bases de Datos" stroke="#00aaff" />
                      <Line type="monotone" dataKey="Redes" stroke="#33bbff" />
                      <Line type="monotone" dataKey="Gráficos" stroke="#66ccff" />
                      <Line type="monotone" dataKey="Embebidos" stroke="#99ddff" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                  <div className="px-4 pb-2 text-xs text-gray-500">
                    <p>Nota: Se observa un incremento constante en tesis relacionadas con IA desde 2019.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Reemplazar el contenido de la pestaña "distribution" con un selector y gráficos condicionales */}
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
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsBarChart
                    layout="vertical"
                    data={advisorDistribution}
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#006699" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              )}

              {selectedDistributionChart === "jury" && (
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsBarChart
                    layout="vertical"
                    data={juryDistribution}
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#002855" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              )}

              {selectedDistributionChart === "comparison" && (
                <div className="p-4">
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
                              <td className="py-1.5 text-sm font-medium">{advisor.name}</td>
                              <td className="py-1.5 text-sm">{advisor.department}</td>
                              <td className="py-1.5 text-sm">{advisor.count}</td>
                              <td className="py-1.5 text-sm">{juryCount}</td>
                              <td className="py-1.5 text-sm font-medium">{total}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                {advisorPerformance.map((advisor, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium">{advisor.name}</h3>
                        <p className="text-xs text-gray-500">{advisor.department}</p>
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

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Análisis de Desempeño</h3>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>
                      <span className="font-medium">Mejor desempeño:</span> Dra. Gómez (82%) - Alta efectividad con
                      pocos tesistas.
                    </p>
                    <p>
                      <span className="font-medium">Desempeño destacado:</span> Dr. Rodríguez (78%) - Alto nivel con
                      mayor número de tesistas.
                    </p>
                    <p>
                      <span className="font-medium">Requiere atención:</span> Dr. López (45%) - Se recomienda revisar
                      estrategias.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Comparativa de Eficiencia</h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <RechartsBarChart data={advisorPerformance} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
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

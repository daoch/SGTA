"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge, BarChart3, CheckCircle, TrendingUp } from "lucide-react"
import { useState } from "react"
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

export interface StudentData {
  name: string;
  currentStage: string;
  totalStages: number;
}

export interface DeliverableCriteria {
  name: string;
  grade: number;
}

export interface Deliverable {
  id: string;
  name: string;
  date: string;
  criteria: DeliverableCriteria[];
  expositionGrade: number;
  finalGrade: number;
}

export interface Stage {
  id: string;
  name: string;
  period: string;
  deliverables: Deliverable[];
}

export interface GradesData {
  stages: Stage[];
}

export interface AcademicAnalysisProps {
  studentData: StudentData;
  gradesData: GradesData;
}

interface ChartDeliverable {
  name: string
  entregableNumber: number
  date: string
  notaFinal: number
  notaExposicion: number
  stage: string
  criterios: DeliverableCriteria[]
  globalIndex: number
}

interface Stats {
  average: number
  trend: "stable" | "improving" | "declining"
  lastGrade: number
  lastDeliverable: string
}



export function AnalisisAcademico({ studentData, gradesData }: AcademicAnalysisProps) {
  const [selectedStage, setSelectedStage] = useState("current")
  const [selectedDeliverableIndex, setSelectedDeliverableIndex] = useState<number | null>(null)

  // Procesar datos para el gráfico de tendencia
  const processGradesForChart = (): ChartDeliverable[] => {
    let allDeliverables: (Deliverable & { stageName: string; stageId: string; globalIndex: number })[] = []

    if (selectedStage === "all") {
      allDeliverables = gradesData.stages.flatMap((stage, stageIndex) =>
        stage.deliverables.map((d, deliverableIndex) => ({
          ...d,
          stageName: stage.name,
          stageId: stage.id,
          globalIndex: stageIndex * 10 + deliverableIndex,
        })),
      )
    } else if (selectedStage === "current") {
      const currentStageData = gradesData.stages.find((s) => s.name === studentData.currentStage)
      if (currentStageData) {
        allDeliverables = currentStageData.deliverables.map((d, deliverableIndex) => ({
          ...d,
          stageName: currentStageData.name,
          stageId: currentStageData.id,
          globalIndex: deliverableIndex,
        }))
      }
    } else {
      const stageData = gradesData.stages.find((s) => s.id === selectedStage)
      if (stageData) {
        allDeliverables = stageData.deliverables.map((d, deliverableIndex) => ({
          ...d,
          stageName: stageData.name,
          stageId: stageData.id,
          globalIndex: deliverableIndex,
        }))
      }
    }

    return allDeliverables.map((deliverable, index) => ({
      name: deliverable.name,
      entregableNumber: index + 1,
      date: deliverable.date,
      notaFinal: deliverable.finalGrade,
      notaExposicion: deliverable.expositionGrade,
      stage: deliverable.stageName,
      criterios: deliverable.criteria,
      globalIndex: deliverable.globalIndex,
    }))
  }

  const chartData = processGradesForChart()

  // Calcular estadísticas
  const calculateStats = () => {
    if (chartData.length === 0) return { average: 0, trend: "stable", lastGrade: 0, lastDeliverable: "" }

    const average = Math.round(chartData.reduce((sum, item) => sum + item.notaFinal, 0) / chartData.length)

    const lastGrade = chartData[chartData.length - 1]?.notaFinal || 0
    const lastDeliverable = chartData[chartData.length - 1]?.name || ""
    const firstGrade = chartData[0]?.notaFinal || 0

    let trend = "stable"
    if (lastGrade > firstGrade + 1) trend = "improving"
    else if (lastGrade < firstGrade - 1) trend = "declining"

    return { average, trend, lastGrade, lastDeliverable }
  }

  const stats = calculateStats()

  // Obtener datos del entregable seleccionado
  const getSelectedDeliverableData = () => {
    if (selectedDeliverableIndex === null || !chartData[selectedDeliverableIndex]) {
      return null
    }
    return chartData[selectedDeliverableIndex]
  }

  const selectedDeliverableData = getSelectedDeliverableData()

  return (
    <div className="space-y-6">
      {/* Tarjetas de resumen estadístico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Última Nota */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Última Nota</span>
          </div>
          <div className="text-3xl font-bold text-green-700 mb-1">{stats.lastGrade}</div>
          <div className="text-xs text-green-600">Entregable reciente</div>
        </div>

        {/* Tendencia */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Tendencia</span>
          </div>
          <div className="text-lg font-bold text-purple-700 mb-1 capitalize">
            {stats.trend === "improving" ? "Mejorando" : stats.trend === "declining" ? "Descendente" : "Estable"}
          </div>
          <div className="text-xs text-purple-600">
            {stats.trend === "improving"
              ? "📈 Rendimiento creciente"
              : stats.trend === "declining"
                ? "📉 Rendimiento descendente"
                : "➡️ Rendimiento constante"}
          </div>
        </div>

        {/* Etapa Actual */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Etapa Actual</span>
          </div>
          <div className="text-lg font-bold text-orange-700 mb-1">{studentData.currentStage}</div>
          <div className="text-xs text-orange-600">{studentData.totalStages} etapas totales</div>
        </div>
      </div>

      {/* Selector de etapa */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h3 className="text-base font-medium">Evolución de Notas por Entregable</h3>
        <Select value={selectedStage} onValueChange={setSelectedStage}>
          <SelectTrigger className="w-full lg:w-[200px]">
            <SelectValue placeholder="Seleccionar etapa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Etapa Actual</SelectItem>
            <SelectItem value="all">Todas las Etapas</SelectItem>
            <SelectItem value="stage1">Tesis 1</SelectItem>
            <SelectItem value="stage2">Tesis 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gráfico de evolución */}
      {chartData.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="entregableNumber"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: "#e0e0e0" }}
                tickFormatter={(value) => `E${value}`}
              />
              <YAxis domain={[0, 20]} tick={{ fontSize: 12 }} axisLine={{ stroke: "#e0e0e0" }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">Entregable {data.entregableNumber}</p>
                        <p className="text-sm text-gray-600">{data.stage}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm">
                            <span className="font-medium text-blue-600">Nota Final:</span> {data.notaFinal}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium text-green-600">Nota Exposición:</span> {data.notaExposicion}
                          </p>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />

              {/* Líneas de referencia */}
              <ReferenceLine
                y={11}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{ value: "Mínimo (11)", position: "right" }}
              />
              <ReferenceLine
                y={16}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                label={{ value: "Bueno (16)", position: "right" }}
              />

              {/* Líneas de datos */}
              <Line
                type="monotone"
                dataKey="notaFinal"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: "#2563eb", strokeWidth: 2, r: 6 }}
                activeDot={{
                    r: 8,
                    stroke: "#2563eb",
                    strokeWidth: 2,
                    onClick: (event: React.MouseEvent<SVGElement, MouseEvent>) => {
                        // @ts-ignore: recharts passes extra props, but we only care about index
                        const index = (event as any).index;
                        if (typeof index === "number") {
                            setSelectedDeliverableIndex(index);
                        }
                    },
                }}
                name="Nota Final"
              />
              <Line
                type="monotone"
                activeDot={{
                    r: 6,
                    stroke: "#16a34a",
                    strokeWidth: 2,
                    onClick: (event: React.MouseEvent<SVGElement, MouseEvent>) => {
                        // @ts-ignore: recharts passes extra props, but we only care about index
                        const index = (event as any).index;
                        if (typeof index === "number") {
                            setSelectedDeliverableIndex(index);
                        }
                    },
                }}
                name="Nota Exposición"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay datos de notas disponibles para la selección actual</p>
          </div>
        </div>
      )}

      {/* Resumen de rendimiento del entregable seleccionado */}
      {selectedDeliverableData && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Resumen de Rendimiento - {selectedDeliverableData.name}</h4>
          <div className="space-y-3">
            {selectedDeliverableData.criterios.map((criteria, index) => {
              const percentage = (criteria.grade / 20) * 100
              const getColor = (grade: number) => {
                if (grade >= 16) return "bg-green-500"
                if (grade >= 14) return "bg-yellow-500"
                if (grade >= 11) return "bg-orange-500"
                return "bg-red-500"
              }

              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-40 text-sm font-medium text-gray-700">{criteria.name}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${getColor(criteria.grade)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-sm font-bold text-right">{criteria.grade}/20</div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-700">{selectedDeliverableData.notaFinal}</div>
                <div className="text-xs text-gray-600">Nota Final</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-700">{selectedDeliverableData.notaExposicion}</div>
                <div className="text-xs text-gray-600">Exposición</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-700">
                  {Math.round(
                    selectedDeliverableData.criterios.reduce((sum, c) => sum + c.grade, 0) /
                      selectedDeliverableData.criterios.length,
                  )}
                </div>
                <div className="text-xs text-gray-600">Prom. Criterios</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay entregable seleccionado */}
      {!selectedDeliverableData && chartData.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Haz clic en cualquier punto del gráfico para ver el resumen de rendimiento de ese
            entregable específico.
          </p>
        </div>
      )}
    </div>
  )
}

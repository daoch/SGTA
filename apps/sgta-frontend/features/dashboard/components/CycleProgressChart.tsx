// src/features/dashboard/components/CycleProgressChart.tsx
'use client'
import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { ChartDataPoint } from '../types';
import { TrendingUp } from 'lucide-react';

interface CycleProgressChartProps {
  data: ChartDataPoint[];
}

// Componente para tooltip personalizado
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow-md border border-gray-100 rounded-md text-xs">
        <p className="font-semibold text-gray-800 mb-1">Ciclo: {label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-1.5 mt-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.stroke }}
            ></div>
            <span className="text-gray-700">{entry.name}: </span>
            <span className="font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  
  return null;
};

// Componente para leyenda personalizada
const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex justify-center gap-6 text-xs mb-2">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1.5">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="font-medium text-gray-700">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const CycleProgressChart: React.FC<CycleProgressChartProps> = ({ data }) => {
  // Definir claves de datos
  const tesistasKey = "tesistas";
  const aprobadosKey = "aprobados";

  // Verificar si tenemos datos de aprobados
  const hasAprobadosData = data.some(d => d[aprobadosKey] !== undefined && d[aprobadosKey] !== null);
  
  // Encontrar el valor máximo para mejor escala del gráfico
  const maxTesistas = Math.max(...data.map(d => d[tesistasKey] || 0));
  const maxAprobados = hasAprobadosData ? Math.max(...data.map(d => d[aprobadosKey] || 0)) : 0;
  const maxValue = Math.max(maxTesistas, maxAprobados);
  
  // Calcular el dominio de Y con un margen superior
  const yDomain = [0, Math.ceil(maxValue * 1.2)];
  
  // Calcular el promedio de tesistas para línea de referencia
  const avgTesistas = data.reduce((sum, item) => sum + (item[tesistasKey] || 0), 0) / data.length;

  return (
    <Card className="shadow-md border border-gray-200 rounded-xl h-full flex flex-col bg-white overflow-hidden">
      <CardHeader className="pb-4 pt-5 px-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-green-50 text-green-600">
            <TrendingUp size={20} strokeWidth={2} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Progreso por Ciclo</h3>
        </div>
        <p className="text-sm text-gray-600 ml-10">
          Evolución de tesistas activos {hasAprobadosData ? 'y aprobados' : ''} por ciclo académico.
        </p>
      </CardHeader>
      
      <CardBody className="p-4 flex-grow flex flex-col">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 space-y-2">
            <TrendingUp size={48} className="text-gray-300 mb-2" />
            <p className="text-base font-medium">No hay datos disponibles</p>
            <p className="text-sm text-gray-400">No hay información de ciclos registrada.</p>
          </div>
        ) : (
          <>
            <div className="h-64 w-full flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={data} 
                  margin={{ top: 20, right: 10, left: 0, bottom: 10 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke="#f1f5f9" 
                  />
                  <XAxis 
                    dataKey="name" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#64748b' }}
                    tickMargin={10}
                  />
                  <YAxis 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    allowDecimals={false}
                    tick={{ fill: '#64748b' }}
                    tickMargin={10}
                    domain={yDomain}
                  />
                  
                  {/* Línea de promedio de tesistas */}
                  <ReferenceLine 
                    y={avgTesistas} 
                    stroke="#94a3b8" 
                    strokeDasharray="3 3" 
                    strokeWidth={1}
                    label={{ 
                      value: 'Promedio', 
                      position: 'insideBottomRight',
                      fill: '#94a3b8',
                      fontSize: 9
                    }}
                  />
                  
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} />
                  
                  {/* Línea de Tesistas Activos */}
                  <Line 
                    type="monotone" 
                    dataKey={tesistasKey} 
                    name="Tesistas Activos"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ 
                      r: 4, 
                      strokeWidth: 2, 
                      stroke: '#2563eb',
                      fill: '#ffffff'
                    }} 
                    activeDot={{ 
                      r: 6, 
                      strokeWidth: 2,
                      stroke: '#2563eb',
                      fill: '#dbeafe'
                    }}
                    animationDuration={1500}
                  />
                  
                  {/* Línea de Aprobados (condicional) */}
                  {hasAprobadosData && (
                    <Line 
                      type="monotone" 
                      dataKey={aprobadosKey} 
                      name="Tesistas Aprobados"
                      stroke="#16a34a"
                      strokeWidth={2.5}
                      dot={{ 
                        r: 4, 
                        strokeWidth: 2, 
                        stroke: '#16a34a',
                        fill: '#ffffff'
                      }} 
                      activeDot={{ 
                        r: 6, 
                        strokeWidth: 2,
                        stroke: '#16a34a',
                        fill: '#dcfce7'
                      }}
                      animationDuration={1500}
                      animationBegin={300}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Resumen estadístico */}
            <div className="mt-3 grid grid-cols-2 gap-3 text-center bg-gray-50 rounded-lg p-2 border border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Tesistas promedio</p>
                <p className="text-sm font-semibold text-blue-600">{avgTesistas.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tendencia</p>
                <p className={`text-sm font-semibold ${
                  data[data.length-1][tesistasKey] > data[0][tesistasKey] 
                    ? 'text-green-600' 
                    : data[data.length-1][tesistasKey] < data[0][tesistasKey]
                      ? 'text-red-600'
                      : 'text-gray-600'
                }`}>
                  {data[data.length-1][tesistasKey] > data[0][tesistasKey] 
                    ? 'Creciente ↑' 
                    : data[data.length-1][tesistasKey] < data[0][tesistasKey]
                      ? 'Decreciente ↓'
                      : 'Estable →'}
                </p>
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default CycleProgressChart;
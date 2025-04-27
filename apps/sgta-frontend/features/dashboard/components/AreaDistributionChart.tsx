// src/features/dashboard/components/AreaDistributionChart.tsx
'use client'
import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { ChartDataPoint } from '../types';
import { BarChart3 } from 'lucide-react';

interface AreaDistributionChartProps {
  data: ChartDataPoint[];
}

// Paleta de colores mejorada con mejor contraste
const COLORS = [
  '#3b82f6', // Azul
  '#10b981', // Verde
  '#8b5cf6', // Púrpura
  '#f59e0b', // Ámbar
  '#ef4444', // Rojo
  '#06b6d4', // Cian
  '#ec4899', // Rosa
  '#14b8a6', // Turquesa
  '#f97316', // Naranja
  '#6366f1', // Índigo
];

// Tooltip personalizado
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow-md border border-gray-100 rounded-md text-xs">
        <p className="font-semibold text-gray-800 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-1.5">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.fill }}
            ></div>
            <span className="text-gray-700">{entry.name}: </span>
            <span className="font-medium">{entry.value}</span>
            <span className="text-gray-500">temas</span>
          </div>
        ))}
      </div>
    );
  }
  
  return null;
};

const AreaDistributionChart: React.FC<AreaDistributionChartProps> = ({ data }) => {
  // Ordenar datos de mayor a menor para mejor visualización
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  
  // Total para mostrar en el resumen
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="shadow-md border border-gray-200 rounded-xl h-full flex flex-col bg-white overflow-hidden">
      <CardHeader className="pb-4 pt-5 px-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-blue-50 text-blue-600">
            <BarChart3 size={20} strokeWidth={2} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Distribución por Áreas</h3>
        </div>
        <p className="text-sm text-gray-600 ml-10">
          Temas de proyectos distribuidos por área de conocimiento.
        </p>
      </CardHeader>
      
      <CardBody className="p-4 flex-grow flex flex-col">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 space-y-2">
            <BarChart3 size={48} className="text-gray-300 mb-2" />
            <p className="text-base font-medium">No hay datos disponibles</p>
            <p className="text-sm text-gray-400">No hay áreas con temas registrados.</p>
          </div>
        ) : (
          <>
            <div className="h-64 w-full flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={sortedData} 
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  barGap={4}
                  barCategoryGap="20%"
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke="#f1f5f9" 
                    strokeWidth={1} 
                  />
                  <XAxis 
                    dataKey="name" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#64748b' }}
                    tickMargin={8}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    allowDecimals={false}
                    tick={{ fill: '#64748b' }}
                    tickMargin={10}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                  />
                  <Bar 
                    dataKey="value" 
                    name="Temas" 
                    radius={[4, 4, 0, 0]}
                    minPointSize={3}
                    maxBarSize={60}
                  >
                    {sortedData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        fillOpacity={0.9}
                        style={{ filter: 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.06))' }} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {sortedData.length > 4 && (
              <div className="mt-4 border-t border-gray-100 pt-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {sortedData.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <div 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span title={item.name} className="font-medium text-gray-800 truncate max-w-[90px]">
                        {item.name}:
                      </span>
                      <span className="text-gray-600">{item.value}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                    <span className="font-medium text-gray-800">Total:</span>
                    <span className="text-gray-600">{total}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default AreaDistributionChart;
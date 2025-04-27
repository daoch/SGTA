// src/features/dashboard/components/ThemeStatusChart.tsx
'use client'
import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartDataPoint } from '../types';
import { PieChart as PieChartIcon } from 'lucide-react';

interface ThemeStatusChartProps {
  data: ChartDataPoint[];
}

// Paleta de colores mejorada
const STATUS_COLORS = {
  'Aprobados': '#16a34a', // Verde más saturado
  'En Revisión': '#2563eb', // Azul más saturado
  'Pendientes': '#d97706', // Ámbar más saturado
  'Rechazados': '#dc2626', // Rojo más saturado
  'Borrador': '#4b5563', // Gris más oscuro
  'Defendidos': '#8b5cf6', // Púrpura para posible estado adicional
  'En Desarrollo': '#0891b2', // Cian para posible estado adicional
};

// Componente para la leyenda personalizada
const renderCustomLegend = (props: any) => {
  const { payload } = props;
  
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs mt-3">
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-1.5 shadow-sm ring-1 ring-opacity-25" 
            style={{ 
              backgroundColor: entry.color,
              boxShadow: `0 1px 2px ${entry.color}40`,
              '--tw-ring-color': entry.color
            } as React.CSSProperties}
          ></div>
          <span className="font-medium text-gray-700">
            {entry.value}
          </span>
          <span className="ml-1 text-gray-500">
            ({entry.payload.percent.toFixed(0)}%)
          </span>
        </div>
      ))}
    </div>
  );
};

// Componente para el tooltip personalizado
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-white p-2 shadow-md border border-gray-100 rounded-md text-xs">
        <div className="font-semibold text-gray-800">{data.name}</div>
        <div className="flex items-center mt-1">
          <div 
            className="w-2 h-2 rounded-full mr-1.5" 
            style={{ backgroundColor: data.color }}
          ></div>
          <span className="text-gray-700">{data.value} tema(s)</span>
        </div>
        <div className="text-gray-500 text-xs mt-1">
          {data.percent.toFixed(1)}% del total
        </div>
      </div>
    );
  }
  
  return null;
};

const ThemeStatusChart: React.FC<ThemeStatusChartProps> = ({ data }) => {
  // Calcular porcentaje para labels
  const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);
  const dataWithPercent = data.map(entry => ({
    ...entry,
    color: STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || '#94a3b8', 
    percent: totalValue > 0 ? (entry.value / totalValue) * 100 : 0,
  }));

  return (
    <Card className="shadow-md border border-gray-200 rounded-xl h-full flex flex-col bg-white overflow-hidden">
      <CardHeader className="pb-4 pt-5 px-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-purple-50 text-purple-600">
            <PieChartIcon size={20} strokeWidth={2} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Estado de Temas</h3>
        </div>
        <p className="text-sm text-gray-600 ml-10">
          Distribución de temas de proyecto por estado actual.
        </p>
      </CardHeader>
      
      <CardBody className="flex flex-col items-center justify-center p-4 flex-grow"> 
        {dataWithPercent.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 space-y-2">
            <PieChartIcon size={48} className="text-gray-300 mb-2" />
            <p className="text-base font-medium">No hay datos disponibles</p>
            <p className="text-sm text-gray-400">No hay temas registrados actualmente.</p>
          </div>
        ) : (
          <div className="w-full h-64 flex-grow flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataWithPercent}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  label={false}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {dataWithPercent.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      style={{ filter: 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))' }} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  content={renderCustomLegend} 
                  verticalAlign="bottom" 
                  wrapperStyle={{ paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {dataWithPercent.length > 0 && (
          <div className="mt-2 text-center">
            <div className="text-xs font-medium text-gray-500">
              Total de temas: <span className="text-gray-800 font-semibold">{totalValue}</span>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ThemeStatusChart;
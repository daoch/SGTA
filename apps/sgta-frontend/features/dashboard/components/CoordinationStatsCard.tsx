// src/features/dashboard/components/CoordinationStatsCard.tsx
import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import { StatData } from '../types';
import StatCard from './StatCard';
import { Activity } from 'lucide-react';

interface CoordinationStatsCardProps {
  stats: StatData[];
  title?: string;
  subtitle?: string;
}

const CoordinationStatsCard: React.FC<CoordinationStatsCardProps> = ({ 
  stats, 
  title = "Resumen Coordinación", 
  subtitle = "Indicadores clave del rendimiento de coordinación"
}) => {
  return (
    <Card className="shadow-md border border-gray-200 rounded-xl overflow-hidden">
      <CardHeader className="pb-4 pt-5 px-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-indigo-50 text-indigo-600">
            <Activity size={20} strokeWidth={2} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {subtitle && (
          <p className="text-sm text-gray-600 ml-10">
            {subtitle}
          </p>
        )}
      </CardHeader>
      
      <CardBody className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard 
              key={index} 
              title={stat.label}
              value={stat.value}
              icon={stat.icon ?? require('lucide-react').Circle}
              delta={stat.delta}
              deltaType={stat.deltaType}
              color={stat.color || 'default'}
              description={stat.description || (
                stat.deltaType 
                  ? (stat.deltaType === 'positive' 
                      ? 'vs. ciclo anterior' 
                      : 'vs. ciclo anterior')
                  : undefined
              )}
            />
          ))}
        </div>
        
        {/* Opcional: Añadir un pequeño resumen o insight */}
        {stats.length > 0 && (
          <div className="mt-5 text-xs text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-100">
            <p className="font-medium text-gray-700 mb-1">Análisis Comparativo</p>
            <p>
              Los indicadores muestran {
                stats.filter(s => s.deltaType === 'positive').length > stats.filter(s => s.deltaType === 'negative').length 
                  ? 'una tendencia positiva general' 
                  : 'áreas de mejora prioritarias'
              } respecto al ciclo académico anterior.
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default CoordinationStatsCard;
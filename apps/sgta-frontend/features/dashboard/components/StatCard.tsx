// src/features/dashboard/components/StatCard.tsx
import React from 'react';
import { Card, CardHeader, CardBody } from "@heroui/react";
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title, 
  value, 
  icon: Icon, 
  delta, 
  deltaType = 'neutral', 
  color = 'default', 
  description
}) => {
  
  // Configuración de colores y estilos mejorada
  const colorClasses = {
    primary: { 
      icon: "text-primary-600 group-hover:text-primary-700", 
      bg: "bg-primary-50 group-hover:bg-primary-100", 
      delta: "text-primary-700",
      ring: "ring-primary-200",
      border: "border-primary-100"
    },
    success: { 
      icon: "text-success-600 group-hover:text-success-700", 
      bg: "bg-success-50 group-hover:bg-success-100", 
      delta: "text-success-700",
      ring: "ring-success-200",
      border: "border-success-100"
    },
    warning: { 
      icon: "text-warning-600 group-hover:text-warning-700", 
      bg: "bg-warning-50 group-hover:bg-warning-100", 
      delta: "text-warning-700",
      ring: "ring-warning-200",
      border: "border-warning-100"
    },
    danger: { 
      icon: "text-danger-600 group-hover:text-danger-700", 
      bg: "bg-danger-50 group-hover:bg-danger-100", 
      delta: "text-danger-700",
      ring: "ring-danger-200",
      border: "border-danger-100"
    },
    default: { 
      icon: "text-gray-600 group-hover:text-gray-700", 
      bg: "bg-gray-50 group-hover:bg-gray-100", 
      delta: "text-gray-700",
      ring: "ring-gray-200",
      border: "border-gray-100"
    },
  };
  
  const styles = colorClasses[color];
  
  // Función para formatear el valor numérico si es necesario
  const formatValue = (val: string | number) => {
    if (typeof val === 'number' && val >= 1000) {
      return val.toLocaleString('es-ES');
    }
    return val;
  };

  return (
    <Card className={`shadow-sm border ${styles.border} rounded-xl overflow-hidden group transition-all duration-200 hover:shadow-md`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
        <h3 className="tracking-tight text-sm font-semibold text-gray-700">{title}</h3>
        <div className={`p-2 rounded-full ${styles.bg} ring-1 ${styles.ring} transition-colors duration-200`}>
          <Icon className={`h-4 w-4 ${styles.icon}`} strokeWidth={2} />
        </div>
      </CardHeader>
      
      <CardBody className="pt-1 pb-4 px-4">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {formatValue(value)}
        </div>
        
        {(delta || description) && (
          <div className="flex items-center gap-1 mt-1">
            {delta && (
              <div className={`flex items-center gap-0.5 text-xs font-medium ${
                deltaType === 'positive' 
                  ? 'text-success-600' 
                  : deltaType === 'negative' 
                    ? 'text-danger-600' 
                    : 'text-gray-500'
              }`}>
                {deltaType === 'positive' ? (
                  <TrendingUp size={12} className="flex-shrink-0" />
                ) : deltaType === 'negative' ? (
                  <TrendingDown size={12} className="flex-shrink-0" />
                ) : null}
                <span>{delta}</span>
              </div>
            )}
            
            {description && (
              <p className="text-xs text-gray-500 truncate">
                {delta && '•'} {description}
              </p>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default StatCard;
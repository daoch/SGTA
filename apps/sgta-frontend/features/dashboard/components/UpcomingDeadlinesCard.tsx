// src/features/dashboard/components/UpcomingDeadlinesCard.tsx
import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button } from '@heroui/react';
import { Clock, ArrowRight, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { UpcomingDeadline } from '../types';

interface UpcomingDeadlinesCardProps {
  deadlines: UpcomingDeadline[];
}

const UpcomingDeadlinesCard: React.FC<UpcomingDeadlinesCardProps> = ({ deadlines }) => {
  
  // Ordenar deadlines por días restantes (ascendente)
  const sortedDeadlines = [...deadlines].sort((a, b) => a.daysRemaining - b.daysRemaining);
  
  const formatDaysRemaining = (days: number) => {
    if (days < 0) {
      return (
        <div className="flex items-center gap-1.5 text-danger-600 font-medium">
          <AlertTriangle size={14} className="flex-shrink-0" />
          <span>Vencido</span>
        </div>
      );
    }
    if (days === 0) {
      return (
        <div className="flex items-center gap-1.5 text-danger-600 font-medium">
          <Clock size={14} className="flex-shrink-0" />
          <span>¡Hoy!</span>
        </div>
      );
    }
    if (days === 1) {
      return (
        <div className="flex items-center gap-1.5 text-warning-600 font-medium">
          <Clock size={14} className="flex-shrink-0" />
          <span>Mañana</span>
        </div>
      );
    }
    if (days <= 7) {
      return (
        <div className="flex items-center gap-1.5 text-primary-600 font-medium">
          <Clock size={14} className="flex-shrink-0" />
          <span>{days} días</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 text-success-600 font-medium">
        <CheckCircle size={14} className="flex-shrink-0" />
        <span>{days} días</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    });
  };

  // Función para determinar el color de fondo basado en los días restantes
  const getItemBackground = (days: number) => {
    if (days < 0) return "bg-danger-50";
    if (days === 0) return "bg-danger-50";
    if (days === 1) return "bg-warning-50";
    return "";
  };

  return (
    <Card className="shadow-md border border-gray-200 rounded-xl h-full flex flex-col bg-white overflow-hidden">
      <CardHeader className="pb-4 pt-5 px-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-blue-50 text-blue-600">
            <Clock size={20} strokeWidth={2} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Próximas Fechas Límite</h3>
        </div>
        <p className="text-sm text-gray-600 ml-10">
          Hitos importantes del ciclo o de tus proyectos.
        </p>
      </CardHeader>
      
      <CardBody className="p-0 flex-grow overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {sortedDeadlines.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 space-y-2">
            <CheckCircle size={48} className="text-success-500 mb-2 opacity-75" />
            <p className="text-base font-medium">No hay fechas límite próximas</p>
            <p className="text-sm text-gray-400">Estaremos al tanto de futuros hitos</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedDeadlines.map((deadline) => (
              <div 
                key={deadline.id} 
                className={`flex items-center justify-between p-4 gap-4 relative hover:bg-gray-50 transition-colors duration-200 ${getItemBackground(deadline.daysRemaining)}`}
              >
                {/* Indicador visual para fechas críticas */}
                {deadline.daysRemaining <= 1 && deadline.daysRemaining >= 0 && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-warning-500 rounded-r"></span>
                )}
                {deadline.daysRemaining < 0 && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-danger-500 rounded-r"></span>
                )}
                
                <div className="flex items-start gap-4 min-w-0 pl-1">
                  <div className={`p-2.5 rounded-full ${
                    deadline.type === 'global' 
                      ? 'bg-purple-100 text-purple-600 ring-1 ring-purple-200' 
                      : 'bg-blue-100 text-blue-600 ring-1 ring-blue-200'
                  } shadow-sm flex-shrink-0`}>
                    <Calendar size={16} strokeWidth={2.5} />
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-800 truncate" title={deadline.name}>
                        {deadline.name}
                      </p>
                      {deadline.type === 'global' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          Global
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500 gap-1">
                      <Calendar size={12} />
                      <span>{formatDate(deadline.date instanceof Date ? deadline.date.toISOString() : deadline.date)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-2">
                  {formatDaysRemaining(deadline.daysRemaining)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
      
      {sortedDeadlines.length > 0 && (
        <CardFooter className="border-t border-gray-100 p-3">
          <Button 
            variant="light" 
            color="primary" 
            size="sm" 
            className="w-full text-xs font-medium py-2 hover:bg-primary-50 transition-colors"
          >
            Ver calendario completo
            <ArrowRight size={14} className="ml-1.5" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default UpcomingDeadlinesCard;
// src/features/dashboard/components/MyEvaluationsCard.tsx
import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Chip, Button } from '@heroui/react';
import { CheckCircle2, Calendar, ArrowRight, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { MyEvaluationInfo } from '../types';

interface MyEvaluationsCardProps {
  evaluations: MyEvaluationInfo[];
}

// Mapeo de estados mejorado con colores y textos más claros
const evaluationStatusConfig: Record<MyEvaluationInfo['estado'], { 
  color: "warning" | "primary" | "success" | "default"; 
  text: string;
  icon: React.ElementType;
}> = {
  pendiente_confirmar: { 
    color: "warning", 
    text: "Por Confirmar", 
    icon: Clock 
  },
  confirmada: { 
    color: "primary", 
    text: "Confirmada", 
    icon: CheckCircle2 
  },
  evaluacion_pendiente: { 
    color: "warning", 
    text: "Evaluación Pendiente", 
    icon: Calendar 
  },
  evaluada: { 
    color: "success", 
    text: "Evaluada", 
    icon: CheckCircle2 
  },
};

const MyEvaluationsCard: React.FC<MyEvaluationsCardProps> = ({ evaluations }) => {
  // Ordenar por fecha más próxima
  const sortedEvaluations = [...evaluations].sort((a, b) => 
    new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
  );

  // Función para formatear fecha de manera más amigable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    
    // Si la fecha es hoy o mañana, mostrar texto descriptivo
    if (date.toDateString() === now.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Mañana";
    }
    
    // Para otras fechas, formato normal
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short'
    });
  };

  return (
    <Card className="shadow-md border border-gray-200 rounded-xl h-full flex flex-col bg-white overflow-hidden">
      <CardHeader className="pb-4 pt-5 px-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-teal-50 text-teal-600">
            <CheckCircle2 size={20} strokeWidth={2} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Mis Evaluaciones (Jurado)</h3>
        </div>
        <p className="text-sm text-gray-600 ml-10">
          Defensas asignadas para tu evaluación.
        </p>
      </CardHeader>
      
      <CardBody className="p-0 flex-grow overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {sortedEvaluations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 space-y-2">
            <CheckCircle2 size={48} className="text-gray-300 mb-2" />
            <p className="text-base font-medium">No tienes evaluaciones asignadas</p>
            <p className="text-sm text-gray-400">Te notificaremos cuando seas asignado a un jurado.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedEvaluations.map((evaluation) => {
              const statusInfo = evaluationStatusConfig[evaluation.estado] || { 
                color: "default", 
                text: evaluation.estado,
                icon: Calendar
              };
              const StatusIcon = statusInfo.icon;
              const fecha = new Date(evaluation.fechaHora);
              const fechaStr = formatDate(evaluation.fechaHora);
              const horaStr = fecha.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit'
              });
              
              // Determinar si es una fecha cercana (hoy o mañana)
              const isUpcoming = fechaStr === "Hoy" || fechaStr === "Mañana";
              
              return (
                <Link 
                  href={evaluation.linkToEvaluation} 
                  key={evaluation.id} 
                  className="block hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className={`flex items-start justify-between p-4 gap-4 relative ${
                    isUpcoming ? 'bg-amber-50/30 hover:bg-amber-50/50' : ''
                  }`}>
                    {/* Indicador visual para próximas evaluaciones */}
                    {isUpcoming && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r"></span>
                    )}
                    
                    <div className="flex items-start gap-4 min-w-0 pl-1">
                      <div className={`p-2.5 rounded-full bg-${statusInfo.color}-100 text-${statusInfo.color}-600 ring-1 ring-${statusInfo.color}-200 shadow-sm flex-shrink-0 mt-0.5`}>
                        <StatusIcon size={16} strokeWidth={2.5} />
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate mb-0.5" title={evaluation.tesistaNombre}>
                          {evaluation.tesistaNombre}
                        </p>
                        <p className="text-xs text-gray-500 truncate line-clamp-1 mb-2" title={evaluation.temaTitulo}>
                          {evaluation.temaTitulo}
                        </p>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                          <div className="flex items-center text-primary-600 font-medium">
                            <Calendar size={12} className="mr-1" />
                            <span>{fechaStr}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock size={12} className="mr-1" />
                            <span>{horaStr}</span>
                          </div>
                          {evaluation.lugar && (
                            <div className="flex items-center text-gray-600">
                              <MapPin size={12} className="mr-1" />
                              <span className="truncate max-w-[150px]" title={evaluation.lugar}>
                                {evaluation.lugar}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Chip 
                        color={statusInfo.color} 
                        variant="flat" 
                        size="sm" 
                        className="capitalize font-medium"
                      >
                        {statusInfo.text}
                      </Chip>
                      <ArrowRight 
                        size={16} 
                        className="text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200 hidden sm:block" 
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardBody>
      
      {sortedEvaluations.length > 0 && (
        <CardFooter className="border-t border-gray-100 p-3">
          <Button 
            variant="light" 
            color="primary" 
            size="sm" 
            className="w-full text-xs font-medium py-2 hover:bg-primary-50 transition-colors"
            as={Link} 
            href="/mis-evaluaciones"
          >
            Ver todas mis evaluaciones
            <ArrowRight size={14} className="ml-1.5" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MyEvaluationsCard;
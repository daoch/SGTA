// src/features/dashboard/components/PendingActionsCard.tsx
import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Badge, Chip } from '@heroui/react';
import { AlertCircle, CheckCircle2, FileText, RefreshCw, UserCheck, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { PendingAction } from '../types';

interface PendingActionsCardProps {
  actions: PendingAction[];
}

// Mapeo de tipos a iconos y colores (optimizado para mejor contraste visual)
const actionConfig = {
  revision: { icon: FileText, color: 'primary', label: 'Revisión' },
  aprobacion_tema: { icon: CheckCircle2, color: 'success', label: 'Aprob. Tema' },
  aprobacion_cese: { icon: UserCheck, color: 'warning', label: 'Aprob. Cese' },
  confirmacion_defensa: { icon: CheckCircle2, color: 'secondary', label: 'Conf. Defensa' },
  evaluacion_defensa: { icon: FileText, color: 'primary', label: 'Eval. Defensa' },
  reasignacion: { icon: RefreshCw, color: 'danger', label: 'Reasignación' },
};

const PendingActionsCard: React.FC<PendingActionsCardProps> = ({ actions }) => {
  
  // Ordenar por prioridad y luego por fecha
  const sortedActions = [...actions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityA = priorityOrder[a.priority || 'low'];
    const priorityB = priorityOrder[b.priority || 'low'];
    
    if (priorityA !== priorityB) return priorityA - priorityB;
    if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  const getPriorityBadge = (priority?: 'high' | 'medium' | 'low') => {
    switch(priority) {
      case 'high':
        return <Chip color="danger" variant="flat" size="sm" className="font-medium">Urgente</Chip>;
      case 'medium':
        return <Chip color="warning" variant="flat" size="sm" className="font-medium">Pronto</Chip>;
      case 'low':
        return <Chip color="default" variant="flat" size="sm" className="font-medium">Normal</Chip>;
      default:
        return null;
    }
  };

  // Formatea la fecha a un formato más amigable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Si la fecha es hoy o en los próximos días, mostrar texto más descriptivo
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays > 1 && diffDays <= 7) return `En ${diffDays} días`;
    
    // Para otras fechas, formato normal
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short'
    });
  };

  return (
    <Card className="shadow-md border border-gray-200 rounded-xl h-full flex flex-col bg-white overflow-hidden">
      <CardHeader className="pb-4 pt-5 px-5 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-amber-50 text-amber-600">
            <AlertCircle size={20} strokeWidth={2} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Acciones Pendientes</h3>
        </div>
        <p className="text-sm text-gray-600 ml-10">
          Tareas que requieren tu atención inmediata.
        </p>
      </CardHeader>
      
      <CardBody className="p-0 flex-grow overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {sortedActions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 space-y-2">
            <CheckCircle2 size={48} className="text-success-500 mb-2 opacity-75" />
            <p className="text-base font-medium">No tienes acciones pendientes</p>
            <p className="text-sm text-gray-400">¡Disfruta de tu día!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedActions.map((action) => {
              const config = actionConfig[action.type] || { icon: AlertCircle, color: 'default', label: 'Acción' };
              const Icon = config.icon;
              
              return (
                <Link 
                  href={action.link} 
                  key={action.id} 
                  className="block hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className="flex items-center justify-between p-4 gap-4 relative">
                    {/* Indicador visual de prioridad */}
                    {action.priority === 'high' && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-danger-500 rounded-r"></span>
                    )}
                    
                    <div className="flex items-start gap-4 min-w-0 pl-1">
                      <div className={`p-2.5 rounded-full bg-${config.color}-100 text-${config.color}-600 ring-1 ring-${config.color}-200 shadow-sm flex-shrink-0`}>
                        <Icon size={16} strokeWidth={2.5} />
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-800 truncate" title={action.description}>
                            {action.description}
                          </p>
                          <Chip 
                            size="sm"
                            color={config.color as any} 
                            variant="flat" 
                            className="ml-1 text-xs font-medium hidden sm:inline-flex"
                          >
                            {config.label}
                          </Chip>
                        </div>
                        
                        {action.dueDate && (
                          <div className="flex items-center text-xs text-gray-500 gap-1">
                            <Clock size={12} />
                            <span>Vence: <span className="font-medium">{formatDate(action.dueDate instanceof Date ? action.dueDate.toISOString() : action.dueDate)}</span></span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {getPriorityBadge(action.priority)}
                      <ArrowRight 
                        size={16} 
                        className="text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200" 
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardBody>
      
      {sortedActions.length > 0 && (
        <CardFooter className="border-t border-gray-100 p-3">
          <Button 
            variant="light" 
            color="primary" 
            size="sm" 
            className="w-full text-xs font-medium py-2 hover:bg-primary-50 transition-colors"
          >
            Ver todas las tareas
            <ArrowRight size={14} className="ml-1.5" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PendingActionsCard;
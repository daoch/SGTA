// src/features/student-project/components/UpcomingDeliverables.tsx
import React from 'react';
import { Card, CardHeader, CardBody, Button, Chip, CardFooter } from '@heroui/react';
import { Clock, Calendar, ArrowRight, Upload } from 'lucide-react';
import { ProjectMilestone } from '../types';
import Link from 'next/link';

interface UpcomingDeliverablesProps {
  deadlines: ProjectMilestone[]; // Recibe los próximos 2-3 hitos del hook
}

const UpcomingDeliverables: React.FC<UpcomingDeliverablesProps> = ({ deadlines }) => {
    
  const formatDate = (isoDate?: string | Date): string => {
    if (!isoDate) return 'Fecha no disponible';
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const formatDaysRemaining = (days: number): React.ReactNode => {
    if (days < 0) return <Chip color="danger" size="sm">Vencido</Chip>;
    if (days === 0) return <Chip color="warning" size="sm">Hoy</Chip>;
    if (days === 1) return <Chip color="warning" size="sm">Mañana</Chip>;
    return <Chip color="success" size="sm">{`${days} días`}</Chip>;
  };
  const calculateDaysRemaining = (dueDate: string | Date): number => {
      const today = new Date(); today.setHours(0,0,0,0);
      const due = new Date(dueDate); due.setHours(0,0,0,0);
      return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  return (
    <Card className="shadow-sm border h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
         <div className="flex items-center gap-2 mb-1">
            <Clock size={18} className="text-primary"/>
            <h3 className="text-lg font-medium text-gray-900">Próximos Hitos</h3>
         </div>
         <p className="text-sm text-gray-500 pl-7">Tus siguientes entregas o exposiciones.</p>
      </CardHeader>
      <CardBody className="p-0 flex-grow">
         {deadlines.length === 0 ? (
             <div className="flex items-center justify-center h-full text-gray-500 p-6 text-center">
                 ¡Parece que no hay hitos pendientes próximamente! Revisa tu cronograma completo.
             </div>
         ) : (
            <div className="divide-y divide-gray-100">
                {deadlines.map((deadline) => {
                    const daysRemaining = calculateDaysRemaining(deadline.fechaLimite);
                    return (
                        <div key={deadline.id} className="p-3 flex items-center justify-between gap-3 hover:bg-gray-50/50">
                           <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate" title={deadline.nombre}>
                                    {deadline.nombre}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                    <Calendar size={12}/> {formatDate(deadline.fechaLimite)}
                                </p>
                           </div>
                           <div className="flex-shrink-0 text-right">
                               <div className="text-xs mb-1">{formatDaysRemaining(daysRemaining)}</div>
                               {deadline.linkToSubmission && (
                                   <Button as={Link} href={deadline.linkToSubmission} size="sm" variant="light" color="primary" className="h-auto p-0 text-xs">
                                       {deadline.estadoEntrega === 'pendiente' || deadline.estadoEntrega === 'revisado_observado' ? 'Entregar' : 'Ver'}
                                   </Button>
                               )}
                           </div>
                        </div>
                    );
                })}
            </div>
         )}
      </CardBody>
        {deadlines.length > 0 && ( // Mostrar solo si hay items
            <CardFooter className="border-t p-2">
                <Button variant="light" color="primary" size="sm" className="w-full text-xs">
                    Ver Cronograma Completo
                    <ArrowRight size={14} className="ml-1" />
                </Button>
            </CardFooter>
        )}
    </Card>
  );
};
export default UpcomingDeliverables;
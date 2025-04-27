// src/features/student-project/components/RecentActivityFeed.tsx
import React from 'react';
import { Card, CardHeader, CardBody, Button, CardFooter } from '@heroui/react';
import { Activity, ArrowRight, MessageSquare, Upload, CheckCircle } from 'lucide-react';

interface ActivityItem {
  id: string;
  fecha: string | Date;
  descripcion: string;
  // tipo?: 'entrega' | 'comentario' | 'aprobacion' | 'sistema'; // Para diferenciar iconos/estilos
}

interface RecentActivityFeedProps {
  activities: ActivityItem[];
}

// Mapeo de iconos (ejemplo)
const getActivityIcon = (descripcion: string): React.ReactElement => {
    if (descripcion.toLowerCase().includes('entregaste')) return <Upload size={14} className="text-blue-500"/>;
    if (descripcion.toLowerCase().includes('comentó')) return <MessageSquare size={14} className="text-purple-500"/>;
    if (descripcion.toLowerCase().includes('aprobó')) return <CheckCircle size={14} className="text-green-500"/>;
    return <Activity size={14} className="text-gray-500"/>; // Default
}

const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities }) => {

  const formatDate = (isoDate?: string | Date): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const getTimeElapsed = (isoDate?: string | Date): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'hace unos segundos';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
    return `hace ${Math.floor(diffInSeconds / 86400)} días`;
  };


  return (
    <Card className="shadow-sm border h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
         <div className="flex items-center gap-2 mb-1">
             <Activity size={18} className="text-primary"/>
             <h3 className="text-lg font-medium text-gray-900">Actividad Reciente del Proyecto</h3>
         </div>
      </CardHeader>
      <CardBody className="p-0 flex-grow overflow-y-auto max-h-96">
        {activities.length === 0 ? (
             <div className="flex items-center justify-center h-full text-gray-500 p-6">
                 No hay actividad reciente para mostrar.
             </div>
        ) : (
           <div className="divide-y divide-gray-100">
               {activities.map((activity) => (
                 <div key={activity.id} className="p-3 flex items-start gap-3 hover:bg-gray-50/50">
                    <div className="mt-1 flex-shrink-0">
                        {getActivityIcon(activity.descripcion)}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-800">{activity.descripcion}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                           {formatDate(activity.fecha)} ({getTimeElapsed(activity.fecha)})
                        </p>
                    </div>
                 </div>
               ))}
           </div>
        )}
      </CardBody>
       {activities.length > 5 && ( // Mostrar si hay más de 5 actividades
            <CardFooter className="border-t p-2">
                <Button variant="light" color="primary" size="sm" className="w-full text-xs">
                    Ver toda la actividad
                    <ArrowRight size={14} className="ml-1" />
                </Button>
            </CardFooter>
        )}
    </Card>
  );
};

export default RecentActivityFeed;
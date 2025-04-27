// src/features/student-applications/components/PostulationCard.tsx
import React from 'react';
import { Card, CardHeader, CardBody, Avatar, Button, Tooltip, CardFooter } from '@heroui/react';
import { FileSearch, User, Calendar, MessageSquare, ThumbsUp, Trash2 } from 'lucide-react'; // Iconos diferentes
import Link from 'next/link';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import { PostulationSummary } from '../types';

interface PostulationCardProps {
    postulation: PostulationSummary;
    // Cambiado: ahora recibe la función para ABRIR el modal de confirmación
    onRequestWithdraw: (postulation: PostulationSummary) => void; 
    isSubmitting: boolean;
  }

  const PostulationCard: React.FC<PostulationCardProps> = ({ 
    postulation, 
    onRequestWithdraw,
    isSubmitting = false
}) => {
    
  const formatDate = (isoDate: string | Date) => new Date(isoDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  const canWithdraw = (postulation.estado === 'enviada' || postulation.estado === 'en_revision');

  return (
     <Card className="shadow-sm border hover:shadow-md transition-shadow">
      <CardHeader className="p-3 border-b flex justify-between items-start gap-2">
         <div className="flex items-center gap-2 min-w-0">
             <ThumbsUp size={18} className="text-secondary flex-shrink-0"/> {/* Icono diferente */}
             <p className="font-semibold text-sm truncate" title={postulation.temaLibre.titulo}>
                 {postulation.temaLibre.titulo}
             </p>
         </div>
          <ApplicationStatusBadge status={postulation.estado} />
      </CardHeader>
      <CardBody className="p-3 text-xs space-y-2">
         <div className="flex items-center text-gray-600 gap-1.5">
            <User size={12}/> 
            <span>Asesor del Tema:</span> 
            <span className="font-medium text-gray-800">{postulation.asesorTema.nombre}</span>
         </div>
         <div className="flex items-center text-gray-600 gap-1.5">
            <Calendar size={12}/>
            <span>Fecha Postulación:</span>
            <span className="font-medium text-gray-800">{formatDate(postulation.fechaPostulacion)}</span>
         </div>
         {postulation.motivacionEnviada && (
             <div className="pt-1 text-gray-600">
                <p className="font-medium text-gray-700 mb-0.5 text-[11px] uppercase tracking-wide">Tu Motivación (Resumen):</p>
                <p className="italic bg-gray-50 p-1.5 rounded border border-gray-100 line-clamp-2">"{postulation.motivacionEnviada}"</p>
             </div>
         )}
          {postulation.ultimoComentarioAsesor && (
              <div className="pt-1 text-gray-600">
                 <p className="font-medium text-gray-700 mb-0.5 text-[11px] uppercase tracking-wide">Último Comentario:</p>
                 <p className="italic bg-gray-50 p-1.5 rounded border border-gray-100">"{postulation.ultimoComentarioAsesor}"</p>
              </div>
          )}
      </CardBody>
      {canWithdraw && (
           <CardFooter className="p-2 border-t bg-gray-50/50 flex justify-end gap-1">
              <Button 
                      size="sm" 
                      variant="light" 
                      color="danger" 
                      startContent={<Trash2 size={14}/>} 
                      onPress={() => onRequestWithdraw(postulation)} // Llama al prop con la postulación
                      isDisabled={isSubmitting}
                   >
                      Retirar Postulación
                   </Button>
           </CardFooter>
       )}
    </Card>
  );
};
export default PostulationCard;
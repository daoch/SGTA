// src/features/student-applications/components/ProposalCard.tsx
import React from 'react';
import { Card, CardHeader, CardBody, Avatar, Button, Tooltip, CardFooter } from '@heroui/react';
import { FileText, User, Calendar, MessageSquare, Edit, Trash2 } from 'lucide-react'; // Iconos relevantes
import Link from 'next/link';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import { ProposalSummary } from '../types';

interface ProposalCardProps {
    proposal: ProposalSummary;
    // Cambiado: ahora recibe la función para ABRIR el modal de confirmación
    onRequestWithdraw: (proposal: ProposalSummary) => void; 
    isSubmitting: boolean; // Estado global de submit para deshabilitar botón
  }

  const ProposalCard: React.FC<ProposalCardProps> = ({ 
    proposal, 
    onRequestWithdraw,
    isSubmitting = false 
}) => {
  const formatDate = (isoDate: string | Date) => new Date(isoDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  const canEdit = proposal.estado === 'enviada' || proposal.estado === 'en_revision'; // Lógica de ejemplo
  const canWithdraw = proposal.estado === 'enviada' || proposal.estado === 'en_revision';

  return (
    <Card className="shadow-sm border hover:shadow-md transition-shadow">
      <CardHeader className="p-3 border-b flex justify-between items-start gap-2">
         <div className="flex items-center gap-2 min-w-0">
             <FileText size={18} className="text-primary flex-shrink-0"/>
             <p className="font-semibold text-sm truncate" title={proposal.tituloPropuesto}>
                 {proposal.tituloPropuesto}
             </p>
         </div>
          <ApplicationStatusBadge status={proposal.estado} />
      </CardHeader>
      <CardBody className="p-3 text-xs space-y-2">
         <div className="flex items-center text-gray-600 gap-1.5">
            <User size={12}/> 
            <span>Enviada a:</span> 
            <span className="font-medium text-gray-800">{proposal.asesorDestino.nombre}</span>
         </div>
         <div className="flex items-center text-gray-600 gap-1.5">
            <Calendar size={12}/>
            <span>Fecha:</span>
            <span className="font-medium text-gray-800">{formatDate(proposal.fechaEnvio)}</span>
         </div>
          {proposal.ultimoComentarioAsesor && (
              <div className="pt-1 text-gray-600">
                 <p className="font-medium text-gray-700 mb-0.5 text-[11px] uppercase tracking-wide">Último Comentario:</p>
                 <p className="italic bg-gray-50 p-1.5 rounded border border-gray-100">"{proposal.ultimoComentarioAsesor}"</p>
              </div>
          )}
      </CardBody>
      {(canEdit || canWithdraw) && (
          <CardFooter className="p-2 border-t bg-gray-50/50 flex justify-end gap-1">
             {/* {canEdit && onEdit && (
                 <Button size="sm" variant="light" color="primary" startContent={<Edit size={14}/>} onPress={() => onEdit(proposal.id)}>Editar</Button>
             )}
             {canWithdraw && onWithdraw && (
                  <Button size="sm" variant="light" color="danger" startContent={<Trash2 size={14}/>} onPress={() => onWithdraw(proposal.id)}>Retirar</Button>
             )} */}
             {canWithdraw && (
                  <Button 
                  size="sm" 
                  variant="light" 
                  color="danger" 
                  startContent={<Trash2 size={14}/>} 
                  onPress={() => onRequestWithdraw(proposal)} // Llama al prop con la propuesta
                  isDisabled={isSubmitting} // Deshabilitar si OTRA acción está en curso
               >
                  Retirar Propuesta
               </Button>
             )}
              {/* <p className="text-xs text-gray-400 italic mr-auto pl-1">Acciones no implementadas</p> */} {/* Placeholder */}
          </CardFooter>
      )}
    </Card>
  );
};
export default ProposalCard;
// src/features/student-project/components/AdvisorInfoCard.tsx
import React from 'react';
import { Card, CardBody, CardHeader, Avatar, Button, Chip } from '@heroui/react';
import { User, Mail, Phone /* Podría ser icono de estado */, Edit } from 'lucide-react';
import { AdvisorContactInfo, AdvisorChangeRequestInfo } from '../types';

interface AdvisorInfoCardProps {
    advisor: AdvisorContactInfo;
    changeRequestStatus: AdvisorChangeRequestInfo;
    onOpenChangeRequestModal: () => void; // Función para abrir el modal
}

const AdvisorInfoCard: React.FC<AdvisorInfoCardProps> = ({ advisor, changeRequestStatus, onOpenChangeRequestModal }) => {
    const canRequestChange = changeRequestStatus.estado === 'no_solicitado';

    const renderStatusChip = () => {
         switch(changeRequestStatus.estado) {
             case 'pendiente_revision': return <Chip color="warning" size="sm" variant='flat'>Solicitud Cambio Pendiente</Chip>;
             case 'aprobada': return <Chip color="success" size="sm" variant='flat'>Cambio Aprobado (Próximamente)</Chip>; // Podría haber más detalle
             case 'rechazada': return <Chip color="danger" size="sm" variant='flat'>Solicitud Cambio Rechazada</Chip>;
             default: return null;
         }
    }

    return (
        <Card className="shadow-sm border">
            <CardHeader className="border-b pb-2">
                <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                    <User size={16} className="text-primary" /> Asesor Principal Asignado
                </h3>
            </CardHeader>
            <CardBody className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                    <Avatar src={advisor.avatar} name={advisor.nombre} size="lg" />
                    <div>
                        <p className="font-medium text-gray-900">{advisor.nombre}</p>
                        <a href={`mailto:${advisor.email}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                            <Mail size={14}/> {advisor.email}
                        </a>
                    </div>
                </div>
                {/* Mostrar Estado de Solicitud de Cambio */}
                <div className="flex justify-between items-center pt-2 border-t mt-2">
                    <div className="flex-grow mr-2">{renderStatusChip()}</div>
                    {/* Botón para Solicitar Cambio */}
                    {canRequestChange && (
                         <Button 
                            size="sm" 
                            variant="light" 
                            color="warning" // Usar warning o default
                            onPress={onOpenChangeRequestModal} 
                            startContent={<Edit size={14}/>}
                         >
                            Solicitar Cambio
                         </Button>
                    )}
                </div>
                 {/* Mostrar motivo de rechazo si aplica */}
                {changeRequestStatus.estado === 'rechazada' && changeRequestStatus.motivoRechazo && (
                    <div className="text-xs text-danger-700 bg-danger-50 p-2 rounded border border-danger-100 mt-1">
                        <strong>Motivo Rechazo:</strong> {changeRequestStatus.motivoRechazo}
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
export default AdvisorInfoCard;
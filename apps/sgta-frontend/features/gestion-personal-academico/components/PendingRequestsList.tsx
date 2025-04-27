// src/features/academic-staff-management/components/PendingRequestsList.tsx
import React from 'react';
import { SolicitudCese } from '../types';
import CessationRequestCard from './CessationRequestCard';

interface PendingRequestsListProps {
  requests: SolicitudCese[];
  onApprove: (solicitud: SolicitudCese) => void;
  onReject: (solicitud: SolicitudCese) => void;
}

const PendingRequestsList: React.FC<PendingRequestsListProps> = ({ requests, onApprove, onReject }) => {
  return (
    <div className="space-y-4">
      {requests.map(solicitud => (
        <CessationRequestCard 
          key={solicitud.id}
          solicitud={solicitud}
          onAprobar={onApprove}
          onRechazar={onReject} 
          onVerDetalle={function (solicitud: SolicitudCese): void {
            throw new Error('Function not implemented.');
          } }        />
      ))}
    </div>
  );
};

export default PendingRequestsList;
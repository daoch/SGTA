// src/features/academic-staff-management/components/PendingRequestsList.tsx
import React from "react";
import { IRequestTerminationConsultancyRequestData } from "@/features/asesores/types/cessation-request";
import CessationRequestCard from "@/features/asesores/components/cessation-request/card-request";

interface PendingRequestsListProps {
  requests: Array<IRequestTerminationConsultancyRequestData>;
  onApprove: (value: number) => void;
  onReject: (value: number) => void;
}

const PendingCessationRequestsList: React.FC<PendingRequestsListProps> = ({ requests, onApprove, onReject }) => {
    return (
    <div className="space-y-4">
      {
        requests.map(request => (
            <CessationRequestCard 
                key={`request-${request.id}`}
                request={request}
                onApprove={()=>{onApprove(request.id);}}
                onReject={()=>{onReject(request.id);}}
            />
        ))
        }
    </div>
  );
};

export default PendingCessationRequestsList;
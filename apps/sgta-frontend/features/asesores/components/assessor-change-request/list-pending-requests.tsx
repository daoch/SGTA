// src/features/academic-staff-management/components/PendingRequestsList.tsx
import React from 'react';
import AssessorChangeRequestCard from '@/features/asesores/components/assessor-change-request/card-request';
import { IAssessorChangePendingRequestsListProps } from '@/features/asesores/types/assessor-change-request';


const PendingAssessorChangeRequestsList: React.FC<IAssessorChangePendingRequestsListProps> = ({ requests, onApprove, onReject }) => {
    return (
    <div className="space-y-4">
      {
        requests.map(request => (
            <AssessorChangeRequestCard
                key={`request-${request.id}`}
                request={request}
                onApprove={()=>{onApprove(request.id)}}
                onReject={()=>{onReject(request.id)}}
            />
        ))
        }
    </div>
  );
};

export default PendingAssessorChangeRequestsList;
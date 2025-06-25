// src/features/asesores/components/cessation-request/list-pending-requests.tsx
import React from "react";
import { ICessationRequestDataTransformed, IPendingCessationRequestsListProps } from "@/features/asesores/types/cessation-request"; // Ensure this type is updated
import CessationRequestCard from "@/features/asesores/components/cessation-request/card-request";

const PendingCessationRequestsList: React.FC<IPendingCessationRequestsListProps> = ({
  requests,
  onApprove,
  onReject,
  onViewDetails, // Add this prop
}) => {
  return (
    <div className="space-y-4">
      {requests.map((request: ICessationRequestDataTransformed) => (
        <CessationRequestCard
          key={`pending-request-${request.id}`}
          request={request}
          onApprove={() => { onApprove(request.id); }}
          onReject={() => { onReject(request.id); }}
          onViewDetails={() => { onViewDetails(request.id); }} // Pass this prop
        />
      ))}
    </div>
  );
};

export default PendingCessationRequestsList;
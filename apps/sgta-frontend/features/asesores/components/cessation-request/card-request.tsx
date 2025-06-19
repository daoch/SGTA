// src/features/asesores/components/cessation-request/card-request.tsx
"use client";

import React, { useState } from "react";
import { format, isValid, formatDistanceToNow } from "date-fns"; // Updated imports
import { es } from "date-fns/locale";
import {
  Check,
  X,
  CalendarDays,
  // Clock, // Replaced by relative time, or can be used for resolution time if needed
  User as UserIcon, // Renamed to avoid conflict if User component is imported
  Users as UsersGroupIcon, // For multiple students
  Briefcase,
  Eye,
  MessageSquare, // For reason
  ChevronDown, // For "Show More"
  ChevronUp,   // For "Show Less"
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ICessationRequestCardProps, ICessationRequestStatusBackend, ICessationRequestEstudianteBackend } from "@/features/asesores/types/cessation-request"; // Ensure ICessationRequestEstudianteBackend is available or adjust as needed
import { cn } from "@/lib/utils"; // For conditional class names

// Helper to get relative time
const getRelativeTime = (date: Date | null | undefined): string | null => {
  if (!date || !isValid(date)) return null;
  try {
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  } catch (e) {
    return null; // Fallback for safety
  }
};

// Mini info item component for card content
const CardInfoItem: React.FC<{
  icon: React.ElementType;
  label?: string; // Label is now optional
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}> = ({ icon: Icon, label, children, className, labelClassName="text-xs text-slate-500", valueClassName="text-sm font-medium text-slate-700"}) => (
  <div className={cn("flex items-center gap-2", className)}>
    <Icon className="h-4 w-4 text-slate-400 flex-shrink-0" />
    <div className="flex-1"> {/* Allow content to take remaining space */}
      {label && <span className={cn(labelClassName, "mr-1")}>{label}:</span>}
      <span className={valueClassName}>{children}</span>
    </div>
  </div>
);


const CessationRequestCard: React.FC<ICessationRequestCardProps> = ({
  request,
  onApprove,
  onReject,
  onViewDetails,
}) => {
  const MAX_REASON_LENGTH_COLLAPSED = 100; // Characters to show before "Show More"
  const [showFullReason, setShowFullReason] = useState<boolean>(false);

  // Assuming status is always 'pendiente' for this specific card usage,
  // but keeping the config for flexibility if this card is reused.
  const statusConfig: Record<
    ICessationRequestStatusBackend,
    { badgeClass: string; text: string; }
  > = {
    pendiente: { badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-300", text: "Pendiente" },
    aprobada: { badgeClass: "bg-green-100 text-green-800 border-green-300", text: "Aprobada" },
    rechazada: { badgeClass: "bg-red-100 text-red-800 border-red-300", text: "Rechazada" },
    desconocido: { badgeClass: "bg-gray-100 text-gray-700 border-gray-300", text: "Desconocido" },
  };
  const currentStatusConfig = statusConfig[request.status.toLowerCase() as ICessationRequestStatusBackend] || statusConfig.desconocido;

  const relativeRequestTime = getRelativeTime(request.registerTime);
  const formattedRequestDate = isValid(request.registerTime) ? format(request.registerTime, "dd MMM yyyy", { locale: es }) : "N/A";

  const reasonNeedsTruncation = request.reason && request.reason.length > MAX_REASON_LENGTH_COLLAPSED;

  return (
    <Card className="w-full shadow-sm border hover:shadow-md transition-shadow duration-150 ease-in-out bg-white rounded-lg overflow-hidden">
      {/* Card Header: Assessor Info & Status */}
      <CardHeader className="p-4 flex flex-row justify-between items-start gap-3 border-b bg-slate-50">
        <div className="flex items-center gap-3 flex-1 min-w-0"> {/* min-w-0 for truncation */}
          <Avatar className="h-11 w-11">
            {request.assessor?.urlPhoto ? (
              <AvatarImage src={request.assessor.urlPhoto} alt={request.assessor.name || "Asesor"} />
            ) : null}
            <AvatarFallback className="bg-sky-100 text-sky-700 font-semibold">
              {request.assessor?.name?.[0]?.toUpperCase()}
              {request.assessor?.lastName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0"> {/* min-w-0 for truncation */}
            <h3 className="text-base font-semibold text-slate-800 leading-tight truncate" title={`${request.assessor?.name} ${request.assessor?.lastName}`}>
              {request.assessor ? `${request.assessor.name} ${request.assessor.lastName}` : "Asesor no disponible"}
            </h3>
            <p className="text-xs text-slate-500 leading-tight truncate" title={request.assessor?.email || ""}>
              {request.assessor?.email || "Email no disponible"}
            </p>
          </div>
        </div>
        {/* Status Badge should only be shown if card is used for history too */}
        {request.status !== "pendiente" && (
             <Badge variant="outline" className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${currentStatusConfig.badgeClass}`}>
                {currentStatusConfig.text}
            </Badge>
        )}
      </CardHeader>

      {/* Card Content: Key Details */}
      <CardContent className="p-4 space-y-3 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            <CardInfoItem icon={CalendarDays} label="Solicitado" valueClassName="text-xs text-slate-600">
                {formattedRequestDate}
                {relativeRequestTime && <span className="ml-1 text-slate-500">({relativeRequestTime})</span>}
            </CardInfoItem>
        </div>
        
        {/* Assessor's Reason */}
        <div>
            <div className="flex items-center gap-1 mb-0.5">
                 <MessageSquare className="h-4 w-4 text-slate-400 flex-shrink-0" />
                 <p className="text-xs text-slate-500 font-medium">Motivo del Asesor:</p>
            </div>
            <p className={cn("text-sm text-slate-700 leading-normal pl-5", !showFullReason && reasonNeedsTruncation && "line-clamp-2")}>
                {request.reason || "No especificado."}
            </p>
            {reasonNeedsTruncation && (
                <Button 
                    variant="link" 
                    size="sm"
                    className="text-xs p-0 h-auto mt-1 text-blue-600 hover:text-blue-700 pl-5" 
                    onClick={() => setShowFullReason(!showFullReason)}
                >
                    {showFullReason ? "Mostrar menos" : "Mostrar más"}
                    {showFullReason ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
                </Button>
            )}
        </div>

        {/* Affected Students Summary */}
        {request.students && request.students.length > 0 && (
            <CardInfoItem 
                icon={UsersGroupIcon} 
                label="Tesistas Afectados" 
                valueClassName="text-sm font-medium text-slate-700"
            >
                <Badge variant="outline" className="border-slate-300 text-slate-700">
                    {request.students.length}
                </Badge>
                {/* Optionally, list first 1-2 student names if space allows and is desired */}
                {/* <span className="text-xs text-slate-500 ml-2 truncate">
                    ({request.students.slice(0,1).map(s => `${s.name} ${s.lastName.charAt(0)}.`).join(', ')}{request.students.length > 1 ? '...': ''})
                </span> */}
            </CardInfoItem>
        )}
      </CardContent>

      {/* Card Footer: Actions */}
      <CardFooter className="p-3 bg-slate-25 border-t flex flex-col sm:flex-row items-center justify-end gap-2">
        {/* For pending requests, actions are primary */}
        {request.status === "pendiente" && (
          <>
            {onViewDetails && (
              <Button variant="ghost" size="sm" onClick={onViewDetails} className="w-full sm:w-auto text-slate-700 hover:bg-slate-100">
                <Eye size={16} className="mr-1.5" />
                Detalles
              </Button>
            )}
            <Button 
                variant="outline" 
                size="sm" 
                onClick={onReject} 
                className="w-full sm:w-auto text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 hover:text-red-700"
            >
              <X size={16} className="mr-1.5" /> Rechazar
            </Button>
            <Button 
                size="sm" 
                onClick={onApprove} 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Check size={16} className="mr-1.5" /> Aprobar
            </Button>
          </>
        )}
        
        {/* For non-pending items (if card is reused for history) */}
        {request.status !== "pendiente" && onViewDetails && (
           <Button variant="outline" size="sm" onClick={onViewDetails} className="w-full text-slate-700 border-slate-300 hover:bg-slate-100">
                <Eye size={16} className="mr-1.5" />
                Ver Detalles
           </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CessationRequestCard;
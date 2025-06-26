// src/features/asesores/components/cessation-request/list-approved-rejected-requests.tsx
// (Assuming this is the correct path based on Page.tsx)

import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ICessationRequestHistoryTableProps,
  ICessationRequestDataTransformed,
  ICessationRequestStatusBackend, // For status badge config
} from "@/features/asesores/types/cessation-request";
import { format, isValid, formatDistanceToNow } from "date-fns"; // Updated import
import { es } from "date-fns/locale";
import { 
    Eye, 
    UserCircle2, 
    Users, 
    CalendarDays, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    HelpCircle 
} from "lucide-react";
import { cn } from "@/lib/utils"; // For conditional class names

// Helper to get relative time
const getRelativeTime = (date: Date | null | undefined): string | null => {
  if (!date || !isValid(date)) return null;
  try {
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  } catch (e) {
    console.error("Error formatting relative time:", e);
    return null; // Fallback for safety
  }
};

// Status Badge Configuration for consistency
const statusBadgeConfigTable: Record<
  ICessationRequestStatusBackend,
  { 
    text: string; 
    icon: React.ElementType;
    className: string; // Tailwind classes for the badge
  }
> = {
  pendiente: { text: "Pendiente", icon: Clock, className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  aceptada: { text: "Aprobada", icon: CheckCircle2, className: "bg-green-100 text-green-800 border-green-300" },
  rechazada: { text: "Rechazada", icon: XCircle, className: "bg-red-100 text-red-800 border-red-300" },
  desconocido: { text: "Desconocido", icon: HelpCircle, className: "bg-gray-100 text-gray-700 border-gray-300" },
};


const RequestHistoryTable: React.FC<ICessationRequestHistoryTableProps> = ({
  requests,
  onViewDetails,
}) => {
  // Define columns with more control over rendering and styling
  const columnsConfig = [
    {
      key: "assessor",
      header: "Asesor Solicitante",
      className: "min-w-[200px]", // Ensure assessor name has enough space
      cell: (request: ICessationRequestDataTransformed) => {
        if (!request.assessor) return <span className="text-xs text-slate-500">N/A</span>;
        return (
          <div className="flex items-center gap-2.5">
            <Avatar className="h-9 w-9">
              {request.assessor.urlPhoto ? (
                <AvatarImage src={request.assessor.urlPhoto} alt={request.assessor.name} />
              ) : null}
              <AvatarFallback className="bg-sky-100 text-sky-700 text-xs font-medium">
                {request.assessor.name?.[0]?.toUpperCase()}
                {request.assessor.lastName?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-slate-800 whitespace-nowrap">{`${request.assessor.name} ${request.assessor.lastName}`}</p>
              <p className="text-xs text-slate-500 whitespace-nowrap">{request.assessor.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "requestDate",
      header: "Solicitud",
      className: "min-w-[150px]",
      cell: (request: ICessationRequestDataTransformed) => {
        const relativeTime = getRelativeTime(request.registerTime);
        return (
          <div>
            <p className="text-sm font-medium text-slate-700">
              {isValid(request.registerTime) ? format(request.registerTime, "dd MMM yy", { locale: es }) : "N/A"}
            </p>
            {relativeTime && (
                <p className="text-xs text-slate-500 capitalize">{relativeTime}</p>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Estado",
      className: "text-center min-w-[120px]",
      cell: (request: ICessationRequestDataTransformed) => {
        const statusInfo = statusBadgeConfigTable[request.status.toLowerCase() as ICessationRequestStatusBackend] || statusBadgeConfigTable.desconocido;
        return (
          <Badge variant="outline" className={cn("font-medium", statusInfo.className)}>
            <statusInfo.icon className="h-3.5 w-3.5 mr-1" />
            {statusInfo.text}
          </Badge>
        );
      },
    },
    {
      key: "decisionDate",
      header: "Decisión",
      className: "min-w-[150px]",
      cell: (request: ICessationRequestDataTransformed) => {
        if (!request.responseTime || !isValid(request.responseTime)) {
          return <span className="text-xs text-slate-400 italic">N/A</span>;
        }
        const relativeTime = getRelativeTime(request.responseTime);
        return (
          <div>
            <p className="text-sm font-medium text-slate-700">
              {format(request.responseTime, "dd MMM yy", { locale: es })}
            </p>
            {relativeTime && (
                <p className="text-xs text-slate-500 capitalize">{relativeTime}</p>
            )}
          </div>
        );
      },
    },
    {
      key: "studentsAffected",
      header: "Tesistas",
      className: "text-center min-w-[80px]",
      cell: (request: ICessationRequestDataTransformed) => (
        <Badge variant="secondary" className="text-xs font-normal bg-slate-100 text-slate-600 border-slate-300">
          {request.students?.length ?? 0}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      className: "text-right min-w-[100px]", // Align action button to the right
      cell: (request: ICessationRequestDataTransformed) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(request.id)}
          className="text-slate-700 border-slate-300 hover:bg-slate-100"
        >
          <Eye size={15} className="mr-1.5" />
          Detalles
        </Button>
      ),
    },
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto simple-scrollbar">
        <Table className="min-w-full">
          <TableHeader className="bg-slate-50">
            <TableRow>
              {columnsConfig.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn("py-2.5 px-3 text-xs font-semibold text-slate-600 uppercase tracking-wider", column.className)}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnsConfig.length} className="text-center py-12 text-slate-500">
                  <Users size={32} className="mx-auto mb-2 text-slate-400" />
                  No hay solicitudes en el historial que coincidan con los filtros aplicados.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-25 transition-colors">
                  {columnsConfig.map((column) => (
                    <TableCell key={column.key} className={cn("px-3 py-2.5 align-top", column.className)}>
                      {column.cell(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RequestHistoryTable;
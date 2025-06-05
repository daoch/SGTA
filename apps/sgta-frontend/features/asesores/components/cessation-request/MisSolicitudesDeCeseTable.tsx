// src/features/asesores/components/cessation-request/MisSolicitudesDeCeseTable.tsx (NUEVO)
"use client";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Para un posible botón de "Ver Detalles"
import { IMyCessationRequestListItemTransformed } from "@/features/asesores/types/cessation-request";
import { format, isValid, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

interface MisSolicitudesDeCeseTableProps {
  requests: IMyCessationRequestListItemTransformed[];
  // onViewDetails?: (solicitudId: number) => void; // Si quieres un botón de detalles
}

const MisSolicitudesDeCeseTable: React.FC<MisSolicitudesDeCeseTableProps> = ({ requests /*, onViewDetails */ }) => {
  const getStatusBadge = (status: string) => {
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case "aprobada": return <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50 px-2 py-0.5">Aprobada</Badge>;
      case "rechazada": return <Badge variant="outline" className="border-red-500 text-red-600 bg-red-50 px-2 py-0.5">Rechazada</Badge>;
      case "pendiente": return <Badge variant="outline" className="border-yellow-500 text-yellow-600 bg-yellow-50 px-2 py-0.5">Pendiente</Badge>;
      default: return <Badge variant="secondary" className="px-2 py-0.5">{status || "Desconocido"}</Badge>;
    }
  };

  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tema de Tesis</TableHead>
            <TableHead>Fecha Solicitud</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Respuesta Coordinador</TableHead>
            <TableHead>Fecha Decisión</TableHead>
            {/* <TableHead className="text-right">Acciones</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                No ha enviado ninguna solicitud de cese.
              </TableCell>
            </TableRow>
          ) : (
            requests.map((req) => (
              <TableRow key={req.solicitudId}>
                <TableCell className="font-medium">{req.temaTitulo || "N/A"}</TableCell>
                <TableCell>
                  {isValid(req.fechaSolicitud) ? format(req.fechaSolicitud, "dd/MM/yyyy", { locale: es }) : "N/A"}
                </TableCell>
                <TableCell>{getStatusBadge(req.estadoSolicitud)}</TableCell>
                <TableCell className="max-w-xs truncate" title={req.respuestaCoordinador || ""}>
                  {req.respuestaCoordinador || <span className="text-muted-foreground">N/A</span>}
                </TableCell>
                <TableCell>
                  {req.fechaDecision && isValid(req.fechaDecision) ? format(req.fechaDecision, "dd/MM/yyyy", { locale: es }) : <span className="text-muted-foreground">N/A</span>}
                </TableCell>
                {/* <TableCell className="text-right">
                  {onViewDetails && (
                    <Button variant="outline" size="sm" onClick={() => onViewDetails(req.solicitudId)}>
                      Ver Detalles
                    </Button>
                  )}
                </TableCell> */}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MisSolicitudesDeCeseTable;
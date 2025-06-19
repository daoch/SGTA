"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { joinUsersSolicitud } from "@/lib/temas/lib";
import { titleCase } from "@/lib/utils";
import { Eye, SquarePen } from "lucide-react";
import {
  SolicitudGeneral,
  SolicitudState,
} from "../../types/solicitudes/entities";

export function mapEstadoSolToClassName(estado: SolicitudState): string {
  switch (estado) {
    case "PENDIENTE":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "ACEPTADA":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    // case EstadoTemaNombre.OBSERVADO:
    //   return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "RECHAZADA":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
  }
}

export interface SolicitudesTableProps {
  readonly solicitudes: readonly SolicitudGeneral[];
  readonly loading: boolean;
  readonly searchQuery: string;
}

export function SolicitudesTableGeneral({
  solicitudes,
  loading,
  searchQuery,
}: SolicitudesTableProps) {
  // Filtrar por búsqueda
  let filtrados = solicitudes;
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtrados = filtrados.filter((solicitud) =>
      solicitud?.descripcion?.toLowerCase().includes(query),
    );
  }

  let tableBodyContent;
  if (loading) {
    tableBodyContent = (
      <TableRow>
        <TableCell
          colSpan={7}
          className="text-center py-8 text-muted-foreground"
        >
          Cargando solicitudes ...
        </TableCell>
      </TableRow>
    );
  } else if (filtrados.length === 0) {
    tableBodyContent = (
      <TableRow>
        <TableCell
          colSpan={7}
          className="text-center py-8 text-muted-foreground"
        >
          No hay solicitudes que mostrar
        </TableCell>
      </TableRow>
    );
  } else {
    tableBodyContent = filtrados.map((sol) => (
      <TableRow key={sol.solicitud_id}>
        {/* Description */}
        <TableCell className="max-w-xs whitespace-normal">
          {sol.tipo_solicitud}
        </TableCell>
        {/* Description */}
        <TableCell className="max-w-xs whitespace-normal">
          {sol.descripcion}
        </TableCell>

        {/* Remitente */}
        <TableCell className="max-w-xs whitespace-normal">
          {joinUsersSolicitud(
            sol.usuarios.filter((user) => user.rol_solicitud === "REMITENTE"),
          )}
        </TableCell>

        {/* Fecha */}
        <TableCell>
          {new Date(sol.fecha_creacion).toLocaleDateString()}
        </TableCell>

        {/* Estado */}
        <TableCell>
          <Badge
            variant="outline"
            className={mapEstadoSolToClassName(sol.estado_solicitud)}
          >
            {titleCase(sol.estado_solicitud)}
          </Badge>
        </TableCell>

        {/* Acciones */}
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            {/* Ver detalles */}
            <TooltipProvider>
              {["PENDIENTE"].includes(sol.estado_solicitud) ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <SquarePen className="h-4 w-4" />
                      <span className="sr-only">Editar solicitud</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar solicitud</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver detalles</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ver detalles</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        </TableCell>
      </TableRow>
    ));
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo Solicitud</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Remitente</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{tableBodyContent}</TableBody>
      </Table>
    </div>
  );
}


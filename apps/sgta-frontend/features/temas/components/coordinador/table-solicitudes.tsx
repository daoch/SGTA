// components/SolicitudesTable.tsx
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
import { titleCase } from "@/lib/utils";
import { Eye, SquarePen } from "lucide-react";
import Link from "next/link";
import { SolicitudPendiente } from "../../types/solicitudes/entities";
import { mapEstadoSolToClassName } from "../../types/solicitudes/lib";
import { EstadoTemaNombre } from "../../types/temas/enums";

export interface SolicitudesTableProps {
  readonly solicitudes: readonly SolicitudPendiente[];
  readonly filter?: EstadoTemaNombre;
  readonly isLoading: boolean;
  readonly searchQuery: string;
}

export function SolicitudesTable({
  solicitudes,
  filter,
  isLoading,
  searchQuery,
}: SolicitudesTableProps) {
  // Filtrar por estado
  let solicitudesFiltradas = filter
    ? solicitudes.filter((s) => s.estado === filter)
    : solicitudes;

  // Filtrar por búsqueda
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    solicitudesFiltradas = solicitudesFiltradas.filter(
      (solicitud) =>
        solicitud.tema.titulo.toLowerCase().includes(query) ||
        solicitud.titulo.toLowerCase().includes(query),
    );
  }

  let tableBodyContent;
  if (isLoading) {
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
  } else if (solicitudesFiltradas.length === 0) {
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
    tableBodyContent = solicitudesFiltradas.map((sol) => (
      <TableRow key={sol.id}>
        {/* Tipo de solicitud */}
        <TableCell>{sol.tipo}</TableCell>

        {/* Título */}
        <TableCell className="font-medium max-w-xs truncate">
          {sol.titulo}
        </TableCell>

        {/* Tesis */}
        <TableCell className="max-w-xs truncate">{sol.tema.titulo}</TableCell>

        {/* Solicitante + tipo de usuario */}
        <TableCell>
          <div className="flex flex-col">
            <span>
              {sol.solicitante.nombres} {sol.solicitante.primerApellido}
            </span>
            <Badge variant="outline" className="mt-1 text-sm">
              {sol.solicitante.tipoSolicitante}
            </Badge>
          </div>
        </TableCell>

        {/* Fecha */}
        <TableCell>
          {new Date(sol.fechaSolicitud).toLocaleDateString()}
        </TableCell>

        {/* Estado */}
        <TableCell>
          <Badge
            variant="outline"
            className={mapEstadoSolToClassName(sol.estado)}
          >
            {titleCase(sol.estado)}
          </Badge>
        </TableCell>

        {/* Acciones */}
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            {/* Ver detalles */}
            <TooltipProvider>
              {sol.estado === EstadoTemaNombre.INSCRITO ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/coordinador/aprobaciones/${sol.tema.id}`}
                      passHref
                    >
                      <Button variant="ghost" size="icon">
                        <SquarePen className="h-4 w-4" />
                        <span className="sr-only">Editar solicitud</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar solicitud</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/coordinador/aprobaciones/${sol.tema.id}`}
                      passHref
                    >
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver detalles</span>
                      </Button>
                    </Link>
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
            <TableHead>Tipo</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Tesis</TableHead>
            <TableHead>Solicitante</TableHead>
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


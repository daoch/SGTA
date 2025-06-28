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
import { joinUsers, usuarioCoincideConBusqueda } from "@/lib/temas/lib";
import { titleCase } from "@/lib/utils";
import { Eye, SquarePen } from "lucide-react";
import Link from "next/link";
import { SolicitudPendiente } from "../../types/solicitudes/entities";
import { mapEstadoSolToClassName } from "../../types/solicitudes/lib";
import { EstadoTemaNombre } from "../../types/temas/enums";

export interface SolicitudesTableProps {
  readonly solicitudes: readonly SolicitudPendiente[];
  readonly page: readonly SolicitudPendiente[];
  readonly isLoading: boolean;
  readonly searchQuery: string;
  readonly limit: number;
}

export function SolicitudesTable({
  solicitudes,
  page,
  isLoading,
  searchQuery,
  limit,
}: SolicitudesTableProps) {
  // Filtrar por búsqueda
  let filtrados;
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtrados = solicitudes.filter(
      (sol) =>
        sol?.tema?.titulo?.toLowerCase().includes(query) ||
        sol?.titulo?.toLowerCase().includes(query) ||
        usuarioCoincideConBusqueda(sol?.solicitante, query) ||
        sol?.tema?.tesistas?.some((t) => usuarioCoincideConBusqueda(t, query)),
    );
  } else {
    filtrados = page;
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
      <TableRow key={sol.id}>
        {/* Tesis */}
        <TableCell className="max-w-xs whitespace-normal">
          {sol.tema.titulo}
        </TableCell>

        {/* Asesores */}
        <TableCell>
          <div className="flex flex-col max-w-xs whitespace-normal">
            <span>{joinUsers(sol.tema.coasesores ?? [])}</span>
          </div>
        </TableCell>

        {/* Tesistas */}
        <TableCell>
          <div className="flex flex-col max-w-xs whitespace-normal">
            <span>{joinUsers(sol.tema.tesistas ?? [])}</span>
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
              {[EstadoTemaNombre.INSCRITO, EstadoTemaNombre.OBSERVADO].includes(
                sol.estado,
              ) ? (
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
            <TableHead>Tesis</TableHead>
            <TableHead>Asesores</TableHead>
            <TableHead>Tesistas</TableHead>
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


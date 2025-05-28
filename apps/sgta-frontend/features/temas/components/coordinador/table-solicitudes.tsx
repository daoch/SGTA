// components/SolicitudesTable.tsx
"use client";

import React from "react";
import Link from "next/link";
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
import { Eye, X, CheckCircle } from "lucide-react";
import { titleCase } from "@/lib/utils";
import { EstadoSolicitud } from "../../types/solicitudes/enums";
import { SolicitudPendiente } from "../../types/solicitudes/entities";

export interface SolicitudesTableProps {
  readonly solicitudes: readonly SolicitudPendiente[];
  readonly filter?: EstadoSolicitud;
}

export function SolicitudesTable({
  solicitudes,
  filter,
}: SolicitudesTableProps) {
  // aplico filtro si viene por props
  const solicitudesFiltradas = filter
    ? solicitudes.filter((s) => s.estado === filter)
    : solicitudes;

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
        <TableBody>
          {solicitudesFiltradas.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No hay solicitudes que mostrar
              </TableCell>
            </TableRow>
          ) : (
            solicitudesFiltradas.map((sol) => (
              <TableRow key={sol.id}>
                {/* Tipo de solicitud */}
                <TableCell>{sol.tipo}</TableCell>

                {/* Título */}
                <TableCell className="font-medium">{sol.titulo}</TableCell>

                {/* Tesis */}
                <TableCell>{sol.tema.titulo}</TableCell>

                {/* Solicitante + tipo de usuario */}
                <TableCell>
                  <div className="flex flex-col">
                    <span>
                      {sol.solicitante.nombres} {sol.solicitante.primerApellido}
                    </span>
                    <Badge variant="outline" className="mt-1 text-sm">
                      {sol.solicitante.tipoUsuario.nombre}
                    </Badge>
                  </div>
                </TableCell>

                {/* Fecha */}
                <TableCell>
                  {new Date(sol.fechaSolicitud).toLocaleDateString()}
                </TableCell>

                {/* Estado */}
                <TableCell>
                  <Badge variant="outline">{titleCase(sol.estado)}</Badge>
                </TableCell>

                {/* Acciones */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* Ver detalles */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={`/solicitudes/${sol.id}`} passHref>
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
                    </TooltipProvider>

                    {/* Solo si está pendiente, mostrar rechazar/aceptar */}
                    {sol.estado === EstadoSolicitud.PENDIENTE && (
                      <>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500"
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Rechazar</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Rechazar</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-500"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span className="sr-only">Aceptar</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Aceptar</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}


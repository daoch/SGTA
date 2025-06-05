"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EntregableAlumnoDto } from "../../dtos/EntregableAlumnoDto";
import { EntregablesModal } from "./subida-entregable-modal";

interface EntregablesTableProps {
  readonly filter?: string;
  readonly entregables?: EntregableAlumnoDto[];
  readonly setEntregables?: React.Dispatch<
    React.SetStateAction<EntregableAlumnoDto[]>
  >;
}

export function EntregablesTable({
  filter,
  entregables,
  setEntregables,
}: EntregablesTableProps) {
  const [selectedEntregable, setSelectedEntregable] =
    useState<EntregableAlumnoDto | null>(null);

  const entregablesFiltradas = (entregables ?? []).filter(
    (entregable: EntregableAlumnoDto) => {
      // Filtrar por tipo
      if (
        filter &&
        filter != "Todos" &&
        entregable.entregableEstado.toLowerCase() !== filter.toLowerCase()
      ) {
        return false;
      }
      return true;
    },
  );

  const handleOpenDialog = (entregable: EntregableAlumnoDto) => {
    setSelectedEntregable(entregable);
  };

  const handleUpdateEntregable = (updated: EntregableAlumnoDto) => {
    setEntregables?.((prev: EntregableAlumnoDto[]) =>
      prev.map((e) => (e.entregableId === updated.entregableId ? updated : e)),
    );
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entregable</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead>Fecha de entrega</TableHead>
              <TableHead>Estado de entrega</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entregablesFiltradas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay entregables disponibles
                </TableCell>
              </TableRow>
            ) : (
              entregablesFiltradas.map((entregable, idx) => (
                <TableRow key={entregable.entregableId}>
                  <TableCell>{`E${idx + 1}`}</TableCell>
                  <TableCell className="font-medium max-w-xs truncate">
                    {entregable.entregableNombre}
                  </TableCell>
                  <TableCell>
                    {entregable.entregableFechaFin
                      ? new Date(entregable.entregableFechaFin).toLocaleString(
                        "es-PE",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {entregable.entregableFechaEnvio
                      ? new Date(
                        entregable.entregableFechaEnvio,
                      ).toLocaleString("es-PE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      let badgeClass = "";
                      let estadoTexto = "";

                      // Determinar el texto a mostrar y el color
                      if (
                        entregable.entregableEstado === "no_enviado" &&
                        new Date() > new Date(entregable.entregableFechaFin)
                      ) {
                        estadoTexto = "No enviado";
                        badgeClass = "bg-red-100 text-red-800 hover:bg-red-100"; // Rojo
                      } else if (entregable.entregableEstado === "no_enviado") {
                        estadoTexto = "Pendiente";
                        badgeClass =
                          "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"; // Amarillo
                      } else if (
                        entregable.entregableEstado === "enviado_a_tiempo"
                      ) {
                        estadoTexto = "Enviado a tiempo";
                        badgeClass =
                          "bg-green-100 text-green-800 hover:bg-green-100"; // Verde
                      } else if (
                        entregable.entregableEstado === "enviado_tarde"
                      ) {
                        estadoTexto = "Enviado tarde";
                        badgeClass =
                          "bg-orange-100 text-orange-800 hover:bg-orange-100"; // Naranja
                      } else if (entregable.entregableEstado === "enviado") {
                        estadoTexto = "Enviado";
                        badgeClass =
                          "bg-gray-100 text-gray-800 hover:bg-gray-100";
                      } else {
                        estadoTexto =
                          estadoLabels[entregable.entregableEstado] ||
                          entregable.entregableEstado;
                        badgeClass =
                          "bg-gray-100 text-gray-800 hover:bg-gray-100";
                      }

                      return (
                        <Badge variant="outline" className={badgeClass}>
                          {estadoTexto}
                        </Badge>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-end gap-2">
                      {entregable.entregableEstado != "no_enviado" && (
                        <Dialog>
                          <Link
                            href={{
                              pathname: `/alumno/mi-proyecto/entregables/${entregable.entregableId}`,
                              query: { tema: entregable.temaId }
                            }}
                          >
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Ver detalles</span>
                            </Button>
                          </Link>
                        </Dialog>
                      )}
                      {new Date() <=
                        new Date(entregable.entregableFechaFin) && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenDialog(entregable)}
                              >
                                <Upload className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            {selectedEntregable && (
                              <EntregablesModal
                                entregable={selectedEntregable}
                                setSelectedEntregable={setSelectedEntregable}
                                handleUpdateEntregable={handleUpdateEntregable}
                              ></EntregablesModal>
                            )}
                          </Dialog>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const estadoLabels: Record<string, string> = {
  no_enviado: "Pendiente",
  enviado_a_tiempo: "Enviado a tiempo",
  enviado_tarde: "Enviado tarde",
};

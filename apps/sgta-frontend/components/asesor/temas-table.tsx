"use client";

import {
  Coasesor,
  Tema,
  Tesista,
} from "@/features/temas/types/inscripcion/entities";
import { estadosValues, Tipo } from "@/features/temas/types/inscripcion/enums";
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
import { titleCase } from "@/lib/utils";
import { FilePen, Trash2 } from "lucide-react";
import DeleteTemaPopUp from "./delete-tema-pop-up";
import { TemaDetailsDialog } from "./tema-details-modal";

interface PropuestasTableProps {
  temasData: Tema[];
  filter?: string;
  isLoading?: boolean;
  error?: string | null;
  asesor?: Coasesor;
}

/**
 * Muestra en una tabla la lista de temas dado un filtro inicial
 * @argument filter Permite filtrar los temas
 * @returns Tabla de temas filtrados
 */
export function TemasTable({
  temasData,
  filter,
  isLoading,
  error,
  asesor,
}: Readonly<PropuestasTableProps>) {
  const propuestasFiltradas = temasData.filter((tema) => {
    if (!filter || filter === Tipo.TODOS) return true;
    return tema.estadoTemaNombre === filter;
  });

  if (isLoading) {
    return <p className="text-center py-8">Cargando temas...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-red-500">{error}</p>;
  }

  const deleteTema = () => {
    console.log("Tema eliminado");
    // Aquí podrías llamar a tu API o actualizar el estado global
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Asesor</TableHead>
              <TableHead>Estudiante(s)</TableHead>
              <TableHead>Postulaciones</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {propuestasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay propuestas disponibles
                </TableCell>
              </TableRow>
            ) : (
              propuestasFiltradas.map((tema) => (
                <TableRow key={tema.id}>
                  {/* Title */}
                  <TableCell className="font-medium max-w-xs truncate">
                    {tema.titulo}
                  </TableCell>
                  {/* Area */}
                  <TableCell>{tema.subareas[0].nombre}</TableCell>
                  {/* Asesor */}
                  <TableCell>{asesor ? asesor.nombres : ""}</TableCell>
                  {/* Tesistas */}
                  <TableCell>
                    {!tema.tesistas
                      ? "Sin asignar"
                      : tema.tesistas.map((e: Tesista) => e.nombres).join(", ")}
                  </TableCell>
                  {/* Postulaciones */}
                  {tema.estadoTemaNombre === Tipo.LIBRE ? (
                    <TableCell>
                      {/* {!tema.postulaciones ? "-" : tema.postulaciones} */}
                    </TableCell>
                  ) : (
                    <TableCell>-</TableCell>
                  )}

                  {/* Tipo */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        tema.estadoTemaNombre === estadosValues.PROPUESTO_LIBRE
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                          : "bg-green-100 text-green-800 hover:bg-green-100"
                      }
                    >
                      {titleCase(tema?.estadoTemaNombre ?? "")}
                    </Badge>
                  </TableCell>
                  {/* Estado */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        tema.activo
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                      }
                    >
                      {titleCase(tema.activo ? "Activo" : "Inactivo")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* View Details */}
                      <TemaDetailsDialog tema={tema} asesor={asesor} />
                      {/* Edit Page */}
                      {[Tipo.INSCRITO, Tipo.LIBRE].includes(
                        tema.estadoTemaNombre as Tipo,
                      ) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-pucp-blue"
                        >
                          <FilePen className="h-4 w-4" />
                          <span className="sr-only">Postular</span>
                        </Button>
                      )}
                      {/* Delete */}
                      {[Tipo.INSCRITO, Tipo.LIBRE].includes(
                        tema.estadoTemaNombre as Tipo,
                      ) && (
                        <DeleteTemaPopUp
                          temaName={tema.titulo}
                          onConfirmar={deleteTema}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                        />
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

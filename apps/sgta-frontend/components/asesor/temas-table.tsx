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
  Coasesor,
  Tema,
  Tesista,
} from "@/features/temas/types/inscripcion/entities";
import { Tipo } from "@/features/temas/types/inscripcion/enums";
import { titleCase } from "@/lib/utils";
import { FilePen, Trash2 } from "lucide-react";
import DeleteTemaPopUp from "./delete-tema-pop-up";
import { TemaDetailsDialog } from "./tema-details-modal";

interface PropuestasTableProps {
  temasData: Tema[];
  filter?: string[];
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
    if (!filter || filter.includes(Tipo.TODOS)) return true;
    if (tema.estadoTemaNombre) return filter.includes(tema.estadoTemaNombre);
    else {
      return true;
    }
  });

  const deleteTema = () => {
    console.log("Tema eliminado");
    // Aquí podrías llamar a tu API o actualizar el estado global
  };

  console.log(temasData);

  let tableBodyContent;
  if (isLoading) {
    tableBodyContent = (
      <TableRow>
        <TableCell
          colSpan={9}
          className="text-center py-8 text-muted-foreground"
        >
          Cargando temas...
        </TableCell>
      </TableRow>
    );
  } else if (error) {
    tableBodyContent = (
      <TableRow>
        <TableCell
          colSpan={9}
          className="text-center py-8 text-muted-foreground"
        >
          {error}
        </TableCell>
      </TableRow>
    );
  } else if (propuestasFiltradas.length === 0) {
    tableBodyContent = (
      <TableRow>
        <TableCell
          colSpan={9}
          className="text-center py-8 text-muted-foreground"
        >
          No hay propuestas disponibles
        </TableCell>
      </TableRow>
    );
  } else {
    tableBodyContent = propuestasFiltradas.map((tema) => (
      <TableRow key={tema.id}>
        {/* Title */}
        <TableCell className="font-medium max-w-xs truncate">
          {tema.titulo}
        </TableCell>
        {/* Area */}
        <TableCell>{tema.area[0]?.nombre}</TableCell>
        {/* Asesor */}
        <TableCell>{asesor ? asesor.nombres : ""}</TableCell>
        {/* Tesistas */}
        <TableCell>
          {!tema.tesistas ||
          tema.tesistas.length === 0 ||
          tema.tesistas.map((tesista) => tesista.asignado === false) ? (
            <p className="text-gray-400">Sin asignar</p>
          ) : (
            tema.tesistas.map((e: Tesista) => e.nombres).join(", ")
          )}
        </TableCell>
        {/* Postulaciones */}
        {
          <TableCell>
            {!tema.cantPostulaciones ? "-" : tema.cantPostulaciones}
          </TableCell>
        }

        {/* Tipo */}
        <TableCell>
          <Badge
            variant="outline"
            className={
              tema.estadoTemaNombre === Tipo.LIBRE
                ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                : tema.estadoTemaNombre === Tipo.PREINSCRITO
                  ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                  : tema.estadoTemaNombre === Tipo.INTERESADO
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    : "bg-green-100 text-green-800 hover:bg-green-100"
            }
          >
            {titleCase(tema?.estadoTemaNombre ?? "")}
          </Badge>
        </TableCell>
        {/* Estado */}
        <TableCell>
          {(() => {
            let estadoLabel = "";
            if (
              tema?.estadoTemaNombre === Tipo.INTERESADO ||
              tema?.estadoTemaNombre === Tipo.LIBRE
            ) {
              estadoLabel = "Pendiente";
            } else if (tema.activo) {
              estadoLabel = "Activo";
            } else {
              estadoLabel = "Inactivo";
            }
            return (
              <Badge
                variant="outline"
                className={
                  tema?.estadoTemaNombre === Tipo.INTERESADO ||
                  tema?.estadoTemaNombre === Tipo.LIBRE
                    ? "bg-yellow-100 text-black-500 hover:bg-yellow-100"
                    : tema.activo
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                }
              >
                {titleCase(estadoLabel)}
              </Badge>
            );
          })()}
        </TableCell>
        {/* Actions */}
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            {/* View Details */}
            <TemaDetailsDialog tema={tema} asesor={asesor} />
            {/* Edit Page */}
            {[Tipo.INSCRITO, Tipo.LIBRE].includes(
              tema.estadoTemaNombre as Tipo,
            ) && (
              <Button variant="ghost" size="icon" className="text-pucp-blue">
                <FilePen className="h-4 w-4" />
                <span className="sr-only">Editar</span>
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
                  <Button variant="ghost" size="icon" className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                }
              />
            )}
          </div>
        </TableCell>
      </TableRow>
    ));
  }

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
          <TableBody>{tableBodyContent}</TableBody>
        </Table>
      </div>
    </div>
  );
}

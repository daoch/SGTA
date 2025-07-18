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
import { Coasesor, Tesista } from "@/features/temas/types/inscripcion/entities";
import { Tipo } from "@/features/temas/types/inscripcion/enums";
import { Tema } from "@/features/temas/types/temas/entidades";
import { titleCase } from "@/lib/utils";
import { FilePen, Trash2 } from "lucide-react";

import EditarTemaModal from "@/features/temas/components/asesor/editar-tema-modal";
import { Carrera } from "@/features/temas/types/inscripcion/entities";
import { AreaConocimiento } from "@/features/temas/types/postulaciones/entidades";
import { EliminarTema } from "@/features/temas/types/temas/data";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogTrigger } from "../ui/dialog";
import DeleteTemaPopUp from "./delete-tema-pop-up";
import { TemaDetailsDialog } from "./tema-details-modal";

interface PropuestasTableProps {
  temasData: Tema[];
  filter?: string[];
  isLoading?: boolean;
  error?: string | null;
  asesor?: Coasesor;
  onTemaInscrito?: () => void;
  areasDisponibles: AreaConocimiento[];
  carreras?: Carrera[];
}

/**
 * Muestra en una tabla la lista de temas dado un filtro inicial
 * @argument filter Permite filtrar los temas
 * @returns Tabla de temas filtrados
 */
export function TemasTable({
  temasData,
  isLoading,
  error,
  asesor,
  onTemaInscrito,
  areasDisponibles,
  carreras,
}: Readonly<PropuestasTableProps>) {
  const [isEditarTemaDialogOpen, setIsEditarTemaDialogOpen] = useState(false);
  const [temaSeleccionado, setTemaSeleccionado] = useState<Tema | null>(null);
  const deleteTema = async (temaId: number) => {
    console.log("Tema eliminado");
    try {
      await EliminarTema(temaId);
      toast.success("Tema eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el tema:", error);
      toast.error("Error al eliminar el tema");
    } finally {
      if (onTemaInscrito) {
        onTemaInscrito();
      }
    }
  };

  console.log("Temas: ", temasData);
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
  } else if (temasData.length === 0) {
    tableBodyContent = (
      <TableRow>
        <TableCell
          colSpan={9}
          className="text-center py-8 text-muted-foreground"
        >
          No hay temas disponibles
        </TableCell>
      </TableRow>
    );
  } else {
    tableBodyContent = temasData.map((tema) => (
      <TableRow key={tema.id}>
        {/* Title */}
        <TableCell className="font-medium max-w-xs truncate">
          {tema.titulo}
        </TableCell>
        {/* Area */}
        <TableCell>{tema.area?.[0]?.nombre ?? "-"}</TableCell>
        {/* Asesor */}
        <TableCell>
          {tema.coasesores && tema.coasesores.length > 1 ? (
            tema.coasesores
              .filter((c) => c.nombres && c.rol === "Coasesor")
              .map((c) => <div key={c.nombres}>{c.nombres}</div>)
          ) : (
            <p className="text-gray-500">Sin asignar</p>
          )}
        </TableCell>
        {/* Tesistas */}
        <TableCell>
          {!tema.tesistas || tema.tesistas.length === 0 ? (
            <p className="text-gray-400">Sin asignar</p>
          ) : (
            (() => {
              const tesistasAsignados = tema.tesistas.filter(
                (e: Tesista) => e.asignado !== false,
              );
              return tesistasAsignados.length === 0 ? (
                <p className="text-gray-400">Sin asignar</p>
              ) : (
                tesistasAsignados.map((e: Tesista, index) => (
                  <p key={index}>{e.nombres}</p>
                ))
              );
            })()
          )}
        </TableCell>
        {/* Postulaciones */}
        {
          <TableCell>
            {" "}
            {!tema.tesistas || tema.tesistas.length === 0 ? (
              <p>{tema.cantPostulaciones}</p>
            ) : (
              (() => {
                const tesistasAsignados = tema.tesistas.filter(
                  (e: Tesista) => e.asignado !== false,
                );
                return tesistasAsignados.length === 0 ? (
                  <p>{tema.cantPostulaciones}</p>
                ) : (
                  <p className="text-gray-400">Asignado</p>
                );
              })()
            )}
          </TableCell>
        }

        {/* Tipo */}
        <TableCell>
          {(() => {
            let badgeClass = "";
            if (tema.estadoTemaNombre === Tipo.LIBRE) {
              badgeClass = "bg-purple-100 text-purple-800 hover:bg-purple-100";
            } else if (tema.estadoTemaNombre === Tipo.PREINSCRITO) {
              badgeClass = "bg-orange-100 text-orange-800 hover:bg-orange-100";
            } else if (tema.estadoTemaNombre === Tipo.INTERESADO) {
              badgeClass = "bg-blue-100 text-blue-800 hover:bg-blue-100";
            } else {
              badgeClass = "bg-green-100 text-green-800 hover:bg-green-100";
            }
            return (
              <Badge variant="outline" className={badgeClass}>
                {titleCase((tema?.estadoTemaNombre ?? "").replace(/_/g, " "))}
              </Badge>
            );
          })()}
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

            let badgeClass = "";
            if (
              tema?.estadoTemaNombre === Tipo.INTERESADO ||
              tema?.estadoTemaNombre === Tipo.LIBRE
            ) {
              badgeClass = "bg-yellow-100 text-black-500 hover:bg-yellow-100";
            } else if (tema.activo) {
              badgeClass = "bg-green-100 text-green-800 hover:bg-green-100";
            } else {
              badgeClass = "bg-purple-100 text-purple-800 hover:bg-purple-100";
            }

            return (
              <Badge variant="outline" className={badgeClass}>
                {titleCase(estadoLabel)}
              </Badge>
            );
          })()}
        </TableCell>
        {/* Actions */}
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            {/* View Details */}
            <TemaDetailsDialog
              tema={tema}
              asesor={asesor}
              onTemaInscrito={onTemaInscrito}
            />
            {/* Edit Page */}
            {[Tipo.INSCRITO, Tipo.LIBRE].includes(
              tema.estadoTemaNombre as Tipo,
            ) && (
              <Dialog
                open={isEditarTemaDialogOpen}
                onOpenChange={setIsEditarTemaDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-pucp-blue"
                    onClick={() => {
                      setTemaSeleccionado(tema);
                      setIsEditarTemaDialogOpen(true);
                    }}
                  >
                    <FilePen className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                </DialogTrigger>
                {temaSeleccionado && asesor && areasDisponibles && carreras && (
                  <EditarTemaModal
                    setIsEditarTemaDialogOpen={setIsEditarTemaDialogOpen}
                    areasDisponibles={areasDisponibles}
                    carreras={carreras}
                    asesor={asesor}
                    tema={temaSeleccionado}
                    onTemaEditado={onTemaInscrito}
                  />
                )}
              </Dialog>
            )}
            {/* Delete */}
            {[Tipo.INSCRITO, Tipo.LIBRE].includes(
              tema.estadoTemaNombre as Tipo,
            ) && (
              <DeleteTemaPopUp
                temaName={tema.titulo}
                onConfirmar={() => deleteTema(tema?.id)}
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
              <TableHead>Coasesor(es)</TableHead>
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

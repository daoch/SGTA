"use client";

import {
  asesorData,
  estadosValues,
  TabValues,
  temasDataMock,
} from "@/app/types/temas/data";
import { Tema, TemaUI } from "@/app/types/temas/entidades";
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
import { titleCase } from "@/lib/utils";
import { CheckCircle, Eye, Send, X, FilePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface PropuestasTableProps {
  filter?: string;
}

const TEST = true;

export function TemasTable({ filter }: PropuestasTableProps) {
  const [temasData, setTemasData] = useState<TemaUI[]>(
    TEST ? temasDataMock : [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemas = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!TEST) {
          const response = await fetch(
            "http://localhost:5000/temas/listarTemasPorUsuarioRolEstado/1?rolNombre=Asesor&estadoNombre=INSCRITO",
          );
          if (!response.ok) {
            throw new Error("Error al cargar los datos");
          }

          const data: Tema[] = await response.json();
          setTemasData(data.map((tema) => ({ ...tema, tipo: "todo" })));
        }
      } catch (err: any) {
        setError("Error desconocido: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemas();
  }, []);

  const propuestasFiltradas = temasData.filter((tema) => {
    if (!filter || filter === "todos") return true;
    return tema.tipo === filter;
  });

  if (isLoading) {
    return <p className="text-center py-8">Cargando temas...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-red-500">{error}</p>;
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
              <TableHead>Estado</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Ciclo</TableHead>
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
                  <TableCell className="font-medium max-w-xs truncate">
                    {tema.titulo}
                  </TableCell>
                  {/* <TableCell>{tema.area}</TableCell> */}
                  <TableCell>{"Artificial Intelligence"}</TableCell>
                  <TableCell>{asesorData.name}</TableCell>
                  <TableCell>
                    {!tema.tesistas
                      ? "Sin asignar"
                      : tema.tesistas.map((e) => e.nombres).join(", ")}
                  </TableCell>
                  <TableCell>
                    3{/* {!tema.postulaciones ? "-" : tema.postulaciones} */}
                  </TableCell>
                  {/* Estado */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        tema.estadoTemaNombre === estadosValues.PROPUESTO_LIBRE
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                          : "bg-green-100 text-green-800 hover:bg-green-100"
                      }
                    >
                      {titleCase(tema?.estadoTemaNombre || "")}
                    </Badge>
                  </TableCell>
                  {/* Tipo */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        tema.tipo === TabValues.LIBRE
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          : "bg-green-100 text-green-800 hover:bg-green-100"
                      }
                    >
                      {titleCase(tema.tipo)}
                    </Badge>
                  </TableCell>
                  <TableCell>{"2025-1"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* View Details */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver detalles</span>
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                      {/* Edit Page */}
                      {[TabValues.INSCRITO, TabValues.LIBRE].includes(
                        tema.tipo as TabValues,
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
                      {[TabValues.INSCRITO, TabValues.LIBRE].includes(
                        tema.tipo as TabValues,
                      ) && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
    </div>
  );
}


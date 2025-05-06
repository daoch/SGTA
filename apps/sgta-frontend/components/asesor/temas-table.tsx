"use client";

import React, { useEffect, useState } from "react";
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
import { CheckCircle, Eye, Send, X } from "lucide-react";
import { temasDataMock } from "@/app/types/temas/data";

interface Tema {
  id: number;
  titulo: string;
  area: string;
  asesor: string;
  estudiantes: { nombre: string; codigo: string }[] | null;
  postulaciones: number | null;
  estado: string;
  tipo: string;
  ciclo: string;
  descripcion: string;
  coasesores: string[];
  recursos: { nombre: string; tipo: string; fecha: string }[];
}

interface PropuestasTableProps {
  filter?: string;
}

export function TemasTable({ filter }: PropuestasTableProps) {
  // const [temasData, setTemasData] = useState<Tema[]>([]);
  const [temasData, setTemasData] = useState<Tema[]>(temasDataMock);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemas = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Realiza la solicitud a la API
        // const response = await fetch("/api/temas"); // Cambia la URL por la de tu API
        // if (!response.ok) {
        //   throw new Error("Error al cargar los datos");
        // }

        // const data: Tema[] = await response.json();
        // setTemasData(data);
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
                  <TableCell>{tema.area}</TableCell>
                  <TableCell>{tema.asesor}</TableCell>
                  <TableCell>
                    {!tema.estudiantes
                      ? "Sin asignar"
                      : tema.estudiantes.map((e) => e.nombre).join(", ")}
                  </TableCell>
                  <TableCell>
                    {!tema.postulaciones ? "-" : tema.postulaciones}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        tema.tipo === "directa"
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                          : "bg-green-100 text-green-800 hover:bg-green-100"
                      }
                    >
                      {titleCase(tema.estado)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        tema.tipo === "directa"
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                          : "bg-green-100 text-green-800 hover:bg-green-100"
                      }
                    >
                      {titleCase(tema.tipo)}
                    </Badge>
                  </TableCell>
                  <TableCell>{tema.ciclo}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver detalles</span>
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                      {tema.tipo === "general" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-pucp-blue"
                        >
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Postular</span>
                        </Button>
                      )}
                      {tema.tipo === "directa" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-500"
                          >
                            <CheckCircle className="h-4 w-4" />
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


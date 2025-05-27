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
import { Eye, Send } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface TemaDisponible {
  id: number;
  titulo: string;
  area: string;
  asesor: string;
  coasesores?: string[];
  postulaciones: number | null;
  fechaLimite: string;
  resumen?: string;
  objetivos?: string;
}

const temasMock: TemaDisponible[] = [
  {
    id: 1,
    titulo: "Desarrollo de un sistema de monitoreo de calidad del aire",
    area: "Internet de las Cosas",
    asesor: "Dr. Roberto Sánchez",
    coasesores: [],
    postulaciones: 3,
    fechaLimite: "2023-11-29",
    resumen: "Sistema IoT para medir CO2, partículas y humedad",
    objetivos: "Recolectar datos. Visualizarlos. Activar alarmas.",
  },
  {
    id: 2,
    titulo: "Optimización de consultas en bases de datos NoSQL",
    area: "Bases de Datos",
    asesor: "Dr. Roberto Sánchez",
    coasesores: ["Dra. Carmen Vega"],
    postulaciones: 5,
    fechaLimite: "2023-12-04",
    resumen: "Estudio de técnicas de indexado para MongoDB",
    objetivos: "Comparar rendimiento. Proponer mejoras.",
  },
];

interface PropuestasTableProps {
  filtroTitulo?: string;
  filtroAsesor?: string;
  filtroArea?: string;
}

export function PropuestasTable({
  filtroTitulo = "",
  filtroAsesor = "",
  filtroArea = "",
}: PropuestasTableProps) {
  const [selected, setSelected] = useState<TemaDisponible | null>(null);

  const temasFiltrados = temasMock.filter((tema) => {
    const matchTitulo = tema.titulo.toLowerCase().includes(filtroTitulo.toLowerCase());
    const matchAsesor = tema.asesor.toLowerCase().includes(filtroAsesor.toLowerCase());
    const matchArea = filtroArea === "all" || tema.area === filtroArea;
    return matchTitulo && matchAsesor && matchArea;
  });

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Asesor</TableHead>
              <TableHead>Coasesor(es)</TableHead>
              <TableHead>Postulaciones</TableHead>
              <TableHead>Fecha Límite</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {temasFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No hay temas que coincidan con los filtros
                </TableCell>
              </TableRow>
            ) : (
              temasFiltrados.map((tema) => (
                <TableRow key={tema.id}>
                  <TableCell className="max-w-xs truncate">{tema.titulo}</TableCell>
                  <TableCell>{tema.area}</TableCell>
                  <TableCell>{tema.asesor}</TableCell>
                  <TableCell>{tema.coasesores?.join(", ") || "-"}</TableCell>
                  <TableCell>
                    {tema.postulaciones !== null ? (
                      <Badge className="bg-blue-100 text-blue-800">{tema.postulaciones}</Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{new Date(tema.fechaLimite).toLocaleDateString("es-PE")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" onClick={() => setSelected(tema)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[90vw] max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalles del Tema</DialogTitle>
                            <DialogDescription>
                              Información completa sobre el tema seleccionado
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-2">
                            <p><strong>Título:</strong> {selected?.titulo}</p>
                            <p><strong>Área:</strong> {selected?.area}</p>
                            <p><strong>Asesor:</strong> {selected?.asesor}</p>
                            <p><strong>Coasesor(es):</strong> {selected?.coasesores?.join(", ") || "-"}</p>
                            <p><strong>Resumen:</strong> {selected?.resumen}</p>
                            <p><strong>Objetivos:</strong> {selected?.objetivos}</p>
                            <p><strong>Fecha límite:</strong> {new Date(selected?.fechaLimite || "").toLocaleDateString("es-PE")}</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" className="text-sm">
                        <Send className="mr-2 h-4 w-4" />
                        Postular
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

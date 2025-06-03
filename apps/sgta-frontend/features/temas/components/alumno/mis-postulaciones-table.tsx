"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";

// Datos sintéticos
const data = [
  {
    titulo: "Modelo de detección de casas",
    area: "ciencias de la computación",
    asesor: "MarthaAsesor Pérez",
    coasesores: ["RenzoAsesor Iwamoto"],
    fechaLimite: "6/6/2025",
    estado: "Pendiente",
    resumen: "Resumen de modelo de casas...",
  },
  {
    titulo: "Análisis de sentimientos para marketing",
    area: "ciencias de la computación",
    asesor: "Carlos Sánchez",
    coasesores: [],
    fechaLimite: "7/6/2025",
    estado: "Aceptado",
    resumen: "Resumen de análisis de sentimientos...",
  },
  {
    titulo: "Desarrollo de app con IoT",
    area: "ciencias de la computación",
    asesor: "MarthaAsesor Pérez",
    coasesores: ["Carlos Sánchez", "RenzoAsesor Iwamoto"],
    fechaLimite: "10/6/2025",
    estado: "Rechazado",
    resumen: "Resumen de app con IoT...",
  },
];

// Estado visual
const getEstadoBadge = (estado: string) => {
  switch (estado) {
    case "Pendiente":
      return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
    case "Rechazado":
      return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
    case "Aceptado":
      return <Badge className="bg-green-100 text-green-800">Aceptado</Badge>;
    default:
      return <Badge variant="outline">Desconocido</Badge>;
  }
};

export function PostulacionesTable() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Asesor</TableHead>
            <TableHead>Coasesor(es)</TableHead>
            <TableHead>Fecha Límite</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell className="max-w-xs truncate">{item.titulo}</TableCell>
              <TableCell>{item.area}</TableCell>
              <TableCell>{item.asesor}</TableCell>
              <TableCell>{item.coasesores.length > 0 ? item.coasesores.join(", ") : "-"}</TableCell>
              <TableCell>{item.fechaLimite}</TableCell>
              <TableCell>{getEstadoBadge(item.estado)}</TableCell>
              <TableCell className="text-right flex gap-2 justify-end">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSelectedIdx(idx)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                {item.estado === "Pendiente" && (
                  <Button size="icon" variant="ghost" className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedIdx !== null && (
        <Dialog open={selectedIdx !== null} onOpenChange={(open) => !open && setSelectedIdx(null)}>
          <DialogContent className="w-[90vw] max-w-3xl sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalles del Tema</DialogTitle>
              <DialogDescription>
                Información completa sobre la postulación seleccionada
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">Título</label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  {data[selectedIdx].titulo}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Área</label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  {data[selectedIdx].area}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Descripción</label>
                <div className="p-3 bg-gray-50 rounded-md border whitespace-pre-wrap">
                  {data[selectedIdx].resumen}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Asesor</label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    {data[selectedIdx].asesor}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Fecha Límite</label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    {data[selectedIdx].fechaLimite}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setSelectedIdx(null)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

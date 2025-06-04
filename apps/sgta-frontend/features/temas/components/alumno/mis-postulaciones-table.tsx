"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Eye, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface TemaAPI {
  id: number;
  titulo: string;
  resumen: string;
  fechaLimite: string;
  estadoTemaNombre: string;
  area: { nombre: string }[];
  subareas?: { nombre: string }[];
  coasesores: { nombres: string; primerApellido?: string; rol: string }[];
}

interface Tema {
  id: number;
  titulo: string;
  resumen: string;
  area: string;
  subareas: string[];
  asesor: string;
  coasesores: string[];
  fechaLimite: string;
  estado: string;
}

const getEstadoBadge = (estado: string) => {
  switch (estado) {
    case "PROPUESTO_LIBRE":
    case "Pendiente":
      return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
    case "Aceptado":
      return <Badge className="bg-green-100 text-green-800">Aceptado</Badge>;
    case "Rechazado":
      return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
    default:
      return <Badge variant="outline">Desconocido</Badge>;
  }
};

export function PostulacionesTable() {
  const [temas, setTemas] = useState<Tema[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    const fetchPostulaciones = async () => {
      try {
        const { idToken } = useAuthStore.getState();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/temas/listarMisPostulacionesTemaLibre`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        if (!res.ok) throw new Error("Error al obtener postulaciones");

        const data: TemaAPI[] = await res.json();
        const mapped = data.map((tema) => {
          const asesorObj = tema.coasesores[0];
          const coasesoresObj = tema.coasesores.slice(1);

          return {
            id: tema.id,
            titulo: tema.titulo,
            resumen: tema.resumen,
            area: tema.area?.[0]?.nombre || "No especificada",
            subareas: tema.subareas?.map((s) => s.nombre) || [],
            asesor: asesorObj
              ? `${asesorObj.nombres} ${asesorObj.primerApellido || ""}`
              : "No asignado",
            coasesores: coasesoresObj.map(
              (c) => `${c.nombres} ${c.primerApellido || ""}`
            ),
            fechaLimite: new Date(tema.fechaLimite).toLocaleDateString("es-PE"),
            estado: tema.estadoTemaNombre,
          };
        });

        setTemas(mapped);
      } catch (err) {
        console.error("Error al cargar postulaciones:", err);
      }
    };

    fetchPostulaciones();
  }, []);

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
          {temas.map((item, idx) => (
            <TableRow key={item.id}>
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
                {item.estado === "PROPUESTO_LIBRE" && (
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
        <Dialog
          open={selectedIdx !== null}
          onOpenChange={(open) => !open && setSelectedIdx(null)}
        >
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
                  {temas[selectedIdx].titulo}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Área</label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  {temas[selectedIdx].area}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Descripción</label>
                <div className="p-3 bg-gray-50 rounded-md border whitespace-pre-wrap">
                  {temas[selectedIdx].resumen}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Asesor</label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    {temas[selectedIdx].asesor}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Fecha Límite</label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    {temas[selectedIdx].fechaLimite}
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

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
import { Toaster, toast } from "sonner";

interface TemaAPI {
  id: number;
  titulo: string;
  resumen: string;
  fechaLimite: string;
  estadoTemaNombre: string;
  area: { nombre: string }[];
  subareas?: { nombre: string }[];
  coasesores: {
    nombres: string;
    primerApellido?: string;
    rol: string;
    comentario?: string | null;
  }[];
  tesistas?: {
    comentario?: string;
    asignado?: boolean;
    rechazado?: boolean;
  }[];
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
  comentarioTesista?: string;
  comentariosAsesores?: string;
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
  const [openEliminarDialog, setOpenEliminarDialog] = useState(false);
  const [temaAEliminar, setTemaAEliminar] = useState<Tema | null>(null);

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

          let comentarioTesista = tema.tesistas?.[0]?.comentario || "Sin comentario";
          let comentariosAsesores: string | undefined = undefined;

          if (comentarioTesista.includes("|@@|")) {
            const partes = comentarioTesista.split("|@@|");
            comentarioTesista = partes[0].trim();
            if (partes.length > 1) {
              comentariosAsesores = partes.slice(1).map(s => s.trim()).join(" - ");
            }
          }

          const comentarios = tema.coasesores
            .map((c) => c.comentario?.trim())
            .filter((c): c is string => Boolean(c))
            .join("\n\n");

          // Lógica de estado personalizada
          let estado = tema.estadoTemaNombre;
          const tesista = tema.tesistas?.[0];
          if (tesista) {
            if (tesista.rechazado) {
              estado = "Rechazado";
            } else if (tesista.asignado) {
              estado = "Aceptado";
            } else {
              estado = "Pendiente";
            }
          }

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
            fechaLimite: tema.fechaLimite
              ? new Date(tema.fechaLimite).toLocaleDateString("es-PE")
              : "-",
            estado,
            comentarioTesista,
            comentariosAsesores: comentariosAsesores || comentarios || undefined,
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
          {temas.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No hay postulaciones disponibles
              </TableCell>
            </TableRow>
          ) : (
            temas.map((item, idx) => (
              <TableRow key={item.id}>
                <TableCell className="max-w-xs truncate">{item.titulo}</TableCell>
                <TableCell>{item.area}</TableCell>
                <TableCell>{item.asesor}</TableCell>
                <TableCell>
                  {item.coasesores.length > 0
                    ? item.coasesores.join(", ")
                    : "-"}
                </TableCell>
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
                  {(item.estado === "PROPUESTO_LIBRE" ||
                    item.estado === "Pendiente") && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => {
                        setTemaAEliminar(item);
                        setOpenEliminarDialog(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={openEliminarDialog} onOpenChange={setOpenEliminarDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar postulación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta postulación? Esta acción no
              se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenEliminarDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={async () => {
                if (!temaAEliminar) return;
                try {
                  const { idToken } = useAuthStore.getState();
                  const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/temas/eliminarPostulacionTemaLibre?temaId=${temaAEliminar.id}`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${idToken}`,
                        "Content-Type": "application/json",
                      },
                    }
                  );
                  if (!res.ok) throw new Error("Error al eliminar la postulación");
                  toast.success("Postulación eliminada exitosamente", {
                    position: "bottom-right",
                  });
                  setOpenEliminarDialog(false);
                  setTemaAEliminar(null);
                  setTemas((prev) => prev.filter((t) => t.id !== temaAEliminar.id));
                } catch (error) {
                  toast.error("Ocurrió un error al eliminar la postulación", {
                    position: "bottom-right",
                  });
                }
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedIdx !== null && (
        <Dialog
          open={selectedIdx !== null}
          onOpenChange={(open) => !open && setSelectedIdx(null)}
        >
          <DialogContent className="w-[90vw] max-w-3xl sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalles de tu postulación</DialogTitle>
              <DialogDescription>
                Información completa sobre la postulación realizada
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
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Comentario enviado al asesor
                </label>
                <div className="p-3 bg-gray-50 rounded-md border whitespace-pre-wrap">
                  {temas[selectedIdx].comentarioTesista}
                </div>
              </div>
              {temas[selectedIdx].comentariosAsesores && (
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Comentario(s) del Asesor
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md border whitespace-pre-wrap">
                    {temas[selectedIdx].comentariosAsesores}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setSelectedIdx(null)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <Toaster position="bottom-right" />
    </div>
  );
}

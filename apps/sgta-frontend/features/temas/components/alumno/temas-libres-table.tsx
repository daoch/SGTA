"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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
import { Eye, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { EnviarPropuestaCard } from "./postular-card";

interface TemaAPI {
  id: number;
  titulo: string;
  area?: { nombre: string }[];
  subareas?: { nombre: string }[];
  coasesores?: { nombres: string; primerApellido?: string }[];
  fechaLimite: string;
  resumen?: string;
  objetivos?: string;
  requisitos?: string; 
}

interface TemaDisponible {
  id: number;
  titulo: string;
  area: string;
  subareas: string[];
  asesor: string;
  coasesores?: string[];
  fechaLimite: string;
  resumen?: string;
  objetivos?: string;
  requisitos?: string; 
}

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
  const [temas, setTemas] = useState<TemaDisponible[]>([]);
  const [selected, setSelected] = useState<TemaDisponible | null>(null);
  const [openPostularDialog, setOpenPostularDialog] = useState(false);
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    const fetchTemas = async () => {
      try {
        const { idToken } = useAuthStore.getState();

        if (!idToken) {
          console.error("No authentication token available");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}temas/listarTemasLibres`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Error al obtener temas libres");

        const data = await res.json();

        const temasMapeados: TemaDisponible[] = (data as TemaAPI[]).map((tema) => {
          const asesor = tema.coasesores?.[0];
          const coasesores = tema.coasesores?.slice(1) ?? [];
          return {
            id: tema.id,
            titulo: tema.titulo,
            area: tema.area?.[0]?.nombre ?? "No especificada",
            subareas: tema.subareas?.map((sa) => sa.nombre) ?? [],
            asesor: asesor
              ? `${asesor.nombres} ${asesor.primerApellido ?? ""}`
              : "No asignado",
            coasesores: coasesores.map(
              (c) => `${c.nombres} ${c.primerApellido ?? ""}`
            ),
            fechaLimite: tema.fechaLimite,
            resumen: tema.resumen,
            objetivos: tema.objetivos,
          };
        });

        setTemas(temasMapeados);
      } catch (error) {
        console.error("Error al cargar temas libres:", error);
      }
    };

    fetchTemas();
  }, []);

  const temasFiltrados = temas.filter((tema) => {
    const matchTitulo = tema.titulo
      .toLowerCase()
      .includes(filtroTitulo.toLowerCase());
    const matchAsesor = tema.asesor
      .toLowerCase()
      .includes(filtroAsesor.toLowerCase());
    const matchArea =
      filtroArea === "all" ||
      tema.area.toLowerCase().includes(filtroArea.toLowerCase());
    return matchTitulo && matchAsesor && matchArea;
  });

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
            <TableHead className="text-right">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {temas.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No hay temas libres disponibles
              </TableCell>
            </TableRow>
          ) : temasFiltrados.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
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
                  {tema.fechaLimite
                    ? new Date(tema.fechaLimite).toLocaleDateString("es-PE")
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setSelected(tema)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[90vw] max-w-3xl sm:max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Detalles del Tema</DialogTitle>
                          <DialogDescription>
                            Información completa sobre el tema libre seleccionado
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-2">
                          <div className="space-y-1">
                            <label className="text-sm font-medium">Título</label>
                            <div className="p-3 bg-gray-50 rounded-md border">
                              {selected?.titulo}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium">Área</label>
                            <div className="p-3 bg-gray-50 rounded-md border">
                              {selected?.area}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium">Subárea(s)</label>
                            <div className="p-3 bg-gray-50 rounded-md border">
                              {selected?.subareas?.join(" - ") || "No especificadas"}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium">Descripción</label>
                            <div className="p-3 bg-gray-50 rounded-md border whitespace-pre-wrap">
                              {selected?.resumen}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-sm font-medium">Asesor</label>
                              <div className="p-3 bg-gray-50 rounded-md border">
                                {selected?.asesor}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-sm font-medium">Fecha Límite</label>
                              <div className="p-3 bg-gray-50 rounded-md border">
                                {selected?.fechaLimite
                                  ? new Date(selected.fechaLimite).toLocaleDateString("es-PE")
                                  : "-"}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium">Requisitos</label>
                            <div className="p-3 bg-gray-50 rounded-md border whitespace-pre-wrap">
                              {selected?.requisitos || "No especificados"}
                            </div>
                          </div>
                        </div>

                        <DialogFooter className="mt-4 flex flex-row gap-2 justify-end">
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              Cerrar
                            </Button>
                          </DialogTrigger>
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => {
                              setSelected(tema);
                              setOpenPostularDialog(true);
                            }}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Postular
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="icon"
                      variant="ghost" 
                      onClick={() => {
                        setSelected(tema);
                        setOpenPostularDialog(true);
                      }}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Dialog
        open={openPostularDialog}
        onOpenChange={(open) => {
          setOpenPostularDialog(open);
        }}
      >
        <DialogContent className="w-[90vw] max-w-2xl overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Postular a tema</DialogTitle>
            <DialogDescription>
              Escribe un comentario antes de postular al tema
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <EnviarPropuestaCard data={selected} setComentario={setComentario} />
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenPostularDialog(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={async () => {
                if (!comentario.trim()) {
                  toast.error("Debes ingresar un comentario antes de postular", {
                    position: "bottom-right",
                  });
                  return;
                }

                try {
                  const { idToken } = useAuthStore.getState();
                  if (!idToken || !selected) {
                    toast.error("Error de autenticación o tema no seleccionado", {
                      position: "bottom-right",
                    });
                    return;
                  }

                  const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}temas/postularTemaLibre?temaId=${selected.id}&comentario=${comentario}`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${idToken}`,
                        "Content-Type": "application/json",
                      },
                    }
                  );

                  if (!res.ok) throw new Error("Error al postular al tema");

                  toast.success("Postulación enviada exitosamente", {
                    position: "bottom-right",
                  });
                  setOpenPostularDialog(false);
                  setComentario("");
                } catch (error) {
                  console.error("Error en la postulación:", error);
                  toast.error("Ocurrió un error al enviar tu postulación", {
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
      <Toaster position="bottom-right" />
    </div>
  );
}

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Proyecto, SubAreaConocimiento, Usuario } from "@/features/temas/types/propuestas/entidades";
import { Eye, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

interface PropuestaAPI {
  id: number;
  titulo: string;
  resumen?: string;
  objetivos?: string;
  metodologia?: string;
  fechaLimite: string;
  cantPostulaciones?: number;
  subareas: SubAreaConocimiento[];
  tesistas: Usuario[];    
  coasesores: Usuario[];  
  estadoTemaNombre?: string;
}

interface PropuestasTableProps {
  filter?: string;
}

export function PropuestasTable({ filter }: PropuestasTableProps) {
  const [propuestas, setPropuestas] = useState<Proyecto[]>([]);
  const [areaFilter, setAreaFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPropuesta, setSelectedPropuesta] = useState<Proyecto | null>(null);

  const MY_ID = 4;

  useEffect(() => {
    async function fetchPropuestas() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/temas/listarPropuestasPorTesista/7`
        );
        const data: PropuestaAPI[] = await res.json();

        const mapped: Proyecto[] = data.map((item) => ({
          id: item.id,
          titulo: item.titulo,
          subareas: item.subareas,
          tesistas: item.tesistas,
          codigos: item.tesistas.map((t) => String(t.id)),
          cantPostulaciones: item.cantPostulaciones || 0,
          fechaLimite: item.fechaLimite,
          tipo:
            item.estadoTemaNombre === "PROPUESTO_DIRECTO"
              ? "directa"
            : item.estadoTemaNombre === "PROPUESTO_GENERAL"
              ? "general"
            : "preinscrito",        
          resumen: item.resumen || "",
          objetivos: item.objetivos || "",
          metodologia: item.metodologia || "",
          coasesores: item.coasesores,
        }));

        setPropuestas(mapped);
      } catch (err) {
        console.error("Error cargando propuestas:", err);
      }
    }

    fetchPropuestas();
  }, []);

  const propuestasFiltradas = propuestas.filter((p) => {
    if (filter && p.tipo !== filter) return false;
    if (areaFilter && p.subareas[0]?.nombre !== areaFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        p.titulo.toLowerCase().includes(term) ||
        p.tesistas.some((t) => {
          const fullName = `${t.nombres} ${t.primerApellido} ${t.segundoApellido}`.toLowerCase();
          return fullName.includes(term);
        })
      );
    }
    return true;
  });

  const areasUnicas = Array.from(
    new Set(propuestas.map((p) => p.subareas[0]?.nombre || "—"))
  );

  return (
    <>
      {/* FILTROS */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <Input
          type="search"
          placeholder="Buscar por título o estudiante..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        <div className="w-full md:w-64">
          <Select
            value={areaFilter || "all"}
            onValueChange={(v) => setAreaFilter(v === "all" ? null : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las áreas</SelectItem>
              {areasUnicas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TABLA */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Cotesistas</TableHead>
              <TableHead>Asesores</TableHead>
              <TableHead>Postulaciones</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {propuestasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No hay propuestas disponibles
                </TableCell>
              </TableRow>
            ) : (
              propuestasFiltradas.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {p.titulo}
                  </TableCell>
                  <TableCell>{p.subareas[0]?.nombre || "—"}</TableCell>

                  {/* Cotesistas no asignados, excluyendo al propio usuario */}
                  <TableCell>
                    {p.tesistas
                      .filter((t) => !t.creador && t.rechazado !== true)
                      .map((t) => `${t.nombres} ${t.primerApellido}`.trim())
                      .join(", ") || "-"}
                  </TableCell>

                  {/* Asesores propuestos */}
                  <TableCell>
                    {(() => {
                      const visibles = p.tipo === "preinscrito"
                        ? p.coasesores.filter(c => c.asignado === true)
                        : p.coasesores.filter(c => c.rechazado !== true);
                      return visibles.length > 0
                        ? visibles.map(c => `${c.nombres} ${c.primerApellido}`.trim()).join(", ")
                        : "-";
                    })()}
                  </TableCell>

                  <TableCell>
                    {p.cantPostulaciones > 0 ? (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {p.cantPostulaciones}
                      </Badge>
                    ) : (
                      <span>-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {p.fechaLimite
                      ? new Date(p.fechaLimite).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        p.tipo === "directa"
                          ? "bg-purple-100 text-purple-800"
                        : p.tipo === "general"
                          ? "bg-green-100 text-green-800"
                        : "bg-sky-100 text-sky-800"
                      }
                    >
                      {p.tipo === "directa"
                          ? "Directa"
                        : p.tipo === "general"
                          ? "General"
                          : "Preinscrito"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedPropuesta(p)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[90vw] max-w-3xl sm:max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Detalles de la Propuesta</DialogTitle>
                          <DialogDescription>
                            Información completa sobre la propuesta
                          </DialogDescription>
                        </DialogHeader>

                        {selectedPropuesta && (
                          <div className="space-y-6 py-4">
                            {/* Título y área */}
                            <div className="space-y-1">
                              <h3 className="font-medium">Título</h3>
                              <p>{selectedPropuesta.titulo}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <h3 className="font-medium">Área</h3>
                                <p>{selectedPropuesta.subareas[0]?.nombre || "—"}</p>
                              </div>
                              {selectedPropuesta.fechaLimite && (
                                <div className="space-y-1">
                                  <h3 className="font-medium">Fecha Límite</h3>
                                  <p>
                                    {new Date(
                                      selectedPropuesta.fechaLimite
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Tipo y postulaciones */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <h3 className="font-medium">Tipo</h3>
                                <Badge
                                  variant="outline"
                                  className={
                                    selectedPropuesta.tipo === "directa"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-green-100 text-green-800"
                                  }
                                >
                                  {selectedPropuesta.tipo === "directa"
                                    ? "Directa"
                                    : "General"}
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                <h3 className="font-medium">Postulaciones</h3>
                                <p>{selectedPropuesta.cantPostulaciones}</p>
                              </div>
                            </div>

                            {/* Cotesistas invitados pendientes */}
                            {selectedPropuesta.tesistas.filter((t) => !t.creador && t.rechazado !== true).length > 0 && (
                              <div className="space-y-2">
                                <h3 className="font-medium">Cotesistas</h3>
                                {selectedPropuesta.tesistas
                                  .filter((t) => !t.creador && t.rechazado !== true)
                                  .map((t, i) => (
                                    <div
                                      key={i}
                                      className="p-3 bg-gray-50 rounded-md border flex justify-between items-center"
                                    >
                                      <span>
                                        {t.nombres} {t.primerApellido}
                                      </span>
                                      {!t.asignado && (
                                        <Badge className="bg-yellow-100 text-yellow-800">
                                          Pendiente
                                        </Badge>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            )}

                            {/* Coasesores (asesores propuestos) */}
                            {(() => {
                              const cp = selectedPropuesta!;
                              const visibles = cp.tipo === "preinscrito"
                                ? cp.coasesores.filter(c => c.asignado === true)
                                : cp.coasesores.filter(c => c.rechazado !== true);
                              return visibles.length > 0 ? (
                                <div className="space-y-2">
                                  <Label>Asesor(es) Propuesto(s)</Label>
                                  {visibles.map(c => (
                                    <p key={c.id}>
                                      {c.nombres} {c.primerApellido}
                                    </p>
                                  ))}
                                </div>
                              ) : null;
                            })()}

                            <Separator />

                            {/* Resumen y objetivos */}
                            <div className="space-y-2">
                              <Label>Resumen</Label>
                              <div className="p-3 bg-gray-50 rounded-md border">
                                <p>{selectedPropuesta.resumen}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Objetivos</Label>
                              <div className="p-3 bg-gray-50 rounded-md border">
                                <p>{selectedPropuesta.objetivos}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setSelectedPropuesta(null)}>
                            Cerrar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Botones de acción */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará la propuesta permanentemente. ¿Deseas continuar?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={async () => {
                              try {
                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/temas/deleteTema`, {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify(p.id),
                                });

                                if (!res.ok) throw new Error("Error en la API");

                                toast.success("Propuesta eliminada", {
                                  description: "Tu propuesta ha sido eliminada satisfactoriamente",
                                  duration: 5000, // 5 segundos
                                });

                                setPropuestas((prev) => prev.filter((x) => x.id !== p.id));
                              } catch (err) {
                                toast.error("Error", {
                                  description: "No se pudo eliminar la propuesta",
                                  duration: 5000,
                                });
                                console.error(err);
                              }
                            }}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Toaster position="bottom-right" richColors />
    </>
  );
}

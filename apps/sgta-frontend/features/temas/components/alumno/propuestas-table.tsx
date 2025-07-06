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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { PendientesCotesistasCard } from "@/features/temas/components/alumno/pendientes-cotesistas-card";
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

interface PropuestaPendiente {
  id: string;
  titulo: string;
  area: string;
  estudiantes: string[];
  codigos: string[];
  postulaciones: number;
  fechaLimite: string;
  tipo: string;
  descripcion: string;
  objetivos: string;
  tesistas: Usuario[];
}

export function PropuestasTable({ filter }: PropuestasTableProps) {
  const [propuestas, setPropuestas] = useState<Proyecto[]>([]);
  const [areaFilter, setAreaFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");  const [selectedPropuesta, setSelectedPropuesta] = useState<Proyecto | null>(null);
  const [openDialog, setOpenDialog] = useState(false); 
  const [pendientesCotesistas, setPendientesCotesistas] = useState<Proyecto[]>([]);
  const [selectedPendiente, setSelectedPendiente] = useState<Proyecto | null>(null);
  const [openPendienteModal, setOpenPendienteModal] = useState(false);
  const [confirmAccion, setConfirmAccion] = useState<{ accion: 0 | 1; id: string } | null>(null);

  useEffect(() => {
    async function fetchPropuestas() {
      try {
        const { idToken } = useAuthStore.getState();
        
        if (!idToken) {
          console.error("No authentication token available");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/temas/listarPropuestasPorTesista`,
          {
            headers: {
              "Authorization": `Bearer ${idToken}`,
              "Content-Type": "application/json"
            }
          }
        );
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

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

  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const { idToken } = useAuthStore.getState?.() ?? {};
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/temas/listarPropuestasPorCotesista`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) return;
        const data = await res.json();
        setPendientesCotesistas(data);
      } catch (e) {
        setPendientesCotesistas([]);
      }
    };
    fetchPendientes();
  }, []);
  const pendientesAdaptados: PropuestaPendiente[] = pendientesCotesistas.map((p) => ({
    id: String(p.id),
    titulo: p.titulo,
    area: Array.isArray(p.subareas) && p.subareas.length > 0
    ? p.subareas.map(sa => sa.nombre).join(", ")
    : "—",
    estudiantes: p.tesistas.map(t => `${t.nombres} ${t.primerApellido}`),
    codigos: p.tesistas.map(t => String(t.id)),
    postulaciones: p.cantPostulaciones ?? 0,
    fechaLimite: p.fechaLimite,
    tipo: p.tipo,
    descripcion: p.resumen ?? "",
    objetivos: p.objetivos ?? "",
    tesistas: p.tesistas,
  }));

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

  const handleAccionCotesista = async (accion: 0 | 1, id?: string) => {
    const temaId = id || selectedPendiente?.id;
    if (!temaId) return;
    try {
      const { idToken } = useAuthStore.getState();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/temas/aceptarPropuestaCotesista?temaId=${temaId}&accion=${accion}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Error en la API");
      toast.success(
        accion === 0 ? "Propuesta aceptada" : "Propuesta rechazada"
      );
      setOpenPendienteModal(false);
      setPendientesCotesistas((prev) =>
        prev.filter((p) => String(p.id) !== String(temaId))
      );
    } catch (err) {
      toast.error("No se pudo completar la acción");
      console.error(err);
    }
  };

  const areasUnicas = Array.from(
    new Set(propuestas.map((p) => p.subareas[0]?.nombre || "—"))
  );

  return (
    <>
      {pendientesAdaptados.length > 0 && (
        <div className=" mb-4">
          <PendientesCotesistasCard
            propuestasPendientes={pendientesAdaptados}
            onView={(id) => {
              const found = pendientesCotesistas.find((p) => String(p.id) === id);
              if (found) {
                setSelectedPendiente(found);
                setOpenPendienteModal(true);
              }
            }}
            onDelete={(accion, id) => setConfirmAccion({ accion: accion as 0 | 1, id })}
          />
        </div>
      )}

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
                  <TableCell>
                    {Array.isArray(p.subareas) && p.subareas.length > 0
                      ? p.subareas.map(sa => sa.nombre).join(", ")
                      : "—"}
                  </TableCell>

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
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedPropuesta(p);
                            setOpenDialog(true); // abrir el modal
                          }}
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
                              <Label>Título</Label>
                              <p>{selectedPropuesta.titulo}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <Label>Área</Label>
                                <p>{Array.isArray(selectedPropuesta.subareas) && selectedPropuesta.subareas.length > 0
                                  ? selectedPropuesta.subareas.map((s: SubAreaConocimiento) => s.nombre).join(", ")
                                  : "—"}</p>
                              </div>
                              {selectedPropuesta.fechaLimite && (
                                <div className="space-y-1">
                                  <Label>Fecha Límite</Label>
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
                                <Label>Tipo</Label>
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
                                <Label>Postulaciones</Label>
                                <p>{selectedPropuesta.cantPostulaciones}</p>
                              </div>
                            </div>

                            {/* Cotesistas invitados pendientes */}
                            {selectedPropuesta.tesistas.filter((t) => !t.creador).length > 0 && (
                              <div className="space-y-2">
                                <Label>Cotesistas</Label>
                                {selectedPropuesta.tesistas
                                  .filter((t) => !t.creador)
                                  .map((t, i) => (
                                    <div
                                      key={i}
                                      className="p-3 bg-gray-50 rounded-md border flex justify-between items-center"
                                    >
                                      <span>
                                        {t.nombres} {t.primerApellido}
                                      </span>
                                      {t.rol === "Alumno" && t.rechazado === true && (
                                        <Badge className="bg-red-100 text-red-800">Rechazado</Badge>
                                      )}
                                      {t.rol === "Tesista" && t.rechazado === false && t.asignado === false &&(
                                        <Badge className="bg-green-100 text-green-800">Aceptado</Badge>
                                      )}
                                      {t.rol === "Alumno" && t.rechazado === false && t.asignado === false &&(
                                        <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            )}
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
                          <Button
                            variant="outline"
                            onClick={() => {
                              setOpenDialog(false);        
                              setTimeout(() => setSelectedPropuesta(null), 200); 
                            }}
                          >
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

      <Dialog open={openPendienteModal} onOpenChange={setOpenPendienteModal}>
        <DialogContent className="w-[90vw] max-w-3xl sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalle de Propuesta Pendiente</DialogTitle>
            <DialogDescription>
              Información completa sobre la propuesta pendiente de aceptación
            </DialogDescription>
          </DialogHeader>
          {selectedPendiente && (
            <div className="space-y-6 py-4">
              <div className="space-y-1">
                <h3 className="font-medium">Título</h3>
                <p>{selectedPendiente.titulo}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="font-medium">Área</h3>
                  <p>
                    {Array.isArray(selectedPendiente.subareas) && selectedPendiente.subareas.length > 0
                      ? selectedPendiente.subareas.map((s: SubAreaConocimiento) => s.nombre).join(", ")
                      : "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Fecha Límite</h3>
                  <p>
                    {selectedPendiente.fechaLimite
                      ? new Date(selectedPendiente.fechaLimite).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Resumen</h3>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p>{selectedPendiente.resumen}</p>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Cotesistas</h3>
                {selectedPendiente.tesistas.map((t: Usuario, i: number) => (
                  <div
                    key={i}
                    className="p-3 bg-gray-50 rounded-md border flex justify-between items-center"
                  >
                    <span>
                      {t.nombres} {t.primerApellido}
                    </span>
                    {t.rol === "Alumno" && t.rechazado === true && (
                      <Badge className="bg-red-100 text-red-800">Rechazado</Badge>
                    )}
                    {t.rol === "Tesista" && t.rechazado === false && (
                      <Badge className="bg-green-100 text-green-800">Aceptado</Badge>
                    )}
                    {t.rol === "Alumno" && t.rechazado === false && (
                      <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
                    )}
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Objetivos</h3>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p>{selectedPendiente.objetivos}</p>
                </div> 
              </div>
              <Separator />
              <DialogFooter className="flex flex-row gap-2 justify-end">
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() =>
                    setConfirmAccion({
                      accion: 0,
                      id: selectedPendiente ? String(selectedPendiente.id) : "",
                    })
                  }
                >
                  Aceptar
                </Button>
                <Button
                  variant="default"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() =>
                    setConfirmAccion({
                      accion: 1,
                      id: selectedPendiente ? String(selectedPendiente.id) : "",
                    })
                  }
                >
                  Rechazar
                </Button>
                <Button variant="outline" onClick={() => setOpenPendienteModal(false)}>
                  Cerrar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmAccion} onOpenChange={(open) => !open && setConfirmAccion(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAccion?.accion === 0 ? "¿Aceptar propuesta?" : "¿Rechazar propuesta?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAccion?.accion === 0
                ? "¿Estás seguro que deseas aceptar esta propuesta? Esta acción no se puede deshacer."
                : "¿Estás seguro que deseas rechazar esta propuesta? Esta acción no se puede deshacer."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmAccion(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className={confirmAccion?.accion === 0 ? "bg-green-600 text-white hover:bg-green-700" : "bg-red-600 text-white hover:bg-red-700"}
              onClick={async () => {
                if (confirmAccion) {
                  await handleAccionCotesista(confirmAccion.accion, confirmAccion.id);
                  setConfirmAccion(null);
                }
              }}
            >
              {confirmAccion?.accion === 0 ? "Aceptar" : "Rechazar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster position="bottom-right" richColors />
    </>
  );
}



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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Postulacion } from "@/features/temas/types/propuestas/entidades";
import { CheckCircle, Eye, X } from "lucide-react";
import { useEffect, useState } from "react";

interface PostulacionesTableProps {
  filter?: "general" | "directa";
  setSelectedPostulacion: (p: Postulacion) => void;
}

interface RawCoAsesor {
  id: number;
  nombres: string;
  primerApellido?: string;
  correoElectronico?: string;
  comentario?: string;
  asignado?: boolean;   // directas
  rechazado?: boolean;  // generales
}

interface RawPostulacionApi {
  id: number;
  titulo: string;
  subareas?: { nombre: string }[];
  resumen?: string;
  fechaLimite?: string;
  estadoTemaNombre?: string;          // directas
  comentario?: string;               // directas
  coasesores: RawCoAsesor[];
  tesistas: { id: number; creador?: boolean; comentario?: string }[]; // generales
}

export function PostulacionesTable({
  filter,
  setSelectedPostulacion,
}: PostulacionesTableProps) {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [searchTitulo, setSearchTitulo] = useState("");
  const [searchAsesor, setSearchAsesor] = useState("");
  const [areaFilter, setAreaFilter] = useState<string | null>(null);
  const handleDecision = async (
    decision: "aceptar" | "rechazar",
    temaId: number,
    asesorId: number,
    _alumnoId: number
  ) => {
    try {
      const { idToken } = useAuthStore.getState();
                    
      if (!idToken) {
        console.error("No authentication token available");
        return;
      }

      const endpoint =
        decision === "aceptar"
          ? "aprobarPostulacionAPropuesta"
          : "rechazarPostulacionAPropuesta";        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/temas/${endpoint}?asesorId=${asesorId}&temaId=${temaId}`,
            {
              method: "POST",
              headers: {
                  "Authorization": `Bearer ${idToken}`,
                  "Content-Type": "application/json"
              }
            }
          );

          if (!res.ok) throw new Error("Error al procesar solicitud");

          setPostulaciones((prev) =>
            prev.map((p) =>
              p.temaId === temaId && p.asesorId === asesorId
                ? { ...p, estado: decision === "aceptar" ? "aceptado" : "rechazado" }
                : p
            )
          );
        } catch (err) {
          console.error("Error en la API de decisión:", err);
        }
      };
  useEffect(() => {
    async function fetchAll() {
      try {
        const { idToken } = useAuthStore.getState();
        
        if (!idToken) {
          console.error("No authentication token available");
          return;
        }

        const [dirRes, genRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/temas/listarPostulacionesDirectasAMisPropuestas`,
            {
              headers: {
                "Authorization": `Bearer ${idToken}`,
                "Content-Type": "application/json"
              }
            }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/temas/listarPostulacionesGeneralesAMisPropuestas`,
            {
              headers: {
                "Authorization": `Bearer ${idToken}`,
                "Content-Type": "application/json"
              }
            }
          ),
        ]);

        const dirData = (await dirRes.json()) as RawPostulacionApi[];
        const genData = (await genRes.json()) as RawPostulacionApi[];
        const directMapped: Postulacion[] = [];

        dirData.forEach((item) => {

          const coAceptado = item.coasesores.find(co => co.asignado === true);
          if (coAceptado) {
            directMapped.push({
              id: `${item.id}-${coAceptado.id}`,
              titulo: item.titulo,
              area: item.subareas?.[0]?.nombre || "—",
              asesor: `${coAceptado.nombres} ${coAceptado.primerApellido ?? ""}`.trim(),
              correoAsesor: coAceptado.correoElectronico ?? "",
              fechaLimite: item.fechaLimite?.slice(0, 10) || "",
              estado: "aceptado",
              tipo: "directa",
              descripcion: item.resumen ?? "",
              comentarioAsesor: item.tesistas.find(t => t.creador)?.comentario ?? "",
              temaId: item.id,
              asesorId: coAceptado.id,
              alumnoId: 0,
            });
            return;
          }

          if (item.estadoTemaNombre === "RECHAZADO") {
            item.coasesores.forEach((co, index) => {
              directMapped.push({
                id: `${item.id}-${co.id}-${index}`,
                titulo: item.titulo,
                area: item.subareas?.[0]?.nombre || "—",
                asesor: `${co.nombres} ${co.primerApellido ?? ""}`.trim(),
                correoAsesor: co.correoElectronico ?? "",
                fechaLimite: item.fechaLimite?.slice(0, 10) || "",
                estado: "rechazado",
                tipo: "directa",
                descripcion: item.resumen ?? "",
                comentarioAsesor: item.tesistas.find(t => t.creador)?.comentario ?? "",
                temaId: item.id,
                asesorId: co.id,
                alumnoId: 0,
              });
            });
          }
        });

        const generalMapped: Postulacion[] = genData.flatMap(item => {
          if (!item.coasesores?.length) return [];
          return item.coasesores.map((co, index) => {
            const estado: Postulacion["estado"] =
              co.rechazado === true
                ? "rechazado"
                : co.asignado === true
                ? "aceptado"
                : "pendiente";
            const alumnoId = item.tesistas?.find(t => t.creador)?.id ?? 0;

            return {
              id: `${item.id}-${co.id}-${index}`, 
              titulo: item.titulo,
              area: item.subareas?.[0]?.nombre || "—",
              asesor: `${co.nombres} ${co.primerApellido ?? ""}`.trim(),
              correoAsesor: co.correoElectronico ?? "",
              fechaLimite: item.fechaLimite?.slice(0, 10) || "",
              estado,
              tipo: "general",
              descripcion: item.resumen ?? "",
              comentarioAsesor: item.tesistas.find(t => t.creador)?.comentario ?? "",
              temaId: item.id,
              asesorId: co.id,
              alumnoId,
            };
          });
        });

        setPostulaciones([...directMapped, ...generalMapped]);
      } catch (err) {
        console.error("Error cargando postulaciones:", err);
      }
    }

    fetchAll();
  }, []);

  // Áreas únicas
  const areasUnicas = Array.from(new Set(postulaciones.map((p) => p.area)));

  // Filtrar por texto, área y tipo
  const postulacionesFiltradas = postulaciones.filter((p) => {
    const matchTitulo = p.titulo
      .toLowerCase()
      .includes(searchTitulo.toLowerCase());
    const matchAsesor = p.asesor
      .toLowerCase()
      .includes(searchAsesor.toLowerCase());
    const matchArea = !areaFilter || p.area === areaFilter;
    const matchTipo = !filter || p.tipo === filter;
    return matchTitulo && matchAsesor && matchArea && matchTipo;
  });

  // Badge de estado
  const renderEstado = (e: Postulacion["estado"]) => {
    switch (e) {
      case "pendiente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
        );
      case "rechazado":
        return (
          <Badge className="bg-red-100 text-red-800">Rechazado</Badge>
        );
      case "aceptado":
        return (
          <Badge className="bg-green-100 text-green-800">Aceptado</Badge>
        );
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          placeholder="Buscar por título..."
          value={searchTitulo}
          onChange={(e) => setSearchTitulo(e.target.value)}
          className="md:w-1/3"
        />
        <Input
          placeholder="Buscar por asesor..."
          value={searchAsesor}
          onChange={(e) => setSearchAsesor(e.target.value)}
          className="md:w-1/3"
        />
        <Select
          value={areaFilter || "todas"}
          onValueChange={(v) => setAreaFilter(v === "todas" ? null : v)}
        >
          <SelectTrigger className="md:w-1/3">
            <SelectValue placeholder="Todas las áreas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las áreas</SelectItem>
            {areasUnicas.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tema</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Asesor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {postulacionesFiltradas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  No hay postulaciones
                </TableCell>
              </TableRow>
            ) : (
              postulacionesFiltradas.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="max-w-xs truncate">
                    {p.titulo}
                  </TableCell>
                  <TableCell>{p.area}</TableCell>
                  <TableCell>{p.asesor}</TableCell>
                  <TableCell>{renderEstado(p.estado)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedPostulacion(p)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {p.estado === "pendiente" && p.tipo === "general" && (
                        <>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se rechazará al docente como asesor.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                  onClick={() =>
                                    handleDecision("rechazar", p.temaId, p.asesorId, p.alumnoId)
                                  }
                                >
                                  Rechazar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-500"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Deseas aceptar esta propuesta?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  El asesor será informado y se procederá a registrar tu decisión.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() =>
                                    handleDecision("aceptar", p.temaId, p.asesorId, p.alumnoId)
                                  }
                                >
                                  Aceptar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

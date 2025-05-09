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
  DialogTrigger
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
import { Proyecto } from "@/features/temas/types/propuestas/entidades";
import { CheckCircle, Eye, Send, X } from "lucide-react";
import { useEffect, useState } from "react";

interface PropuestaAPI {
  id: number;
  titulo: string;
  resumen: string;
  objetivos: string | null;
  metodologia: string | null;
  fechaLimite: string;
  estadoTemaNombre: string;
  cantPostulaciones: number;
  subareas: { nombre: string }[];
  tesistas: { nombre: string }[];
}

interface PropuestasTableProps {
  filter?: string;
}

export function PropuestasTable({ filter }: PropuestasTableProps) {
  const [propuestas, setPropuestas] = useState<Proyecto[]>([]);
  const [areaFilter, setAreaFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPropuesta, setSelectedPropuesta] = useState<Proyecto | null>(null);

  useEffect(() => {
    const fetchPropuestas = async () => {
      try {
        const res = await fetch("http://localhost:5000/temas/listarPropuestasPorTesista/2");
        const data: PropuestaAPI[] = await res.json();
        const mapeado: Proyecto[] = data.map((item) => ({
          id: String(item.id),
          titulo: item.titulo,
          area: item.subareas[0]?.nombre || "Sin área",
          estudiantes: item.tesistas?.map((t) => t.nombre) || [],
          codigos: [],
          postulaciones: item.cantPostulaciones,
          fechaLimite: item.fechaLimite,
          tipo: item.estadoTemaNombre === "PROPUESTO_DIRECTO" ? "directa" : "general",
          descripcion: item.resumen,
          objetivos: item.objetivos || "",
          metodologia: item.metodologia || "",
          recursos: [],
        }));
        setPropuestas(mapeado);
      } catch (err) {
        console.error("Error cargando propuestas:", err);
      }
    };

    fetchPropuestas();
  }, []);

  const propuestasFiltradas = propuestas.filter((propuesta) => {
    if (filter && propuesta.tipo !== filter) return false;
    if (areaFilter && propuesta.area !== areaFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        propuesta.titulo.toLowerCase().includes(term) ||
        propuesta.estudiantes.some((e) => e.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const areasUnicas = Array.from(new Set(propuestas.map((p) => p.area)));

  return (
    <>
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
            onValueChange={(value) => setAreaFilter(value === "all" ? null : value)}
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Estudiante(s)</TableHead>
              <TableHead>Postulaciones</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {propuestasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No hay propuestas disponibles
                </TableCell>
              </TableRow>
            ) : (
              propuestasFiltradas.map((propuesta) => (
                <TableRow key={propuesta.id}>
                  <TableCell className="font-medium max-w-xs truncate">{propuesta.titulo}</TableCell>
                  <TableCell>{propuesta.area}</TableCell>
                  <TableCell>{propuesta.estudiantes.join(", ")}</TableCell>
                  <TableCell>
                    {propuesta.postulaciones > 0 ? (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        {propuesta.postulaciones}
                      </Badge>
                    ) : (
                      <span>-</span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(propuesta.fechaLimite).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        propuesta.tipo === "directa"
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                          : "bg-green-100 text-green-800 hover:bg-green-100"
                      }
                    >
                      {propuesta.tipo === "directa" ? "Directa" : "General"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedPropuesta(propuesta)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[90vw] max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Detalles de la Propuesta</DialogTitle>
                          <DialogDescription>Información completa sobre la propuesta seleccionada</DialogDescription>
                        </DialogHeader>
                        {selectedPropuesta && (
                          <div className="space-y-6 py-4">
                            <div>
                              <h3 className="font-medium">Título</h3>
                              <p>{selectedPropuesta.titulo}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-medium">Área</h3>
                                <p>{selectedPropuesta.area}</p>
                              </div>
                              <div>
                                <h3 className="font-medium">Fecha límite</h3>
                                <p>{new Date(selectedPropuesta.fechaLimite).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-medium">Tipo</h3>
                                <Badge
                                  variant="outline"
                                  className={
                                    selectedPropuesta.tipo === "directa"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-green-100 text-green-800"
                                  }
                                >
                                  {selectedPropuesta.tipo === "directa" ? "Directa" : "General"}
                                </Badge>
                              </div>
                              <div>
                                <h3 className="font-medium">Postulaciones</h3>
                                <p>{selectedPropuesta.postulaciones}</p>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium">Estudiantes</h3>
                              <p>{selectedPropuesta.estudiantes.join(", ") || "Ninguno"}</p>
                            </div>
                            <Separator />
                            <div>
                              <Label>Descripción</Label>
                              <p className="p-2 bg-gray-50 rounded-md border">{selectedPropuesta.descripcion}</p>
                            </div>
                            <div>
                              <Label>Objetivos</Label>
                              <p className="p-2 bg-gray-50 rounded-md border">{selectedPropuesta.objetivos}</p>
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
                    {/* Otros botones */}
                    {propuesta.tipo === "general" && (
                      <Button variant="ghost" size="icon" className="text-[#042354]">
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    {propuesta.tipo === "directa" && (
                      <>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <X className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-green-500">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
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

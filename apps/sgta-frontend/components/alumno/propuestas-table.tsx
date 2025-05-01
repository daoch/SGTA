import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, X, FileEdit, Trash2 } from "lucide-react";

export interface Propuesta {
  id: string;
  titulo: string;
  area: string;
  estudiantes: string[];
  codigos: string[];
  postulaciones: number;
  fechaLimite: string;
  tipo: "general" | "directa";
  descripcion: string;
  objetivos: string;
  asesor?: string;
  estado: "propuesta" | "cotesista_pendiente";
}

interface PropuestasTableProps {
  filter?: "general" | "directa"; // Cambiado para reflejar los valores posibles
  setSelectedPropuesta: (propuesta: Propuesta) => void;
  propuestas: Propuesta[];
}

export function PropuestasTable({
  filter,
  setSelectedPropuesta,
  propuestas,
}: PropuestasTableProps) {
  const [areaFilter, setAreaFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const areasUnicas = Array.from(new Set(propuestas.map((p) => p.area)));

  const propuestasFiltradas = propuestas.filter((p) => {
    if (filter && p.tipo !== filter) return false;
    if (areaFilter && p.area !== areaFilter) return false;
    const term = searchTerm.toLowerCase();
    const tituloMatch = p.titulo.toLowerCase().includes(term);
    const estudianteMatch = p.estudiantes.some((e) =>
      e.toLowerCase().includes(term)
    );
    return tituloMatch || estudianteMatch;
  });

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <Input
          type="search"
          placeholder="Buscar por título o estudiante..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2"
        />
        <Select
          value={areaFilter || "todas"}
          onValueChange={(v) => setAreaFilter(v === "todas" ? null : v)}
        >
          <SelectTrigger className="md:w-1/3">
            <SelectValue placeholder="Filtrar por área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las áreas</SelectItem>
            {areasUnicas.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Cotesista</TableHead>
              <TableHead>Asesor</TableHead>
              <TableHead>Postulaciones</TableHead>
              <TableHead>Fecha Límite</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {propuestasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay propuestas disponibles
                </TableCell>
              </TableRow>
            ) : (
              propuestasFiltradas.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="max-w-xs truncate font-medium">
                    {p.titulo}
                  </TableCell>
                  <TableCell>{p.area}</TableCell>
                  <TableCell>
                    {p.estudiantes.length > 0 ? (
                      p.estudiantes.join(", ")
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {p.tipo === "general"
                      ? "No asignado"
                      : p.asesor || "No asignado"}
                  </TableCell>
                  <TableCell>
                    {p.postulaciones > 0 ? (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                        {p.postulaciones}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(p.fechaLimite).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        p.tipo === "directa"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {p.tipo === "directa" ? "Directa" : "General"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setSelectedPropuesta({
                            ...p,
                            estado: p.estado ?? "propuesta",
                          })
                        }
                        className="text-gray-500"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground"
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

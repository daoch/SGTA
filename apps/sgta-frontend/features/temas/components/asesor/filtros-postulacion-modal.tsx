"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

interface FiltrosPostulacionProps {
  filtroEstado: string;
  setFiltroEstado: (filtroEstado: string) => void;
  fechaFin: string;
  setFechaFin: (fechaFin: string) => void;
  handleClearFilters: () => void;
  filtrarLosCampos: () => void;
}

export function FiltrosPostulacionModal({
  filtroEstado,
  setFiltroEstado,
  fechaFin,
  setFechaFin,
  handleClearFilters,
  filtrarLosCampos,
}: FiltrosPostulacionProps) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Filtros de búsqueda</DialogTitle>
        <DialogDescription>
          Filtra las postulaciones por estado y rango de fechas
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="filtroEstado">Estado</Label>
          <Select
            value={filtroEstado || "All"}
            onValueChange={(value) =>
              setFiltroEstado(value === "All" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Todos</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="Aprobado">Aprobado</SelectItem>
              <SelectItem value="Rechazado">Rechazado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fechaFin">Fecha Fin</Label>
          <Input
            id="fechaFin"
            type="date"
            value={fechaFin ? fechaFin : ""}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={handleClearFilters}>
          Limpiar filtros
        </Button>
        <Button
          onClick={() => filtrarLosCampos()}
          className="bg-[#042354] hover:bg-[#001e44] text-white"
        >
          Aplicar filtros
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

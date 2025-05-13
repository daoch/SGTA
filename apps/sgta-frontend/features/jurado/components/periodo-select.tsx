"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface PeriodoSelectProps {
  periodo: string | null;
  setPeriodo: (value: string) => void;
  ciclos: { id: number; semestre: string; anio: number }[];
}

export const PeriodoSelect: React.FC<PeriodoSelectProps> = ({
  periodo,
  setPeriodo,
  ciclos,
}) => {
  const handleChange = (value: string) => {
    setPeriodo(value);
    console.log("ID del ciclo seleccionado:", value);
  };

  return (
    <div className="flex flex-col space-y-1">
      <Label htmlFor="periodo">Periodo</Label>
      <Select
        value={periodo ?? ""}
        onValueChange={handleChange}
        disabled={ciclos.length === 0}
      >
        <SelectTrigger id="periodo" className="w-[150px]">
          <SelectValue placeholder="Selecciona un periodo" />
        </SelectTrigger>
        <SelectContent>
          {ciclos.map((ciclo) => (
            <SelectItem key={ciclo.id} value={String(ciclo.id)}>
              {ciclo.anio} - {ciclo.semestre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

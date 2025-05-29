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

interface CursoSelectProps {
  curso: string | null;
  setCurso: (value: string) => void;
  cursos: { id: number; nombre: string }[];
}

export const CursoSelect: React.FC<CursoSelectProps> = ({
  curso,
  setCurso,
  cursos,
}) => {
  const handleChange = (value: string) => {
    setCurso(value);
    console.log("ID del curso seleccionado:", value);
  };

  return (
    <div className="flex flex-col space-y-1">
      <Label htmlFor="curso">Curso</Label>
      <Select
        value={curso ?? ""}
        onValueChange={handleChange}
        disabled={cursos.length === 0}
      >
        <SelectTrigger id="curso" className="w-[250px]">
          <SelectValue placeholder="Selecciona un curso" />
        </SelectTrigger>
        <SelectContent>
          {cursos.map((cursoItem) => (
            <SelectItem key={cursoItem.id} value={String(cursoItem.id)}>
              {cursoItem.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

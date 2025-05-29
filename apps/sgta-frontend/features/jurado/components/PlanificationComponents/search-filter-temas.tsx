"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { AreaEspecialidad } from "@/features/jurado/types/jurado.types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FilterForm = {
  query: string;
  especialidad: string;
};

interface Props {
  areasEspecialidad: AreaEspecialidad[];
}

const SearchFilterTemas: React.FC<Props> = ({ areasEspecialidad }) => {
  const { register, setValue, watch } = useFormContext<FilterForm>();
  const especialidad = watch("especialidad");

  return (
    <div className="flex gap-4 justify-between">
      {/* Campo de búsqueda */}
      <div>
        <Label>Buscar</Label>
        <Input
          className="mt-1"
          placeholder={"Nombre del docente o código de tesis"}
          {...register("query")}
        />
      </div>

      {/* Selector de especialidad */}
      <div>
        <Label>Especialidad</Label>
        <Select
          value={especialidad || "__all__"}
          onValueChange={(val) => setValue("especialidad", val)}
        >
          <SelectTrigger className="mt-1 min-w-40">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas</SelectItem>
            {areasEspecialidad.map((a) => (
              <SelectItem key={a.id} value={a.nombre}>
                {a.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default React.memo(SearchFilterTemas);

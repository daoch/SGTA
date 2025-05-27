"use client";
import { useState } from "react";
import { AreaEspecialidad } from "../../types/jurado.types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  topics: AreaEspecialidad[];
}

const SearchFilter: React.FC<Props> = ({ topics }) => {
  const placeholder = "Nombre del docente o código de tesis";
  const [selectedEspecialidad, setSelectedEspecialidad] = useState<string>("");

  function handleSearch(term: string) {
    // lógica de búsqueda aquí
  }

  return (
    <div className="flex gap-4 justify-between">
      <div>
        <Label>Buscar</Label>
        <Input
          className="mt-1"
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
      </div>
      <div>
        <Label>Especialidad</Label>
        <Select
          value={selectedEspecialidad || "__all__"}
          onValueChange={(val) =>
            setSelectedEspecialidad(val === "__all__" ? "" : val)
          }
        >
          <SelectTrigger className="mt-1 min-w-40">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas</SelectItem>
            {topics.map((top) => (
              <SelectItem key={top.nombre} value={top.nombre}>
                {top.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchFilter;

"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import { AreaEspecialidad } from "../../types/jurado.types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  topics: AreaEspecialidad[];
}

const SearchFilter: React.FC<Props> = ({ topics }) => {
  const placeholder = "Inombre del docente o codigo de tesis";
  const [selectedEspecialidad, _] = useState("Todos");

  function handleSearch(term: string) {}

  return (
    <div className="flex gap-4">
      <div>
        <Label>Buscar</Label>
        <Input
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
      </div>
      <div>
        <Label>Filtros</Label>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>{selectedEspecialidad}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {topics.map((top: AreaEspecialidad) => (
              <DropdownMenuItem key={top.nombre}>{top.nombre}</DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SearchFilter;

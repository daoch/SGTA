"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaTematica,
  TemaInteres,
} from "@/features/asesores/types/perfil/entidades";
import { X } from "lucide-react";

interface Filters {
  areasTematicas: AreaTematica[];
  temasInteres: TemaInteres[];
  soloDisponible: boolean;
}

interface Props {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export default function FiltrosAplicados({ filters, setFilters }: Props) {
  const mostrar =
    filters.areasTematicas.length > 0 ||
    filters.temasInteres.length > 0 ||
    filters.soloDisponible;

  if (!mostrar) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <div className="text-sm text-muted-foreground mr-2 pt-0.5">
        Filtros aplicados:
      </div>

      {filters.areasTematicas.map((area) => (
        <Badge key={area.idArea} variant="secondary" className="gap-1">
          {area.nombre}
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                areasTematicas: prev.areasTematicas.filter((a) => a !== area),
              }))
            }
            className="ml-1 rounded-full hover:bg-muted"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Eliminar</span>
          </button>
        </Badge>
      ))}

      {filters.temasInteres.map((tema) => (
        <Badge key={tema.idTema} variant="secondary" className="gap-1">
          {tema.nombre}
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                temasInteres: prev.temasInteres.filter((t) => t !== tema),
              }))
            }
            className="ml-1 rounded-full hover:bg-muted"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Eliminar</span>
          </button>
        </Badge>
      ))}

      {filters.soloDisponible && (
        <Badge variant="secondary" className="gap-1">
          Solo disponibles
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                soloDisponible: false,
              }))
            }
            className="ml-1 rounded-full hover:bg-muted"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Eliminar</span>
          </button>
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs"
        onClick={() =>
          setFilters({
            areasTematicas: [],
            temasInteres: [],
            soloDisponible: false,
          })
        }
      >
        Limpiar todos
      </Button>
    </div>
  );
}

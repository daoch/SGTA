"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  AreaTematica,
  TemaInteres,
} from "@/features/asesores/types/perfil/entidades";
import { Check, Filter, X } from "lucide-react";
import { useMemo, useState } from "react";

interface SearchFilters {
  areasTematicas: AreaTematica[];
  temasInteres: TemaInteres[];
  soloDisponible: boolean;
}

interface FiltrosSheetProps {
  appliedFiltersCount: number;
  tempFilters: SearchFilters;
  isFilterOpen: boolean;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTempFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  allAreaTematica: AreaTematica[];
  allTemasInteres: TemaInteres[];
  applyFilters: () => void;
  cancelFilters: () => void;
  clearFilters: () => void;
}

export default function FiltrosAsesoresSheet({
  appliedFiltersCount,
  tempFilters,
  isFilterOpen,
  setIsFilterOpen,
  setTempFilters,
  allAreaTematica,
  allTemasInteres,
  applyFilters,
  cancelFilters,
  clearFilters,
}: FiltrosSheetProps) {
  const [thematicAreaSearch, setThematicAreaSearch] = useState("");
  const [interestAreaSearch, setInterestAreaSearch] = useState("");

  const filteredThematicAreas = useMemo(() => {
    return thematicAreaSearch.trim()
      ? allAreaTematica.filter((area) =>
          area.nombre.toLowerCase().includes(thematicAreaSearch.toLowerCase()),
        )
      : allAreaTematica;
  }, [thematicAreaSearch, allAreaTematica]);

  const filteredInterestAreas = useMemo(() => {
    return interestAreaSearch.trim()
      ? allTemasInteres.filter((area) =>
          area.nombre.toLowerCase().includes(interestAreaSearch.toLowerCase()),
        )
      : allTemasInteres;
  }, [interestAreaSearch, allTemasInteres]);

  const toggleThematicArea = (area: AreaTematica) => {
    setTempFilters((prev) => {
      const alreadySelected = prev.areasTematicas.some(
        (a) => a.idArea === area.idArea,
      );

      return {
        ...prev,
        areasTematicas: alreadySelected
          ? prev.areasTematicas.filter((a) => a.idArea !== area.idArea)
          : [...prev.areasTematicas, area],
      };
    });
  };

  const toggleInterestArea = (area: TemaInteres) => {
    setTempFilters((prev) => {
      const alreadySelected = prev.temasInteres.some(
        (a) => a.idTema === area.idTema,
      );

      return {
        ...prev,
        temasInteres: alreadySelected
          ? prev.temasInteres.filter((a) => a.idTema !== area.idTema)
          : [...prev.temasInteres, area],
      };
    });
  };

  return (
    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
          {appliedFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 rounded-full">
              {appliedFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filtros de búsqueda</SheetTitle>
          <SheetDescription>
            Filtra asesores por áreas temáticas, temas de interés y
            disponibilidad.
          </SheetDescription>
        </SheetHeader>

        <div className="overflow-y-auto max-h-[calc(100vh-200px)] px-6 py-6 space-y-6">
          {/* Filtro de áreas temáticas */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Áreas Temáticas</h3>
            <div className="space-y-2">
              <Input
                placeholder="Buscar área temática..."
                value={thematicAreaSearch}
                onChange={(e) => setThematicAreaSearch(e.target.value)}
              />
              {filteredThematicAreas.length > 0 && (
                <div className="border rounded-lg p-2 max-h-40 overflow-y-auto">
                  {filteredThematicAreas.map((area) => (
                    <div
                      key={area.idArea}
                      className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                      onClick={() => toggleThematicArea(area)}
                    >
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                          tempFilters.areasTematicas.some(
                            (a) => a.idArea === area.idArea,
                          )
                            ? "bg-primary border-primary"
                            : "border-input"
                        }`}
                      >
                        {tempFilters.areasTematicas.some(
                          (a) => a.idArea === area.idArea,
                        ) && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <span className="text-sm">{area.nombre}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {tempFilters.areasTematicas.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tempFilters.areasTematicas.map((area) => (
                  <Badge
                    key={area.idArea}
                    variant="secondary"
                    className="gap-1"
                  >
                    {area.nombre}
                    <button
                      onClick={() => toggleThematicArea(area)}
                      className="ml-1 rounded-full hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Eliminar</span>
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Filtro de temas de interés */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Temas de Interés</h3>
            <div className="space-y-2">
              <Input
                placeholder="Buscar tema de interés..."
                value={interestAreaSearch}
                onChange={(e) => setInterestAreaSearch(e.target.value)}
              />
              {filteredInterestAreas.length > 0 && (
                <div className="border rounded-lg p-2 max-h-40 overflow-y-auto">
                  {filteredInterestAreas.map((area) => (
                    <div
                      key={area.idTema}
                      className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                      onClick={() => toggleInterestArea(area)}
                    >
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                          tempFilters.temasInteres.includes(area)
                            ? "bg-primary border-primary"
                            : "border-input"
                        }`}
                      >
                        {tempFilters.temasInteres.includes(area) && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <span className="text-sm">{area.nombre}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {tempFilters.temasInteres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tempFilters.temasInteres.map((area) => (
                  <Badge
                    key={area.idTema}
                    variant="secondary"
                    className="gap-1"
                  >
                    {area.nombre}
                    <button
                      onClick={() => toggleInterestArea(area)}
                      className="ml-1 rounded-full hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Eliminar</span>
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Filtro de disponibilidad */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="available">Solo asesores disponibles</Label>
              <p className="text-sm text-muted-foreground">
                Mostrar únicamente asesores que están disponibles para asesorar
              </p>
            </div>
            <Switch
              id="available"
              className="ml-4 cursor-pointer"
              checked={tempFilters.soloDisponible}
              onCheckedChange={(checked) =>
                setTempFilters((prev) => ({
                  ...prev,
                  soloDisponible: checked,
                }))
              }
            />
          </div>
        </div>

        <SheetFooter className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2 ml-auto sm:order-2">
            <Button variant="outline" onClick={cancelFilters}>
              Cancelar
            </Button>
            <Button onClick={applyFilters}>Aplicar</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

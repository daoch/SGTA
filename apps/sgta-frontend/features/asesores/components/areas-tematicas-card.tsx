import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import type { AreaTematica } from "../types/perfil/entidades";

interface Props {
  isEditing: boolean;
  editedAreas: AreaTematica[];
  areasFiltered: AreaTematica[];
  selectedArea: AreaTematica | null;
  openAreaCombobox: boolean;
  recentlyAddedArea: number | null;
  setSelectedArea: (area: AreaTematica | null) => void;
  setOpenAreaCombobox: (open: boolean) => void;
  addAreaTematica: (area: AreaTematica) => void;
  initiateAreaDelete: (area: AreaTematica) => void;
}

export default function AreasTematicasCard({
  isEditing,
  editedAreas,
  areasFiltered,
  selectedArea,
  openAreaCombobox,
  recentlyAddedArea,
  setSelectedArea,
  setOpenAreaCombobox,
  addAreaTematica,
  initiateAreaDelete,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Áreas Temáticas</h3>

      {isEditing ? (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-wrap gap-2">
            {editedAreas.map((area) => (
              <div
                key={area.idArea}
                className={`flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm
                  ${
                    recentlyAddedArea === area.idArea
                      ? "bg-yellow-100 text-yellow-800 animate-pulse"
                      : "bg-green-100 text-green-800"
                  }`}
              >
                <span>{area.nombre}</span>
                <button
                  onClick={() => initiateAreaDelete(area)}
                  className="ml-1 sm:ml-2 text-green-800 hover:text-green-950"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Popover open={openAreaCombobox} onOpenChange={setOpenAreaCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openAreaCombobox}
                  className="flex-1 justify-between"
                >
                  {selectedArea
                    ? selectedArea.nombre
                    : "Seleccionar área temática..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Buscar área temática..." />
                  <CommandList>
                    <CommandEmpty>
                      No se encontraron áreas temáticas.
                    </CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-auto">
                      {areasFiltered.map((area) => (
                        <CommandItem
                          key={area.idArea}
                          value={area.nombre}
                          onSelect={() => {
                            setSelectedArea(
                              selectedArea?.idArea === area.idArea
                                ? null
                                : area,
                            );
                            setOpenAreaCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedArea?.idArea === area.idArea
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {area.nombre}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              onClick={() => {
                if (selectedArea) {
                  addAreaTematica(selectedArea);
                  setSelectedArea(null);
                }
              }}
              variant="outline"
              size="icon"
              disabled={!selectedArea}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {areasFiltered.length === 0 && (
            <p className="text-xs text-amber-600">
              Ya has agregado todas las áreas temáticas disponibles.
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {editedAreas?.length ? (
            editedAreas.map((area) => (
              <Badge
                key={area.idArea}
                variant="outline"
                className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200 text-xs sm:text-sm"
              >
                {area.nombre}
              </Badge>
            ))
          ) : (
            <span className="text-gray-500 text-sm">Sin áreas registradas</span>
          )}
        </div>
      )}
    </div>
  );
}

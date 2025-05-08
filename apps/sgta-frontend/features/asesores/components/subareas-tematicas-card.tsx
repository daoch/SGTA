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
import type { AreaTematica, TemaInteres } from "../types/perfil/entidades";

interface Props {
  isEditing: boolean;
  temasInteres: TemaInteres[];
  temasFiltered: TemaInteres[];
  selectedTema: TemaInteres | null;
  openTemaCombobox: boolean;
  editedAreasTematicas: AreaTematica[];
  setSelectedTema: (tema: TemaInteres | null) => void;
  setOpenTemaCombobox: (open: boolean) => void;
  addTemaInteres: () => void;
  removeTemaInteres: (idTema: number) => void;
}

export default function TemasInteresCard({
  isEditing,
  temasInteres,
  temasFiltered,
  selectedTema,
  openTemaCombobox,
  editedAreasTematicas,
  setSelectedTema,
  setOpenTemaCombobox,
  addTemaInteres,
  removeTemaInteres,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Temas de Interés</h3>

      {isEditing ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {temasInteres.map((tema) => (
              <div
                key={tema.idTema}
                className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
              >
                <span>{tema.nombre}</span>
                <button
                  onClick={() => removeTemaInteres(tema.idTema)}
                  className="ml-2 text-purple-800 hover:text-purple-950"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Popover open={openTemaCombobox} onOpenChange={setOpenTemaCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openTemaCombobox}
                  className="flex-1 justify-between"
                >
                  {selectedTema
                    ? selectedTema.nombre
                    : "Seleccionar tema de interés..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Buscar tema de interés..." />
                  <CommandList>
                    <CommandEmpty>
                      No se encontraron temas de interés.
                    </CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-auto">
                      {temasFiltered.map((tema) => {
                        const areaYaSeleccionada = editedAreasTematicas.some(
                          (a) => a.idArea === tema.area.idArea,
                        );

                        return (
                          <CommandItem
                            key={tema.idTema}
                            value={tema.nombre}
                            onSelect={() => {
                              setSelectedTema(
                                selectedTema?.idTema === tema.idTema
                                  ? null
                                  : tema,
                              );
                              setOpenTemaCombobox(false);
                            }}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedTema?.idTema === tema.idTema
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              <span>{tema.nombre}</span>
                            </div>
                            {!areaYaSeleccionada && (
                              <Badge
                                variant="outline"
                                className="ml-2 bg-yellow-100 text-yellow-800 text-xs"
                              >
                                + {tema.area.nombre}
                              </Badge>
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              onClick={addTemaInteres}
              variant="outline"
              size="icon"
              disabled={!selectedTema}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {temasFiltered.length === 0 && (
            <p className="text-xs text-amber-600">
              Ya has agregado todos los temas de interés disponibles.
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {temasInteres?.length ? (
            temasInteres.map((tema) => (
              <Badge
                key={tema.idTema}
                variant="outline"
                className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200"
              >
                {tema.nombre}
              </Badge>
            ))
          ) : (
            <span className="text-gray-500">Sin temas registrados</span>
          )}
        </div>
      )}
    </div>
  );
}

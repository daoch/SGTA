import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AreaDeInvestigacion,
  Coasesor,
} from "@/features/temas/types/inscripcion/entities";

type Item = Coasesor | AreaDeInvestigacion;

/**
 * Renderiza un selector combobox y un botón para agregar elementos a una lista visual.
 */
interface ItemSelectorProps {
  label: string;
  itemsDisponibles: Item[];
  itemsSeleccionados: Item[] | null;
  itemKey: string; // Propiedad única (ej: 'codigoPucp' o 'id')
  itemLabel: string; // Propiedad que se muestra (ej: 'nombres' o 'nombreSubarea')
  selectedItem: Item | null;
  onSelectItem: (value: string) => void;
  onAgregarItem: () => void;
  onEliminarItem: (id: number) => void;
  placeholder?: string;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({
  label,
  itemsDisponibles,
  itemsSeleccionados,
  itemKey,
  itemLabel,
  selectedItem,
  onSelectItem,
  onAgregarItem,
  onEliminarItem,
  placeholder = "Seleccione una opción",
}) => {
  /**
   * Se obtiene el Valor a mostrar en el selector, tipicamente, un string.
   */
  const selectedItemValue = selectedItem
    ? String(selectedItem[itemLabel as keyof Item])
    : "";

  /**
   * Se obtiene la lista de Items a mostrar, se realiza un filtro para remover los items que ya han sido seleccionados
   */
  const itemsAMostrar = itemsDisponibles.filter(
    (item) =>
      itemsSeleccionados &&
      !itemsSeleccionados.some(
        (selected) =>
          selected[itemKey as keyof Item] === item[itemKey as keyof Item],
      ),
  );
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Select value={selectedItemValue} onValueChange={onSelectItem}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {itemsAMostrar.map((item) => (
              <SelectItem
                key={item.id}
                value={String(item[itemLabel as keyof Item])}
              >
                {item[itemKey as keyof Item]}: {item[itemLabel as keyof Item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={onAgregarItem}>
          Agregar
        </Button>
      </div>

      {/* Lista de elementos seleccionados */}
      <div className="flex flex-wrap gap-2 mt-2">
        {itemsSeleccionados &&
          itemsSeleccionados.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full"
            >
              <span>{item[itemLabel as keyof Item]}</span>
              <button
                className="ml-2 text-white hover:text-gray-200"
                onClick={() => onEliminarItem(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ItemSelector;


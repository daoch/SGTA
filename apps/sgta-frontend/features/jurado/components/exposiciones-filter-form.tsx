import { FC } from "react";
import { Controller, Control } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Filtros } from "../hooks/use-exposicion-filters-form";
import { FilterOption } from "../hooks/use-fetch-exposicion-filters";

interface FilterFormProps {
  control: Control<Filtros>;
  etapasFormativas: FilterOption[];
  ciclos: FilterOption[];
  estados: FilterOption[];
}
export const ExposicionesFilterForm: FC<FilterFormProps> = ({
  control,
  etapasFormativas,
  ciclos,
  estados,
}) => (
  <form className="flex gap-4 w-full">
    {[
      {
        name: "etapaFormativa",
        options: etapasFormativas,
        placeholder: "Etapa Formativa",
      },
      { name: "ciclo", options: ciclos, placeholder: "Ciclo" },
      { name: "estado", options: estados, placeholder: "Estado" },
    ].map(({ name, options, placeholder }) => (
      <div key={name} className="flex flex-col">
        <Label htmlFor={name}>{placeholder}</Label>
        <Controller
          name={name as keyof Filtros}
          control={control}
          render={({ field: { value, onChange } }) => (
            <Select
              value={value || "__all__"}
              onValueChange={(val) => onChange(val === "__all__" ? "" : val)}
            >
              <SelectTrigger id={name} className="mt-1 min-w-50">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todas</SelectItem>
                {options.map((opt) => (
                  <SelectItem
                    key={opt.value.toString()}
                    value={opt.value.toString()}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
    ))}
  </form>
);

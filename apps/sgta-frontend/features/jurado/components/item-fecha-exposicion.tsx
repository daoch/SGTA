import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Controller, UseFormSetValue } from "react-hook-form";
import { FormValues } from "./modal-planificador-coordinador";

interface ExposicionFechaItemProps {
  control: any;
  index: number;
  remove: (index: number) => void;
  setValue: UseFormSetValue<FormValues>;
  isFechasDisabled: boolean;
}

export function ItemFechaExposicion({
  control,
  index,
  remove,
  setValue,
  isFechasDisabled,
}: ExposicionFechaItemProps) {
  return (
    <div className="flex gap-2 justify-between items-end">
      <div className="min-w-[250px]">
        <Label className="text-xs font-medium">Fecha de Exposición</Label>
        <Controller
          name={`fechas.${index}.fecha`}
          control={control}
          render={({ field: dateField }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateField.value && "text-muted-foreground",
                  )}
                  disabled={isFechasDisabled}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateField.value ? (
                    format(dateField.value, "PPP")
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateField.value}
                  onSelect={(date) => setValue(`fechas.${index}.fecha`, date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </div>

      {/* Hora Inicio */}
      <div className="w-[120px]">
        <Label className="text-xs font-medium">Hora Inicio</Label>
        <Controller
          name={`fechas.${index}.horaInicio`}
          control={control}
          render={({ field }) => (
            <Input {...field} type="time" disabled={isFechasDisabled} />
          )}
        />
      </div>

      {/* Hora Fin */}
      <div className="w-[120px]">
        <Label className="text-xs font-medium">Hora Fin</Label>
        <Controller
          name={`fechas.${index}.horaFin`}
          control={control}
          render={({ field }) => (
            <Input {...field} type="time" disabled={isFechasDisabled} />
          )}
        />
      </div>

      {/* Salas Seleccionadas */}
      <div>
        <Label className="text-xs font-medium">Salas Habilitadas</Label>
        <Controller
          name={`fechas.${index}.salasSeleccionadas`}
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isFechasDisabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 sala seleccionada">
                  1 sala seleccionada
                </SelectItem>
                <SelectItem value="2 salas seleccionadas">
                  2 salas seleccionadas
                </SelectItem>
                <SelectItem value="3 salas seleccionadas">
                  3 salas seleccionadas
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="h-5 w-5 text-white"
          onClick={() => remove(index)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

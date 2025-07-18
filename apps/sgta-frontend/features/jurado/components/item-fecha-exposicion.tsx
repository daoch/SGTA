"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectContent, SelectTrigger } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Select } from "@radix-ui/react-select";
import { format, startOfTomorrow } from "date-fns";
import { CalendarIcon, Check, X } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

interface ItemFechaExposicionProps {
  index: number;
  remove: (index: number) => void;
  isFechasDisabled: boolean;
  salasDisponibles: { id: number; nombre: string }[];
  isSubmitting?: boolean;
}

export function ItemFechaExposicion({
  index,
  remove,
  isFechasDisabled,
  salasDisponibles,
  isSubmitting = false,
}: ItemFechaExposicionProps) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const isDisabled = isFechasDisabled || isSubmitting;

  interface FechaError {
    fecha?: { message: string };
    hora_inicio?: { message: string };
    hora_fin?: { message: string };
    salas?: { message: string };
  }

  const fechaErrors =
    (errors?.fechas as Record<number, FechaError> | undefined)?.[index] || {};

  return (
    <div className="flex gap-2 justify-between items-end">
      {/* Fecha */}
      <div className="min-w-[250px]">
        <Label className="text-xs font-medium">Fecha de Exposición</Label>
        <Controller
          name={`fechas.${index}.fecha`}
          control={control}
          render={({ field: dateField }) => (
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateField.value && "text-muted-foreground",
                  )}
                  disabled={isDisabled}
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
                  disabled={(date) => date < startOfTomorrow()}
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {fechaErrors?.fecha && (
          <p className="text-red-500 text-xs mt-1">
            {fechaErrors.fecha.message as string}
          </p>
        )}
      </div>

      {/* Hora Inicio */}
      <div className="w-[120px]">
        <Label className="text-xs font-medium">Hora Inicio</Label>
        <Controller
          name={`fechas.${index}.hora_inicio`}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="time"
              disabled={isDisabled}
              value={field.value ?? ""}
            />
          )}
        />
        {fechaErrors?.hora_inicio && (
          <p className="text-red-500 text-xs mt-1">
            {fechaErrors.hora_inicio.message as string}
          </p>
        )}
      </div>

      {/* Hora Fin */}
      <div className="w-[120px]">
        <Label className="text-xs font-medium">Hora Fin</Label>
        <Controller
          name={`fechas.${index}.hora_fin`}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="time"
              disabled={isDisabled}
              value={field.value ?? ""}
            />
          )}
        />
        {fechaErrors?.hora_fin && (
          <p className="text-red-500 text-xs mt-1">
            {fechaErrors.hora_fin.message as string}
          </p>
        )}
      </div>

      <div>
        <Label className="text-xs font-medium">Salas Habilitadas</Label>
        <Controller
          name={`fechas.${index}.salas`}
          control={control}
          render={({ field }) => (
            <Select open={undefined} disabled={isDisabled}>
              <SelectTrigger>
                {/* Render personalizado directamente */}
                <div className="truncate">
                  {field.value.length > 0 ? (
                    `${field.value.length} sala(s) seleccionada(s)`
                  ) : (
                    <span className="text-muted-foreground">
                      Selecciona las salas
                    </span>
                  )}
                </div>
              </SelectTrigger>

              <SelectContent>
                {salasDisponibles.map((sala) => {
                  const isChecked = field.value.includes(sala.id);

                  return (
                    <div
                      key={sala.id}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent rounded",
                        isDisabled && "pointer-events-none opacity-50",
                      )}
                      onClick={(e) => {
                        if (isDisabled) return;
                        e.preventDefault();
                        if (isChecked) {
                          field.onChange(
                            field.value.filter((id: number) => id !== sala.id),
                          );
                        } else {
                          field.onChange([...field.value, sala.id]);
                        }
                      }}
                    >
                      <span>{sala.nombre}</span>
                      {isChecked && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        />
        {fechaErrors?.salas && (
          <p className="text-red-500 text-xs mt-1">
            {fechaErrors.salas.message as string}
          </p>
        )}
      </div>

      {/* Botón eliminar */}
      <div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className={cn(
            "h-5 w-5 text-white",
            isSubmitting && "opacity-50 pointer-events-none",
          )}
          onClick={() => {
            if (isSubmitting) return;
            remove(index);
          }}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

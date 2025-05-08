"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, X, PlusIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios/axios-instance";
import { Input } from "@/components/ui/input";
import { ItemFechaExposicion } from "./item-fecha-exposicion";

interface FechaExposicion {
  fecha: Date | undefined;
  horaInicio: string;
  horaFin: string;
  salasSeleccionadas: string;
}

export interface FormValues {
  curso: string;
  tipoExposicion: string;
  fechas: FechaExposicion[];
}

interface CursoOption {
  etapaFormativaId: string;
  nombre: string;
}

interface TipoExposicionOption {
  id: number;
  nombre: string;
}

interface ModalPlanificadorCoordinadorProps {
  open: boolean;
  onClose: () => void;
}

export default function ModalPlanificadorCoordinador({
  open,
  onClose,
}: ModalPlanificadorCoordinadorProps) {
  const { control, handleSubmit, watch, reset, setValue } = useForm<FormValues>(
    {
      defaultValues: {
        curso: "",
        tipoExposicion: "",
        fechas: [],
      },
    },
  );

  const [cursos, setCursos] = React.useState<CursoOption[]>([]);
  const [tiposExposicion, setTiposExposicion] = React.useState<
    TipoExposicionOption[]
  >([]);

  const cursoSeleccionado = watch("curso");
  const tipoSeleccionado = watch("tipoExposicion");
  const fechas = watch("fechas");

  React.useEffect(() => {
    if (open) {
      reset({
        curso: "",
        tipoExposicion: "",
        fechas: [],
      });

      axiosInstance
        .get("/etapas-formativas/coordinador/3")
        .then((res) => setCursos(res.data))
        .catch((err) => console.error("Error fetching cursos:", err));
    }
  }, [open, reset]);

  React.useEffect(() => {
    if (cursoSeleccionado) {
      axiosInstance
        .get(
          `/exposicion/listarExposicionXCicloActualEtapaFormativa?etapaFormativaId=${cursoSeleccionado}`,
        )
        .then((res) => {
          setTiposExposicion(res.data);
        })
        .catch((err) => {
          console.error("Error fetching tipos de exposicion:", err);
          setTiposExposicion([]);
        });
    } else {
      setTiposExposicion([]);
    }
  }, [cursoSeleccionado]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fechas",
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    onClose();
  };

  const isTipoExposicionDisabled =
    !cursoSeleccionado || tiposExposicion.length === 0;
  const isFechasDisabled = !tipoSeleccionado || isTipoExposicionDisabled;

  const canAddMoreFechas = fechas.every(
    (f) =>
      f.fecha !== undefined &&
      f.horaInicio.trim() !== "" &&
      f.horaFin.trim() !== "" &&
      f.salasSeleccionadas.trim() !== "",
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="md:min-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Registro de Fecha y Rango de Horarios de Exposiciones
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-2">
            Al ser la primera vez que se está planificando el curso en el
            periodo vigente, debe registrar las fechas y los rangos en que se
            realizarán las exposiciones.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Curso</Label>
            <Controller
              name="curso"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {cursos.map((curso) => (
                      <SelectItem
                        key={curso.etapaFormativaId}
                        value={curso.etapaFormativaId}
                      >
                        {curso.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de Exposición</Label>
            <Controller
              name="tipoExposicion"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isTipoExposicionDisabled}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposExposicion.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.nombre}>
                        {tipo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <ItemFechaExposicion
                key={field.id}
                control={control}
                index={index}
                remove={remove}
                setValue={setValue}
                isFechasDisabled={isFechasDisabled}
              />
            ))}
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              append({
                fecha: undefined,
                horaInicio: "17:00",
                horaFin: "20:30",
                salasSeleccionadas: "2 salas seleccionadas",
              })
            }
            disabled={isFechasDisabled || !canAddMoreFechas}
          >
            <PlusIcon /> Agregar Fecha de Exposición
          </Button>

          <DialogFooter className="flex justify-between sm:justify-between gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSubmit(onSubmit)}>
              Continuar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
import { Input } from "@/components/ui/input";
import { X, Calendar, PlusIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

interface FechaExposicion {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  salasSeleccionadas: string;
}

interface FormValues {
  curso: string;
  tipoExposicion: string;
  fechas: FechaExposicion[];
}

interface ModalPlanificadorCoordinadorProps {
  open: boolean;
  onClose: () => void;
}

export default function ModalPlanificadorCoordinador({
  open,
  onClose,
}: ModalPlanificadorCoordinadorProps) {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      curso: "Proyecto de Fin de Carrera 1",
      tipoExposicion: "Final",
      fechas: [
        {
          fecha: "05/06/2025",
          horaInicio: "17:00",
          horaFin: "20:30",
          salasSeleccionadas: "3 salas seleccionadas",
        },
        {
          fecha: "12/06/2025",
          horaInicio: "17:00",
          horaFin: "20:30",
          salasSeleccionadas: "2 salas seleccionadas",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fechas",
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    onClose();
  };

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
                    <SelectItem value="Proyecto de Fin de Carrera 1">
                      Proyecto de Fin de Carrera 1
                    </SelectItem>
                    <SelectItem value="Proyecto de Fin de Carrera 2">
                      Proyecto de Fin de Carrera 2
                    </SelectItem>
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Final">Final</SelectItem>
                    <SelectItem value="Parcial">Parcial</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex gap-2 justify-between items-end"
              >
                <div className="min-w-[150px]">
                  <Label className="text-xs font-medium">
                    Fecha de Exposición
                  </Label>
                  <Controller
                    name={`fechas.${index}.fecha`}
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <Input {...field} className="pl-10" type="text" />
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                      </div>
                    )}
                  />
                </div>

                <div className="w-[120px]">
                  <Label className="text-xs font-medium">Hora Inicio</Label>
                  <Controller
                    name={`fechas.${index}.horaInicio`}
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <Input {...field} className="pl-10" type="text" />
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                      </div>
                    )}
                  />
                </div>

                <div className="w-[120px]">
                  <Label className="text-xs font-medium">Hora Fin</Label>
                  <Controller
                    name={`fechas.${index}.horaFin`}
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <Input {...field} className="pl-10" type="text" />
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                      </div>
                    )}
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium">
                    Salas Habilitadas
                  </Label>
                  <Controller
                    name={`fechas.${index}.salasSeleccionadas`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
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
                    className="h-5 w-5 text-white "
                    onClick={() => remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              append({
                fecha: "",
                horaInicio: "17:00",
                horaFin: "20:30",
                salasSeleccionadas: "2 salas seleccionadas",
              })
            }
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

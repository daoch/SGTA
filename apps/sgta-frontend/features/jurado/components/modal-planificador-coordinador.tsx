"use client";

import * as React from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
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
import { PlusIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "../schemas/exposicion-form-schema";
import { ItemFechaExposicion } from "./item-fecha-exposicion";
import {
  enviarPlanificacion,
  getEtapasFormativasByCoordinador,
  getExposicionPorEtapaFormativa,
  getSalasDisponibles,
} from "../services/exposicion-service";
import {
  EtapaFormativa,
  ExposicionNombre,
  Sala,
} from "../types/exposicion.types";

interface ModalPlanificadorCoordinadorProps {
  open: boolean;
  onClose: () => void;
}

export default function ModalPlanificadorCoordinador({
  open,
  onClose,
}: ModalPlanificadorCoordinadorProps) {
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      etapa_formativa_id: undefined,
      exposicion_id: undefined,
      fechas: [],
    },
  });

  const { control, handleSubmit, watch, reset, setValue } = methods;

  const [cursos, setCursos] = React.useState<EtapaFormativa[]>([]);
  const [tiposExposicion, setTiposExposicion] = React.useState<
    ExposicionNombre[]
  >([]);

  const etapaFormativaId = watch("etapa_formativa_id");
  const exposicionId = watch("exposicion_id");
  const fechas = watch("fechas");

  const [salas, setSalas] = React.useState<Sala[]>([]);

  React.useEffect(() => {
    if (open) {
      reset({
        etapa_formativa_id: undefined,
        exposicion_id: undefined,
        fechas: [],
      });

      getEtapasFormativasByCoordinador(3).then(setCursos).catch(console.error);
      getSalasDisponibles().then(setSalas).catch(console.error);
    }
  }, [open, reset]);

  React.useEffect(() => {
    if (etapaFormativaId !== undefined) {
      getExposicionPorEtapaFormativa(etapaFormativaId)
        .then(setTiposExposicion)
        .catch((err) => {
          console.error("Error fetching tipos de exposición:", err);
          setTiposExposicion([]);
        });
    } else {
      setTiposExposicion([]);
    }
  }, [etapaFormativaId]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fechas",
  });

  const canAddMoreFechas = fechas.every(
    (f) =>
      f.fecha !== null &&
      f.hora_inicio.trim() !== "" &&
      f.hora_fin.trim() !== "" &&
      f.hora_inicio < f.hora_fin &&
      f.salas.length > 0,
  );

  const onSubmit = (data: FormValues) => {
    console.log("Datos enviados:", data);

    enviarPlanificacion(data)
      .then((res) => {
        console.log("Respuesta del servidor:", res);
        onClose();
      })
      .catch((err) => {
        console.error("Error al enviar datos:", err);
      });
  };

  return (
    <FormProvider {...methods}>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="md:min-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Registro de Fecha y Rango de Horarios de Exposiciones
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-2">
              Debe registrar las fechas, rangos horarios y salas habilitadas
              para las exposiciones.
            </p>
          </DialogHeader>

          <div className="space-y-4">
            {/* Selección de Curso */}
            <div className="space-y-2">
              <Label>Curso</Label>
              <Select
                onValueChange={(val) =>
                  setValue("etapa_formativa_id", Number(val))
                }
                value={
                  etapaFormativaId !== undefined
                    ? etapaFormativaId.toString()
                    : ""
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar curso" />
                </SelectTrigger>
                <SelectContent>
                  {cursos.map((curso) => (
                    <SelectItem
                      key={curso.etapaFormativaId}
                      value={curso.etapaFormativaId.toString()}
                    >
                      {curso.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selección de Tipo de Exposición */}
            <div className="space-y-2">
              <Label>Tipo de Exposición</Label>
              <Select
                onValueChange={(val) => setValue("exposicion_id", Number(val))}
                value={
                  exposicionId !== undefined ? exposicionId.toString() : ""
                }
                disabled={etapaFormativaId === undefined}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposExposicion.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lista de Fechas */}
            <div className="space-y-4">
              {fields.map((field, index) => (
                <ItemFechaExposicion
                  key={field.id}
                  index={index}
                  remove={remove}
                  isFechasDisabled={exposicionId === undefined}
                  salasDisponibles={salas}
                />
              ))}
            </div>

            {/* Botón Agregar Fecha */}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                append({
                  fecha: null,
                  hora_inicio: "17:00",
                  hora_fin: "20:30",
                  salas: [],
                })
              }
              disabled={!canAddMoreFechas || exposicionId === undefined}
            >
              <PlusIcon /> Agregar Fecha de Exposición
            </Button>

            <DialogFooter className="flex justify-between sm:justify-between gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={
                  !(
                    etapaFormativaId !== undefined &&
                    exposicionId !== undefined &&
                    fechas.length > 0 &&
                    fechas.every(
                      (f) =>
                        f.fecha !== null &&
                        f.hora_inicio.trim() !== "" &&
                        f.hora_fin.trim() !== "" &&
                        f.hora_inicio < f.hora_fin &&
                        f.salas.length > 0,
                    )
                  )
                }
              >
                Continuar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}

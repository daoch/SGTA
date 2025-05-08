import { z } from "zod";

export const formSchema = z.object({
  etapa_formativa_id: z.number({
    required_error: "Debe seleccionar un curso",
    invalid_type_error: "Debe seleccionar un curso válido",
  }),
  exposicion_id: z.number({
    required_error: "Debe seleccionar un tipo de exposición",
    invalid_type_error: "Debe seleccionar un tipo de exposición válido",
  }),
  fechas: z
    .array(
      z
        .object({
          fecha: z.date({ required_error: "La fecha es requerida" }).nullable(),
          hora_inicio: z.string().nonempty("La hora de inicio es requerida"),
          hora_fin: z.string().nonempty("La hora de fin es requerida"),
          salas: z
            .array(z.number())
            .min(1, "Debe seleccionar al menos una sala"),
        })
        .refine((data) => data.hora_inicio < data.hora_fin, {
          message: "La hora de fin debe ser posterior a la hora de inicio",
          path: ["hora_fin"],
        }),
    )
    .min(1, "Debe agregar al menos una fecha"),
});

export interface FormValues {
  etapa_formativa_id: number;
  exposicion_id: number;
  fechas: {
    fecha: Date | null;
    hora_inicio: string;
    hora_fin: string;
    salas: number[];
  }[];
}

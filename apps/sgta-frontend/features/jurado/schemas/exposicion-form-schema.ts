import { z } from "zod";
import { startOfTomorrow } from "date-fns";

// Utilidad: convierte "HH:mm" a minutos
const horaStringToMinutos = (hora: string): number => {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
};

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
          fecha: z
            .date({ required_error: "La fecha es requerida" })
            .nullable()
            .refine((date) => date === null || date >= startOfTomorrow(), {
              message: "La fecha debe ser a partir de mañana",
            }),
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
    .min(1, "Debe agregar al menos una fecha")
    .refine(
      (fechas) => {
        for (let i = 0; i < fechas.length; i++) {
          for (let j = i + 1; j < fechas.length; j++) {
            const a = fechas[i];
            const b = fechas[j];

            if (!a.fecha || !b.fecha) continue;

            const mismaFecha =
              a.fecha.toDateString() === b.fecha.toDateString();

            if (!mismaFecha) continue;

            const inicioA = horaStringToMinutos(a.hora_inicio);
            const finA = horaStringToMinutos(a.hora_fin);
            const inicioB = horaStringToMinutos(b.hora_inicio);
            const finB = horaStringToMinutos(b.hora_fin);

            const seSolapan = inicioA < finB && inicioB < finA;
            if (seSolapan) return false;
          }
        }
        return true;
      },
      {
        message: "Hay fechas con horarios que se solapan",
        path: ["fechas"],
      },
    ),
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

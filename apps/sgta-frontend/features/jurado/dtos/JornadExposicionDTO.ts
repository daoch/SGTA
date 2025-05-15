import { SalaExposicion } from "@/features/jurado/types/jurado.types";

export interface JornadaExposicionDTO {
    code: number;
    fecha: Date;
    horaInicio: string;
    horaFin: string;
    salasExposicion: SalaExposicion[];
  }
import { JornadaExposicionDTO } from "../dtos/JornadExposicionDTO";
import { JornadaExposicionSalas } from "../types/jurado.types";

export const transformarJornada = (
  data: JornadaExposicionSalas,
): JornadaExposicionDTO => {
  const fechaInicio = new Date(data.datetimeInicio);
  const fechaFin = new Date(data.datetimeFin);
  return {
    code: data.jornadaExposicionId, // O cualquier otro campo relevante
    fecha: fechaInicio, // Usamos `dateTimeInicio` como fecha
    horaInicio: fechaInicio.toTimeString().split(" ")[0], // Solo hora
    horaFin: fechaFin.toTimeString().split(" ")[0], // Solo hora
    salasExposicion: data.salasExposicion,
  };
};

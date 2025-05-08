export interface Exposicion {
  id?: string;
  titulo: string;
  etapa?: string;
  fechaInicio: string;
  fechaFin: string;
  fechas: string;
  descripcion: string;
  duracion: string;
  modalidad: "Virtual" | "Presencial";
  jurados: "Con jurados" | "Sin jurados";
}

type Miembro = {
  id_persona: number;
  nombre: string;
  tipo: "asesor" | "estudiante" | "jurado";
};

const ESTADOS = [
  "sin_programar",
  "esperando_respuesta",
  "esperando_aprobacion",
  "programada",
  "completada",
  "finalizada",
] as const;

export type ExposicionEstado = (typeof ESTADOS)[number];

export type Exposicion = {
  id_exposicion: number;
  fechaHora: Date;
  sala: string;
  estado: ExposicionEstado;
  titulo: string;
  miembros: Miembro[];
};

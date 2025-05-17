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
  id_etapa_formativa: number;
  titulo: string;
  miembros: Miembro[];
};

export type EtapaFormativa = {
  etapaFormativaId: number;
  nombre: string;
};

export type ExposicionSinInicializar = {
  exposicionId: number;
  nombre: string;
  inicializada: boolean;
};

export type Sala = {
  id: number;
  nombre: string;
};

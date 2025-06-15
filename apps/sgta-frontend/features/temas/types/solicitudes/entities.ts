import { Tema } from "../temas/entidades";
import { EstadoTemaNombre } from "../temas/enums";
import { TipoSolicitud } from "./enums";

export interface SolicitudPendiente {
  id: number;
  tipo: TipoSolicitud;
  titulo: string;
  tema: Tema;
  solicitante: Solicitante;
  fechaSolicitud: string; // formato ISO
  estado: EstadoTemaNombre;
}

export interface Solicitante {
  id: number;
  tipoSolicitante: string;
  codigoPucp: string;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  correoElectronico: string | null;
}

export interface TemasPages {
  pages: Record<number, Tema[]>; // [Page]: Tema[]
  current: number; // Current Page
  totalCounts: number;
}

export type PagesList = Partial<Record<EstadoTemaNombre, TemasPages>>;

export type SolicitudAction =
  | "Aprobada"
  | "Rechazada"
  | "Observada"
  | "Eliminada";

export type TypeSolicitud = "titulo" | "resumen" | "no-enviar";

export interface TemaSimilar {
  id: number;
  codigo: string;
  titulo: string;
  resumen: string;
  objetivos: string;
  metodologia: string;
  requisitos: string | null;
  portafolioUrl: string | null;
  activo: boolean;
  rechazado: boolean | null;
  fechaLimite: string | null; // formato ISO
  fechaFinalizacion: string | null; // formato ISO
  fechaCreacion: string; // formato ISO
  fechaModificacion: string; // formato ISO
  estadoTemaNombre: string;
  cantPostulaciones: number | null;
  porcentajeSimilitud: number | null;
  // carrera: any | null;
  // area: any | null;
  // subareas: any | null;
  // tesistas: any | null;
  // coasesores: any | null;
  // estadoUsuarioTema: any | null;
}


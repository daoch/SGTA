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

export type AccionSolicitud =
  | "SIN_ACCION"
  | "PENDIENTE_ACCION"
  | "APROBADO"
  | "RECHAZADO";

export type RolSolicitud = "DESTINATARIO" | "REMITENTE";

export type SolicitudState = "PENDIENTE" | "RECHAZADA" | "ACEPTADA";

export enum SolicitudType {
  APROBACION_TEMA = "Aprobación de tema (por coordinador)",
  CAMBIO_TITULO = "Solicitud de cambio de título",
  CAMBIO_RESUMEN = "Solicitud de cambio de resumen",
  CESE_ASESORIA = "Cese de asesoria (por alumno)",
}

export interface User {
  usuario_solicitud_id: number;
  usuario_id: number;
  nombres: string;
  primer_apellido: string;
  segundo_apellido: string;
  codigo: string;
  accion_solicitud: AccionSolicitud;
  rol_solicitud: RolSolicitud;
  comentario: string | null;
}

export interface SolicitudGeneral {
  solicitud_id: number;
  descripcion: string;
  tipo_solicitud: string;
  estado_solicitud: SolicitudState;
  tema_id: number;
  fecha_creacion: string; // formato ISO
  usuarios: User[];
}

export interface SolicitudTema {
  solicitud_id: number;
  descripcion: string;
  tipo_solicitud: string;
  estado_solicitud: SolicitudState;
  usuarios: User[];
}


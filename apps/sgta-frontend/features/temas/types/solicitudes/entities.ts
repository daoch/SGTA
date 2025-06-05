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
  pages: Record<number, Tema[]>;
  current: number;
  totalCounts: number;
}

export type PagesList = Record<string, TemasPages>;


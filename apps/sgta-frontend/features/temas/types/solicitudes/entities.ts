import { Tema } from "../temas/entidades";
import { EstadoSolicitud, TipoSolicitud } from "./enums";

export interface SolicitudPendiente {
  id: number;
  tipo: TipoSolicitud;
  titulo: string;
  tema: Tema;
  solicitante: Solicitante;
  fechaSolicitud: string; // formato ISO
  estado: EstadoSolicitud;
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


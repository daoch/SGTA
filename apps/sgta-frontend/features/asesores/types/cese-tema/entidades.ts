import { UsuarioSolicitud } from "../cambio-asesor/entidades";

export interface SolicitudCeseTemaResumen {
  solicitudId: number;
  fechaEnvio: string | Date;
  estadoGlobal: string;
  estadoAccion: string;
  temaId: number;
  temaTitulo: string;
  nombreSolicitante: string;
  correoSolicitante: string;
  nombreAsesorActual: string;
}

export interface DetalleSolicitudCeseTema {
  solicitudId: number;
  fechaEnvio: string | Date;
  estadoGlobal: string;
  motivoEstudiante: string;
  temaId: number;
  temaTitulo: string;
  solicitante: UsuarioSolicitud;
  asesorActual: UsuarioSolicitud;
  coordinador: UsuarioSolicitud;
  fechaResolucion: string | Date | null;
}

export interface SolicitudCeseTemaRegistro {
  solicitudId?: number;
  creadorId: number;
  temaId: number;
  estadoTema: string;
  motivo: string;
}

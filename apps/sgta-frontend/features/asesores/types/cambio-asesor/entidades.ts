export interface SolicitudCambioAsesorResumen {
  solicitudId: number;
  fechaEnvio: string | Date;
  estadoGlobal: string;
  estadoAccion: string;
  tema: number;
  temaTitulo: string;
  nombreSolicitante: string;
  correoSolicitante: string;
  nombreAsesorActual: string;
  nombreAsesorNuevo: string;
}

export interface UsuarioSolicitud {
  id: number;
  nombres: string;
  correoElectronico: string;
  rolSolicitud: string;
  foto: string | null;
  accionSolicitud: string;
  fechaAccion: string | Date | null;
  comentario: string | null;
}

export interface DetalleSolicitudCambioAsesor {
  solicitudId: number;
  fechaEnvio: string | Date;
  estadoGlobal: string;
  motivoEstudiante: string;
  temaId: number;
  temaTitulo: string;
  solicitante: UsuarioSolicitud;
  asesorActual: UsuarioSolicitud;
  asesorNuevo: UsuarioSolicitud;
  coordinador: UsuarioSolicitud;
  fechaResolucion: string | Date | null;
}

export interface SolicidudRegistro {
  solicitudId?: number;
  alumnoId: number;
  temaId: number;
  asesorActualId: number;
  nuevoAsesorId: number;
  motivo: string;
}

export interface TemaActual {
  id: number;
  titulo: string;
  areas?: string;
}

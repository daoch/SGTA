export interface UsuarioXReunionDto {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  reunionId: number;
  reunionTitulo: string;
  reunionFechaHoraInicio: string; 
  reunionFechaHoraFin: string; 
  estadoAsistencia: string;
  estadoDetalle: string;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion: string; 
  asistenciaAsesor?: string;
  asistenciaAlumno?: string;
  descripcion?: string;
}

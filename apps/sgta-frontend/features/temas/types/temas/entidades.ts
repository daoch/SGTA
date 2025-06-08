export interface Tema {
  id: number;
  codigo: string | null;
  carrera: Carrera | null;
  titulo: string;
  resumen: string;
  objetivos: string;
  metodologia: string;
  portafolioUrl: string;
  activo: boolean;
  fechaLimite: string;
  fechaCreacion: string;
  fechaModificacion: string | null;
  estadoTemaNombre: string | null;
  idUsuarioInvolucradosList: number[] | null;
  idCoasesorInvolucradosList: number[] | null;
  idEstudianteInvolucradosList: number[] | null;
  idSubAreasConocimientoList: number[] | null;
  coasesores: Coasesor[] | null;
  tesistas: Tesista[] | null;
  subareas: Subareas[];
  requisitos: string; //agregado
  area: AreaConocimiento[];
  cantPostulaciones: number;
}

export interface Carrera {
  id: number;
  unidadAcademicaId: number | null;
  codigo: string;
  nombre: string;
  descripcion: string;
  activo: boolean | null;
  fechaCreacion: string | null;
  fechaModificacion: string | null;
}

export interface Tesista {
  id: number;
  tipoUsuario: string | null;
  codigoPucp: string | null;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  correoElectronico: string;
  nivelEstudios: string | null;
  contrasena: string | null;
  biografia: string | null;
  enlaceRepositorio: string | null;
  enlaceLinkedin: string | null;
  disponibilidad: string | null;
  tipoDisponibilidad: string | null;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion: string | null;
  asignado: boolean;
}

export interface Coasesor {
  id: number;
  tipoUsuario: string | null;
  codigoPucp: string | null;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  correoElectronico: string;
  nivelEstudios: string | null;
  contrasena: string | null;
  biografia: string | null;
  enlaceRepositorio: string | null;
  enlaceLinkedin: string | null;
  disponibilidad: string | null;
  tipoDisponibilidad: string | null;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion: string | null;
  rol: string | null;
}

export interface Subareas {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  fechaCreacion: string | null;
  fechaModificacion: string | null;
  areaConocimiento: AreaConocimiento | null;
}

export interface AreaConocimiento {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
  idCarrera: number;
}

export type Usuario = {
  id: number;
  tipoUsuario: TipoUsuario;
  codigoPucp: string;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  correoElectronico: string | null;
  nivelEstudios: string;
  contrasena: string | null;
  biografia: string | null;
  enlaceRepositorio: string | null;
  enlaceLinkedin: string | null;
  disponibilidad: string | null;
  tipoDisponibilidad: string;
  asignado: boolean;
  creador: boolean;
  rechazado: boolean;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
};

export type TipoUsuario = {
  id: number;
  nombre: string;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
};

export interface TemaCreateLibre {
  titulo: string;
  carrera: { id: number };
  resumen: string;
  objetivos: string;
  metodologia: string;
  fechaLimite: string;
  subareas: { id: number }[];
  coasesores: { id: number }[];
  requisitos: string;
}

export interface TipoSolicitud {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Usuario_V2 {
  id: number;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  correoElectronico: string;
  fotoPerfil: string | null;
}

export interface Topic {
  titulo: string;
  resumen: string;
}

export interface Student {
  id: number;
  name: string;
  lastName: string;
  topic: Topic;
}

export interface Solicitud {
  id: number;
  registerTime: string;
  status: string;
  reason: string;
  solicitudCompletada: boolean;
  aprobado: boolean;
  tipoSolicitud: TipoSolicitud;
  usuario: Usuario;
  students: Student[];
}

export interface Observacion {
  campo: "título" | "descripción";
  detalle: string;
  autor: string;
  fecha: string;
}


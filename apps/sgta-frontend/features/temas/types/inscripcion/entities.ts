export interface TemaForm {
  tipoRegistro: string;
  titulo: string;
  areaInvestigacion: string;
  descripcion: string;
  coasesores: string[];
  asesorPrincipal: string;
  estudiantes: string[];
  requisitos?: string;
  fechaLimite?: string;
}

export interface TemaCreateInscription {
  titulo: string;
  carrera: Identifiable;
  resumen: string;
  objetivos: string;
  metodologia: string;
  fechaLimite: string;
  subareas: Identifiable[];
  coasesores: Identifiable[];
  tesistas: Identifiable[];
}

export interface Identifiable {
  id: number;
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
}

export interface AreaDeInvestigacion {
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


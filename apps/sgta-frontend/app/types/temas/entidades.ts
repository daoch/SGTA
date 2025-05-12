import { TabValues } from "./enums";

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

export interface Tema {
  id: number;
  codigo: string | null;
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
  carrera: string | null;
  idUsuarioInvolucradosList: number[] | null;
  idCoasesorInvolucradosList: number[] | null;
  idEstudianteInvolucradosList: number[] | null;
  idSubAreasConocimientoList: number[] | null;
  coasesores: Coasesor[] | null;
  tesistas: Tesista[] | null;
  subareas: {
    id: number;
    areaConocimiento: string | null;
    nombre: string;
    descripcion: string | null;
    activo: boolean;
    fechaCreacion: string | null;
    fechaModificacion: string | null;
  }[];
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

export interface TemaUI extends Tema {
  tipo: TabValues;
}


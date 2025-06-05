export type Carrera = {
  id: number;
  unidadAcademicaId: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
};

export type AreaConocimiento = {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
  idCarrera: number;
};

export type Subarea = {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
  areaConocimiento: AreaConocimiento;
};

export type TipoUsuario = {
  id: number;
  nombre: string;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
};

export type Tesista = {
  id: number;
  tipoUsuario: TipoUsuario;
  codigoPucp: string;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  correoElectronico: string;
  nivelEstudios: string;
  comentario: string;
  biografia: string;
  enlaceRepositorio: string | null;
  enlaceLinkedin: string | null;
  disponibilidad: string | null;
  tipoDisponibilidad: string;
  tipoDedicacion: string | null;
  rol: string | null;
  activo: boolean;
  rechazado: string | null;
  creador: string | null;
  fechaCreacion: string;
  fechaModificacion: string;
  asignado: string | null;
};

export type Asesor = {
  id: number;
  tipoUsuario: string | null;
  codigoPucp: string;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  correoElectronico: string;
  nivelEstudios: string | null;
  comentario: string | null;
  biografia: string | null;
  enlaceRepositorio: string | null;
  enlaceLinkedin: string | null;
  disponibilidad: string | null;
  tipoDisponibilidad: string | null;
  tipoDedicacion: string | null;
  rol: string;
  activo: boolean;
  rechazado: boolean;
  creador: string | null;
  fechaCreacion: string;
  fechaModificacion: string | null;
  asignado: boolean;
};

export type Postulacion = {
  id: number;
  codigo: string;
  titulo: string;
  resumen: string;
  objetivos: string;
  metodologia: string;
  requisitos: string;
  portafolioUrl: string | null;
  activo: boolean | null;
  rechazado: boolean | null;
  fechaLimite: string;
  fechaFinalizacion: string | null;
  fechaCreacion: string;
  fechaModificacion: string;
  estadoTemaNombre: string;
  carrera: Carrera;
  cantPostulaciones: number | null;
  area: string | null;
  subareas: Subarea[];
  tesistas: Tesista[];
  coasesores: Asesor[];
  estadoUsuarioTema: string;
};

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

export type TemaDto = {
  usuarioId: number;
  temaId: number;
  comentario: string;
};

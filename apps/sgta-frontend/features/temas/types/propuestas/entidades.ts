export type Proyecto = {
  id: number;
  codigo?: string | null;
  titulo: string;
  resumen?: string;
  objetivos: string;
  metodologia: string;
  portafolioUrl?: string;
  activo?: boolean;
  fechaLimite: string;
  fechaFinalizacion?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  estadoTemaNombre?: string;
  carrera?: string;
  cantPostulaciones: number;
  coasesores: Usuario[];
  tesistas: Usuario[];
  subareas: SubAreaConocimiento[];
  tipo: string; //agregado
  estudiantes?: Usuario[]; //agregado
};

export type TipoUsuario = {
  id: number;
  nombre: string;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
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
  disponibilidad: string | null;
  tipoDisponibilidad: string;
  asignado: string;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
};

export type Area = {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: string | null;
  fechaModificacion: string | null;
};

export type SubAreaConocimiento = {
  id: number;
  areaConocimiento: Area;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  fechaCreacion: string | null;
  fechaModificacion: string | null;
};

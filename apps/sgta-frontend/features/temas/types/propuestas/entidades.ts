export type Proyecto = {
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
  fechaModificacion: string;
  idUsuarioInvolucradosList: number[] | null;
  idCoasesorInvolucradosList: number[] | null;
  idEstudianteInvolucradosList: number[];
  idSubAreasConocimientoList: number[];
  tipo: string;
  subAreas: SubAreaConocimiento[];
  estudiantes: Usuario[];
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
  disponibilidad: string | null;
  tipoDisponibilidad: string;
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

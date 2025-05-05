export type Proyecto = {
  id: string;
  titulo: string;
  area: string;
  estudiantes: string[];
  codigos: string[];
  postulaciones: number;
  fechaLimite: string;
  tipo: string;
  descripcion: string;
  objetivos: string;
  metodologia: string;
  recursos: {
    nombre: string;
    tipo: string;
    fecha: string;
  }[];
};

export type Tema = {
  id: number;
  codigo: string | null;
  titulo: string;
  resumen: string;
  objetivos: string;
  metodologia: string;
  portafolioUrl: string;
  activo: boolean;
  fechaLimite: string; // ISO 8601 string, puedes usar Date si lo conviertes en un objeto Date
  fechaCreacion: string; // ISO 8601 string, también puedes convertirlo a Date
  fechaModificacion: string; // ISO 8601 string, igual puedes convertirlo a Date
  idUsuarioInvolucradosList: number[] | null;
  idCoasesorInvolucradosList: number[] | null;
  idEstudianteInvolucradosList: number[];
  idSubAreasConocimientoList: number[];
  estadoTema: EstadoTema;
};

export type EstadoTema = {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: string; // ISO 8601 string, puedes usar Date si lo conviertes en un objeto Date
  fechaModificacion: string; // ISO 8601 string, igual puedes convertirlo a Date
}
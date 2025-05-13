export interface Jurado {
  code: string;
  name: string;
}

export interface Tema {
  id: number;
  codigo : string;
  titulo : string;
  asesor: string;
  jurados: Jurado[];
}

export interface AreaEspecialidad {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaModificacion: Date | null;
  idCarrera: number;
}

export interface SalaExposicion {
  id: number;
  nombre: string;
  buyse:false;
}

export interface JornadaExposicionSalas {
  jornadaExposicionId: number;
  datetimeInicio: Date;
  datetimeFin: Date; 
  salasExposicion: SalaExposicion[];
}

export interface TipoDedicacion {
  id: number;
  iniciales: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaModificacion: Date | null;
}
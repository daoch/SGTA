export interface Jurado {
  code: string;
  name: string;
}

export interface Tema {
  id: number;
  codigo : string;
  titulo : string;
  usuarios : Usuario[];
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
export interface TimeSlot {
  key: string;
  range: string; // 17:00  -  18:00
  idBloque: number;
  idJornadaExposicionSala: number;
  expo?: Tema;
  idExposicion?:number;
  esBloqueReservado?: boolean;
  esBloqueBloqueado?:boolean;
}

export interface EstadoPlanificacion{
  id : number;
  nombre :string;
  activo : boolean;
}

export interface Estudiante {
  id: number;
  nombre: string;
  tipo: string;
}

export interface Asesor {
  id: number;
  nombre: string;
  tipo: string;
}

export interface MiembroJurado {
  id: number;
  nombre: string;
  tipo: string;
}

export interface Exposicion {
  id: number;
  nombre: string;
  estadoExposicion: string;
  datetimeInicio: string;
  datetimeFin: string;
  salaExposicion: string;
}

export interface EtapaFormativaExposiciones {
  id: number;
  nombre: string;
  exposiciones: Exposicion[];
}

export interface  Usuario{
  idUsario: number;
  nombres : string;
  apellidos: string;
  rol : Rol;
}

export interface Rol{
  id: number;
  nombre:string;
}
export type OrigenBoton = "siguiente" | "terminar";

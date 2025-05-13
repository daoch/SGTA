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
  name: string;
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

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

export interface Espacio {
  code: string;
  busy: boolean;
}

export interface Dispo {
  code: number;
  date: Date;
  startTime: string;
  endTime: string;
  spaces: Espacio[];
}

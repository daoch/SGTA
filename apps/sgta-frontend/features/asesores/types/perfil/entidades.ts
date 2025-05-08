export interface Tesis {
  titulo: string;
  estudiante: string;
  año: string;
  nivel: string;
  estado: "en_proceso" | "terminada";
}

export interface AreaTematica {
  idArea: number;
  nombre: string;
}

export interface TemaInteres {
  idTema: number;
  nombre: string;
  area: AreaTematica;
}

export interface Asesor {
  nombre: string;
  especialidad: string;
  email: string;
  linkedin: string;
  repositorio: string;
  biografia: string;
  disponible: boolean;
  limiteTesis: number;
  tesis: Tesis[];
  areasTematicas: AreaTematica[];
  temasInteres: TemaInteres[];
}

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
  areaTematica: AreaTematica;
}

export interface Asesor {
  nombre: string;
  especialidad: string;
  email: string;
  linkedin: string | null;
  repositorio: string | null;
  biografia: string | null;
  disponible: boolean;
  limiteTesis: number | null;
  tesis?: Tesis[];
  areasTematicas: AreaTematica[];
  temasIntereses: TemaInteres[];
  estado?: number | null;
}

export interface AsesorDTO {
  idAsesor: number;
  nombre: string;
  especialidad: string;
  email: string;
  linkedin: string | null;
  repositorio: string | null;
  biografia: string | null;
  estado: boolean | null;
  limiteTesis: number | null;
  tesistasActuales: number | null;
  areasTematicas: AreaTematica[];
  temasIntereses: TemaInteres[];
}

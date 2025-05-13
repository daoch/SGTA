export interface Tesis {
  idTesis: number;
  titulo: string;
  estudiantes: string[];
  año: string;
  nivel: string;
  estado: "en_proceso" | "terminada" | null;
}

export interface Proyecto {
  idProyecto: number;
  nombre: string;
  participantes: number;
  añoInicio: string | null;
  añoFin: string | null;
  estado: "en_proceso" | "finalizado" | null;
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
  id: number;
  nombre: string;
  especialidad: string;
  email: string;
  linkedin: string | null;
  repositorio: string | null;
  biografia: string | null;
  limiteTesis: number | null;
  tesistasActuales: number | null;
  areasTematicas: AreaTematica[];
  temasIntereses: TemaInteres[];
  estado: boolean | null;
}

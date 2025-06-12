export interface Tesis {
  idTesis: number;
  titulo: string;
  estudiantes: string;
  anio: string;
  nivel: string;
  estado: "en_proceso" | "finalizada" | null;
}

export interface Proyecto {
  idProyecto: number;
  nombre: string;
  participantes: number;
  anioInicio: string | null;
  anioFin: string | null;
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
  fotoPerfil?: string | null;
  linkedin: string | null;
  repositorio: string | null;
  biografia: string | null;
  limiteTesis: number | null;
  tesistasActuales: number | null;
  areasTematicas: AreaTematica[];
  temasIntereses: TemaInteres[];
  estado: boolean | null;
  foto?: string | null;
}

export interface Enlace {
  id: number;
  plataforma: PlataformaType;
  enlace: string;
}

export type PlataformaType =
  | "LinkedIn"
  | "GitHub"
  | "Twitter"
  | "Google Scholar"
  | "ResearchGate"
  | "ORCID"
  | "Academia.edu"
  | "Scopus"
  | "Web of Science"
  | "Otras";

export interface AsesorPerfil {
  id: number;
  nombre: string;
  especialidad: string;
  email: string;
  fotoPerfil?: string | null;
  linkedin: string | null;
  repositorio: string | null;
  biografia: string | null;
  limiteTesis: number | null;
  tesistasActuales: number | null;
  enlaces: Enlace[];
  areasTematicas: AreaTematica[];
  temasIntereses: TemaInteres[];
  estado: boolean | null;
  foto?: string | null;
}

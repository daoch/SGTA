export interface TemaForm {
  tipoRegistro: string;
  titulo: string;
  areaInvestigacion: string;
  descripcion: string;
  coasesores: string[];
  asesorPrincipal: string;
  estudiantes: string[];
  requisitos?: string;
  fechaLimite?: string;
}

export interface Tema {
  id: number;
  titulo: string;
  area: string;
  asesor: string;
  estudiantes: { nombre: string; codigo: string }[] | null;
  postulaciones: number | null;
  estado: string;
  tipo: string;
  ciclo: string;
  descripcion: string;
  coasesores: string[];
  recursos: { nombre: string; tipo: string; fecha: string }[];
}


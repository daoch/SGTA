export interface SelectOption {
  label: string;
  value: string;
}

export interface UserInfo {
  name: string;
  avatar: string;
}

export interface JuradoUI {
  user: UserInfo;
  code: string;
  email?: string;
  dedication: string;
  assigned: string;
  specialties: string[];
  status: string;
  id?: string;
}

export interface ModalDetallesExposicionProps {
  id_exposicion: number;
}

export interface Jurado {
  specialties: string[];
}

export interface Tesis {
  titulo: string;
  codigo: string;
  estudiante: string;
  codEstudiante: string;
  resumen: string;
  especialidades: string[];
  rol: string;
}


export enum TipoDedicacion {
  TODOS = "Todos",
  TIEMPO_COMPLETO = "Tiempo Completo",
  MEDIO_TIEMPO = "Medio Tiempo"
}

export enum AreaEspecialidadFilter {
  TODOS = "Todos",
  CIENCIAS_COMPUTACION = "Ciencias de la Computacion",
  DESARROLLO_SOFTWARE = "Desarrollo de Software",
  DESARROLLO_WEB = "Desarrollo Web",
  FRONTEND = "Front-End",
  BACKEND = "Backend",
  UI_UX = "UI/UX"
}

export enum EstadoJurado {
  TODOS = "Todos",
  ACTIVO = "Activo",
  INACTIVO = "Inactivo"
}

// Tipo para los datos de jurado en la vista del coordinador
export interface JuradoViewModel {
  user: UserInfo;
  code: string;
  email: string;
  dedication: string;
  assigned: string;
  specialties: string[];
  status: string;
}

export enum CursoType {
  TODOS = "Todos",
  PFC1 = "PFC1",
  PFC2 = "PFC2"
}

export enum PeriodoAcademico {
  TODOS = "Todos",
  PERIODO_2025_1 = "2025-1",
  PERIODO_2025_0 = "2025-0",
  PERIODO_2024_2 = "2024-2"
}

// Tipo para tesis asignadas al jurado
export interface TesisAsignada extends Tesis {
  curso: CursoType | string;
  periodo: PeriodoAcademico | string;
}

export interface ModalAsignarTesisProps {
  open: boolean;
  onClose: () => void;
  onAsignar: (tesisSeleccionada: Tesis) => void;
  data: Tesis[];
  jurado: Jurado;
}


// Props para la vista de detalle del jurado
export interface JuradoDetalleViewProps {
  modalAsignarTesisComponent: React.ComponentType<ModalAsignarTesisProps>; // Puedes reemplazar 'any' con un tipo específico para las props del modal
}


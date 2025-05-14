export interface JuradoDTO {
  id: number;
  codigoPucp: string;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  correoElectronico: string;
  nivelEstudios: string;
  asignados: number;
  tipoDedicacion: string;
  activo: boolean;
  fechaAsignacion: string;
  especialidades: string[];
}

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

//export interface Jurado {
  //specialties: string[];
//}

export interface Tesis {
  titulo: string;
  codigo: string;
  estudiantes: {
    nombre: string;
    codigo: string;
  }[];
  resumen: string;
  sub_areas_conocimiento: {
    id: number;
    nombre: string;
    id_area_conocimiento: number;
  }[];
  rol: string;
}



export interface EspecialidadOption {
  label: string;
  value: string;
}

export enum EstadoJurado {
  TODOS = "Todos",
  ACTIVO = "Activo",
  INACTIVO = "Inactivo",
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
  PFC2 = "PFC2",
}

export enum PeriodoAcademico {
  TODOS = "Todos",
  PERIODO_2025_1 = "2025-1",
  PERIODO_2025_0 = "2025-0",
  PERIODO_2024_2 = "2024-2",
}

// Tipo para tesis asignadas al jurado
export interface TesisAsignada extends Tesis {
  curso: CursoType | string;
  periodo: PeriodoAcademico | string;
}

interface MiembroJurado {
  nombre: string;
  id: string;
}
interface ExposicionJurado {
  id: string;
  titulo: string;
  fecha: string;
  hora: string;
  lugar: string;
  estado: "Completada" | "Pendiente" | "Cancelada";
  curso: "Proyecto de Fin de Carrera 1" | "Proyecto de Fin de Carrera 2";
}

export interface TesisAsignadaDetalle extends Tesis {
  curso: CursoType | string;
  periodo: PeriodoAcademico | string;
  estado: string;
  area: string;
  fechaCreacion: string;
  fechaAprobacion: string;
  asesor: string;
  coasesor: string;
  jurados: MiembroJurado[];
  exposiciones: ExposicionJurado[];
}

export interface ModalAsignarTesisProps {
  open: boolean;
  onClose: () => void;
  onAsignar: (tesisSeleccionada: JuradoTemasDetalle) => void;
  data: JuradoTemasDetalle[];
  jurado: AreaConocimientoJurado[];
}

// Props para la vista de detalle del jurado
export interface JuradoDetalleViewProps {
  modalAsignarTesisComponent: React.ComponentType<ModalAsignarTesisProps>; // Puedes reemplazar 'any' con un tipo específico para las props del modal
}

export interface AreaConocimientoJurado {
  id: number;
  nombre: string;
}

export enum TipoDedicacion {
  TODOS = "Todos",
  TIEMPO_COMPLETO = "TC",
  MEDIO_TIEMPO = "TPA",
}

export enum AreaEspecialidadFilter {
  TODOS = "Todos",
  CIENCIAS_COMPUTACION = "Ciencias de la Computacion",
  DESARROLLO_SOFTWARE = "Desarrollo de Software",
  DESARROLLO_WEB = "Desarrollo Web",
  FRONTEND = "Front-End",
  BACKEND = "Backend",
  UI_UX = "UI/UX",
}

export enum Especialidades {
  TODOS = "Todos",
  INGENIERIA_SOFTWARE = "Ingeniería de Software",
  CIENCIAS_COMPUTACION = "Ciencias de la Computación",
  TECNOLOGIAS_INFORMACION = "Tecnologias de la informacion",
  VISION_COMPUTACIONAL = "Vision Computacional",
  SISTEMAS_INFORMACION = "Sistemas de Informacion",
  DESARROLLO_WEB = "Desarrollo Web",
  FRONTEND = "Front-End",
  BACKEND = "Backend",
  UI_UX = "UI/UX",
}

export interface JuradoTemasDetalle {
  id: number,
  titulo: string;
  codigo: string;
  resumen: string;
  rol: string;
  estudiantes: {
    nombre: string;
    codigo: string;
  }[];
  sub_areas_conocimiento: {
    id: number;
    nombre: string;
    id_area_conocimiento: number;
  }[];
  etapaFormativaTesis: {
    id: number;
    nombre: string;
  };
  cicloTesis: {
    id: number;
    nombre: string;
  };
  estadoTema: {
    id: number;
    nombre: string;
  };
}
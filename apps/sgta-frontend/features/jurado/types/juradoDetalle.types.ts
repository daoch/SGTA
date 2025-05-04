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

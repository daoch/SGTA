export interface Ciclo {
  id: number;
  nombre: string;
  activo: boolean;
  estado: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface CrearCicloDto {
  semestre: string;
  anio: number;
  fechaInicio: string;
  fechaFin: string;
}

export interface ActualizarCicloDto {
  id: number;
  semestre: string;
  anio: number;
  fechaInicio: string;
  fechaFin: string;
  activo?: boolean;
}

export interface CicloEtapas {
  id: number;
  semestre: string;
  anio: number;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
  etapasFormativas: string[];
  cantidadEtapas: number;
}
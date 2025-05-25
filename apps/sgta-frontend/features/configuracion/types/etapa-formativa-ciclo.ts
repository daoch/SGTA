export interface Ciclo {
  id: number;
  anio: number;
  semestre: string;
}

export interface EtapaFormativaCiclo {
    id: number;
    etapaFormativaId: number;
    cicloId: number;
    carreraId: number;
    activo: boolean;
    nombreEtapaFormativa: string;
    creditajePorTema: number;
    nombre: string;
    descripcion?: string;
    objetivos?: string;
    entregables?: number;
    exposiciones?: number;
}

export interface EtapaFormativaCicloCreate {
    etapaFormativaId: number;
    cicloId: number;
    activo: boolean;
}
export interface CriterioEntregableDetalle {
    criterioId: number;
    criterioNombre: string;
    notaMaxima: number;
    notaCriterio: number | null;
}

export interface EntregableCriteriosDetalle {
    entregableId: number;
    entregableNombre: string;
    fechaEnvio: string | null;
    fechaFin: string | null;
    notaGlobal: number | null;
    estadoEntrega: string;
    criterios: CriterioEntregableDetalle[];
    etapaFormativaXCicloId: number | null;
    esEvaluable: boolean | null;
} 

export interface StudentData {
  name: string;
  currentStage: string;
  totalStages: number;
}

export interface DeliverableCriteria {
  name: string;
  grade: number;
}

export interface Deliverable {
  id: string;
  name: string;
  date: string;
  criteria: DeliverableCriteria[];
  expositionGrade: number;
  fechaLimite: string;
  finalGrade: number;
}

export interface Stage {
  id: string;
  name: string;
  period: string;
  deliverables: Deliverable[];
}

export interface GradesData {
  stages: Stage[];
}

export interface AcademicAnalysisProps {
  studentData: StudentData;
  gradesData: GradesData;
}

export interface ChartDeliverable {
  name: string
  entregableNumber: number
  date: string
  fechaLimite: string
  notaFinal: number
  notaExposicion: number
  stage: string
  criterios: DeliverableCriteria[]
  globalIndex: number
}

// Interface simple para etapas formativas
export interface EtapaFormativaSimple {
  id: number;
  etapaFormativaNombre: string;
  cicloNombre: string;
}
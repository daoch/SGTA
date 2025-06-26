// Tipos para los reportes del coordinador

export interface TopicArea {
  areaName: string;
  topicCount: number;
  etapasFormativasCount: Record<string, number>;
}

export interface AdvisorDistribution {
  teacherName: string;
  count: number;
  areaName: string;
  areasConocimiento: string[];
  etapasFormativasCount: Record<string, number>;
}

export interface JurorDistribution {
  teacherName: string;
  count: number;
  areaName: string;
}

export interface AdvisorPerformance {
  advisorName: string;
  areaName: string;
  performancePercentage: number;
  totalStudents: number;
}

export interface TopicTrend {
  year: number;
  areaName: string;
  topicCount: number;
  etapasFormativasCount: Record<string, number>;
} 
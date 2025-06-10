// Tipos para los reportes del coordinador

export interface TopicArea {
  areaName: string;
  topicCount: number;
}

export interface AdvisorDistribution {
  teacherName: string;
  count: number;
  department: string;
}

export interface JurorDistribution {
  teacherName: string;
  count: number;
  department: string;
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
} 
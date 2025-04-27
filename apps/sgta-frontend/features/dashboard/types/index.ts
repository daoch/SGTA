// src/features/dashboard/types/index.ts

// Tipos específicos para los datos que necesita el dashboard
// Estos pueden reutilizar tipos de otras features o ser específicos

export interface StatData {
    description: string | undefined;
    value: number | string;
    label: string;
    delta?: string; // ej: "+5"
    deltaType?: 'positive' | 'negative' | 'neutral';
    icon?: React.ElementType;
    color?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
  }
  
  export interface PendingAction {
    id: string;
    type: 'revision' | 'aprobacion_tema' | 'aprobacion_cese' | 'confirmacion_defensa' | 'evaluacion_defensa' | 'reasignacion';
    description: string; // ej: "Revisar entrega de Ana García"
    dueDate?: string | Date;
    priority?: 'high' | 'medium' | 'low';
    link: string; // Enlace a la pantalla correspondiente
  }
  
  export interface UpcomingDeadline {
      id: string;
      name: string; // ej: "Entrega Avance 2 (T1)"
      date: string | Date;
      daysRemaining: number;
      type: 'personal' | 'global'; // Si es del cronograma del estudiante o global del ciclo
  }
  
  export interface MyStudentInfo {
      id: string;
      nombre: string;
      avatar?: string;
      temaTitulo: string;
      progreso: number; // 0-100
      estadoActual?: string; // ej: "Esperando revisión Avance 1"
      linkToProject: string;
  }
  
  export interface MyProposalInfo {
      area: any;
      area: any;
      id: string;
      titulo: string;
      estado: 'borrador' | 'en_revision' | 'aprobado' | 'rechazado' | 'con_interesados';
      interesadosCount?: number;
      linkToTheme: string;
  }
  
  export interface MyEvaluationInfo {
      id: string; // ID de la defensa/evaluación
      tesistaNombre: string;
      temaTitulo: string;
      fechaHora: string | Date;
      estado: 'pendiente_confirmar' | 'confirmada' | 'evaluacion_pendiente' | 'evaluada';
      linkToEvaluation: string;
  }
  
  // Datos para gráficos (simplificados)
  export interface ChartDataPoint {
      name: string;
      tesistas: number;
      value: number;
      aprobados?: number;
      
      // otros valores...
  }
  
  // Estructura general de datos para el hook del dashboard
  export interface DashboardData {
      globalStats?: StatData[]; // Estadísticas generales visibles para todos
      pendingActions?: PendingAction[]; // Acciones PENDIENTES específicas del rol
      upcomingDeadlines?: UpcomingDeadline[]; // Próximas fechas límite relevantes
      
      // Datos específicos por rol
      asesorData?: {
          myStudents?: MyStudentInfo[];
          myProposals?: MyProposalInfo[];
          pendingReviewsCount?: number; 
      };
      juradoData?: {
          myEvaluations?: MyEvaluationInfo[];
          pendingConfirmationsCount?: number;
      };
      coordinadorData?: {
          coordinationStats?: StatData[]; // Stats como Total Tesistas, Asesores Activos, etc.
          pendingThemeApprovalsCount?: number;
          pendingCessationRequestsCount?: number;
          pendingReassignmentsCount?: number;
          areaDistribution?: ChartDataPoint[]; // Para gráfico de barras
          cycleProgress?: ChartDataPoint[]; // Para gráfico de líneas
          themeStatusDistribution?: ChartDataPoint[]; // Para gráfico pie
      };
      // ... otros roles si aplican
  }
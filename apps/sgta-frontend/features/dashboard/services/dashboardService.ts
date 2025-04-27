// src/features/dashboard/services/dashboardService.ts
//import apiClient from '@/lib/api';
import { AlertCircle, Calendar, RefreshCw, UserRound, Users } from 'lucide-react';
import { DashboardData } from '../types';

const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtiene TODOS los datos necesarios para el dashboard del usuario actual.
 * El backend debería filtrar los datos según el rol/permisos del usuario que hace la petición.
 */
export const fetchDashboardData = async (): Promise<DashboardData> => {
  console.log("SERVICE: Fetching dashboard data...");
  await apiDelay(1200); // Simular una llamada más compleja

  // --- INICIO SIMULACIÓN API ---
  // El backend construiría este objeto basado en el usuario autenticado
  const mockDashboardData: DashboardData = {
    globalStats: [
      { value: '2025-1', label: 'Ciclo Actual', icon: Calendar, color: 'primary' },
      // Podría haber un stat global aquí si aplica
    ],
    pendingActions: [ // Ejemplo de acciones PENDIENTES (mezcla simulada)
      { id: 'rev1', type: 'revision', description: 'Revisar "Avance 1" de Carlos Mendez', dueDate: '2025-04-18', priority: 'medium', link: '/mis-tesistas/carlos-mendez/entregables' },
      { id: 'aprT1', type: 'aprobacion_tema', description: 'Aprobar tema "Sistema Recomendador X"', priority: 'high', link: '/gestion-temas/aprobaciones' },
      { id: 'cese1', type: 'aprobacion_cese', description: 'Revisar solicitud de cese de Manuel Vázquez', priority: 'high', link: '/personal-academico/solicitudes-cese' },
      { id: 'eval1', type: 'evaluacion_defensa', description: 'Evaluar defensa de Laura Benitez', dueDate: '2025-04-30', priority: 'medium', link: '/mis-evaluaciones/laura-benitez' },
      { id: 'reas1', type: 'reasignacion', description: 'Reasignar tesis de Ana López', priority: 'high', link: '/personal-academico/reasignaciones' },
    ],
    upcomingDeadlines: [
        { id: 'dead1', name: 'Entrega Avance 2 (T1)', date: '2025-05-10', daysRemaining: 29, type: 'global' },
        { id: 'dead2', name: 'Solicitud Defensa (T2)', date: '2025-06-15', daysRemaining: 65, type: 'global' },
    ],
    // Simular datos para diferentes roles (el backend solo enviaría los relevantes)
    asesorData: {
      myStudents: [
        { id: 'T001', nombre: 'Ana García', avatar: 'https://i.pravatar.cc/150?u=T001', temaTitulo: 'Sistema de detección de plagio usando ML', progreso: 75, estadoActual: 'Feedback Entregado', linkToProject: '/proyectos/T001' },
        { id: 'T002', nombre: 'Carlos Mendez', avatar: 'https://i.pravatar.cc/150?u=T002', temaTitulo: 'Aplicación web para gestión académica', progreso: 40, estadoActual: 'Esperando Revisión Avance 1', linkToProject: '/proyectos/T002' },
      ],
      myProposals: [
         { id: 'PROP01', titulo: 'IA para análisis de imágenes médicas', estado: 'aprobado', linkToTheme: '/gestion-temas/mis-propuestas/PROP01'},
         { id: 'PROP02', titulo: 'Framework comparativo NoSQL', estado: 'borrador', linkToTheme: '/gestion-temas/mis-propuestas/PROP02'},
      ],
       pendingReviewsCount: 1, // Carlos Mendez
    },
    juradoData: {
      myEvaluations: [
        { id: 'DEF01', tesistaNombre: 'Laura Benitez', temaTitulo: 'Análisis de redes sociales con NLP', fechaHora: '2025-04-30T14:00:00Z', estado: 'evaluacion_pendiente', linkToEvaluation: '/mis-evaluaciones/DEF01' },
        { id: 'DEF02', tesistaNombre: 'Marco Polo', temaTitulo: 'Seguridad en aplicaciones IoT', fechaHora: '2025-05-02T10:30:00Z', estado: 'confirmada', linkToEvaluation: '/mis-evaluaciones/DEF02' },
      ],
       pendingConfirmationsCount: 0,
    },
    coordinadorData: {
      coordinationStats: [
         { value: 30, label: 'Total Tesistas Activos', delta: '+5', deltaType: 'positive', icon: Users },
         { value: 12, label: 'Asesores Habilitados', icon: UserRound }, // Reemplazar UserCheck
         { value: 3, label: 'Temas Pend. Aprobación', icon: AlertCircle, color: 'warning', deltaType: 'neutral' },
         { value: 3, label: 'Tesis Pend. Reasignación', icon: RefreshCw, color: 'danger', deltaType: 'neutral' },
      ],
       pendingThemeApprovalsCount: 3,
       pendingCessationRequestsCount: 5, // Asegúrate que coincida con los datos de ejemplo
       pendingReassignmentsCount: 3,
       areaDistribution: [ { name: 'IA', value: 12 }, { name: 'Web', value: 8 }, { name: 'Seg.', value: 5 }, { name: 'BD', value: 7 }, { name: 'Redes', value: 3 }, { name: 'Otros', value: 5 }],
       cycleProgress: [ { name: '24-1', value: 18 }, { name: '24-2', value: 22 }, { name: '25-1', value: 30 }],
       themeStatusDistribution: [ { name: 'Aprobados', value: 21 }, { name: 'En Revisión', value: 7 }, { name: 'Pendientes', value: 2 }, { name: 'Rechazados', value: 1 }],
    },
  };
  // --- FIN SIMULACIÓN API ---
  // try {
  //     // El backend debería determinar el rol y devolver los datos apropiados
  //     const response = await apiClient.get<DashboardData>('/api/dashboard');
  //     return response.data;
  // } catch (error) {
  //     console.error("Error fetching dashboard data:", error);
  //     throw new Error("No se pudieron cargar los datos del panel de control.");
  // }
  return mockDashboardData;
};
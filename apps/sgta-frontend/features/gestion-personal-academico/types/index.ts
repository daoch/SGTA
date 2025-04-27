// src/features/academic-staff-management/types/index.ts
export interface Tesista {
    id: string;
    nombre: string;
    titulo: string;
    codigo: string;
    fechaInicio?: string; // Mantener opcional si no siempre está
  }

  export interface Profesor {
    id: string; // ID único del sistema o PUCP
    nombre: string;
    email: string;
    // Habilitaciones Académicas (Gestionadas por Coordinador)
    habilitadoAsesor: boolean;
    habilitadoJurado: boolean;
    // Estado Académico Interno (Gestionado por Coordinador)
    academicStatus?: 'active' | 'cessation_in_progress'; // Para indicar cese pendiente
    // Datos Informativos (Vienen del BE)
    numTesis: number; // Tesis activas como ASESOR
    numDefensas?: number; // Opcional si lo tienes
    departamento?: string; // Opcional
    expertiseAreas?: string[]; // Opcional
    codigoPucp?: string; // Código único PUCP
    rolAcademico?: string; // Ej: Profesor Principal, Asociado, TPA, TPC
    avatar?: string; // URL del avatar
  }

  export interface SortConfig {
    key: keyof Profesor | null;
    direction: 'asc' | 'desc';
  }
  
  // Tipo para opciones de filtro (usado en Selects)
  export interface FilterOption {
      key: string;
      label: string;
  }
  
  export type SolicitudEstado = 'pendiente' | 'aprobada' | 'rechazada';
  
  export interface SolicitudCese {
    id: string;
    profesorId: string;
    profesorNombre: string;
    profesorEmail: string;
    profesorAvatar: string;
    fechaSolicitud: string | Date; 
    motivo: string;
    estado: SolicitudEstado;
    fechaDecision?: string | Date;
    motivoRechazo?: string;
    coordinadorDecision?: string;
    tesistasAfectados: Tesista[];
  }
  
  export type FiltroEstado = SolicitudEstado | 'todas'; 
  
  export interface Asesor { // Tipo para la lista de asesores candidatos
    id: string;
    nombre: string;
    email: string;
    avatar: string;
    // departamento: string; // Opcional si se usa
    areasExpertise: string[];
    cargaActual: number; 
    estado: 'habilitado' | 'inhabilitado' | 'en_proceso_cese'; // Asegurar que este estado exista
  }
  
  export interface ProyectoReasignacion {
    id: string;
    tesista: Tesista;
    titulo: string;
    asesorOriginal: { // Podría ser un tipo Asesor simplificado
      id: string;
      nombre: string;
      email: string; // Opcional aquí
      avatar: string; // Opcional aquí
    };
    areasTematicas: string[];
    fechaCese: string | Date; // Usar Date es mejor
    estado: 'pendiente_reasignacion' | 'reasignado'; // 'reasignado' podría no ser necesario si se filtran
  }

  export interface AcademicStats {
    totalProfesores?: number;
    habilitadosAsesorar?: number;
    habilitadosJurado?: number;
    solicitudesPendientes?: number;
    tesisPendientesReasignacion?: number;
  }
  
  export interface NavigationCard {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    linkText: string;
    pendingCount?: number;
    pendingText?: string;
    alertText?: string;
    iconBgColor: string;
    iconColor: string;
    linkColor: string;
    linkHoverColor: string;
  }
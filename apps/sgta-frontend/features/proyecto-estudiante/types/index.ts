// src/features/student-project/types/index.ts

// Reutilizar tipos existentes si es posible
import { ProjectStatus, TesistaInfo } from '@/features/supervision-estudiantes/types'; // Ejemplo
import { AreaTematica } from '@/features/configuracion-academica/types'; // Ejemplo

// Información del Asesor para esta vista
export interface AdvisorContactInfo {
    id: string;
    nombre: string;
    email: string;
    avatar?: string;
}

// Información de un Entregable/Hito del Cronograma
export interface ProjectMilestone {
    id: string;
    nombre: string;
    descripcion?: string;
    fechaLimite: string | Date;
    estadoEntrega: 'pendiente' | 'entregado' | 'revisado_observado' | 'aprobado' | 'vencido';
    fechaEntrega?: string | Date | null;
    linkToSubmission?: string; // Enlace para subir/ver entrega
    tieneObservaciones?: boolean;
}

// Estado de la solicitud de cambio de asesor
export type AdvisorChangeRequestStatus = 'no_solicitado' | 'pendiente_revision' | 'aprobada' | 'rechazada';

export interface AdvisorChangeRequestInfo {
    id?: string; // ID si ya existe una solicitud
    estado: AdvisorChangeRequestStatus;
    fechaSolicitud?: string | Date;
    motivoRechazo?: string; // Si fue rechazada
}

// Datos completos para la página "Mi Proyecto"
export interface MyProjectData {
    projectId: string;
    tituloProyecto: string;
    estadoProyecto: ProjectStatus; // Estado general del proyecto
    cursoActual: 'PFC1' | 'PFC2' | null; // Curso en el que está matriculado
    cicloActual: string;
    asesorPrincipal: AdvisorContactInfo;
    coAsesor?: AdvisorContactInfo | null; // Opcional
    areasTematicas: AreaTematica[];
    // Cronograma y Entregables
    cronograma: ProjectMilestone[]; // Lista de hitos/entregables ordenados
    progresoGeneral: number; // % de avance calculado
    // Solicitud de Cambio de Asesor
    solicitudCambioAsesor: AdvisorChangeRequestInfo;
    // Actividad Reciente (opcional)
    actividadReciente?: Array<{ id: string; fecha: string | Date; descripcion: string }>;
}
// src/features/student-project/services/studentProjectService.ts
//import apiClient from '@/lib/api';
import { MyProjectData, AdvisorContactInfo, ProjectMilestone, AdvisorChangeRequestInfo } from '../types'; // Importar todos los tipos necesarios

const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- MOCK DATA (Debería venir de diferentes fuentes en una API real) ---
const MOCK_PROJECT_DATA: MyProjectData = {
    projectId: 'PROJ_T001',
    tituloProyecto: 'Sistema de detección de plagio usando ML para textos académicos en español',
    estadoProyecto: 'revision_t1',
    cursoActual: 'PFC1',
    cicloActual: '2025-1',
    asesorPrincipal: { id: 'P001', nombre: 'Manuel Vázquez', email: 'mvazquez@pucp.edu.pe', avatar: 'https://i.pravatar.cc/150?u=P001' },
    coAsesor: null,
    areasTematicas: [{ id: 'ia', nombre: 'Inteligencia Artificial', descripcion: '...' }, { id: 'nlp', nombre: 'Procesamiento de Lenguaje Natural', descripcion: '...' }],
    cronograma: [
        { id: 'h1', nombre: 'Plan de Trabajo Detallado', fechaLimite: '2025-03-30', estadoEntrega: 'aprobado', fechaEntrega: '2025-03-28', linkToSubmission: '/entregas/h1' },
        { id: 'h2', nombre: 'E1: Problema, Objetivos, Estado del Arte', fechaLimite: '2025-04-20', estadoEntrega: 'revisado_observado', fechaEntrega: '2025-04-19', linkToSubmission: '/entregas/h2', tieneObservaciones: true },
        { id: 'h3', nombre: 'E2: Marco Teórico y Metodología', fechaLimite: '2025-05-18', estadoEntrega: 'pendiente', fechaEntrega: null, linkToSubmission: '/entregas/h3' },
        { id: 'h4', nombre: 'E3: Documento Final Tesis 1', fechaLimite: '2025-06-29', estadoEntrega: 'pendiente', fechaEntrega: null, linkToSubmission: '/entregas/h4' },
        // ... más hitos ...
    ],
    progresoGeneral: 45, // Calculado en backend o frontend
    solicitudCambioAsesor: { estado: 'no_solicitado' }, // O 'pendiente_revision', etc.
    actividadReciente: [
        { id: 'act1', fecha: '2025-04-22', descripcion: 'Asesor Manuel Vázquez comentó en E1.' },
        { id: 'act2', fecha: '2025-04-19', descripcion: 'Entregaste "E1: Problema, Objetivos, Estado del Arte".' },
        { id: 'act3', fecha: '2025-04-02', descripcion: 'Asesor Manuel Vázquez aprobó "Plan de Trabajo".' },
    ]
};
// ----------------

/**
 * Obtiene los datos del proyecto activo del estudiante actual.
 * Devuelve null si el estudiante no tiene un proyecto activo.
 */
export const fetchMyActiveProject = async (): Promise<MyProjectData | null> => {
    console.log("SERVICE: Fetching active project data for student...");
    await apiDelay(800);
    // try {
    //     // La API debe identificar al estudiante por su sesión/token
    //     const response = await apiClient.get<MyProjectData | null>('/api/estudiante/mi-proyecto-activo');
    //     return response.data; // Puede ser null si no hay proyecto activo
    // } catch (error: any) {
    //      if (error.response && error.response.status === 404) {
    //         return null; // No encontrado es un caso esperado
    //     }
    //     console.error("Error fetching active project:", error);
    //     throw new Error("No se pudo cargar la información de tu proyecto.");
    // }
    // Simulación: devolver los datos mock o null si se quiere probar ese caso
    const hasActiveProject = true; // Cambiar a false para simular que no tiene proyecto
    return hasActiveProject ? MOCK_PROJECT_DATA : null;
};

/**
 * Envía una solicitud de cambio de asesor para el proyecto activo.
 */
export const requestAdvisorChange = async (projectId: string, motivo: string, asesorSugeridoId?: string | null): Promise<boolean> => {
    console.log(`SERVICE: Requesting advisor change for project ${projectId}`);
    await apiDelay(1000);
    const payload = { motivo, asesorSugeridoId: asesorSugeridoId || undefined };
    console.log("Payload:", payload);
    // try {
    //     await apiClient.post(`/api/estudiante/mi-proyecto-activo/solicitar-cambio-asesor`, payload);
    //     return true;
    // } catch (error: any) {
    //     console.error("Error requesting advisor change:", error);
    //     throw new Error(error.response?.data?.message || "No se pudo enviar la solicitud de cambio.");
    // }
    // Simular éxito/fallo aleatorio
    if (Math.random() < 0.1) throw new Error("Error simulado del servidor.");
    return true; 
};
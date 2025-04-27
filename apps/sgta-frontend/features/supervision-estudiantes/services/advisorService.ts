// src/features/advisor-dashboard/services/advisorService.ts
//import apiClient from '@/lib/api';
import { TesistaInfo, CessationRequestPayload } from '../types';

const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- MOCK DATA ---
const MOCK_TESISTAS: TesistaInfo[] = [
    { studentId: 'T001', projectId: 'PROJ_A1', nombreEstudiante: 'Ana García López', codigoEstudiante: '20201234', avatarEstudiante: 'https://i.pravatar.cc/150?u=T001', tituloProyecto: 'Sistema de detección de plagio usando ML', estadoProyecto: 'revision_t1', fechaUltimaEntrega: '2025-04-10T00:00:00Z', proximoHito: 'Entrega Final T1', fechaProximoHito: '2025-05-15T00:00:00Z', alerta: 'proximo_vencimiento', puedeSolicitarCese: true },
    { studentId: 'T002', projectId: 'PROJ_A2', nombreEstudiante: 'Carlos Mendez Roca', codigoEstudiante: '20210456', avatarEstudiante: 'https://i.pravatar.cc/150?u=T002', tituloProyecto: 'Aplicación web para gestión académica', estadoProyecto: 'desarrollo_t1', fechaUltimaEntrega: '2025-03-20T00:00:00Z', proximoHito: 'Entrega Avance 2 (T1)', fechaProximoHito: '2025-04-30T00:00:00Z', alerta: null, puedeSolicitarCese: true },
    { studentId: 'T004', projectId: 'PROJ_A4', nombreEstudiante: 'Roberto Sánchez', codigoEstudiante: '20211300', avatarEstudiante: 'https://i.pravatar.cc/150?u=T004', tituloProyecto: 'Arquitectura de Microservicios para Sistema Académico', estadoProyecto: 'desarrollo_t2', fechaUltimaEntrega: '2025-04-01T00:00:00Z', proximoHito: 'Entrega Borrador Completo', fechaProximoHito: '2025-05-25T00:00:00Z', alerta: null, puedeSolicitarCese: true },
    { studentId: 'T007', projectId: 'PROJ_A7', nombreEstudiante: 'Gabriela Vargas', codigoEstudiante: '20200789', avatarEstudiante: 'https://i.pravatar.cc/150?u=T007', tituloProyecto: 'Metodologías Ágiles en Proyectos Universitarios', estadoProyecto: 'listo_defensa', fechaUltimaEntrega: '2025-03-15T00:00:00Z', proximoHito: 'Sustentación Final', fechaProximoHito: '2025-04-28T00:00:00Z', alerta: null, puedeSolicitarCese: false, ceseSolicitado: true }, // Ya solicitó cese (ejemplo)
    { studentId: 'T009', projectId: 'PROJ_A9', nombreEstudiante: 'Isabel Castro', codigoEstudiante: '20200555', avatarEstudiante: 'https://i.pravatar.cc/150?u=T009', tituloProyecto: 'Aplicaciones IoT para Smart Campus', estadoProyecto: 'planificacion', fechaUltimaEntrega: null, proximoHito: 'Entrega Plan T1', fechaProximoHito: '2025-05-05T00:00:00Z', alerta: 'sin_entregas_recientes', puedeSolicitarCese: true },
];
// ----------------

/**
 * Obtiene la lista de tesistas activos asignados al asesor actual.
 */
export const fetchMyTesistas = async (): Promise<TesistaInfo[]> => {
    console.log("SERVICE: Fetching my tesistas...");
    await apiDelay(700);
    // try {
    //     // La API debe devolver solo los tesistas del asesor autenticado
    //     const response = await apiClient.get<TesistaInfo[]>('/api/asesor/mis-tesistas');
    //     return response.data;
    // } catch (error) {
    //     console.error("Error fetching tesistas:", error);
    //     throw new Error("No se pudieron cargar tus tesistas asignados.");
    // }
    return [...MOCK_TESISTAS]; // Devolver copia
};

/**
 * Envía una solicitud de cese para uno o más tesistas.
 */
export const requestCessation = async (payload: CessationRequestPayload): Promise<boolean> => {
    console.log("SERVICE: Requesting cessation for students:", payload.studentIds);
    console.log("Reason:", payload.motivo);
    await apiDelay(1200); // Simular llamada más lenta
    // try {
    //     // El endpoint podría recibir una lista de studentIds o projectIds
    //     await apiClient.post('/api/asesor/solicitud-cese', payload);
    //     return true;
    // } catch (error: any) {
    //     console.error("Error requesting cessation:", error);
    //     throw new Error(error.response?.data?.message || "No se pudo enviar la solicitud de cese.");
    // }
     // Simular un posible error aleatorio
     if (Math.random() < 0.1) {
         throw new Error("Error simulado: El servidor no respondió al solicitar cese.");
     }
     return true; // Simular éxito
};
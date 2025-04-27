// src/features/advisor-dashboard/types/index.ts

// Reutilizar o definir tipos necesarios
//import { AreaTematica } from '@/features/configuracion-academica/types'; // Ejemplo

export type ProjectStatus = 'planificacion' | 'desarrollo_t1' | 'revision_t1' | 'esperando_t2' | 'desarrollo_t2' | 'revision_t2' | 'listo_defensa' | 'aprobado' | 'pausa'; // Ajustar estados

export interface TesistaInfo {
  studentId: string;
  projectId: string; // ID del proyecto específico
  nombreEstudiante: string;
  codigoEstudiante: string;
  avatarEstudiante?: string;
  tituloProyecto: string;
  estadoProyecto: ProjectStatus;
  // Datos útiles para el asesor:
  fechaUltimaEntrega?: string | Date | null;
  proximoHito?: string; // Nombre del próximo hito
  fechaProximoHito?: string | Date;
  alerta?: 'sin_entregas_recientes' | 'proximo_vencimiento' | null; // Indicador visual
  // Necesario para lógica de cese:
  // Puede ser que el backend calcule si el asesor puede solicitar cese para este alumno
  // o si ya hay una solicitud pendiente/aprobada.
  puedeSolicitarCese?: boolean; 
  ceseSolicitado?: boolean;
}

// Para el modal de solicitud de cese
export interface CessationRequestPayload {
    studentIds: string[]; // Puede ser uno o varios
    projectId?: string; // Podría ser útil saber qué proyecto se afecta
    motivo: string;
    fechaPropuesta?: string | Date | null;
}
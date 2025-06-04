// src/features/asesores/types/asesor-invitations.types.ts

// --- Tipos Fundamentales que vienen del Backend DTO para Invitaciones de Asesoría ---

/**
 * Representa un DTO simple para un estudiante dentro de una invitación de asesoría.
 * Corresponde a EstudianteSimpleDto.java
 */
export interface IInvitacionEstudianteData {
  id: number;
  nombres: string;
  primerApellido: string;
  segundoApellido?: string | null;
}

/**
 * Representa un ítem en la lista de invitaciones de asesoría que recibe un asesor,
 * tal como viene del API (fetched).
 * Corresponde a InvitacionAsesoriaDto.java
 */
export interface IInvitacionAsesoriaFetched {
  solicitudOriginalId: number;    // ID de la Solicitud de cese original que generó esta propuesta
  temaId: number | null;
  temaTitulo: string;
  temaResumen?: string | null;
  estudiantes: IInvitacionEstudianteData[];
  asesorOriginalNombres: string;
  asesorOriginalApellidos: string;
  fechaPropuesta: string;         // Formato ISO Date String (OffsetDateTime)
  motivoCeseOriginal: string;
}

/**
 * Representa un ítem de invitación de asesoría después de transformar las fechas.
 */
export interface IInvitacionAsesoriaTransformed extends Omit<IInvitacionAsesoriaFetched, 'fechaPropuesta'> {
  fechaPropuesta: Date;
}

/**
 * Estructura de la respuesta paginada del API para las invitaciones de asesoría del asesor.
 * Debe coincidir con la estructura de Spring Data Page<InvitacionAsesoriaDto>.
 */
export interface IInvitacionesAsesoriaListResponseFetched {
  content: IInvitacionAsesoriaFetched[];
  totalPages: number;
  totalElements: number;
  number: number; // Número de página actual (0-indexed)
  size: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  // sort?: { sorted: boolean; unsorted: boolean; empty: boolean; }; // Opcional
}

/**
 * Estructura procesada para la lista de invitaciones, lista para usar en la UI por el asesor.
 */
export interface IInvitacionesAsesoriaListProcessed {
  invitaciones: IInvitacionAsesoriaTransformed[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}

// --- Tipos para Criterios de Búsqueda de la Lista de Invitaciones del Asesor ---
export interface IInvitacionesAsesoriaSearchCriteria {
  page: number; // 0-indexed
  size: number;
  // Podrías añadir filtros si el backend los soporta, ej:
  // sortBy?: string; // ej. "fechaPropuesta,desc"
}

// --- Tipos para las Acciones sobre una Invitación (Aceptar/Rechazar) ---

/**
 * Payload para cuando el asesor rechaza una propuesta de asesoría.
 */
export interface IRechazarInvitacionAsesoriaPayload {
  motivoRechazo: string;
}

/**
 * Payload para cuando el asesor rechaza una propuesta de asesoría.
 */
export interface IRechazarPropuestaPayload {
  motivoRechazo: string;
}

// Podrías tener un tipo para el payload de aceptación si necesitara algún dato,
// pero si solo es el ID de la solicitud (que va en la URL), no se necesita un payload.

// Podrías tener un tipo para la respuesta de las acciones de aceptar/rechazar si el backend devuelve algo.
// Ejemplo:
// export interface IAccionInvitacionResponse {
//   success: boolean;
//   message: string;
// }

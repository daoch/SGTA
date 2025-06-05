// src/features/coordinador/types/reasignacion.types.ts

import {
  // Importa tipos comunes si los reutilizas, por ejemplo, para Estudiante
  // Asegúrate que las rutas sean correctas
  IInvitacionEstudianteData, // Si la estructura es la misma que en asesor-invitations.types.ts
                             // O define un IReasignacionEstudianteData si es ligeramente diferente
} from "@/features/asesores/types/asesor-invitations.types"; // O una ubicación común de tipos

// --- Tipos para la Lista de REASIGNACIONES PENDIENTES (Vista Coordinador) ---

/**
 * Representa un ítem en la lista de reasignaciones pendientes que ve el coordinador.
 * Corresponde a ReasignacionPendienteDto.java
 */
export interface IReasignacionPendienteFetched {
  solicitudOriginalId: number;
  fechaAprobacionCese: string; // Formato ISO Date String (OffsetDateTime)
  motivoCeseOriginal: string;
  temaId: number | null;
  temaTitulo: string;
  asesorOriginalId: number | null;
  asesorOriginalNombres: string | null;
  asesorOriginalPrimerApellido: string | null;
  asesorOriginalCorreo: string | null;
  estudiantes: IInvitacionEstudianteData[]; // Reutilizando el tipo de estudiante simple
  estadoReasignacion: string; // Ej: "PENDIENTE_PROPUESTA_COORDINADOR", "PENDIENTE_ACEPTACION_ASESOR", etc.
  asesorPropuestoId?: number | null; // Opcional, solo presente si hay una propuesta activa
  asesorPropuestoNombres?: string | null;
  asesorPropuestoPrimerApellido?: string | null;
  fechaPropuestaNuevoAsesor?: string | null; // Formato ISO Date String (OffsetDateTime)
}

/**
 * Representa un ítem de reasignación pendiente después de transformar las fechas.
 */
export interface IReasignacionPendienteTransformed extends Omit<
  IReasignacionPendienteFetched,
  "fechaAprobacionCese" | "fechaPropuestaNuevoAsesor"
> {
  fechaAprobacionCese: Date;
  fechaPropuestaNuevoAsesor: Date | null;
}

/**
 * Estructura de la respuesta paginada del API para GET /api/coordinador/solicitudes-cese/reasignaciones-pendientes
 * Debe coincidir con la estructura de Spring Data Page<ReasignacionPendienteDto>.
 */
export interface IReasignacionesPendientesListResponseFetched {
  content: IReasignacionPendienteFetched[];
  totalPages: number;
  totalElements: number;
  number: number; // Página actual (0-indexed)
  size: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  // sort?: { sorted: boolean; unsorted: boolean; empty: boolean; }; // Opcional
}

/**
 * Estructura procesada para la lista de reasignaciones pendientes, lista para usar en la UI del coordinador.
 */
export interface IReasignacionesPendientesListProcessed {
  reasignaciones: IReasignacionPendienteTransformed[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}

// --- Tipos para Criterios de Búsqueda de la Lista de Reasignaciones Pendientes ---
export interface IReasignacionesPendientesSearchCriteria {
  page: number; // 0-indexed
  size: number;
  searchTerm?: string; // Para filtrar por título de tema, asesor original, etc.
  // Podrías añadir más filtros si el backend los soporta:
  // estadoReasignacion?: string; // Si quieres sub-filtrar por los estados de reasignación
}
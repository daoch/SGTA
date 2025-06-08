// src/features/usuario/types/notificacion.types.ts

/**
 * Representa el módulo de la notificación (tal como el componente lo usa).
 */
export interface INotificacionModulo {
  id: number;
  nombre: string;
}

/**
 * Representa el tipo de notificación (tal como el componente lo usa).
 */
export interface INotificacionTipo {
  id: number;
  nombre: string;
  prioridad: number;
}

/**
 * Notificación tal como viene “plana” desde la API.
 * Obsérvese que NO hay { modulo: … } ni { tipoNotificacion: … }, 
 * sino estos tres campos separados:
 *   • moduloNombre
 *   • tipoNotificacionNombre
 *   • tipoNotificacionPrioridad
 */
export interface INotificacionFetched {
  id: number;
  mensaje: string;
  canal: string;
  fechaCreacion: string;       // ISO String (p.ej. "2025-06-04T05:40:11.219005Z")
  fechaLectura: string | null; // ISO String o null
  activo: boolean;

  // Campos “planos” que realmente devuelve el backend:
  moduloNombre: string;
  tipoNotificacionNombre: string;
  tipoNotificacionPrioridad: number;

  enlaceRedireccion: string | null;
}


/**
 * Notificación que ya está transformada para el UI:
 *   • Convierte fechaCreacion/fechaLectura a Date
 *   • Construye los objetos anidados “modulo” y “tipoNotificacion”
 */
export interface INotificacionTransformed {
  id: number;
  mensaje: string;
  canal: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaLectura: Date | null;
  enlaceRedireccion: string | null;

  modulo: INotificacionModulo;
  tipoNotificacion: INotificacionTipo;
}


/**
 * Respuesta paginada del backend para la lista de notificaciones.
 * El “content” es un array de INotificacionFetched (plano).
 */
export interface INotificacionesListResponseFetched {
  content: INotificacionFetched[];
  totalPages: number;
  totalElements: number;
  number: number; // Página actual (0-indexed)
  size: number;
  // (Puedes añadir aquí más campos de Spring Page si los necesitas)
}


/**
 * Objeto que expone el frontend una vez transformada la respuesta:
 *   • notificaciones: array de INotificacionTransformed
 *   • totalPages, totalElements, currentPage
 */
export interface INotificacionesListProcessed {
  notificaciones: INotificacionTransformed[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}


/**
 * Respuesta del endpoint “count-no-leidas”
 */
export interface INotificacionesCount {
  count: number;
}

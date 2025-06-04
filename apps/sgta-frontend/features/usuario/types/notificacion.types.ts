// src/features/usuario/types/notificacion.types.ts

export interface INotificacionModulo { // Corresponde a Modulo en backend
  id: number;
  nombre: string;
}

export interface INotificacionTipo { // Corresponde a TipoNotificacion en backend
  id: number;
  nombre: string;
  prioridad: number;
}

// Notificación tal como viene del API
export interface INotificacionFetched {
  id: number;
  mensaje: string;
  canal: string;
  fechaCreacion: string; // ISO String
  fechaLectura: string | null; // ISO String o null
  activo: boolean;
  modulo: INotificacionModulo;
  tipoNotificacion: INotificacionTipo;
  // usuarioDestinatario no es necesario en el DTO de respuesta si es para el usuario actual
  enlaceRedireccion: string | null;
}

// Notificación transformada para la UI
export interface INotificacionTransformed extends Omit<INotificacionFetched, 'fechaCreacion' | 'fechaLectura'> {
  fechaCreacion: Date;
  fechaLectura: Date | null;
}

// Respuesta paginada del API para la lista de notificaciones
export interface INotificacionesListResponseFetched {
  content: INotificacionFetched[];
  totalPages: number;
  totalElements: number;
  number: number; // Página actual (0-indexed)
  size: number;
  // ... otros campos de Spring Page
}

export interface INotificacionesListProcessed {
  notificaciones: INotificacionTransformed[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}

export interface INotificacionesCount {
    count: number;
}
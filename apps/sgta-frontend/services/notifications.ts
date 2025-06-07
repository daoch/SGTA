import axios from "axios";

export interface Notificacion {
  notificacionId: number;
  mensaje: string;
  canal: string;
  fechaCreacion: string;
  fechaLectura: string | null;
  activo: boolean;
  tipoNotificacion: string;
  prioridad: number;
  modulo: string;
  usuarioId: number;
  nombreUsuario: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/";

export const NotificacionesService = {
  // Obtener notificaciones no leídas
  getUnreadNotifications: async (): Promise<Notificacion[]> => {
    const response = await axios.get(`${BASE_URL}api/notifications/unread`);
    return response.data;
  },

  // Obtener todas las notificaciones
  getAllNotifications: async (): Promise<Notificacion[]> => {
    const response = await axios.get(`${BASE_URL}api/notifications/all`);
    return response.data;
  },

  // Obtener notificaciones no leídas por módulo
  getUnreadNotificationsByModule: async (
    moduloId: string,
  ): Promise<Notificacion[]> => {
    const response = await axios.get(
      `${BASE_URL}api/notifications/unread/${moduloId}`,
    );
    return response.data;
  },

  // Obtener conteo de notificaciones no leídas
  getUnreadCount: async (): Promise<number> => {
    const response = await axios.get(
      `${BASE_URL}api/notifications/count-unread`,
    );
    return response.data;
  },

  // Marcar notificación como leída
  markAsRead: async (notificacionId: number): Promise<void> => {
    await axios.post(
      `${BASE_URL}api/notifications/mark-read/${notificacionId}`,
    );
  },
};

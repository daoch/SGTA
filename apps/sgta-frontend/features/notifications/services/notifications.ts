import { useAuthStore } from "@/features/auth/store/auth-store";
import axiosInstance from "@/lib/axios/axios-instance";
import { Notificacion } from "../types/Notification.type";

const { idToken } = useAuthStore.getState();

export const getUnreadNotifications = async (): Promise<Notificacion[]> => {
  try {
    const response = await axiosInstance.get<Notificacion[]>(
      "/notifications/unread",
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener notificaciones no leidas:", error);
    throw error;
  }
};

export const getAllNotifications = async (): Promise<Notificacion[]> => {
  try {
    const response = await axiosInstance.get<Notificacion[]>(
      "/notifications/all",
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener todas las notificaciones:", error);
    throw error;
  }
};

export const getUnreadNotificationsByModule = async (moduloId: string): Promise<Notificacion[]> => {
  try {
    const response = await axiosInstance.get<Notificacion[]>(
      `/notifications/unread/${moduloId}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error al obtener todas las notificaciones no leidas del modulo ${moduloId}:`, error);
    throw error;
  }
};

export const getUnreadCount = async (): Promise<Notificacion[]> => {
  try {
    const response = await axiosInstance.get<Notificacion[]>(
      "/notifications/count-unread",
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener el conteo de todas las notificaciones no leidas:", error);
    throw error;
  }
};

export const markAsRead = async (notificacionId: number): Promise<Notificacion[]> => {
  try {
    const response = await axiosInstance.post<Notificacion[]>(
      `/notifications/mark-read/${notificacionId}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error al marcar la notificacion como leida", error);
    throw error;
  }
};

// Tipos para la configuración de recordatorios
export interface ReminderConfig {
  activo: boolean;
  diasAnticipacion: number[];
  canalCorreo: boolean;
  canalSistema: boolean;
}

// Obtener configuración de recordatorios
export const getReminderConfig = async (): Promise<ReminderConfig> => {
  try {
    const response = await axiosInstance.get<ReminderConfig>(
      "/reminder-config",
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener la configuración de recordatorios:", error);
    throw error;
  }
};

// Actualizar configuración de recordatorios
export const updateReminderConfig = async (config: ReminderConfig): Promise<ReminderConfig> => {
  try {
    const response = await axiosInstance.post<ReminderConfig>(
      "/reminder-config",
      config,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la configuración de recordatorios:", error);
    throw error;
  }
};

// Actualizar configuración de recordatorios (reset)
export const updateReminderConfigReset = async (config: ReminderConfig): Promise<ReminderConfig> => {
  try {
    const response = await axiosInstance.post<ReminderConfig>(
      "/reminder-config",
      config,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la configuración de recordatorios (reset):", error);
    throw error;
  }
};


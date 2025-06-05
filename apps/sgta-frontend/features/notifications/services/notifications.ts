import { useAuthStore } from "@/features/auth/store/auth-store";
import axiosInstance from "@/lib/axios/axios-instance";
import { Notificacion } from "../types/Notification.type";

const { idToken } = useAuthStore.getState();


export const getUnreadNotifications = async (): Promise<Notificacion[]> => {
  try {
    const response = await axiosInstance.get<Notificacion[]>(
      "api/notifications/unread",
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
      "api/notifications/all",
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
      `api/notifications/unread/${moduloId}`,
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
      "api/notifications/count-unread",
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
      `api/notifications/mark-read/${notificacionId}`,
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


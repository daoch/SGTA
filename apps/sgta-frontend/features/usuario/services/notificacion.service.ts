// src/features/usuario/services/notificacion.service.ts

import axiosInstance from "@/lib/axios/axios-instance";
import {
  INotificacionesListResponseFetched,
  INotificacionesListProcessed,
  INotificacionTransformed,
  INotificacionesCount,
} from "../types/notificacion.types";

/**
 * Esta interfaz refleja exactamente la forma “plana” de la API:
 *   • módulo, tipo y prioridad vienen como campos separados:
 *       - moduloNombre
 *       - tipoNotificacionNombre
 *       - tipoNotificacionPrioridad
 */
interface INotificacionFetched {
  id: number;
  mensaje: string;
  canal: string;
  fechaCreacion: string;       // ISO String
  fechaLectura: string | null; // ISO String o null
  activo: boolean;

  // Campos planos que devuelve el backend:
  moduloNombre: string;
  tipoNotificacionNombre: string;
  tipoNotificacionPrioridad: number;

  enlaceRedireccion: string | null;
}

/**
 * Obtener lista paginada de notificaciones
 */
export async function getMisNotificaciones(
  page: number,
  size: number = 10,
  soloNoLeidas: boolean = false
): Promise<INotificacionesListProcessed> {
  const params: { page: number; size: number; leidas?: boolean } = { page, size };
  if (soloNoLeidas) {
    params.leidas = false;
  }

  try {
    const response = await axiosInstance.get<INotificacionesListResponseFetched>(
      "notificaciones",
      { params }
    );
    const data = response.data;

    const transformed: INotificacionTransformed[] = (data.content || []).map((n) => ({
      id: n.id,
      mensaje: n.mensaje,
      canal: n.canal,
      activo: n.activo,
      enlaceRedireccion: n.enlaceRedireccion,
      fechaCreacion: new Date(n.fechaCreacion),
      fechaLectura: n.fechaLectura ? new Date(n.fechaLectura) : null,

      modulo: {
        id: 0,
        nombre: n.moduloNombre,
      },
      tipoNotificacion: {
        id: 0,
        nombre: n.tipoNotificacionNombre,
        prioridad: n.tipoNotificacionPrioridad,
      },
    }));

    return {
      notificaciones: transformed,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      currentPage: data.number,
    };
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return {
      notificaciones: [],
      totalPages: 0,
      totalElements: 0,
      currentPage: page,
    };
  }
}

/**
 * Obtener el conteo de notificaciones no leídas
 */
export async function getCountMisNotificacionesNoLeidas(): Promise<INotificacionesCount> {
  try {
    const response = await axiosInstance.get<INotificacionesCount>(
      "notificaciones/count-no-leidas"
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener conteo de notificaciones no leídas:", error);
    return { count: 0 };
  }
}

/**
 * Marcar una notificación como leída
 */
export async function marcarNotificacionComoLeidaApi(
  notificacionId: number
): Promise<INotificacionTransformed> {
  const response = await axiosInstance.post<INotificacionFetched>(
    "notificaciones/" + notificacionId + "/marcar-leida"
  );
  const data = response.data;

  return {
    id: data.id,
    mensaje: data.mensaje,
    canal: data.canal,
    activo: data.activo,
    enlaceRedireccion: data.enlaceRedireccion,
    fechaCreacion: new Date(data.fechaCreacion),
    fechaLectura: data.fechaLectura ? new Date(data.fechaLectura) : null,

    modulo: {
      id: 0,
      nombre: data.moduloNombre,
    },
    tipoNotificacion: {
      id: 0,
      nombre: data.tipoNotificacionNombre,
      prioridad: data.tipoNotificacionPrioridad,
    },
  };
}

/**
 * Marcar todas las notificaciones como leídas
 */
export async function marcarTodasMisNotificacionesComoLeidasApi(): Promise<{ count: number }> {
  const response = await axiosInstance.post<{ count: number }>(
    "notificaciones/marcar-todas-leidas"
  );
  return response.data;
}

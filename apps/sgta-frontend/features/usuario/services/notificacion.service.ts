// src/features/usuario/services/notificacion.service.ts

import axiosInstance from "@/lib/axios/axios-instance";
import {
  INotificacionesListResponseFetched,
  INotificacionesListProcessed,
  INotificacionTransformed,
} from "../types/notificacion.types";
import { ELEMENTS_PER_PAGE_DEFAULT } from "@/lib/constants";

const NOTIFICACIONES_API_BASE = "notificaciones"; // Asume /api/notificaciones

// Definimos el tipo que esperamos recibir desde el backend para cada notificación sin transformar:
interface INotificacionFetched {
  id: number;
  mensaje: string;
  canal: string;
  activo: boolean;
  enlaceRedireccion: string;
  fechaCreacion: string;
  fechaLectura: string | null;
  moduloNombre: string;
  tipoNotificacionNombre: string;
  tipoNotificacionPrioridad: number;
}

/**
 * Obtener lista paginada de notificaciones
 */
export async function getMisNotificaciones(
  page: number,
  size: number = ELEMENTS_PER_PAGE_DEFAULT,
  soloNoLeidas: boolean = false
): Promise<INotificacionesListProcessed> {
  // Definimos un tipo explícito para params en lugar de 'any'
  interface Params {
    page: number;
    size: number;
    leidas?: boolean;
  }
  const params: Params = { page, size };
  if (soloNoLeidas) {
    params.leidas = false;
  }

  try {
    const response = await axiosInstance.get<INotificacionesListResponseFetched>(
      `${NOTIFICACIONES_API_BASE}`,
      { params }
    );
    const data = response.data;

    // Mapeo de cada elemento bruto a INotificacionTransformed
    const transformed: INotificacionTransformed[] = (data.content || []).map(
      (n) => ({
        id: n.id,
        mensaje: n.mensaje,
        canal: n.canal,
        activo: n.activo,
        enlaceRedireccion: n.enlaceRedireccion,
        fechaCreacion: new Date(n.fechaCreacion),
        fechaLectura: n.fechaLectura ? new Date(n.fechaLectura) : null,
        modulo: n.modulo,
        tipoNotificacion: n.tipoNotificacion,
      })
    );

    return {
      notificaciones: transformed,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      currentPage: data.number,
    };
  } catch {
    // En caso de error devolvemos un objeto vacío
    return {
      notificaciones: [],
      totalPages: 0,
      totalElements: 0,
      currentPage: page,
    };
  }
}

/**
 * Obtener conteo de notificaciones no leídas
 */
export async function getCountMisNotificacionesNoLeidas(): Promise<{ count: number }> {
  try {
    const response = await axiosInstance.get<{ count: number }>(
      `${NOTIFICACIONES_API_BASE}/count-no-leidas`
    );
    return response.data;
  } catch {
    return { count: 0 };
  }
}

/**
 * Marcar una notificación como leída
 */
export async function marcarNotificacionComoLeidaApi(
  notificacionId: number
): Promise<INotificacionTransformed> {
  try {
    // Usamos el tipo INotificacionFetched en lugar de 'any'
    const response = await axiosInstance.post<INotificacionFetched>(
      `${NOTIFICACIONES_API_BASE}/${notificacionId}/marcar-leida`
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
  } catch (_error) {
    // Re-lanzamos el error capturado
    throw _error;
  }
}

/**
 * Marcar todas las notificaciones como leídas
 */
export async function marcarTodasMisNotificacionesComoLeidasApi(): Promise<{ count: number }> {
  try {
    const response = await axiosInstance.post<{ count: number }>(
      `${NOTIFICACIONES_API_BASE}/marcar-todas-leidas`
    );
    return response.data;
  } catch (_error) {
    throw _error;
  }
}

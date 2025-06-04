// src/features/usuario/services/notificacion.service.ts

import axiosInstance from "@/lib/axios/axios-instance";
import {
  INotificacionesListResponseFetched,
  INotificacionesListProcessed,
  INotificacionTransformed,
} from "../types/notificacion.types";
import { ELEMENTS_PER_PAGE_DEFAULT } from "@/lib/constants";

const NOTIFICACIONES_API_BASE = "notificaciones"; // Asume /api/notificaciones

/**
 * Suponemos que el backend ya devuelve un objeto con “content” donde cada elemento tiene:
 *   - moduloNombre: string
 *   - tipoNotificacionNombre: string
 *   - tipoNotificacionPrioridad: number
 *   - fechaCreacion: string (ISO)
 *   - fechaLectura: string | null (ISO o null)
 *   - resto de campos planos
 */
export async function getMisNotificaciones(
  page: number,
  size: number = ELEMENTS_PER_PAGE_DEFAULT,
  soloNoLeidas: boolean = false
): Promise<INotificacionesListProcessed> {
  const params: any = { page, size };
  if (soloNoLeidas) {
    params.leidas = false;
  }

  try {
    const response = await axiosInstance.get<INotificacionesListResponseFetched>(
      `${NOTIFICACIONES_API_BASE}`,
      { params }
    );
    const data = response.data;

    //  Aquí mapeamos cada “n” de data.content (con campos planos) a INotificacionTransformed:
    const transformed: INotificacionTransformed[] = (data.content || []).map((n: any) => {
      return {
        id: n.id,
        mensaje: n.mensaje,
        canal: n.canal,
        activo: n.activo,
        enlaceRedireccion: n.enlaceRedireccion,
        // Convertimos las fechas a Date:
        fechaCreacion: new Date(n.fechaCreacion),
        fechaLectura: n.fechaLectura ? new Date(n.fechaLectura) : null,

        // Creamos aquí los objetos “modulo” y “tipoNotificacion” anidados
        modulo: {
          // Como el raw solo trae “moduloNombre” (y no un id), asignamos id = 0 (o -1) por defecto
          id: 0,
          nombre: n.moduloNombre,
        },
        tipoNotificacion: {
          id: 0,
          nombre: n.tipoNotificacionNombre,
          prioridad: n.tipoNotificacionPrioridad,
        },
      };
    });

    return {
      notificaciones: transformed,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      currentPage: data.number,
    };
  } catch (error) {
    // En caso de error devolvemos un objeto vacío (o maneja como prefieras)
    return {
      notificaciones: [],
      totalPages: 0,
      totalElements: 0,
      currentPage: page,
    };
  }
}

export async function getCountMisNotificacionesNoLeidas(): Promise<{ count: number }> {
  try {
    const response = await axiosInstance.get<{ count: number }>(
      `${NOTIFICACIONES_API_BASE}/count-no-leidas`
    );
    return response.data;
  } catch (error) {
    return { count: 0 };
  }
}

export async function marcarNotificacionComoLeidaApi(
  notificacionId: number
): Promise<INotificacionTransformed> {
  try {
    const response = await axiosInstance.post<any>(
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
  } catch (error) {
    throw error;
  }
}

export async function marcarTodasMisNotificacionesComoLeidasApi(): Promise<{ count: number }> {
  try {
    const response = await axiosInstance.post<{ count: number }>(
      `${NOTIFICACIONES_API_BASE}/marcar-todas-leidas`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

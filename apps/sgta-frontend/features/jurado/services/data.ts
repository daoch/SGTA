import axiosInstance from "@/lib/axios/axios-instance";
import axios from "axios";
import { Tema, TimeSlot } from "../types/jurado.types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function listarTemasCicloActualXEtapaFormativa(
  etapaFormativaId: number,
  exposicionId : number,
) {
  try {
    const response = await fetch(
      `${baseUrl}/temas/listarTemasCicloActualXEtapaFormativa/${etapaFormativaId}/${exposicionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Error : fetching  data de temas por etapa formativa:",
      error,
    );
    return [];
  }
}

export async function listarJornadasExposicionSalasByExposicion(
  exposicionId: number,
) {
  try {
    const response = await fetch(
      `${baseUrl}/jornada-exposcion-salas/listar-jornadas-salas/${exposicionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(
      "Error : fetching  data de jorandas y salas  por etapa formativa:",
      error,
    );
    return [];
  }
}

export async function listarBloquesHorariosExposicion(exposicionId: number) {
  try {
    const response = await fetch(
      `${baseUrl}/bloqueHorarioExposicion/listarBloquesHorarioExposicionByExposicion/${exposicionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(
      "Error al obtener los bloques horarios de exposición:",
      error,
    );
    return [];
  }
}

export async function listarEstadoPlanificacionPorExposicion(
  exposicionId: number,
) {
  try {
    const response = await fetch(
      `${baseUrl}/estado-planificacion/getByIdExposicion/${exposicionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(
      "Error al obtener estado planificaion de la exposición:",
      error,
    );
    return [];
  }
}

/**
 * Obtiene el ID de la EtapaFormativaXCiclo asociada
 * a una Exposición dado su exposicionId.
 */
export async function getEtapaFormativaIdByExposicionId(
  exposicionId: number,
): Promise<number> {
  try {
    const response = await fetch(
      `${baseUrl}/etapas-formativas/getEtapaFormativaIdByExposicionId/${exposicionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      // Para debugging, imprime status y texto
      const text = await response.text();
      console.error(
        `Error al obtener etapa formativa (${response.status}):`,
        text,
      );
      throw new Error("Network response was not ok");
    }

    // El back devuelve un número puro en el body: ej. 1
    const data: number = await response.json();
    return data;
  } catch (error) {
    console.error("Error : fetching EtapaFormativaId por exposicionId:", error);
    // En caso de fallo, devolvemos 0 (o podrías devolver `null` si prefieres)
    return 0;
  }
}

export const bloquearBloquePorId = async (
  idBloque: number,
): Promise<boolean> => {
  try {
    const response = await axiosInstance.patch(
      `/bloqueHorarioExposicion/bloquearBloque/${idBloque}`,
    );
    return response.status === 200;
  } catch (error) {
    console.error("Error al bloquear el bloque:", error);
    return false;
  }
};

export const desbloquearBloquePorId = async (
  idBloque: number,
): Promise<boolean> => {
  try {
    const response = await axiosInstance.patch(
      `/bloqueHorarioExposicion/desbloquearBloque/${idBloque}`,
    );
    return response.status === 200;
  } catch (error) {
    console.error("Error al desbloquear el bloque:", error);
    return false;
  }
};

/**
 * Obtiene las áreas de conocimiento asociadas a una exposición.
 *
 * @param exposicionId - El ID de la exposición para listar sus áreas de conocimiento.
 * @returns Un array de objetos con la información de cada área de conocimiento.
 */
export async function listarAreasConocimientoPorExposicion(
  exposicionId: number,
) {
  try {
    const response = await fetch(
      `${baseUrl}/areaConocimiento/listarPorIdExpo/${exposicionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Error en la respuesta de red (status ${response.status})`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Error al obtener áreas de conocimiento por exposición:",
      error,
    );
    return [];
  }
}

/**
 * Ejecuta el algoritmo de distribución de bloques de exposición.
 *
 * @param temas      - Lista de temas a distribuir (Tema[]).
 * @param timeSlots  - Lista de time slots disponibles (TimeSlot[]).
 * @returns          - Array de TimeSlot reasignados tras el algoritmo.
 */
export async function distribuirBloquesExposicion(
  temas: Tema[],
  timeSlots: TimeSlot[],
): Promise<TimeSlot[]> {
  try {
    const payload = { temas, bloques: timeSlots };
    const response = await axiosInstance.post<TimeSlot[]>(
      "/bloqueHorarioExposicion/algoritmoDistribucion",
      payload,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error al distribuir bloques de exposición:",
        error.response ?? error.message,
      );
    } else {
      console.error("Error inesperado al distribuir bloques:", error);
    }
    return [];
  }
}

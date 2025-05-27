import axiosInstance from "@/lib/axios/axios-instance";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function listarTemasCicloActulXEtapaFormativa(
  etapaFormativaId: number,
) {
  try {
    const response = await fetch(
      `${baseUrl}/temas/listarTemasCicloActualXEtapaFormativa/${etapaFormativaId}`,
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
    const response = await axiosInstance.post(
      `/bloqueHorarioExposicion/bloquear/${idBloque}`,
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
    const response = await axiosInstance.post(
      `/bloqueHorarioExposicion/desbloquear/${idBloque}`,
    );
    return response.status === 200;
  } catch (error) {
    console.error("Error al desbloquear el bloque:", error);
    return false;
  }
};

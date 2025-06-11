import axiosInstance from "@/lib/axios/axios-instance";
import { TimeSlot } from "../types/jurado.types";

export type State = {
  message: string | null;
  errors?: Record<string, string[]>;
};

export async function updateBloquesNextPhase(bloquesList: TimeSlot[]) {
  try {
    const response = await axiosInstance.patch(
      "/bloqueHorarioExposicion/updateBloquesListNextPhase",
      bloquesList,
    );

    const data = response.data as { success: boolean; message: string };

    if (data.success) {
      console.log(data.message);
    } else {
      console.warn(data.message);
    }

    return data;
  } catch (error) {
    const err = error as { response?: { data?: unknown } };
    console.error(
      "Error al actualizar la lista de bloques siguiente fase:",
      err.response?.data || err,
    );

    return {
      success: false,
      message: "Error inesperado al actualizar bloques siguiente fase",
    };
  }
}

export async function finishPlanning(idExposicon: number) {
  try {
    const response = await axiosInstance.patch(
      `/bloqueHorarioExposicion/finishPlanning/${idExposicon}`,
    );
    const data = response.data as { success: boolean; message: string };

    if (data.success) {
      console.log(data.message);
    } else {
      console.warn(data.message);
    }

    return data;
  } catch (error) {
    const err = error as { response?: { data?: unknown } };
    console.error(
      "Error al terminar la planificacion:",
      err.response?.data || err,
    );

    return { success: false, message: "Error al terminar la planificación" };
  }
}

//TESTING WATERS
export async function obtenerAccessTokenZoom() {
  try {
    const response = await axiosInstance.post("/zoom/generar-token-acceso");
    const data = response.data as { access_token: string };

    if (data.access_token) {
      return data.access_token;
    } else {
      console.warn("No se obtuvo el token de acceso de Zoom");
      return null;
    }
  } catch (error) {
    const err = error as { response?: { data?: unknown } };
    console.error(
      "Error al obtener el token de acceso de Zoom:",
      err.response?.data || err,
    );
    return null;
  }
}

export async function reunionesZoom(idExposicion: number) {
  try {
    const url = `/zoom/crear-meetings-jornada-exposicion/${idExposicion}`;
    const response = await axiosInstance.get(url);

    console.log("Respuesta de creación de reunión:", response.data);
  } catch (error) {
    const err = error as unknown;
    throw err;
  }
}

export async function descargarExcelByExposicionId(exposicionId: number) {
  try {
    const response = await axiosInstance.get(
      `/exposicion/export-excel/${exposicionId}`,
      {
        responseType: "blob",
      },
    );

    // Crear URL desde el blob
    const url = window.URL.createObjectURL(response.data);
    const enlace = document.createElement("a");
    enlace.href = url;

    enlace.setAttribute("download", `exposicion-${exposicionId}.xlsx`);
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(
      `Error al descargar el Excel de exposición ${exposicionId}:`,
      error,
    );
    throw error;
  }
}

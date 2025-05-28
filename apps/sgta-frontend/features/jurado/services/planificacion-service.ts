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

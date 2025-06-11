import axiosInstance from "@/lib/axios/axios-instance";
import { TimeSlot } from "../types/jurado.types";
import axios from "axios";

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

export async function reunionesZoom(bearerTokenId: string, idExposicion: number) {
  try {
    // 25 de junio de 2025 a las 4:00 PM en Lima
    // const limaDateTimeString = "2025-06-10T16:25:00"; // sin zona

    // const body = {
    //   topic: "Reunión de prueba SGTA",
    //   startTime: limaDateTimeString, // se enviará como "2025-06-25T21:00:00Z"
    //   duration: 1440, // duración en minutos
    //   agenda: "Discusión de avance de proyecto",
    //   timezone: "America/Lima",
    //   hostVideo: false,
    //   participantVideo: false,
    //   muteUponEntry: true,
    //   audio: "both",
    //   joinBeforeHost: false,
    //   accessToken: accessToken,
    //   defaultPassword: true, // para que Zoom genere una contraseña automáticamente
    //   waitingRoom: true,
    // };

    const url = `/zoom/crear-meetings-jornada-exposicion/${idExposicion}`;
    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${bearerTokenId}`,
      },
    });

    console.log("Respuesta de creación de reunión:", response.data);

    // const data = response.data as {
    //   join_url: string;
    //   start_url: string;
    //   type: number;
    //   host_email: string;
    //   registration_url: string;
    //   duration: number;
    //   password: string;
    // };

    // return data;

  } catch (error) {
    const err = error as unknown;
    // console.error("Error al crear la reunión de Zoom:", err.response?.data || err);
    throw err;
  }
}
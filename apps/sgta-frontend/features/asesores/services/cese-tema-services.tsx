// Update the import path below if the actual path is different
import axiosInstance from "@/lib/axios/axios-instance";
import axios from "axios";
import {
  DetalleSolicitudCeseTema,
  SolicitudCeseTemaRegistro,
  SolicitudCeseTemaResumen,
} from "../types/cese-tema/entidades";

export async function getDetalleSolicitudCeseTema(
  idSolicitud: number,
): Promise<DetalleSolicitudCeseTema> {
  try {
    const response = await axiosInstance.get(
      "/solicitudes/listarDetalleSolicitudCeseTema",
      {
        params: { idSolicitud },
      },
    );
    return response.data as DetalleSolicitudCeseTema;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error al obtener el detalle de la solicitud:",
        error.message,
      );
    } else {
      console.error("Error inesperado al obtener el detalle:", error);
    }
    throw error;
  }
}

export async function getResumenesSolicitudCeseTema(
  roles: string[],
): Promise<SolicitudCeseTemaResumen[]> {
  try {
    const response = await axiosInstance.get(
      "/solicitudes/listarResumenSolicitudCeseTemaUsuario",
      {
        params: { roles },
      },
    );
    return response.data as SolicitudCeseTemaResumen[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error al obtener los resúmenes de solicitudes:",
        error.message,
      );
    } else {
      console.error("Error inesperado al obtener los resúmenes:", error);
    }
    throw error;
  }
}

export async function getResumenesSolicitudCeseTemaCoordinador(): Promise<
  SolicitudCeseTemaResumen[]
> {
  try {
    const response = await axiosInstance.get(
      "/solicitudes/listarResumenSolicitudCeseTemaCoordinador",
    );
    return response.data as SolicitudCeseTemaResumen[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error al obtener los resúmenes de solicitudes del coordinador:",
        error.message,
      );
    } else {
      console.error("Error inesperado al obtener los resúmenes:", error);
    }
    throw error;
  }
}

export async function aceptarSolicitudCeseTema(
  idUsuario: number,
  idSolicitud: number,
  rolSolicitud: string,
): Promise<SolicitudCeseTemaResumen[]> {
  try {
    const response = await axiosInstance.patch(
      "/solicitudes/aprobarSolicitudCeseTema",
      null,
      {
        params: {
          idUsuario,
          idSolicitud,
          rolSolicitud,
        },
      },
    );

    return response.data as SolicitudCeseTemaResumen[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error al aceptar la solicitud:", error.message);
    } else {
      console.error("Error inesperado al aceptar la solicitud:", error);
    }
    throw error;
  }
}

export async function rechazarSolicitudCeseTema(
  idUsuario: number,
  idSolicitud: number,
  rolSolicitud: string,
): Promise<SolicitudCeseTemaResumen[]> {
  try {
    console.log(idSolicitud, idUsuario, rolSolicitud);
    const response = await axiosInstance.patch(
      "/solicitudes/rechazarSolicitudCeseTema",
      null,
      {
        params: {
          idUsuario,
          idSolicitud,
          rolSolicitud,
        },
      },
    );

    return response.data as SolicitudCeseTemaResumen[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error al rechazar la solicitud:", error.message);
    } else {
      console.error("Error inesperado al rechazar la solicitud:", error);
    }
    throw error;
  }
}

export async function registrarSolicitudCeseTema(
  data: SolicitudCeseTemaRegistro,
): Promise<{ success: boolean; message: string; solicitudId?: number }> {
  try {
    const response = await axiosInstance.post(
      "/solicitudes/registrarSolicitudCeseTema",
      data,
    );

    return {
      success: true,
      message: "Solicitud registrada exitosamente",
      solicitudId: response.data?.solicitudId,
    };
  } catch (error: unknown) {
    let message = "Ocurrió un error al registrar la solicitud.";

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message ?? message;
    }

    console.error("Error al registrar solicitud:", error);

    return {
      success: false,
      message,
    };
  }
}

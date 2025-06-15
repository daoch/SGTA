// Update the import path below if the actual path is different
import axiosInstance from "@/lib/axios/axios-instance";
import axios from "axios";
import {
  DetalleSolicitudCambioAsesor,
  SolicidudRegistro,
  SolicitudCambioAsesorResumen,
  TemaActual,
} from "../types/cambio-asesor/entidades";
import { Asesor } from "../types/perfil/entidades";

export interface InformacionTesisResponse {
  temaActual: TemaActual;
  asesoresActuales: Asesor[];
}

export async function getDetalleSolicitudCambioAsesor(
  idSolicitud: number,
): Promise<DetalleSolicitudCambioAsesor> {
  try {
    const response = await axiosInstance.get(
      "/solicitudes/listarDetalleSolicitudCambioAsesorUsuario",
      {
        params: { idSolicitud },
      },
    );
    return response.data as DetalleSolicitudCambioAsesor;
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

export async function getResumenesSolicitudCambioAsesor(
  idUsuario: number,
  rolSolicitud: string,
): Promise<SolicitudCambioAsesorResumen[]> {
  try {
    console.log(idUsuario, rolSolicitud);
    const response = await axiosInstance.get(
      "/solicitudes/listarResumenSolicitudCambioAsesorUsuario",
      {
        params: { idUsuario, rolSolicitud },
      },
    );
    return response.data as SolicitudCambioAsesorResumen[];
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

export async function getResumenesSolicitudCambioAsesorCoordinador(): Promise<
  SolicitudCambioAsesorResumen[]
> {
  try {
    const response = await axiosInstance.get(
      "/solicitudes/listarResumenSolicitudCambioAsesorCoordinador",
    );
    return response.data as SolicitudCambioAsesorResumen[];
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

export async function getInformacionTesisPorAlumno(
  idAlumno: number,
): Promise<InformacionTesisResponse> {
  try {
    const response = await axiosInstance.get(
      `/temas/listarTemaActivoConAsesor/${idAlumno}`,
    );
    return response.data as InformacionTesisResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error al obtener información de tesis:", error.message);
    } else {
      console.error("Error inesperado al obtener información de tesis:", error);
    }
    throw error;
  }
}

export async function registrarSolicitudCambioAsesor(
  data: SolicidudRegistro,
): Promise<{ success: boolean; message: string; solicitudId?: number }> {
  try {
    const response = await axiosInstance.post(
      "/solicitudes/registrarSolicitudCambioAsesor",
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

export async function aceptarSolicitud(
  idUsuario: number,
  idSolicitud: number,
  rolSolicitud: string,
): Promise<SolicitudCambioAsesorResumen[]> {
  try {
    const response = await axiosInstance.patch(
      "/solicitudes/aprobarSolicitudCambioAsesor",
      null,
      {
        params: {
          idUsuario,
          idSolicitud,
          rolSolicitud,
        },
      },
    );

    return response.data as SolicitudCambioAsesorResumen[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error al aceptar la solicitud:", error.message);
    } else {
      console.error("Error inesperado al aceptar la solicitud:", error);
    }
    throw error;
  }
}

export async function rechazarSolicitud(
  idUsuario: number,
  idSolicitud: number,
  rolSolicitud: string,
): Promise<SolicitudCambioAsesorResumen[]> {
  try {
    console.log(idSolicitud, idUsuario, rolSolicitud);
    const response = await axiosInstance.patch(
      "/solicitudes/rechazarSolicitudCambioAsesor",
      null,
      {
        params: {
          idUsuario,
          idSolicitud,
          rolSolicitud,
        },
      },
    );

    return response.data as SolicitudCambioAsesorResumen[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error al rechazar la solicitud:", error.message);
    } else {
      console.error("Error inesperado al rechazar la solicitud:", error);
    }
    throw error;
  }
}

export async function aceptarSolicitudPorAsesor(
  idSolicitud: number,
  comentario: string,
): Promise<SolicitudCambioAsesorResumen[]> {
  try {
    const response = await axiosInstance.patch(
      "/solicitudes/aprobarSolicitudCambioAsesorAsesor",
      null,
      {
        params: {
          idSolicitud,
          comentario,
        },
      },
    );

    return response.data as SolicitudCambioAsesorResumen[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error al aceptar la solicitud:", error.message);
    } else {
      console.error("Error inesperado al aceptar la solicitud:", error);
    }
    throw error;
  }
}

export async function rechazarSolicitudPorAsesor(
  idSolicitud: number,
  comentario: string,
): Promise<SolicitudCambioAsesorResumen[]> {
  try {
    const response = await axiosInstance.patch(
      "/solicitudes/rechazarSolicitudCambioAsesorAsesor",
      null,
      {
        params: {
          idSolicitud,
          comentario,
        },
      },
    );

    return response.data as SolicitudCambioAsesorResumen[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error al aceptar la solicitud:", error.message);
    } else {
      console.error("Error inesperado al aceptar la solicitud:", error);
    }
    throw error;
  }
}

export async function rechazarSolicitudPorCoordinador(
  idSolicitud: number,
  comentario: string,
): Promise<SolicitudCambioAsesorResumen[]> {
  try {
    const response = await axiosInstance.patch(
      "/solicitudes/rechazarSolicitudCambioAsesorCoordinador",
      null,
      {
        params: {
          idSolicitud,
          comentario,
        },
      },
    );

    return response.data as SolicitudCambioAsesorResumen[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error al aceptar la solicitud:", error.message);
    } else {
      console.error("Error inesperado al aceptar la solicitud:", error);
    }
    throw error;
  }
}

export async function aceptarSolicitudPorCoordinador(
  idSolicitud: number,
  comentario: string,
): Promise<SolicitudCambioAsesorResumen[]> {
  try {
    const response = await axiosInstance.patch(
      "/solicitudes/aprobarSolicitudCambioAsesorCoordinador",
      null,
      {
        params: {
          idSolicitud,
          comentario,
        },
      },
    );

    return response.data as SolicitudCambioAsesorResumen[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error al aceptar la solicitud:", error.message);
    } else {
      console.error("Error inesperado al aceptar la solicitud:", error);
    }
    throw error;
  }
}

// Update the import path below if the actual path is different
import axiosInstance from "@/lib/axios/axios-instance";
import {
  getMockDetalleSolicitudCambioAsesor,
  getMockSolicitudCambioAsesorResumen,
  getMockTemaYAsesor,
} from "../../mocks/requests/assessor-change-requests";
import {
  DetalleSolicitudCambioAsesor,
  SolicidudRegistro,
  SolicitudCambioAsesorResumen,
  TemaActual,
} from "../../types/cambio-asesor/entidades";
import { Asesor } from "../../types/perfil/entidades";

export interface InformacionTesisResponse {
  temaActual: TemaActual;
  asesorActual: Asesor;
}

export async function getDetalleSolicitudCambioAsesor(
  idSolicitud: number,
  idUsuario: number,
  rolSolicitud: string,
): Promise<DetalleSolicitudCambioAsesor> {
  try {
    /*
    const response = await axiosInstance.get("/solicitudes/detalleSolicitud", {
      params: {
        idSolicitud,
        idUsuario,
        rolSolicitud,
      },
    });

    return response.data as DetalleSolicitudCambioAsesor;
    */

    return getMockDetalleSolicitudCambioAsesor();
  } catch (error) {
    console.error("Error al obtener el detalle de la solicitud:", error);
    throw error;
  }
}

export async function getResumenesSolicitudCambioAsesor(
  idUsuario: number,
  rolSolicitud: string,
): Promise<SolicitudCambioAsesorResumen[]> {
  try {
    /*
    const response = await axiosInstance.get("/solicitudes/listarResumenes", {
      params: {
        idUsuario,
        rolSolicitud,
      },
    });

    return response.data as SolicitudCambioAsesorResumen[];*/
    return getMockSolicitudCambioAsesorResumen();
  } catch (error) {
    console.error("Error al obtener los resúmenes de solicitudes:", error);
    throw error;
  }
}

export async function getInformacionTesisPorAlumno(
  idAlumno: number,
): Promise<InformacionTesisResponse> {
  try {
    /*
    const response = await axiosInstance.get("/solicitudes/informacion-tesis/", {
      params: { idAlumno },
    });

    return response.data as InformacionTesisResponse; */
    return getMockTemaYAsesor();
  } catch (error) {
    console.error("Error al obtener información de tesis:", error);
    throw error;
  }
}

export async function registrarSolicitudCambioAsesor(
  data: SolicidudRegistro,
): Promise<{ success: boolean; message: string; solicitudId?: number }> {
  try {
    const response = await axiosInstance.post(
      "/solicitudes/registrar-cambio-asesor",
      data,
    );

    return {
      success: true,
      message: "Solicitud registrada exitosamente",
      solicitudId: response.data?.solicitudId, // Asegúrate de que la API retorne esto
    };
  } catch (error: any) {
    console.error("Error al registrar solicitud:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Ocurrió un error al registrar la solicitud.",
    };
  }
}

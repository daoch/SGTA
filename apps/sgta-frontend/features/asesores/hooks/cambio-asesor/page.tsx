// Update the import path below if the actual path is different
import {
  getMockDetalleSolicitudCambioAsesor,
  getMockSolicitudCambioAsesorResumen,
} from "../../mocks/requests/assessor-change-requests";
import {
  DetalleSolicitudCambioAsesor,
  SolicitudCambioAsesorResumen,
} from "../../types/cambio-asesor/entidades";

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

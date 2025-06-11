import axiosInstance from "@/lib/axios/axios-instance";


import { AlumnoReviewer, AlumnoTemaDetalle } from "../types/Alumno.type";
import { EntregableCriteriosDetalle } from "../types/Entregable.type";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { OverdueSummary } from "../types/OverdueSummary.type";


export const obtenerDetalleTemaAlumno = async (): Promise<AlumnoTemaDetalle> => {

    try {
        const { idToken } = useAuthStore.getState();
        const response = await axiosInstance.get<AlumnoTemaDetalle>("/usuario/detalle-tema-alumno", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener detalle del tema del alumno:", error);
        throw error;
    }
};


export const findStudentsForReviewer = async (cadenaBusqueda: string): Promise<AlumnoReviewer[]> => {
  try {
    const { idToken } = useAuthStore.getState();
    const response = await axiosInstance.get("/usuario/findByStudentsForReviewer", {
      params: {
        cadenaBusqueda
      },
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al buscar estudiantes para el revisor:", error);
    throw error;
  }
};

/*
export const getEntregablesAlumno = async (alumnoId: string) => {
  const response = await axiosInstance.get(`/api/v1/reports/entregables/${alumnoId}`);
  return response.data;
};
*/

export const getEntregablesAlumno = async () => {
  try {
    const { idToken } = useAuthStore.getState();

    console.log(" idToken obtenido:", idToken);

    const response = await axiosInstance.get(
        "/reports/entregables",
       {
         headers: {
           Authorization: `Bearer ${idToken}`,
         },
       }
     );

    console.log(" Respuesta de entregables:", response.data);

    return response.data;
  } catch (error) {
    console.error(" Error al obtener entregables del alumno:", error);
    throw error;
  }
};


export const getEntregablesConCriterios = async (usuarioId: number): Promise<EntregableCriteriosDetalle[]> => {
  try {
    const response = await axiosInstance.get<EntregableCriteriosDetalle[]>(
      `/reports/entregables-criterios/${usuarioId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener entregables con criterios:", error);
    throw error;
  }
};

export const obtenerEntregablesConRetraso = async (): Promise<OverdueSummary> => {
  try {
    const { idToken } = useAuthStore.getState();
    const response = await axiosInstance.get<OverdueSummary>("/api/notifications/overdue-summary", {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener detalle del tema del alumno:", error);
    throw error;
  }
};


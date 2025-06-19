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


export const getEntregablesAlumnoSeleccionado = async (alumnoId: number) => {
  const response = await axiosInstance.get(`/reports/entregables/${alumnoId}`);
  return response.data;
};


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


export const getEntregablesConCriterios = async (): Promise<EntregableCriteriosDetalle[]> => {
  try {
    const { idToken } = useAuthStore.getState();
    const response = await axiosInstance.get<EntregableCriteriosDetalle[]>(
      `/reports/entregables-criterios`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
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
    const response = await axiosInstance.get<OverdueSummary>("/notifications/overdue-summary", {
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

// Servicios para reportes del coordinador
import type {
  AdvisorDistribution,
  AdvisorPerformance,
  JurorDistribution,
  TopicArea,
  TopicTrend
} from "../types/coordinator-reports.type";

// Re-exportar los tipos para compatibilidad
export type {
  AdvisorDistribution,
  AdvisorPerformance,
  JurorDistribution,
  TopicArea,
  TopicTrend
};

export const obtenerTemasPorArea = async (ciclo: string): Promise<TopicArea[]> => {
  try {
    const { idToken } = useAuthStore.getState();

    const response = await axiosInstance.get<TopicArea[]>("/reports/topics-areas", {
      params: { ciclo },
      headers: {
        Authorization: `Bearer ${idToken}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener temas por área:", error);
    throw error;
  }
};

export const obtenerDistribucionAsesores = async (ciclo: string): Promise<AdvisorDistribution[]> => {
  try {
    const { idToken } = useAuthStore.getState();

    const response = await axiosInstance.get<AdvisorDistribution[]>("/reports/advisors-distribution", {
      params: { ciclo },
      headers: { 
        Authorization: `Bearer ${idToken}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener distribución de asesores:", error);
    throw error;
  }
};

export const obtenerDistribucionJurados = async (ciclo: string): Promise<JurorDistribution[]> => {
  try {
    const { idToken } = useAuthStore.getState();

    const response = await axiosInstance.get<JurorDistribution[]>("/reports/jurors-distribution", {
      params: { ciclo },
      headers: { 
        Authorization: `Bearer ${idToken}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener distribución de jurados:", error);
    throw error;
  }
};

export const obtenerDesempenoAsesores = async (ciclo: string): Promise<AdvisorPerformance[]> => {
  try {
    const { idToken } = useAuthStore.getState();
    const response = await axiosInstance.get<AdvisorPerformance[]>("/reports/advisors/performance", {
      params: { ciclo },
      headers: {
        Authorization: `Bearer ${idToken}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener desempeño de asesores:", error);
    throw error;
  }
};

export const obtenerTendenciasTemas = async (): Promise<TopicTrend[]> => {
  try {
    const { idToken } = useAuthStore.getState();
    const response = await axiosInstance.get<TopicTrend[]>("/reports/topics-trends", {
      headers: {
        Authorization: `Bearer ${idToken}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener tendencias de temas:", error);
    throw error;
  }
};


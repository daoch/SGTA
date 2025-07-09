import axiosInstance from "@/lib/axios/axios-instance";
import { useAuthStore } from "@/features/auth/store/auth-store";

// Interfaz para el listado de etapas formativas
export interface EtapaFormativaListItem {
  id: number;
  nombre: string;
  carreraNombre: string;
  estado: "EN_CURSO" | "FINALIZADO";
}

// Interfaz para el detalle de una etapa formativa
export interface EtapaFormativaDetail {
  id: number;
  nombre: string;
  carreraNombre: string;
  carreraId: number;
  creditajePorTema: number;
  duracionExposicion: string;
  activo: boolean;
  cicloActual: string;
  estadoActual: "EN_CURSO" | "FINALIZADO";
  historialCiclos: Array<{
    id: number;
    ciclo: string;
    estado: "EN_CURSO" | "FINALIZADO";
  }>;
}

// Interfaz para etapas formativas del coordinador
export interface EtapaFormativaCoordinador {
  id: number;
  nombre: string;
  creditajePorTema: number;
  duracionExposicion: string;
  activo: boolean;
  carreraId: number;
}

export const etapasFormativasService = {
  // Obtener todas las etapas formativas
  getAll: async (): Promise<EtapaFormativaListItem[]> => {
    const response = await axiosInstance.get("/etapas-formativas");
    return response.data;
  },

  // Obtener una etapa formativa por ID
  getById: async (id: string | number): Promise<EtapaFormativaDetail> => {
    const response = await axiosInstance.get(`/etapas-formativas/${id}`);
    return response.data;
  },

  // Obtener etapas formativas activas por coordinador
  getActivasByCoordinador: async (): Promise<EtapaFormativaCoordinador[]> => {
    const { idToken } = useAuthStore.getState();
    const response = await axiosInstance.get(
      "/etapas-formativas/listarActivasPorCoordinador",
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  },

  // Crear una nueva etapa formativa
  create: async (
    etapaFormativa: Omit<EtapaFormativaDetail, "id">,
  ): Promise<EtapaFormativaDetail> => {
    const { idToken } = useAuthStore.getState();
    const response = await axiosInstance.post(
      "/etapas-formativas/crear",
      etapaFormativa,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  },

  // Actualizar una etapa formativa
  update: async (
    id: string | number,
    etapaFormativa: Partial<EtapaFormativaDetail>,
  ): Promise<EtapaFormativaDetail> => {
    const { idToken } = useAuthStore.getState();
    const response = await axiosInstance.put(
      `/etapas-formativas/actualizar/${id}`,
      etapaFormativa,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  },

  // Eliminar una etapa formativa
  delete: async (id: string | number): Promise<void> => {
    const { idToken } = useAuthStore.getState();
    await axiosInstance.delete(`/etapas-formativas/eliminar/${id}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
  },
};

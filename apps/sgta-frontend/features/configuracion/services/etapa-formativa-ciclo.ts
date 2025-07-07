import { useAuthStore } from "@/features/auth/store/auth-store";
import axiosInstance from "@/lib/axios/axios-instance";
import { EtapaFormativaCiclo, EtapaFormativaCicloCreate } from "../types/etapa-formativa-ciclo";

export interface EtapaFormativaXCicloTesista {
    id: number;
    etapaFormativaId: number;
    etapaFormativaNombre: string;
    cicloId: number;
    cicloNombre: string;
    carreraId: number;
    carreraNombre: string;
    activo: boolean;
    estado: string;
}

export interface PageResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface EtapaFormativaCicloPageRequest {
    page?: number;
    size?: number;
    search?: string;
    estado?: string;
    anio?: number;
    semestre?: string;
}

export const etapaFormativaCicloService = {
    getAllByIdCarrera: async (): Promise<EtapaFormativaCiclo[]> => {
        const { idToken } = useAuthStore.getState();
        const response = await axiosInstance.get("/etapa-formativa-x-ciclo/carreraList",
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
        );
        return response.data;
    },

    getAllByIdCarreraPaginated: async (params: EtapaFormativaCicloPageRequest = {}): Promise<PageResponse<EtapaFormativaCiclo>> => {
        const { idToken } = useAuthStore.getState();
        const queryParams = new URLSearchParams();
        
        if (params.page !== undefined) queryParams.append("page", params.page.toString());
        if (params.size !== undefined) queryParams.append("size", params.size.toString());
        if (params.search) queryParams.append("search", params.search);
        if (params.estado) queryParams.append("estado", params.estado);
        if (params.anio) queryParams.append("anio", params.anio.toString());
        if (params.semestre) queryParams.append("semestre", params.semestre);

        const response = await axiosInstance.get(`/etapa-formativa-x-ciclo/carreraListPaginated?${queryParams.toString()}`,
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
        );
        return response.data;
    },

    getByTesista: async (): Promise<EtapaFormativaXCicloTesista[]> => {
        const { idToken } = useAuthStore.getState();
        const response = await axiosInstance.get("/etapa-formativa-x-ciclo/tesista",
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
        );
        return response.data;
    },

    create: async (etapaFormativaCiclo: EtapaFormativaCicloCreate): Promise<EtapaFormativaCiclo> => {
        try {
          const response = await axiosInstance.post("/etapa-formativa-x-ciclo/create", etapaFormativaCiclo);
          return response.data;
        } catch (error: any) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Error al crear la etapa";
          throw new Error(message);
        }
    },

    delete: async (id: number): Promise<void> => {
        const { idToken } = useAuthStore.getState();
        await axiosInstance.post(`/etapa-formativa-x-ciclo/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
    },

    actualizarEstado: async (relacionId: number, estado: string): Promise<EtapaFormativaCiclo> => {
      const response = await axiosInstance.put(
        `/etapa-formativa-x-ciclo/actualizar-relacion/${relacionId}`,
        { estado }
      );
      return response.data;
    }

};

export const ciclosService = {
    getAll: async () => {
        const response = await axiosInstance.get("/ciclos/listarCiclos");
        return response.data;
    },

    getAllYears: async () => {
        const response = await axiosInstance.get("/ciclos/listarTodosLosCiclos");
        return response.data;
    }
};



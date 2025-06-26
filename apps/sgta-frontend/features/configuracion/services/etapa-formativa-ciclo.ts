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
        const response = await axiosInstance.post("/etapa-formativa-x-ciclo/create", etapaFormativaCiclo);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.post(`/etapa-formativa-x-ciclo/delete/${id}`);
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



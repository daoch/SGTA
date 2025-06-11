import axiosInstance from "@/lib/axios/axios-instance";
import { EtapaFormativaCiclo, EtapaFormativaCicloCreate } from "../types/etapa-formativa-ciclo";
import { useAuthStore } from "@/features/auth/store/auth-store";

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
    }
};


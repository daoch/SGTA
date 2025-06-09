import axiosInstance from "@/lib/axios/axios-instance";
import { EtapaFormativaCiclo, EtapaFormativaCicloCreate } from "../types/etapa-formativa-ciclo";
import { useAuthStore } from "@/features/auth/store/auth-store";

export const etapaFormativaCicloService = {
    getAllByIdCarrera: async (): Promise<EtapaFormativaCiclo[]> => {
        const { idToken } = useAuthStore.getState();
        const response = await axiosInstance.get(`/etapa-formativa-x-ciclo/carreraList`,
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

    update: async (etapaFormativaId: number, cicloId: number, data: { nombre: string; creditajePorTema: number }) => {
        const response = await fetch(
        `http://localhost:5000/etapas-formativas/actualizar-relacion/${etapaFormativaId}/${cicloId}`,
        {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
        );
        if (!response.ok) throw new Error("Error al actualizar la etapa");
        return response.json();
    },

    actualizarEstado: async (relacionId: number, estado: string) => {
    const response = await fetch(
      `http://localhost:5000/etapa-formativa-x-ciclo/actualizar-relacion/${relacionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado }),
      }
    );
    return response.json();
  }
};

export const ciclosService = {
    getAll: async () => {
        const response = await axiosInstance.get("/ciclos/listarCiclos");
        return response.data;
    }
};


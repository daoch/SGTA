import axiosInstance from "@/lib/axios/axios-instance";
import { EtapaFormativaCiclo, EtapaFormativaCicloCreate } from "../types/etapa-formativa-ciclo";


export const etapaFormativaCicloService = {
    getAllByIdCarrera: async (idCarrera: number): Promise<EtapaFormativaCiclo[]> => {
        const response = await axiosInstance.get(`/etapa-formativa-x-ciclo/carrera/${idCarrera}`);
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
    }
};

export const ciclosService = {
    getAll: async () => {
        const response = await axiosInstance.get("/ciclos/listarCiclos");
        return response.data;
    }
};


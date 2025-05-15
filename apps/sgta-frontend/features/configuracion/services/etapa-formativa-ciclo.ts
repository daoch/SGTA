import axiosInstance from "@/lib/axios/axios-instance";
import { EtapaFormativaCiclo } from "../types/etapa-formativa-ciclo";



export const etapaFormativaCicloService = {
    getAllByIdCarrera: async (idCarrera: number): Promise<EtapaFormativaCiclo[]> => {
        const response = await axiosInstance.get(`/etapa-formativa-x-ciclo/carrera/${idCarrera}`);
        return response.data;
    }
}

export const ciclosService = {
    getAll: async () => {
        const response = await axiosInstance.get("/ciclos/listarCiclos");
        return response.data;
    }
}
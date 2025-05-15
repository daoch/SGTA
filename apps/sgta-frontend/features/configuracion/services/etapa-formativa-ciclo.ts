import axiosInstance from "@/lib/axios/axios-instance";

export interface EtapaFormativaCiclo {
    id: number;
    etapaFormativaId: number;
    cicloId: number;
    carreraId: number;
    activo: boolean;
    nombreEtapaFormativa: string;
    creditajePorTema: number;
    nombre: string;
    descripcion?: string;
    objetivos?: string;
    entregables?: number;
    exposiciones?: number;
}

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
import axiosInstance from "@/lib/axios/axios-instance";
import {
  EtapaFormativaCiclo,
  EtapaFormativaCicloCreate,
} from "../types/etapa-formativa-ciclo";

export const etapaFormativaCicloService = {
  getAllByIdCarrera: async (
    idCarrera: number,
  ): Promise<EtapaFormativaCiclo[]> => {
    const response = await axiosInstance.get(
      `/etapa-formativa-x-ciclo/carrera/${idCarrera}`,
    );
    return response.data;
  },

  create: async (
    etapaFormativaCiclo: EtapaFormativaCicloCreate,
  ): Promise<EtapaFormativaCiclo> => {
    const response = await axiosInstance.post(
      "/etapa-formativa-x-ciclo/create",
      etapaFormativaCiclo,
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.post(`/etapa-formativa-x-ciclo/delete/${id}`);
  },
};

export const ciclosService = {
  getAll: async () => {
    const response = await axiosInstance.get("/ciclos/listarCiclos");
    return response.data;
  },
};

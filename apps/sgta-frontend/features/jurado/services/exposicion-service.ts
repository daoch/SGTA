import axiosInstance from "@/lib/axios/axios-instance";
import { Sala } from "../types/exposicion.types";
import { FormValues } from "../schemas/exposicion-form-schema";
import { EtapaFormativaXSalaExposicion } from "../dtos/EtapaFormativaXSalaExposicion";

export const getEtapasFormativasByCoordinador = async (
  coordinador_id: number,
) => {
  const response = await axiosInstance.get(
    `/etapas-formativas/coordinador/${coordinador_id}`,
  );
  return response.data;
};

export const getExposicionPorEtapaFormativa = async (
  etapaFormativaId: number,
) => {
  const response = await axiosInstance.get(
    `/exposicion/listarExposicionXCicloActualEtapaFormativa?etapaFormativaId=${etapaFormativaId}`,
  );
  return response.data;
};

export const enviarPlanificacion = async (data: FormValues) => {
  console.log("Datos enviados para la planificación:", data);
  // const response = await axiosInstance.post("/tu/endpoint/api", data);
  // return response.data;
};

export const getSalasDisponiblesByEtapaFormativa = async (
  etapaFormativaId: number,
) => {
  const response = await axiosInstance.get(
    `/etapaFormativaXSalaExposicion/listarEtapaFormativaXSalaExposicionByEtapaFormativa/${etapaFormativaId}`,
  );

  const salas: Sala[] = response.data.map(
    (item: EtapaFormativaXSalaExposicion) => ({
      id: item.salaExposicionId,
      nombre: item.nombreSalaExposicion,
    }),
  );

  return salas;
};

export const getCiclos = async () => {
  try {
    const response = await axiosInstance.get("/ciclos/listarCiclos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener ciclos:", error);
    throw new Error("Error al obtener ciclos");
  }
};

export const getCursos = async () => {
  try {
    const response = await axiosInstance.get(
      "/etapas-formativas/listarActivas",
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    throw new Error("Error al obtener cursos");
  }
};

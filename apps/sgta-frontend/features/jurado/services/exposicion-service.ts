import axiosInstance from "@/lib/axios/axios-instance";
import { Sala } from "../types/exposicion.types";
import { FormValues } from "../schemas/exposicion-form-schema";
import { EtapaFormativaXSalaExposicion } from "../dtos/EtapaFormativaXSalaExposicion";

export const getEtapasFormativasPorInicializarByCoordinador = async (
  coordinador_id: number,
) => {
  const response = await axiosInstance.get(
    `/etapas-formativas/listarPorInicializarByCoordinador/${coordinador_id}`,
  );
  return response.data;
};

export const getExposicionSinInicializarPorEtapaFormativa = async (
  etapaFormativaId: number,
) => {
  const response = await axiosInstance.get(
    `/exposicion/listarExposicionesSinInicializarByEtapaFormativaEnCicloActual/${etapaFormativaId}`,
  );
  return response.data;
};

export const enviarPlanificacion = async (data: FormValues) => {
  const payload = {
    etapaFormativaId: data.etapa_formativa_id,
    exposicionId: data.exposicion_id,
    fechas: data.fechas.map((fechaItem) => {
      if (!fechaItem.fecha) {
        throw new Error(
          "La fecha no puede ser nula al enviar la planificación",
        );
      }

      const fechaISO = fechaItem.fecha.toISOString().split("T")[0];
      return {
        fechaHoraInicio: new Date(
          `${fechaISO}T${fechaItem.hora_inicio}`,
        ).toISOString(),
        fechaHoraFin: new Date(
          `${fechaISO}T${fechaItem.hora_fin}`,
        ).toISOString(),
        salas: fechaItem.salas,
      };
    }),
  };

  console.log("Datos enviados para la planificación (mapeados):", payload);

  const response = await axiosInstance.post(
    "/jornada-exposicion/initialize",
    payload,
  );

  return response.data;
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

export const getCursosByCoordinador = async (coordinadorId: number) => {
  try {
    const response = await axiosInstance.get(
      `/etapas-formativas/listarActivasPorCoordinador/${coordinadorId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener cursos por coordinador:", error);
    throw new Error("Error al obtener cursos por coordinador");
  }
};

export const getExposicionesInicializadasByCoordinador = async (
  coordinadorId: number,
) => {
  try {
    const response = await axiosInstance.get(
      `/exposicion/listarExposicionesInicializadasXCoordinador/${coordinadorId}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener exposiciones inicializadas por coordinador:",
      error,
    );
    throw new Error(
      "Error al obtener exposiciones inicializadas por coordinador",
    );
  }
};


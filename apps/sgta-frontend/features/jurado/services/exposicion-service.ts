import axiosInstance from "@/lib/axios/axios-instance";
import { ExposicionAlumno, Sala } from "../types/exposicion.types";
import { FormValues } from "../schemas/exposicion-form-schema";
import { EtapaFormativaXSalaExposicion } from "../dtos/EtapaFormativaXSalaExposicion";
import axios from "axios";

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

export const enviarPlanificacion = async (
  data: FormValues,
): Promise<{ success: boolean; message: string }> => {
  try {
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

    return {
      success: true,
      message: "Planificación enviada correctamente",
    };
  } catch (error: unknown) {
    const mensajeError =
      axios.isAxiosError(error) && error.response?.data?.mensaje
        ? error.response.data.mensaje
        : "Error inesperado al enviar la planificación";

    console.error("Error al enviar planificación:", mensajeError);

    return {
      success: false,
      message: mensajeError,
    };
  }
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

export const getCursosByCoordinador = async (bearerTokenId: string) => {
  try {
    const response = await axiosInstance.get("/etapas-formativas/listarActivasPorCoordinador", {
      headers: {
        "Authorization": `Bearer ${bearerTokenId}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener cursos por coordinador:", error);
    throw new Error("Error al obtener cursos por coordinador");
  }
};

export const getEstadosExposicion = async () => {
  try {
    const response = await axiosInstance.get("/estado-planificacion/getAll");
    return response.data;
  } catch (error) {
    console.error("Error al obtener estados de exposicion:", error);
    throw new Error("Error al obtener estados de exposicion");
  }
};

export const getExposicionesInicializadasByCoordinador = async (
  tokenId: string,
) => {
  try {
    const response = await axiosInstance.get(
      "/exposicion/listarExposicionesInicializadasXCoordinador", {
        headers: {
          "Authorization": `Bearer ${tokenId}`,
        }
      }
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

export const getExposicionesEstudiantesByEstudianteId = async (
  bearerTokenId: string,
) => {
  try {
    // const response = await axiosInstance.get(
    //   `/exposicion/listarExposicionesPorUsuario/${bearerTokenId}`,
    // );

    const response = await axiosInstance.get("/exposicion/listarExposicionesPorUsuario", {
      headers: {
        "Authorization": `Bearer ${bearerTokenId}`,
      },
    });

    console.log("Datos de exposiciones obtenidos:", response.data);

    return response.data.map((item: ExposicionAlumno) => ({
      estudianteId: item.estudianteId,
      exposicionId: item.exposicionId,
      tema_id: item.temaId,
      estado: item.estado,
      link_exposicion: item.linkExposicion,
      link_grabacion: item.linkGrabacion,
      datetimeInicio: new Date(item.datetimeInicio),
      datetimeFin: new Date(item.datetimeFin),
      sala: item.sala,
      titulo: item.titulo,
      etapaFormativa: item.etapaFormativa,
      ciclo: item.ciclo,
      miembrosJurado: item.miembrosJurado.map((miembro) => ({
        id_persona: miembro.id_persona,
        nombre: miembro.nombre,
        tipo: miembro.tipo,
      })),
    }));
  } catch (error) {
    console.error(
      "Error al obtener exposiciones de estudiantes por ID:",
      error,
    );
    throw new Error("Error al obtener exposiciones de estudiantes por ID");
  }
};

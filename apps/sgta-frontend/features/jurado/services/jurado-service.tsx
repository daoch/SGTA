import axiosInstance from "@/lib/axios/axios-instance";
import {
  AreaEspecialidad,
  Asesor,
  Estudiante,
  EtapaFormativaExposiciones,
  Exposicion,
  MiembroJurado,
  TipoDedicacion,
  ExposicionJurado,
  MiembroJuradoExpo,
  EvaluacionExposicionJurado,
} from "../types/jurado.types";
import {
  JuradoDTO,
  JuradoTemasDetalle,
  JuradoUI,
  EtapaFormativa,
  Ciclo,
  AreaConocimientoJurado,
  TesisDetalleExposicion,
  MiembroJuradoDetalle,
} from "../types/juradoDetalle.types";
import axios from "axios";
import Exposiciones from "../views/vista-exposiciones/alumno-exposiciones";

export const getAllJurados = async (): Promise<JuradoUI[]> => {
  const response = await axiosInstance.get<JuradoDTO[]>("/jurado");

  const data = response.data;

  return data.map((j) => ({
    id: j.id.toString(),
    code: j.codigoPucp,
    user: {
      name: `${j.nombres} ${j.primerApellido} ${j.segundoApellido}`,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${j.nombres} ${j.primerApellido}`,
      )}`,
    },
    email: j.correoElectronico,
    dedication: j.tipoDedicacion,
    assigned: j.asignados.toString(),
    specialties: j.especialidades,
    status: j.activo ? "Activo" : "Inactivo",
  }));
};

export const getAllAreasEspecialidad = async (): Promise<
  AreaEspecialidad[]
> => {
  const response = await axiosInstance.get("/areaConocimiento/list");
  const data = response.data;

  return data.map((area: AreaEspecialidad) => ({
    id: area.id,
    nombre: area.nombre,
    descripcion: area.descripcion,
    idCarrera: area.idCarrera,
  }));
};

export const getAllTiposDedicacion = async (): Promise<TipoDedicacion[]> => {
  const response = await axiosInstance.get("/tipodedicacion");
  const data = response.data;

  return data.map((tipo: TipoDedicacion) => ({
    id: tipo.id,
    iniciales: tipo.iniciales,
    descripcion: tipo.descripcion,
    activo: tipo.activo,
    fechaCreacion: tipo.fechaCreacion,
    fechaModificacion: tipo.fechaModificacion,
  }));
};

export const getTemasJurado = async (
  idJurado: number,
): Promise<JuradoTemasDetalle[]> => {
  const response = await axiosInstance.get(`/jurado/temas-tesis/${idJurado}`);
  const data = response.data;

  return data.map((tema: JuradoTemasDetalle) => ({
    id: tema.id,
    titulo: tema.titulo,
    codigo: tema.codigo,
    resumen: tema.resumen,
    rol: tema.rol,
    estudiantes: tema.estudiantes,
    sub_areas_conocimiento: tema.sub_areas_conocimiento,
    etapaFormativaTesis: tema.etapaFormativaTesis,
    cicloTesis: tema.cicloTesis,
    estadoTema: tema.estadoTema,
  }));
};

export const getEtapasFormativasNombres = async (): Promise<
  EtapaFormativa[]
> => {
  const response = await axiosInstance.get(
    "/etapas-formativas/listarActivasNombre",
  );
  const data = response.data;

  return data.map((etapa: EtapaFormativa) => ({
    etapaFormativaId: etapa.etapaFormativaId,
    nombre: etapa.nombre,
  }));
};

export const getCiclos = async (): Promise<Ciclo[]> => {
  const response = await axiosInstance.get("/ciclos/listarCiclos");
  const data = response.data;

  return data.map((ciclo: Ciclo) => ({
    id: ciclo.id,
    semestre: ciclo.semestre,
    anio: ciclo.anio,
  }));
};

export const listarAreasConocimientoJurado = async (
  idJurado: number,
): Promise<AreaConocimientoJurado[]> => {
  const response = await axiosInstance.get(
    `/jurado/${idJurado}/areas-conocimiento`,
  );
  const data = response.data;

  return data.areas_conocimiento.map((area: AreaConocimientoJurado) => ({
    id: area.id,
    nombre: area.nombre,
  }));
};

export const getTemasModalAsignar = async (
  idJurado: number,
): Promise<JuradoTemasDetalle[]> => {
  const response = await axiosInstance.get(
    `/jurado/temas-otros-jurados/${idJurado}`,
  );
  const data = response.data;

  return data.map((tesis: JuradoTemasDetalle) => ({
    id: tesis.id,
    titulo: tesis.titulo,
    codigo: tesis.codigo,
    estudiantes: tesis.estudiantes.map((estudiante) => ({
      nombre: estudiante.nombre,
      codigo: estudiante.codigo,
    })),
    sub_areas_conocimiento: tesis.sub_areas_conocimiento.map((area) => ({
      id: area.id,
      nombre: area.nombre,
      id_area_conocimiento: area.id_area_conocimiento,
    })),
  }));
};

export const asignarTemaJurado = async (
  usuarioId: number,
  temaId: number,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axiosInstance.post("/jurado/asignar-tema", {
      usuarioId,
      temaId,
    });

    return {
      success: true,
      message: response.data.mensaje || "Tema asignado correctamente",
    };
  } catch (error: unknown) {
    // Manejo de errores
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.mensaje
        ? error.response.data.mensaje
        : "Error al asignar el tema al jurado";
    console.error("Error al asignar tema:", errorMessage);

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const desasignarMiembroJuradoTemaTodos = async (
  usuarioId: number,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axiosInstance.put(
      `/jurado/desasignar-jurado-tema-todos/${usuarioId}`,
    );

    return {
      success: true,
      message:
        response.data.mensaje ||
        "Todos los temas desasignados correctamente para el miembro de jurado",
    };
  } catch (error: unknown) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.mensaje
        ? error.response.data.mensaje
        : "Error al eliminar las asignaciones del miembro de jurado con sus temas";

    // console.error(
    //   "Error al eliminar desasignar miembro de jurado a todos sus temas:",
    //   errorMessage,
    // );

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const getExposicionesTema = async (
  temaId: number,
): Promise<TesisDetalleExposicion> => {
  try {
    console.log("Data de exposiciones:");
    const response = await axiosInstance.get(`/jurado/${temaId}/detalle`);
    const data = response.data;

    console.log("Data de exposiciones:", data);

    // Mapear la respuesta al formato requerido
    return {
      // Mapear los estudiantes directamente
      estudiantes: data.estudiantes.map((estudiante: Estudiante) => ({
        id: estudiante.id,
        nombre: estudiante.nombre,
        tipo: estudiante.tipo,
      })),

      // Para el asesor, tomamos el primer elemento del array asesores
      // que tenga tipo "Asesor"
      asesores: data.asesores.map((asesor: Asesor) => ({
        id: asesor.id,
        nombre: asesor.nombre,
        tipo: asesor.tipo,
      })),

      // Mapear los miembros del jurado
      miembrosJurado: data.miembrosJurado.map((miembro: MiembroJurado) => ({
        id: miembro.id,
        nombre: miembro.nombre,
        tipo: miembro.tipo,
      })),

      etapaFormativaTesis: data.etapasFormativas.map(
        (etapa: EtapaFormativaExposiciones) => ({
          id: etapa.id,
          nombre: etapa.nombre,
          exposiciones: etapa.exposiciones.map((expo: Exposicion) => ({
            id: expo.id,
            nombre: expo.nombre,
            estadoExposicion: expo.estadoExposicion,
            datetimeInicio: expo.datetimeInicio,
            datetimeFin: expo.datetimeFin,
            sala: expo.salaExposicion,
            miembrosJurado: expo.miembrosJurado.map(
              (miembroJurado: MiembroJuradoDetalle) => ({
                id: miembroJurado.id,
                nombres: miembroJurado.nombres,
                primerApellido: miembroJurado.primerApellido,
                segundoApellido: miembroJurado.segundoApellido,
                rol: miembroJurado.rol,
              }),
            ),
          })),
        }),
      ),
    };
  } catch (error: unknown) {
    console.error("Error al obtener exposiciones del tema:", error);
    return {
      estudiantes: [],
      asesores: [],
      miembrosJurado: [],
      etapaFormativaTesis: [],
    };
  }
};

export const desasignarJuradoTema = async (
  usuarioId: number,
  temaId: number,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axiosInstance.put("/jurado/desasignar-jurado", {
      usuarioId,
      temaId,
    });

    return {
      success: true,
      message: response.data.mensaje || "Asignación eliminada correctamente",
    };
  } catch (error: unknown) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.mensaje
        ? error.response.data.mensaje
        : "Error al desasignar el jurado del tema";

    // console.error("Error al desasignar jurado:", errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const getExposicionesJurado = async (
  idToken: string,
): Promise<ExposicionJurado[]> => {
  try {
    console.log("========== INICIO SOLICITUD getExposicionesJurado ==========");
    console.log("Intentando obtener exposiciones con token:", 
    idToken ? `${idToken.substring(0, 10)}...` : "undefined");


    const response = await axiosInstance.get("/jurado/exposiciones", {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    const data = response.data as ExposicionJurado[];

    // Verificar si hay datos recibidos
    if (!data || !Array.isArray(data)) {
      console.warn(
        "No se recibieron datos de exposiciones o el formato es incorrecto",
      );
      return [];
    }

    // Mapear los datos al formato requerido
    return data.map((expo): ExposicionJurado => {
      // Mapear miembros corrigiendo el campo id_persona a id
      const miembros: MiembroJuradoExpo[] = expo.miembros.map(
        (miembro): MiembroJuradoExpo => ({
          id_persona: miembro.id_persona, // Aquí es donde se hace la conversión de id_persona a id
          nombre: miembro.nombre,
          tipo: miembro.tipo,
        }),
      );

      // Retornar objeto con el tipo correcto
      return {
        id_exposicion: expo.id_exposicion,
        fechahora: new Date(expo.fechahora),
        sala: expo.sala,
        estado: expo.estado,
        estado_control: expo.estado_control,
        id_etapa_formativa: expo.id_etapa_formativa,
        nombre_etapa_formativa: expo.nombre_etapa_formativa,
        titulo: expo.titulo,
        nombre_exposicion: expo.nombre_exposicion,
        ciclo_id: expo.ciclo_id,
        enlace_grabacion: expo.enlace_grabacion,
        enlace_sesion: expo.enlace_sesion,
        miembros,
      };
    });
  } catch (error) {
    console.error("Error al obtener exposiciones del jurado:", error);

    // En caso de error, devolver un array vacío
    return [];
  }
};

export const actualizarEstadoExposicion = async (
  exposicionId: number,
  nuevoEstado: string,
): Promise<boolean> => {
  try {
    const response = await axiosInstance.put("/jurado/conformidad", {
      exposicionTemaId: exposicionId,
      estadoExposicion: nuevoEstado,
    });

    return response.status === 200;
  } catch (error) {
    console.error("Error al actualizar el estado de la exposición:", error);
    throw error;
  }
};

export const actualizarEstadoControlExposicion = async (
  exposicionId: number,
  juradoId: string,
  nuevoEstado: string,
): Promise<boolean> => {
  try {
    const response = await axiosInstance.put("/jurado/control", 
      {
        exposicionTemaId: exposicionId,
        estadoExposicionUsuario: nuevoEstado
      },
      {
        headers: {
          Authorization: `Bearer ${juradoId}`
        }
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error("Error al actualizar el estado de la exposición:", error);
    throw error;
  }
};

export const getExposicionCalificarJurado = async (
  token: number | string,
  exposicionId: number | string,
): Promise<EvaluacionExposicionJurado> => {
  try {
    // Convertir IDs a números si vienen como strings (por ejemplo, desde URL params)
    //const jId = 6;
    const expId =
      typeof exposicionId === "string" ? parseInt(exposicionId) : exposicionId;

    console.log("ID Jurado:",token , "ID Exposición:", expId);

    interface EstudianteRespuesta {
      id: number;
      nombre: string;
    }

    interface CriterioRespuesta {
      id: number;
      titulo: string;
      descripcion: string;
      calificacion?: number;
      nota_maxima?: number;
      observacion?: string;
    }

    interface RespuestaAPI {
      id_exposicion?: number;
      titulo?: string;
      descripcion?: string;
      estudiantes?: EstudianteRespuesta[];
      criterios?: CriterioRespuesta[];
      observaciones_finales?: string;
    }

    // Llamada al endpoint de criterios con los parámetros requeridos
    // Llamada al endpoint utilizando el token para autenticación
    const response = await axiosInstance.get("/jurado/criterios", {
      params: {
        exposicion_tema_id: expId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    {/*
    const response = await axiosInstance.get("/jurado/criterios", {
      params: {
        jurado_id: jId,
        exposicion_tema_id: expId,
      },
    });
      */}
    const data = response.data;

    // Log para depuración
    console.log("Datos de evaluación recibidos:", data);

    // Mapear la respuesta al formato requerido por el cliente
    return {
      id_exposicion: data.id_exposicion || exposicionId,
      titulo: data.titulo || "",
      descripcion: data.descripcion || "",
      estudiantes: Array.isArray(data.estudiantes)
        ? data.estudiantes.map((est: EstudianteRespuesta) => ({
            id: est.id,
            nombre: est.nombre,
          }))
        : [],
      criterios: Array.isArray(data.criterios)
        ? data.criterios.map((criterio: CriterioRespuesta) => ({
            id: criterio.id,
            titulo: criterio.titulo,
            descripcion: criterio.descripcion,
            calificacion: criterio.calificacion || 0,
            nota_maxima: criterio.nota_maxima || 20,
            observacion: criterio.observacion || "",
          }))
        : [],
      observaciones_finales: data.observaciones_finales || "",
    };
  } catch (error) {
    console.error("Error al obtener datos para calificar exposición:", error);

    // En caso de error, devolvemos un objeto vacío con la estructura esperada
    return {
      id_exposicion: Number(exposicionId),
      titulo: "",
      descripcion: "",
      estudiantes: [],
      criterios: [],
      observaciones_finales: "",
    };
  }
};

export const actualizarComentarioFinalJurado = async (
  exposicionId: number,
  observacion_final: string,
): Promise<boolean> => {
  try {
    console.log("Guardando observaciones finales para la exposición:", exposicionId);
            console.log("Observaciones finales:", observacion_final);
    const response = await axiosInstance.put("/jurado/observacionfinal", {
      id: exposicionId,
      observacion_final: observacion_final,
    });

    return response.status === 200;
  } catch (error) {
    console.error("Error al actualizar el estado de la exposición:", error);
    throw error;
  }
};

export const actualizarCriteriosEvaluacion = async (
  criterios: {
    id: number;
    calificacion: number;
    observacion: string;
  }[],
): Promise<boolean> => {
  try {
    const response = await axiosInstance.put("/jurado/criterios", {
      criterios: criterios,
    });

    return response.status === 200;
  } catch (error) {
    console.error("Error al actualizar los criterios de evaluación:", error);
    throw error;
  }
};


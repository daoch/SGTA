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
} from "../types/jurado.types";
import {
  JuradoDTO,
  JuradoTemasDetalle,
  JuradoUI,
  EtapaFormativa,
  Ciclo,
  AreaConocimientoJurado,
  TesisDetalleExposicion,
} from "../types/juradoDetalle.types";
import axios from "axios";

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

    console.error(
      "Error al eliminar desasignar miembro de jurado a todos sus temas:",
      errorMessage,
    );

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

    console.error("Error al desasignar jurado:", errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const getExposicionesJurado= async (
  idJurado: number,
): Promise<ExposicionJurado[]> => {
  try {
    const response = await axiosInstance.get(`/jurado/${idJurado}/exposiciones`);
    const data = response.data as ExposicionJurado[];

    // Verificar si hay datos recibidos
    if (!data || !Array.isArray(data)) {
      console.warn("No se recibieron datos de exposiciones o el formato es incorrecto");
      return [];
    }

    // Mapear los datos al formato requerido
    return data.map((expo): ExposicionJurado => {
      // Mapear miembros corrigiendo el campo id_persona a id
      const miembros: MiembroJuradoExpo[] = (expo.miembros).map(
        (miembro): MiembroJuradoExpo => ({
          id_persona: miembro.id_persona, // Aquí es donde se hace la conversión de id_persona a id
          nombre: miembro.nombre,
          tipo: miembro.tipo
        })
      );

      // Retornar objeto con el tipo correcto
      return {
        id_exposicion: expo.id_exposicion,
        fechahora: new Date(expo.fechahora),
        sala: expo.sala,
        estado: expo.estado,
        id_etapa_formativa: expo.id_etapa_formativa,
        nombre_etapa_formativa: expo.nombre_etapa_formativa,
        titulo: expo.titulo,
        ciclo_id: expo.ciclo_id,
        miembros
      };
    });
  } catch (error) {
    console.error("Error al obtener exposiciones del jurado:", error);
    
    // En caso de error, devolver un array vacío
    return [];
  }
};


// En jurado-service.tsx
export const actualizarEstadoExposicion = async (
  exposicionId: number,
  nuevoEstado: string
): Promise<boolean> => {
  try {
    const response = await axiosInstance.put(`/jurado/conformidad`, {
      exposicionTemaId: exposicionId,
      estadoExposicion: nuevoEstado
    });
    
    return response.status === 200;
  } catch (error) {
    console.error("Error al actualizar el estado de la exposición:", error);
    throw error;
  }
};
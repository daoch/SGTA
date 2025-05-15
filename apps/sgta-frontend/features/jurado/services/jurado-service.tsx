import axiosInstance from "@/lib/axios/axios-instance";
import { AreaEspecialidad, TipoDedicacion } from "../types/jurado.types";
import {
  JuradoDTO,
  JuradoTemasDetalle,
  JuradoUI,
  EtapaFormativa,
  Ciclo,
  AreaConocimientoJurado,
  TesisDetalleExposicion,
} from "../types/juradoDetalle.types";

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
  } catch (error: any) {
    // Manejo de errores
    const errorMessage =
      error.response?.data?.mensaje || "Error al asignar el tema al jurado";
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
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.mensaje ||
      "Error al eliminar las asignaciones del miembro de jurado con sus temas";
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
  temaId: number
): Promise<TesisDetalleExposicion> => {
  try {
    const response = await axiosInstance.get(`/jurado/${temaId}/detalle`);
    const data = response.data;

    // Mapear la respuesta al formato requerido
    return {
      // Mapear los estudiantes directamente
      estudiantes: data.estudiantes.map((estudiante: any) => ({
        id: estudiante.id,
        nombre: estudiante.nombre,
        tipo: estudiante.tipo,
      })),
      
      // Para el asesor, tomamos el primer elemento del array asesores
      // que tenga tipo "Asesor"
      asesores: data.asesores.map((asesor: any) => ({
        id: asesor.id,
        nombre: asesor.nombre,
        tipo: asesor.tipo,
      })),
      
      // Mapear los miembros del jurado
      miembrosJurado: data.miembros_jurado.map((miembro: any) => ({
        id: miembro.id,
        nombre: miembro.nombre,
        tipo: miembro.tipo,
      })),
      
      // Para la etapa formativa, tomamos la primera (podría necesitar ajustes según tu lógica)
      etapaFormativaTesis: {
        id: data.etapas_formativas[0].id,
        nombre: data.etapas_formativas[0].nombre,
        exposiciones: data.etapas_formativas[0].exposiciones.map((expo: any) => ({
          id: expo.id,
          nombre: expo.nombre,
          estado: expo.estado_exposición,
          fechaInicio: expo.datetime_inicio,
          fechaFin: expo.datetime_fin,
          sala: expo.sala_exposicion,
        })),
      },
    };
  } catch (error) {
    console.error("Error al obtener exposiciones del tema:", error);
    // Devolver un objeto vacío con la estructura correcta en caso de error
    return {
      estudiantes: [],
      asesores: [],
      miembrosJurado: [],
      etapaFormativaTesis: {
        id: 0,
        nombre: "",
        exposiciones: [],
      },
    };
  }
}; 

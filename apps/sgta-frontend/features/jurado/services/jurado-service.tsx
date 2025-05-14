import axiosInstance from "@/lib/axios/axios-instance";
import { AreaEspecialidad, TipoDedicacion } from "../types/jurado.types";
import {
  JuradoDTO,
  JuradoTemasDetalle,
  JuradoUI,
  EtapaFormativa,
  Ciclo,
  AreaConocimientoJurado,
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
  temaId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axiosInstance.post('/jurado/asignar-tema', {
      usuarioId,
      temaId
    });
    
    return {
      success: true,
      message: response.data.mensaje || "Tema asignado correctamente"
    };
  } catch (error: any) {
    // Manejo de errores
    const errorMessage = error.response?.data?.mensaje || "Error al asignar el tema al jurado";
    console.error("Error al asignar tema:", errorMessage);
    
    return {
      success: false,
      message: errorMessage
    };
  }
};

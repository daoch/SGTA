import type {
  AreaTematica,
  Asesor,
  AsesorPerfil,
  Proyecto,
  TemaInteres,
  Tesis,
} from "@/features/asesores/types/perfil/entidades";
import axiosInstance from "@/lib/axios/axios-instance";
import axios from "axios";
import { asignarPlataformas } from "../components/perfil/plataforma-icons";

export async function getPerfilAsesor(id: number) {
  try {
    const response = await axiosInstance.get("/usuario/getPerfilAsesor", {
      params: { id },
    });

    console.log("Respuesta de la API:", response.data);
    return response.data as Asesor;
  } catch (error) {
    console.error("Error al obtener perfil del asesor:", error);
    throw error;
  }
}

export async function getPerfilAsesorEnlaces(id: number) {
  try {
    const response = await axiosInstance.get("/usuario/getPerfilUsuario", {
      params: { idUsuario: id },
    });

    console.log("Respuesta de la API:", response.data);
    asignarPlataformas(response.data.enlaces);
    return response.data as AsesorPerfil;
  } catch (error) {
    console.error("Error al obtener perfil del asesor:", error);
    throw error;
  }
}

export async function getIdByCorreo(
  correoUsuario: string,
): Promise<number | null> {
  try {
    console.log("Attempting to get ID for email:", correoUsuario);
    console.log("API Base URL:", axiosInstance.defaults.baseURL);
    
    const response = await axiosInstance.get("/usuario/getIdByCorreo", {
      params: { correoUsuario },
    });

    console.log("ID obtenido por correo:", response.data);
    return response.data as number;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      
      console.error("Axios error details:", {
        message: error.message,
        status: status,
        baseURL: axiosInstance.defaults.baseURL,
        url: error.config?.url,
        fullURL: `${axiosInstance.defaults.baseURL}${error.config?.url}`,
        code: error.code
      });

      if (
        status === 500 &&
        error.response?.data?.message?.includes("Usuario no encontrado")
      ) {
        console.warn("El usuario no existe en la base de datos.");
        return null;
      }

      console.error("Error de Axios al obtener ID por correo:", error.message);
    } else {
      console.error("Error desconocido al obtener ID por correo:", error);
    }

    throw error;
  }
}

export async function getFotoUsuario(idUsuario: number): Promise<string> {
  try {
    const response = await axiosInstance.get("/usuario/getFotoUsuario", {
      params: { idUsuario },
    });

    console.log("Foto recibida:", response.data);
    return response.data.foto as string; // base64 string
  } catch (error) {
    console.error("Error al obtener la foto del usuario:", error);
    throw error;
  }
}

export async function getListaProyectos(idAsesor: number) {
  try {
    const response = await axiosInstance.get(
      `/proyectos/listarProyectosUsuarioInvolucrado/${idAsesor}`,
    );
    console.log("Proyectos recibidos:", response.data);
    return (response.data as Proyecto[]) ?? [];
  } catch (error) {
    console.error("Error al obtener la lista de proyectos:", error);
    throw error;
  }
}

export async function getListaTesisPorAsesor(idAsesor: number) {
  try {
    const response = await axiosInstance.get(
      `/temas/listarTemasAsesorInvolucrado/${idAsesor}`,
    );
    console.log("Tesis recibidas:", response.data);
    return (response.data as Tesis[]) ?? [];
  } catch (error) {
    console.error("Error al obtener tesis del asesor:", error);
    throw error;
  }
}

export async function editarAsesor(asesor: AsesorPerfil) {
  try {
    console.log("Datos del asesor a editar:", asesor);
    const response = await axiosInstance.put(
      "/usuario/updatePerfilUsuario",
      asesor,
    );
    return response.data;
  } catch (error) {
    console.error("Error al editar asesor:", error);
    throw error;
  }
}

export async function listarAreasTematicas(
  usuarioId: number,
): Promise<AreaTematica[]> {
  try {
    const response = await axiosInstance.get<AreaTematica[]>(
      "/areaConocimiento/listarTodasParaPerfilAsesor",
      { params: { usuarioId } },
    );
    return response.data;
  } catch (error) {
    console.error("Error al listar áreas temáticas:", error);
    throw error;
  }
}

export async function listarTemasInteres(
  usuarioId: number,
): Promise<TemaInteres[]> {
  try {
    const response = await axiosInstance.get<TemaInteres[]>(
      "/subAreaConocimiento/listarTodasParaPerfilAsesor",
      { params: { usuarioId } },
    );
    return response.data;
  } catch (error) {
    console.error("Error al listar temas de interés:", error);
    throw error;
  }
}

import type {
  AreaTematica,
  Asesor,
  AsesorDTO,
  TemaInteres,
} from "@/features/asesores/types/perfil/entidades";
import axiosInstance from "@/lib/axios/axios-instance";

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

export async function editarAsesor(asesor: AsesorDTO) {
  try {
    console.log("Datos del asesor a editar:", asesor);
    const response = await axiosInstance.put(
      "/usuario/updatePerfilAsesor",
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

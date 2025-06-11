import axiosInstance from "@/lib/axios/axios-instance";
import { Carrera, Tema, Usuario } from "../temas/entidades";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchUsuariosFindById(
  usuarioId: number,
): Promise<Usuario> {
  try {
    const response = await axiosInstance.get(
      `/usuario/findById?idUsuario=${usuarioId}`,
    );
    return response.data;
  } catch (error) {
    console.error("La página no responde.", error);
    throw error;
  }
}

export async function obtenerCarrerasPorUsuario(): Promise<Carrera[]> {
  try {
    const response = await axiosInstance.get("/usuario/carreras");
    return response.data;
  } catch (error) {
    console.error(
      "La página no responde. No se obtuvieron las carreras.",
      error,
    );
    throw error;
  }
}

export const fetchUsers = async (
  carreraId: number,
  tipoUsuarioNombre: string,
  cadenaBusqueda: string = "",
) => {
  const response = await axiosInstance.get(
    "/usuario/findByTipoUsuarioAndCarrera",
    {
      params: {
        carreraId,
        tipoUsuarioNombre,
        cadenaBusqueda,
      },
    },
  );
  return response.data;
};

export async function inscribirTemaPrescrito(temaId: number) {
  try {
    const response = await axiosInstance.put(
      `/temas/inscribirTemaPrenscrito/${temaId}`,
    );
    return response.data;
  } catch (error) {
    console.error("No se pudo inscribir el tema prescrito.", error);
    throw error;
  }
}

export async function fetchTemasAPI(
  titulo: string = "",
  //areaId: number,
  estadoNombre: string,
  limit: number = 10,
  offset: number = 0,
): Promise<Tema[]> {
  try {
    const response = await axiosInstance.get(
      "/temas/porUsuarioTituloAreaCarreraEstadoFecha",
      {
        params: {
          titulo: titulo,
          //areaId: areaId,
          estadoNombre: estadoNombre,
          limit,
          offset,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("La página no responde. No se obtuvieron los temas.", error);
    throw error;
  }
}

export async function obtenerAreasDelUsuario(usuarioId: number) {
  try {
    const response = await fetch(
      `${baseUrl}/areaConocimiento/listarPorUsuario?usuarioId=${usuarioId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("No se pudieron listar las áreas.");
    }

    const data = await response.json();
    console.log("Áreas del usuario:", data);
    return data;
  } catch (error) {
    console.error("Error al listar las áreas:", error);
    throw error;
  }
}

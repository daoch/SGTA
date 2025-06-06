import { Carrera, Tema, Usuario } from "../temas/entidades";
import axiosInstance from "@/lib/axios/axios-instance";
import { EstadoTemaNombre } from "../temas/enums";

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
  const url = `/usuario/findByTipoUsuarioAndCarrera?carreraId=${carreraId}&tipoUsuarioNombre=${tipoUsuarioNombre}&cadenaBusqueda=${cadenaBusqueda}`;
  const response = await axiosInstance.get(url);
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
  rol: string,
  estado: EstadoTemaNombre,
  limit: number = 10,
  offset: number = 0,
): Promise<Tema[]> {
  try {
    const response = await axiosInstance.get(
      "/temas/listarTemasPorUsuarioRolEstado",
      {
        params: {
          rolNombre: rol,
          estadoNombre: estado,
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

export async function lenTemasPorUsuarioRolEstado(
  rol: string,
  estado: EstadoTemaNombre,
): Promise<number> {
  const temas = await fetchTemasAPI(rol, estado, 200, 0);
  return temas.length;
}


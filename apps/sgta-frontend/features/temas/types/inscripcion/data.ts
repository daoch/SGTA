import { Carrera, Usuario } from "../temas/entidades";
import axiosInstance from "@/lib/axios/axios-instance";

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

export async function obtenerCarrerasPorUsuario(
  usuarioId: number,
): Promise<Carrera[]> {
  try {
    const response = await axiosInstance.get(`/usuario/${usuarioId}/carreras`);
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


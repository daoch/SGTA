import axiosInstance from "@/lib/axios/axios-instance";
import { Asesor } from "../types/perfil/entidades";

export interface FiltrosDirectorioAsesores {
  alumnoId: number;
  cadenaBusqueda: string;
  activo: boolean;
  idAreas?: number[];
  idTemas?: number[];
}

export interface SearchPage {
  content: Asesor[];
  totalPages: number;
  totalElements: number;
}

export async function buscarAsesoresPorNombre(
  nombre: string,
): Promise<Asesor[]> {
  try {
    const response = await axiosInstance.get(
      "/usuario/buscar-asesores-por-nombre",
      {
        params: { nombre },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error al buscar asesores:", error);
    return [];
  }
}

export async function getAsesoresPorFiltros(
  filtros: FiltrosDirectorioAsesores,
  page: number = 0,
  order: boolean = true,
) {
  try {
    const params = {
      alumnoId: filtros.alumnoId,
      cadenaBusqueda: filtros.cadenaBusqueda,
      activo: filtros.activo,
      page,
      order,
      ...(filtros.idAreas && filtros.idAreas.length > 0
        ? { idAreas: filtros.idAreas }
        : {}),
      ...(filtros.idTemas && filtros.idTemas.length > 0
        ? { idTemas: filtros.idTemas }
        : {}),
    };

    const response = await axiosInstance.get(
      "usuario/asesor-directory-by-filters",
      {
        params,
        paramsSerializer: (params) => {
          const query = new URLSearchParams();
          query.append("alumnoId", params.alumnoId);
          query.append("cadenaBusqueda", params.cadenaBusqueda);
          query.append("activo", String(params.activo));
          query.append("page", params.page);
          query.append("order", String(params.order));

          if (params.idAreas) {
            params.idAreas.forEach((id: number) =>
              query.append("idAreas", id.toString()),
            );
          }

          if (params.idTemas) {
            params.idTemas.forEach((id: number) =>
              query.append("idTemas", id.toString()),
            );
          }

          return query.toString();
        },
      },
    );

    console.log("Respuesta de la API busqueda filtrado:", response.data);
    return response.data; // esto será una lista de PerfilAsesorDto
  } catch (error) {
    console.error("Error al obtener asesores filtrados:", error);
    throw error;
  }
}

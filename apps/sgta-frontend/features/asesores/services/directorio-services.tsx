import axiosInstance from "@/lib/axios/axios-instance";

export interface FiltrosDirectorioAsesores {
  alumnoId: number;
  cadenaBusqueda: string;
  activo: boolean;
  idAreas?: number[];
  idTemas?: number[];
}

export async function getAsesoresPorFiltros(
  filtros: FiltrosDirectorioAsesores,
) {
  try {
    const params = {
      alumnoId: filtros.alumnoId,
      cadenaBusqueda: filtros.cadenaBusqueda,
      activo: filtros.activo,
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

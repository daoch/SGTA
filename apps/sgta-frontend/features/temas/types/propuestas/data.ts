import {
  Area,
  Proyecto_M,
  SubAreaConocimiento,
  Usuario,
} from "@/features/temas/types/propuestas/entidades";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

import { useAuthStore } from "@/features/auth/store/auth-store";
const { idToken } = useAuthStore.getState();

export async function fetchTemasPropuestosAlAsesor(
  titulo?: string,
  limit?: number,
  offset?: number,
): Promise<Proyecto_M[]> {
  try {
    const params = new URLSearchParams();

    params.append("titulo", titulo != null ? titulo?.toString() : "");
    params.append("limit", limit != null ? limit.toString() : "50");
    params.append("offset", offset != null ? offset.toString() : "0");
    console.log(
      `${baseUrl}temas/listarTemasPropuestosAlAsesor?${params.toString()}`,
    );
    console.log({ idToken });
    const response = await fetch(
      `${baseUrl}temas/listarTemasPropuestosAlAsesor?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener los temas.");
    }

    const data = await response.json();

    const updatedData = await Promise.all(
      data.map(async (item: Proyecto_M) => {
        // Crear un array para almacenar los estudiantes y areas
        const estudiantes = [];
        const subAreas = [];

        for (const idEstudiante of item?.tesistas?.map(
          (item: Usuario) => item.id,
        ) || []) {
          const estudiante = await fetchUsuariosFindById(idEstudiante);
          estudiantes.push(estudiante);
        }

        for (const idSubArea of item.subareas.map(
          (item: SubAreaConocimiento) => item.id,
        ) || []) {
          const area = await fetchSubAreaConocimientoFindById(idSubArea);
          subAreas.push(area);
        }

        return {
          ...item,
          tipo: "directa",
          estudiantes: estudiantes,
          subAreas: subAreas,
        };
      }),
    );

    return updatedData;
  } catch (error) {
    console.error("La página no responde.", error);
    throw error;
  }
}

export async function fetchTemasPropuestosPorSubAreaConocimiento(
  subAreas: SubAreaConocimiento[],
  titulo?: string,
  limit?: number,
  offset?: number,
): Promise<Proyecto_M[]> {
  try {
    const params = new URLSearchParams();
    const idsSubAreas = subAreas.map((item) => item.id);
    // Agregar múltiples valores para el mismo parámetro
    idsSubAreas.forEach((id) => params.append("subareaIds", id.toString()));

    if (titulo) params.append("titulo", titulo);
    params.append("limit", limit ? limit.toString() : "10");
    params.append("offset", offset ? offset.toString() : "0");

    const response = await fetch(
      `${baseUrl}temas/listarTemasPropuestosPorSubAreaConocimiento?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener los temas.");
    }

    const data = await response.json();

    const updatedData = await Promise.all(
      data.map(async (item: Proyecto_M) => {
        // Crear un array para almacenar los estudiantes y areas
        const estudiantes = [];
        const subAreas = [];

        for (const idEstudiante of item?.tesistas?.map(
          (item: Usuario) => item.id,
        ) || []) {
          const estudiante = await fetchUsuariosFindById(idEstudiante);
          estudiantes.push(estudiante);
        }

        for (const idSubArea of item.subareas.map(
          (item: SubAreaConocimiento) => item.id,
        ) || []) {
          const area = await fetchSubAreaConocimientoFindById(idSubArea);
          subAreas.push(area);
        }

        return {
          ...item,
          tipo: "general",
          estudiantes: estudiantes,
          subAreas: subAreas,
        };
      }),
    );

    return updatedData;
  } catch (error) {
    console.error("La página no responde.", error);
    throw error;
  }
}

export async function fetchUsuariosFindById(
  usuarioId: number,
): Promise<Usuario> {
  try {
    const response = await fetch(
      `${baseUrl}usuario/findById?idUsuario=${usuarioId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener los usuarios.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("La página no responde.", error);
    throw error;
  }
}

export async function fetchAreaConocimientoFindByUsuarioId(
  usuarioId: number,
): Promise<Area[]> {
  try {
    const response = await fetch(
      `${baseUrl}areaConocimiento/listarPorUsuario?usuarioId=${usuarioId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener las áreas de conocimiento.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("La página no responde.", error);
    throw error;
  }
}

export async function fetchSubAreaConocimientoFindByUsuarioId(
  usuarioId: number,
): Promise<SubAreaConocimiento[]> {
  try {
    const response = await fetch(
      `${baseUrl}subAreaConocimiento/listarPorUsuario?usuarioId=${usuarioId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener las áreas de conocimiento.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("La página no responde.", error);
    throw error;
  }
}

export async function fetchSubAreaConocimientoFindById(
  areaId: number,
): Promise<SubAreaConocimiento> {
  try {
    const response = await fetch(
      `${baseUrl}subAreaConocimiento/findById?idSubArea=${areaId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener las sub-áreas de conocimiento.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("La página no responde.", error);
    throw error;
  }
}

export async function postularTemaPropuestoGeneral(
  idAlumno: number,
  idTema: number,
  comentario: string,
) {
  try {
    const response = await fetch(
      `${baseUrl}temas/postularAsesorTemaPropuestoGeneral?idAlumno=${idAlumno}&idTema=${idTema}&comentario=${encodeURIComponent(comentario)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al postular al tema.");
    }

    console.log("Postulación general realizada con éxito.");
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

export async function enlazarTesistasATemaPropuestoDirecta(
  usuariosId: number[],
  temaId: number,
  comentario: string,
) {
  try {
    const response = await fetch(
      `${baseUrl}temas/enlazarTesistasATemaPropuestDirecta`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuariosId,
          temaId,
          comentario,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Error al aceptar el tema.");
    }

    console.log("Aceptación realizada con éxito.");
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

export async function rechazarTema(
  alumnoId: number,
  temaId: number,
  comentario: string,
) {
  try {
    const response = await fetch(
      `${baseUrl}temas/rechazarTemaPropuestaDirecta?alumnoId=${alumnoId}&comentario=${encodeURIComponent(comentario)}&temaId=${temaId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al rechazar el tema.");
    }

    console.log("Rechazo realizado con éxito.");
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

export async function buscarUsuarioPorToken() {
  try {
    const response = await fetch(`${baseUrl}usuario/getInfoUsuarioLogueado`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el usuario.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(
      "La página no responde. No se pudo encontrar al usuario.",
      error,
    );
    throw error;
  }
}

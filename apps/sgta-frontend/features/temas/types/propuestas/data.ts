"use server";

import {
  Area,
  Proyecto,
  SubAreaConocimiento,
  Usuario,
} from "@/features/temas/types/propuestas/entidades";
const baseUrl = process.env.BASE_URL;

export async function fetchTemasPropuestosAlAsesor(
  asesorId: number,
): Promise<Proyecto[]> {
  try {
    const response = await fetch(
      `${baseUrl}/temas/listarTemasPropuestosAlAsesor/${asesorId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener los temas.");
    }

    const data = await response.json();

    const updatedData = await Promise.all(
      data.map(async (item: Proyecto) => {
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
  areasId: number[],
  asesorId: number,
): Promise<Proyecto[]> {
  try {
    const response = await fetch(
      `${baseUrl}/temas/listarTemasPropuestosPorSubAreaConocimiento?subareaIds=${areasId.join("&subareaIds=")}&asesorId=${asesorId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener los temas.");
    }

    const data = await response.json();

    const updatedData = await Promise.all(
      data.map(async (item: Proyecto) => {
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
      `${baseUrl}/usuario/findById?idUsuario=${usuarioId}`,
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
      `${baseUrl}/areaConocimiento/listarPorUsuario?usuarioId=${usuarioId}`,
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
      `${baseUrl}/subAreaConocimiento/listarPorUsuario?usuarioId=${usuarioId}`,
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
      `${baseUrl}/subAreaConocimiento/findById?idSubArea=${areaId}`,
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
  idAsesor: number,
  idTema: number,
  comentario: string,
) {
  try {
    const response = await fetch(
      `${baseUrl}/temas/postularAsesorTemaPropuestoGeneral?idAlumno=${idAlumno}&idAsesor=${idAsesor}&idTema=${idTema}&comentario=${encodeURIComponent(comentario)}`,
      {
        method: "POST",
        headers: {
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
  profesorId: number,
  comentario: string,
) {
  try {
    const response = await fetch(
      `${baseUrl}/temas/enlazarTesistasATemaPropuestDirecta`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuariosId,
          temaId,
          profesorId,
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
      `${baseUrl}/temas/rechazarTemaPropuestaDirecta?alumnoId=${alumnoId}&comentario=${encodeURIComponent(comentario)}&temaId=${temaId}`,
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

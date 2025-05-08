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
      data.map(async (item: any) => {
        // Crear un array para almacenar los estudiantes y areas
        const estudiantes = [];
        const subAreas = [];

        for (const idEstudiante of item.idEstudianteInvolucradosList || []) {
          const estudiante = await fetchUsuariosFindById(idEstudiante);
          estudiantes.push(estudiante);
        }

        for (const idSubArea of item.idSubAreasConocimientoList || []) {
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
): Promise<Proyecto[]> {
  try {
    const response = await fetch(
      `${baseUrl}/temas/listarTemasPropuestosPorSubAreaConocimiento?subareaIds=${areasId.join("&subareaIds=")}`,
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
      data.map(async (item: any) => {
        // Crear un array para almacenar los estudiantes y areas
        const estudiantes = [];
        const subAreas = [];

        for (const idEstudiante of item.idEstudianteInvolucradosList || []) {
          const estudiante = await fetchUsuariosFindById(idEstudiante);
          estudiantes.push(estudiante);
        }

        for (const idSubArea of item.idSubAreasConocimientoList || []) {
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

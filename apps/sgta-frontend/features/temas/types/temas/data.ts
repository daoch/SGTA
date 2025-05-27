import {
  AreaConocimiento,
  Carrera,
  Subareas,
  Usuario,
} from "@/features/temas/types/temas/entidades";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
//listar areas asesor
export async function fetchAreaConocimientoFindByUsuarioId(
  usuarioId: number,
): Promise<AreaConocimiento[]> {
  try {
    console.log(
      `${baseUrl}/areaConocimiento/listarPorUsuario?usuarioId=${usuarioId}`,
    );
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

//listar subareas por area conocimiento
export async function fetchSubareasPorAreaConocimiento(
  areaId: number,
): Promise<Subareas[]> {
  try {
    const response = await fetch(
      `${baseUrl}/subAreaConocimiento/list/${areaId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error("Error al obtener las SubAreas de conocimiento.");
    }

    const data = await response.json();

    return data;
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

export async function obtenerCarrerasPorUsuario(
  usuarioId: number,
): Promise<Carrera[]> {
  try {
    const response = await fetch(`${baseUrl}/usuario/${usuarioId}/carreras`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las carreras del usuario");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "La página no responde. No se obtuvieron las carreras.",
      error,
    );
    throw error;
  }
}

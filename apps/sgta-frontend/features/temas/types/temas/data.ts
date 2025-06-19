//import { useAuthStore } from "@/features/auth";
import {
  AreaConocimiento,
  Carrera,
  Subareas,
  TemaCreateLibre,
  TemaSimilitud,
  Usuario,
} from "@/features/temas/types/temas/entidades";

import { useAuthStore } from "@/features/auth/store/auth-store";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const { idToken } = useAuthStore.getState();

//listar areas asesor
export async function fetchAreaConocimientoFindByUsuarioId(
  usuarioId: number,
): Promise<AreaConocimiento[]> {
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

export async function obtenerCarrerasPorUsuario(): Promise<Carrera[]> {
  try {
    const response = await fetch(`${baseUrl}/usuario/carreras`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las carreras del usuario");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(
      "La página no responde. No se obtuvieron las carreras.",
      error,
    );
    throw error;
  }
}

export async function fetchTemasAPI(rol: string, estado: string) {
  try {
    console.log({ idToken });
    const response = await fetch(
      `${baseUrl}/temas/listarTemasPorUsuarioRolEstado?rolNombre=${rol}&estadoNombre=${estado}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener los temas del usuario");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("La página no responde. No se obtuvieron los temas.", error);
    throw error;
  }
}

export async function buscarTema(idTema: number) {
  try {
    console.log(`${baseUrl}/temas/findById?idTema=${idTema}`);
    const response = await fetch(`${baseUrl}/temas/findById?idTema=${idTema}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el tema");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("La página no responde. No se obtuvo el tema..", error);
    throw error;
  }
}

export async function obtenerObservacionesTema(idTema: number) {
  try {
    const response = await fetch(
      `${baseUrl}/solicitudes/listSolicitudesByTema/${idTema}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener las observaciones.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "La página no responde. No se obtuvieron las observaciones del tema.",
      error,
    );
    throw error;
  }
}

export async function crearTemaLibre(
  tema: TemaCreateLibre,
  similares: TemaSimilitud[] = [],
  forzarGuardar: boolean = false,
) {
  try {
    const response = await fetch(`${baseUrl}/temas/crearTemaLibre`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tema),
    });

    if (!response.ok) {
      throw new Error("Error al insertar el tema.");
    }

    const temaId = await response.json();
    console.log("Tema creado con ID:", temaId);

    if (forzarGuardar && similares.length > 0) {
      try {
        const similitudesPayload = similares.map((sim) => ({
          tema: { id: temaId },
          temaRelacion: { id: sim.tema.id },
          porcentajeSimilitud: sim.similarityScore,
        }));

        const resSim = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/temas/guardarSimilitudes`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(similitudesPayload),
          },
        );
        if (!resSim.ok) {
          throw new Error("Error al insertar las similitudes");
        }
      } catch (error) {
        console.error("Error al guardar similitudes:", error);
        throw new Error("Error al guardar similitudes del tema.");
      }
    }
    return;
  } catch (error) {
    console.error(
      "La página no responde. No se pudo registrar el tema libre.",
      error,
    );
    throw error;
  }
}

export async function verificarSimilitudTema(body: {
  id: number;
  titulo: string;
  resumen: string;
  objetivos: string;
  palabrasClaves: string[];
  estadoTemaNombre: string;
}) {
  try {
    console.log("Verificando similitud del tema:", body);
    const res = await fetch(`${baseUrl}/temas/findSimilar?threshold=75.0`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error("Error al verificar similitud del tema.");
    }
    return data;
  } catch (err) {
    console.error("Error al verificar similitud:", err);
    throw new Error("Error al verificar similitud del tema.");
  }
}

export async function EliminarTema(idTema: number) {
  try {
    const response = await fetch(`${baseUrl}/temas/deleteTema`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(idTema),
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el tema.");
    }

    return true;
  } catch (error) {
    console.error("La página no responde. No se pudo eliminar el tema.", error);
    throw error;
  }
}

export async function editarTema(body: TemaCreateLibre) {
  try {
    const res = await fetch(`${baseUrl}/temas/actualizarTemaLibre`, {
      method: "POST", // Usamos PUT para editar un recurso existente
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Verificar si la respuesta fue exitosa antes de intentar parsearla
    if (!res.ok) {
      const errorData = await res.json(); // Parsear el mensaje de error si no fue exitoso
      throw new Error(errorData.message || "Error al editar el tema.");
    }

    // Parsear la respuesta solo si es exitosa
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error al editar tema:", err);
    throw new Error("Error al editar el tema.");
  }
}

export async function obtenerHistorialTema(idTema: number) {
  try {
    const response = await fetch(`${baseUrl}/temas/${idTema}/historial`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el historial del tema.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "La página no responde. No se pudo obtener el historial.",
      error,
    );
    throw error;
  }
}

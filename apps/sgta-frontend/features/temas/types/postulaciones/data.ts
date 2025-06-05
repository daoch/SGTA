import {
  Postulacion,
  TemaDto,
} from "@/features/temas/types/postulaciones/entidades";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

import { useAuthStore } from "@/features/auth/store/auth-store";
const { idToken } = useAuthStore.getState();

export async function fetchPostulacionesAlAsesor(
  debouncedSearchTerm: string,
  debounceEstado: string,
  debounceFechaFin: string,
): Promise<Postulacion[]> {
  try {
    const response = await fetch(
      `${baseUrl}/temas/listarPostuladosTemaLibre?busqueda=${debouncedSearchTerm}&estado=${debounceEstado}&fechaLimite=${debounceFechaFin}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener las postulaciones.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("La página no responde.", error);
    throw error;
  }
}

export async function buscarUsuarioPorToken() {
  try {
    const response = await fetch(`${baseUrl}/usuario/getInfoUsuarioLogueado`, {
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

export async function rechazarPostulacionDeAlumno(tema: TemaDto) {
  try {
    const response = await fetch(
      `${baseUrl}/temas/rechazarPostulacionAlumnoTemaLibre`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tema),
      },
    );

    if (!response.ok) {
      throw new Error("Error al rechazar la postulación.");
    }

    console.log("Postulación rechazada correctamente");
  } catch (error) {
    console.error(
      "La página no responde. No se pudo rechazar la postulación.",
      error,
    );
    throw error;
  }
}

export async function aceptarPostulacionDeAlumno(tema: TemaDto) {
  try {
    const response = await fetch(
      `${baseUrl}/temas/aceptarPostulacionAlumnoTemaLibre`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tema),
      },
    );

    if (!response.ok) {
      throw new Error("Error al aceptar la postulación.");
    }

    console.log("Postulación aceptada correctamente");
  } catch (error) {
    console.error(
      "La página no responde. No se pudo aceptar la postulación.",
      error,
    );
    throw error;
  }
}

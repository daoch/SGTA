import { Postulacion } from "@/features/temas/types/postulaciones/entidades";

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

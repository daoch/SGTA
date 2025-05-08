import type { Asesor } from "@/features/asesores/types/perfil/entidades"; // si ya tienes el tipo
import axiosInstance from "@/lib/axios/axios-instance";

export async function getPerfilAsesor(id: number) {
  try {
    const response = await axiosInstance.get("/usuario/getPerfilAsesor", {
      params: { id },
    });

    console.log("Respuesta de la API:", response.data); // Verifica la respuesta aquí
    return response.data as Asesor;
  } catch (error) {
    console.error("Error al obtener perfil del asesor:", error);
    throw error;
  }
}

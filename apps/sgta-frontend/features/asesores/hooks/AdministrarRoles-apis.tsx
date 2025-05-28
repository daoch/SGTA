import axiosInstance from "@/lib/axios/axios-instance";

// Asignar rol de Asesor
export async function assignAdvisorRole(userId: number): Promise<string> {
  try {
    const response = await axiosInstance.post(`/usuario/${userId}/assign-advisor-role`);
    return response.data; // Mensaje de éxito del backend
  } catch (error: any) {
    const msg = error?.response?.data || "Error al asignar el rol de Asesor.";
    throw new Error(msg);
  }
}

// Quitar rol de Asesor
export async function removeAdvisorRole(userId: number): Promise<string> {
  try {
    const response = await axiosInstance.post(`/usuario/${userId}/remove-advisor-role`);
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data || "Error al quitar el rol de Asesor.";
    throw new Error(msg);
  }
}

// Asignar rol de Jurado
export async function assignJuryRole(userId: number): Promise<string> {
  try {
    const response = await axiosInstance.post(`/usuario/${userId}/assign-jury-role`);
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data || "Error al asignar el rol de Jurado.";
    throw new Error(msg);
  }
}

// Quitar rol de Jurado
export async function removeJuryRole(userId: number): Promise<string> {
  try {
    const response = await axiosInstance.post(`/usuario/${userId}/remove-jury-role`);
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data || "Error al quitar el rol de Jurado.";
    throw new Error(msg);
  }
}
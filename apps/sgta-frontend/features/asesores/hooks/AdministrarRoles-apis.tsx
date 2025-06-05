import axiosInstance from "@/lib/axios/axios-instance";
import axios, { AxiosError } from "axios";

// Asignar rol de Asesor
export async function assignAdvisorRole(userId: number): Promise<string> {
  try {
    const response = await axiosInstance.post(`/usuario/${userId}/assign-advisor-role`);
    return response.data; // Mensaje de éxito del backend
  } catch (error: unknown) {
    let msg = "Error al asignar el rol de Asesor.";
    if (axios.isAxiosError(error)) {
      msg = error.response?.data || msg;
    }
    throw new Error(msg);
  }
}

// Quitar rol de Asesor
export async function removeAdvisorRole(userId: number): Promise<string> {
  try {
    const response = await axiosInstance.post(`/usuario/${userId}/remove-advisor-role`);
    return response.data;
  } catch (error: unknown) {
    let msg = "Error al quitar el rol de Asesor.";
    if (axios.isAxiosError(error)) {
      msg = error.response?.data || msg;
    }
    throw new Error(msg);
  }
}

// Asignar rol de Jurado
export async function assignJuryRole(userId: number): Promise<string> {
  try {
    const response = await axiosInstance.post(`/usuario/${userId}/assign-jury-role`);
    return response.data;
  } catch (error: unknown) {
    let msg = "Error al asignar el rol de Jurado.";
    if (axios.isAxiosError(error)) {
      msg = error.response?.data || msg;
    }
    throw new Error(msg);
  }
}

// Quitar rol de Jurado
export async function removeJuryRole(userId: number): Promise<string> {
  try {
    const response = await axiosInstance.post(`/usuario/${userId}/remove-jury-role`);
    return response.data;
  } catch (error: unknown) {
    let msg = "Error al quitar el rol de Jurado.";
    if (axios.isAxiosError(error)) {
      msg = error.response?.data || msg;
    }
    throw new Error(msg);
  }
}
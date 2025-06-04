import axiosInstance from "@/lib/axios/axios-instance";

import { AlumnoTemaDetalle } from "../types/Alumno.type";

import { useAuthStore } from "@/features/auth/store/auth-store";

const { idToken } = useAuthStore.getState();

export const obtenerDetalleTemaAlumno = async (): Promise<AlumnoTemaDetalle> => {
    try {
       
        const response = await axiosInstance.get<AlumnoTemaDetalle>("/usuario/detalle-tema-alumno", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener detalle del tema del alumno:", error);
        throw error;
    }
};


export const getEntregablesAlumno = async (alumnoId: string) => {
  const response = await axiosInstance.get(`/api/v1/reports/entregables/${alumnoId}`);
  return response.data;
};
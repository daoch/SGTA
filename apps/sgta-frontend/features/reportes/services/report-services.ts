import axiosInstance from "@/lib/axios/axios-instance";

import axios from "@/lib/axios/axios-instance";
import { AlumnoReviewer, AlumnoTemaDetalle } from "../types/Alumno.type";

import { useAuthStore } from "@/features/auth/store/auth-store";


export const obtenerDetalleTemaAlumno = async (): Promise<AlumnoTemaDetalle> => {
    try {
        const { idToken } = useAuthStore.getState();
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


export const findStudentsForReviewer = async (carreraId: number, cadenaBusqueda: string): Promise<AlumnoReviewer[]> => {
  try {
    const response = await axiosInstance.get(`/usuario/findByStudentsForReviewer`, {
      params: {
        carreraId,
        cadenaBusqueda
      },
      /*headers: {
        Authorization: `Bearer ${idToken}`,
      },*/
    });
    return response.data;
  } catch (error) {
    console.error("Error al buscar estudiantes para el revisor:", error);
    throw error;
  }
};

{/*
//Probando lo de ID_Token
export async function obtenerDetalleTemaAlumno(idAlumno: number, idToken: string) {
  const response = await axiosInstance.get(`/usuario/detalle-tema-alumno/${idAlumno}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data;
}
*/}


export const getEntregablesAlumno = async (alumnoId: string) => {
  const response = await axios.get(`/api/v1/reports/entregables/${alumnoId}`);
  return response.data;
};
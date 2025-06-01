import axiosInstance from "@/lib/axios/axios-instance";
import { AlumnoTemaDetalle } from "../types/Alumno.type";

import axios from "@/lib/axios/axios-instance";


export const obtenerDetalleTemaAlumno = async (idUsuario: number): Promise<AlumnoTemaDetalle> => {
    try {
        const response = await axiosInstance.get<AlumnoTemaDetalle>(`/usuario/detalle-tema-alumno/${idUsuario}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener detalle del tema del alumno:", error);
        throw error;
    }
};


export const getEntregablesAlumno = async (alumnoId: string) => {
  const response = await axios.get(`/api/v1/reports/entregables/${alumnoId}`);
  return response.data;
};
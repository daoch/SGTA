import axiosInstance from "@/lib/axios/axios-instance";
import { AlumnoTemaDetalle } from "../types/Alumno.type";



export const obtenerDetalleTemaAlumno = async (idUsuario: number): Promise<AlumnoTemaDetalle> => {
    try {
        const response = await axiosInstance.get<AlumnoTemaDetalle>(`/usuario/detalle-tema-alumno/${idUsuario}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener detalle del tema del alumno:", error);
        throw error;
    }
};


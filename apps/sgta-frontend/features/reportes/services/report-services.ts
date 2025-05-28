import axiosInstance from "@/lib/axios/axios-instance";



// export const obtenerDetalleTemaAlumno = async (idUsuario: number): Promise<AlumnoTemaDetalle> => {
//     try {
//         const response = await axiosInstance.get<AlumnoTemaDetalle>(`/usuario/detalle-tema-alumno/${idUsuario}`);
//         return response.data;
//     } catch (error) {
//         console.error("Error al obtener detalle del tema del alumno:", error);
//         throw error;
//     }
// };


//Probando lo de ID_Token
export async function obtenerDetalleTemaAlumno(idAlumno: number, idToken: string) {
  const response = await axiosInstance.get(`/usuario/detalle-tema-alumno/${idAlumno}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data;
}


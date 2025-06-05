import axiosInstance from "@/lib/axios/axios-instance";
import { Profesor } from "../types/temas.types";

export const getProfesores = async (): Promise<Profesor[]> => {
  const response = await axiosInstance.get("/usuario/getProfesoresActivos");
  const data = response.data;
  return data.map((tipo: Profesor) => ({
    id: tipo.id,
    nombres: tipo.nombres,
    primerApellido: tipo.primerApellido,
    segundoApellido: tipo.segundoApellido,
    codigoPucp: tipo.codigoPucp,
    correoElectronico: tipo.correoElectronico,
    tipoDedicacion: tipo.tipoDedicacion,
    cantTemasAsignados: tipo.cantTemasAsignados,
    areasConocimientoIds: tipo.areasConocimientoIds || [],
  }));
};


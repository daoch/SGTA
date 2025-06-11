import axios from "@/lib/axios/axios-instance";
import { CarreraDto } from "../dtos/CarreraDto";

export const getCarrerasByUsuario = async (usuarioId: number): Promise<CarreraDto[]> => {
  const response = await axios.get("/carrera/list-by-usuario", {
    params: { usuarioId },
  });
  return response.data;
};



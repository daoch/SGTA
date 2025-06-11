import axios from "@/lib/axios/axios-instance";
import { CarreraDto } from "../dtos/CarreraDto";

export const getCarreraCoordinadaPorUsuario = async (usuarioId: number): Promise<CarreraDto> => {
  const response = await axios.get("/carrera/coordinada-por-usuario", {
    params: { usuarioId },
  });
  return response.data;
};
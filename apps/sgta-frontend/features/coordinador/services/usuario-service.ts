import axios from "@/lib/axios/axios-instance";
import { UsuarioDto } from "../dtos/UsuarioDto";

export const getUsuarioById = async (idUsuario: number): Promise<UsuarioDto> => {
  const response = await axios.get("/usuario/findById", {
    params: { idUsuario },
  });
  return response.data;
};

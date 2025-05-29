import axios from "@/lib/axios/axios-instance";
import { UsuarioXReunionDto } from "../dtos/UsuarioXReunionDto";

export const getReunionesXUsuario = async (usuarioId: number): Promise<UsuarioXReunionDto[]> => {
  const res = await axios.get(`/api/reuniones/usuario/${usuarioId}`);
  return res.data;
};
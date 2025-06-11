import axios from "@/lib/axios/axios-instance";
import { UsuarioXReunionDto } from "../dtos/UsuarioXReunionDto";
import { ReunionesXUsuariosDto } from "../dtos/ReunionesXUsuariosDto";
import { ReunionDto } from "../dtos/ReunionDto";

export const getReunionesXUsuario = async (usuarioId: number): Promise<UsuarioXReunionDto[]> => {
  const res = await axios.get(`/api/reuniones/usuario/${usuarioId}`);
  return res.data;
};

export const getReunionesXAlumno = async (): Promise<ReunionesXUsuariosDto[]> => {
  const res = await axios.get("/api/reuniones/asesor-alumno");
  console.log("res completa:", res);
  return res.data;
};

export const getReunionPorId = async (reunionId: number): Promise<ReunionDto> => {
  const res = await axios.get(`/api/reuniones/${reunionId}`);
  return res.data;
};



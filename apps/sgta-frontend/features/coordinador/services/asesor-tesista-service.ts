import axios from "@/lib/axios/axios-instance";
import { AsesorTesistaDto } from "../dtos/AsesorTesistaDto";

export const getAsesoresTesistasPorCarrera = async (
  carrera: string
): Promise<AsesorTesistaDto[]> => {
  const response = await axios.get("/api/asesor-tesista/listar-por-carrera", {
    params: { carrera },
  });
  return response.data;
};

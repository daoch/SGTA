import axios from "@/lib/axios/axios-instance";
import { EtapaFormativaDto } from "../dtos/EtapaFormativaDto";


export const getEtapasFormativasDelCoordinador = async (
  usuarioId: number
): Promise<EtapaFormativaDto[]> => {
  const response = await axios.get(`/etapas-formativas/listarActivasPorCoordinador/${usuarioId}`);
  return response.data;
};

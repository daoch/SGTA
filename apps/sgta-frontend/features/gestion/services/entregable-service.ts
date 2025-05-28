import axios from "@/lib/axios/axios-instance";
import { EntregableDto } from "../dtos/EntregableDto";

export const getEntregablesByEtapaFormativaXCiclo = async (etapaId: number): Promise<EntregableDto[]> => {
  const res = await axios.get(`/entregable/etapa-formativa-x-ciclo/${etapaId}`);
  return res.data;
};

export const getEntregablesConEnvioXEtapaFormativaXCiclo = async (
  etapaId: number,
  temaId: number
): Promise<EntregableDto[]> => {
  const res = await axios.get(`/entregable/etapa-formativa-x-ciclo/${etapaId}/tema/${temaId}`);
  return res.data;
};


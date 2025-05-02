import axiosInstance from "@/lib/axios/axios-instance";

/**
 * Servicio simple para realizar ping al servidor
 * @returns La respuesta del servidor
 */
export const pingServer = async (): Promise<string> => {
  const { data } = await axiosInstance.get("/ping");
  return data;
};

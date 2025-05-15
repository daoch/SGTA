import axiosInstance from "@/lib/axios/axios-instance";


export async function crearCiclo(data: any) {
    try {
        const response = await axiosInstance.post("/ciclos/create", data);
        return response.data;
    } catch (error) {
        console.error("Error al crear ciclo:", error);
        throw new Error("Error al crear ciclo");
    }
}

export async function listarCiclosConEtapas() {
  try {
        const response = await axiosInstance.get("/ciclos/listarCiclosConEtapas");
        return response.data;
    } catch (error) {
        console.error("Error al listar Ciclos con etapas:", error);
        throw new Error("Error al listar Ciclos con etapas");
    }
}
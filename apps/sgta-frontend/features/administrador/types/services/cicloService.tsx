import axiosInstance from "@/lib/axios/axios-instance";
import { ActualizarCicloDto, CrearCicloDto } from "../ciclo.type";


export async function crearCiclo(data: CrearCicloDto) {
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

export async function actualizarCiclo(id: number, data: CrearCicloDto): Promise<ActualizarCicloDto> {
    try {
        const cicloDto: ActualizarCicloDto = {
            id: id,
            semestre: data.semestre,
            anio: data.anio,
            fechaInicio: data.fechaInicio,
            fechaFin: data.fechaFin
        };
        const response = await axiosInstance.put("/ciclos/update", cicloDto);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar ciclo:", error);
        throw new Error("Error al actualizar ciclo");
    }
}
import axiosInstance from "@/lib/axios/axios-instance";
import { CarreraXParametroConfiguracionDto } from "../dtos/CarreraXParametroConfiguracionDto";

//Services para Parametros generales

export const updateCarreraXParametroConfiguracion = async (
    dto: CarreraXParametroConfiguracionDto
): Promise<void> => {
    await axiosInstance.post("/carreraXParametroConfiguracion/update", dto);
};

export const getAllByCarreraId = async (
    carreraId: number
): Promise<CarreraXParametroConfiguracionDto[]> => {
    const response = await axiosInstance.get<CarreraXParametroConfiguracionDto[]>(
        `/carreraXParametroConfiguracion/${carreraId}/parametros`,
    );
    return response.data;
}


//Services para Áreas por carrera

export const createArea = async (area: any): Promise<any> => {
    const response = await axiosInstance.post<any>(
        "/areaConocimiento/create",
        area,
    );
    return response.data;
}


export const getAllAreasByCarreraId = async (
    carreraId: number
): Promise<any[]> => {
    const response = await axiosInstance.get<any[]>(
        `/areaConocimiento/list/${carreraId}`,
    );
    
    // Para cada área, cargar sus subáreas
    const areasWithSubareas = await Promise.all(
        response.data.map(async (area) => {
            const subareas = await getAllSubAreasByAreaId(area.id);
            return {
                ...area,
                subAreas: subareas.map(sub => sub.nombre)
            };
        })
    );
    
    return areasWithSubareas;
}

export const deleteAreaById = async (id: number): Promise<void> => {
    await axiosInstance.post(`/areaConocimiento/delete/${id}`);
};

//Services para Subareas

export const createSubArea = async (subArea: { nombre: string, idAreaConocimiento: number }): Promise<any> => {
    const dto = {
        nombre: subArea.nombre,
        areaConocimiento: {
            id: subArea.idAreaConocimiento
        }
    };
    
    const response = await axiosInstance.post<any>(
        "/subAreaConocimiento/create",
        dto,
    );
    return response.data;
}


export const getAllSubAreasByAreaId = async (
    areaId: number
): Promise<any[]> => {
    const response = await axiosInstance.get<any[]>(
        `/subAreaConocimiento/list/${areaId}`,
    );
    return response.data;
}

export const deleteSubAreaById = async (id: number): Promise<void> => {
    await axiosInstance.post(`/subAreaConocimiento/delete/${id}`);
};
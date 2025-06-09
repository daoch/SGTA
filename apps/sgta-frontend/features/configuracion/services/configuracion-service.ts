import axiosInstance from "@/lib/axios/axios-instance";
import { CarreraXParametroConfiguracionDto } from "../types/CarreraXParametroConfiguracion.type";
import { AreaConocimientoDto, SubAreaConocimientoDto } from "../types/Area.type";
import { useAuthStore } from "@/features/auth/store/auth-store";

//Services para Parametros generales

export const updateCarreraXParametroConfiguracion = async (
    dto: CarreraXParametroConfiguracionDto
): Promise<void> => {
    await axiosInstance.post("/carreraXParametroConfiguracion/update", dto);
};

export const getAllByCarreraId = async (
): Promise<CarreraXParametroConfiguracionDto[]> => {

    const { idToken } = useAuthStore.getState();
    const response = await axiosInstance.get<CarreraXParametroConfiguracionDto[]>(
        `/carreraXParametroConfiguracion/parametros`,
    {
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
    });
    return response.data;
};


//Services para Áreas por carrera

export const createArea = async (area: Omit<AreaConocimientoDto, "id">): Promise<AreaConocimientoDto> => {
    const response = await axiosInstance.post<AreaConocimientoDto>(
        "/areaConocimiento/create",
        area,
    );
    return response.data;
};


export const getAllAreasByCarreraId = async (): Promise<AreaConocimientoDto[]> => {
    const { idToken } = useAuthStore.getState();
    const response = await axiosInstance.get<AreaConocimientoDto[]>(
        `/areaConocimiento/listCarrera`,
        {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        }
    );

    // Para cada área, cargar sus subáreas
    const areasWithSubareas = await Promise.all(
        response.data.map(async (area) => {
            const subareas = await getAllSubAreasByAreaId(area.id);
            return {
                ...area,
                subAreas: subareas
            };
        })
    );

    return areasWithSubareas;
};

export const deleteAreaById = async (id: number): Promise<void> => {
    await axiosInstance.post(`/areaConocimiento/delete/${id}`);
};

//Services para Subareas

export const createSubArea = async (subArea: { nombre: string, idAreaConocimiento: number }): Promise<SubAreaConocimientoDto> => {
    const dto = {
        nombre: subArea.nombre,
        activo: true,
        areaConocimiento: {
            id: subArea.idAreaConocimiento
        }
    };

    const response = await axiosInstance.post<SubAreaConocimientoDto>(
        "/subAreaConocimiento/create",
        dto,
    );
    return response.data;
};


export const getAllSubAreasByAreaId = async (
    areaId: number
): Promise<SubAreaConocimientoDto[]> => {
    const response = await axiosInstance.get<SubAreaConocimientoDto[]>(
        `/subAreaConocimiento/list/${areaId}`,
    );
    return response.data;
};

export const deleteSubAreaById = async (id: number): Promise<void> => {
    await axiosInstance.post(`/subAreaConocimiento/delete/${id}`);
};
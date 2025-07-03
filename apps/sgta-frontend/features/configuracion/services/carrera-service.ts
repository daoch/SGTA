import axiosInstance from "@/lib/axios/axios-instance";

export interface Carrera {
    id: number;
    nombre: string;
    codigo: string;
    descripcion: string;
    activo: boolean;
    unidadAcademicaId?: number;
}

export interface UnidadAcademica {
    id: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
}

export const carreraService = {
    getAll: async (): Promise<Carrera[]> => {
        const response = await axiosInstance.get("/carrera/listar");
        return response.data;
    },

    getById: async (id: number): Promise<Carrera> => {
        const response = await axiosInstance.get(`/carrera/get/${id}`);
        return response.data;
    },

    create: async (carrera: Omit<Carrera, "id">): Promise<Carrera> => {
        const response = await axiosInstance.post("/carrera/create", carrera);
        return response.data;
    },

    update: async (carrera: Carrera): Promise<Carrera> => {
        const response = await axiosInstance.post("/carrera/update", carrera);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.post(`/carrera/delete/${id}`);
    }
}; 

export const unidadAcademicaService = {
    getAll: async (): Promise<UnidadAcademica[]> => {
        const response = await axiosInstance.get("/unidad-academica/listar");
        return response.data;
    }
};

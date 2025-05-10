import axiosInstance from "@/lib/axios/axios-instance";
import { AreaEspecialidad } from "../types/jurado.types";
import { JuradoDTO, JuradoUI } from "../types/juradoDetalle.types";


  
  export const getAllJurados = async (): Promise<JuradoUI[]> => {
    const response = await axiosInstance.get<JuradoDTO[]>(`/jurado`);  
  
    const data = response.data;
  
    return data.map((j) => ({
      id: j.id.toString(),
      code: j.codigoPucp,
      user: {
        name: `${j.nombres} ${j.primerApellido} ${j.segundoApellido}`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          `${j.nombres} ${j.primerApellido}`
        )}`,
      },
      email: j.correoElectronico,
      dedication: j.tipoDedicacion,
      assigned: j.asignados.toString(),
      specialties: j.especialidades,
      status: j.activo ? "Activo" : "Inactivo",
    }));
  };

  export const getAllAreasEspecialidad = async (): Promise<AreaEspecialidad[]> => {
    const response = await axiosInstance.get(`/areaConocimiento/list`);
    const data = response.data;
  
    return data.map((item: any) => ({
      name: item.nombre,
    }));
  };
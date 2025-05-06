// import axiosInstance from "@/lib/axios/axios-instance";
// import { CarreraXParametroConfiguracionDto } from "../dtos/CarreraXParametroConfiguracionDto";

// //dto ejemplo
// // const dto: CarreraXParametroConfiguracionDto = {
// //   id: 1,
// //   valor: "valor",
// //   carreraId: 1,
// //   parametroConfiguracionId: 1,
// // };

// export const updateCarreraXParametroConfiguracion = async (
//   dto: CarreraXParametroConfiguracionDto
// ): Promise<void> => {
//   await axiosInstance.post("/carreraXParametroConfiguracion/update", dto);
// };

// export const getAllByCarreraId = async (
//   carreraId: number
// ): Promise<CarreraXParametroConfiguracionDto[]> => {
//   const response = await axiosInstance.get<CarreraXParametroConfiguracionDto[]>(
//     `/carreraXParametroConfiguracion/carrera/${carreraId}`
//   );
//   return response.data;
// }

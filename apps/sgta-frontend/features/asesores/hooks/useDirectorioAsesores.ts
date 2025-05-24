import { useState, useEffect } from "react";
import { Profesor } from "../types";
import axiosInstance from "@/lib/axios/axios-instance";

// Mapeo para enviar el valor correcto al backend
const ROL_MAP: Record<"todos" | "asesor" | "jurado", string | undefined> = {
  todos: undefined,
  asesor: "Asesor",
  jurado: "Jurado",
};

export function useDirectorioAsesores() {
  const [search, setSearch] = useState("");
  const [rolAsignado, setRolAsignado] = useState<"todos" | "asesor" | "jurado">("todos");
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const params: any = {};
    if (rolAsignado !== "todos") params.rolNombre = ROL_MAP[rolAsignado];
    if (search) params.terminoBusqueda = search;

    const fetchProfesores = async () => {
      try {
        const res = await axiosInstance.get("/usuario/professors-with-roles", { params });
        console.log("Respuesta API profesores:", res.data);
        const data = res.data;
        const mapped: Profesor[] = data.map((dto: any) => ({
          id: dto.id,
          nombres: dto.nombres,
          primerApellido: dto.primerApellido,
          segundoApellido: dto.segundoApellido,
          correo: dto.correoElectronico,
          codigo: dto.codigoPucp,
          rolesAsignados: [
            ...(dto.rolesStr?.toLowerCase().includes("asesor") ? ["asesor"] : []),
            ...(dto.rolesStr?.toLowerCase().includes("jurado") ? ["jurado"] : []),
          ],
          tesisActivas: Number(dto.tesisActivas ?? 0),
          estado: "activo",
        }));
        setProfesores(mapped);
      } catch (error) {
        console.error("Error al obtener profesores:", error);
        setProfesores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfesores();
  }, [rolAsignado, search]);

  const updateRoles = (id: number, nuevosRoles: ("asesor" | "jurado")[]) => {
    setProfesores(prev =>
      prev.map(p =>
        p.id === id ? { ...p, rolesAsignados: nuevosRoles } : p
      )
    );
    // Aquí podrías llamar a una API para actualizar roles si lo necesitas
  };

  return {
    profesores,
    search,
    setSearch,
    rolAsignado,
    setRolAsignado,
    updateRoles,
    loading,
  };
}
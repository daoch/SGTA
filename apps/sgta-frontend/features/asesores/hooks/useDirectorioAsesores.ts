import { useState, useEffect } from "react";
import { Profesor } from "../types";
import axiosInstance from "@/lib/axios/axios-instance";

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
        const mapped: Profesor[] = data.map((dto: any) => {
          const roles = (dto.rolesConcat || "")
            .toLowerCase()
            .split(",")
            .map((r: string) => r.trim());
          return {
            id: dto.usuario.id,
            nombres: dto.usuario.nombres,
            primerApellido: dto.usuario.primerApellido,
            segundoApellido: dto.usuario.segundoApellido,
            correo: dto.usuario.correoElectronico,
            codigo: dto.usuario.codigoPucp,
            rolesAsignados: [
              ...(roles.includes("asesor") ? ["asesor"] : []),
              ...(roles.includes("jurado") ? ["jurado"] : []),
            ],
            tesisActivas: Number(dto.tesisCount ?? 0),
            estado: "activo",
          };
        });
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
    // Aquí  llamamos a una API para actualizar roles
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
import { useState, useEffect } from "react";
import { Profesor } from "../types";
import axiosInstance from "@/lib/axios/axios-instance";
import {
  assignAdvisorRole,
  removeAdvisorRole,
  assignJuryRole,
  removeJuryRole,
} from "@/features/asesores/hooks/AdministrarRoles-apis";

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


  const updateRoles = async (
    id: number,
    nuevosRoles: ("asesor" | "jurado")[]
  ): Promise<string | void> => {
    const profesor = profesores.find((p) => p.id === id);
    if (!profesor) return;

    const rolesActuales = profesor.rolesAsignados;
    let mensaje = "";

    try {
      // Asesor
      if (!rolesActuales.includes("asesor") && nuevosRoles.includes("asesor")) {
        mensaje = await assignAdvisorRole(id);
      }
      if (rolesActuales.includes("asesor") && !nuevosRoles.includes("asesor")) {
        mensaje = await removeAdvisorRole(id);
      }

      // Jurado
      if (!rolesActuales.includes("jurado") && nuevosRoles.includes("jurado")) {
        mensaje = await assignJuryRole(id);
      }
      if (rolesActuales.includes("jurado") && !nuevosRoles.includes("jurado")) {
        mensaje = await removeJuryRole(id);
      }

      // Actualiza el estado local solo si todo salió bien
      setProfesores((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, rolesAsignados: nuevosRoles } : p
        )
      );

      return mensaje || "Roles actualizados correctamente.";
    } catch (error: any) {
      // Puedes retornar el mensaje de error para mostrarlo en el modal/toast
      return error.message || "Ocurrió un error al actualizar los roles.";
    }
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
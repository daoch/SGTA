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

    const params: Record<string, unknown> = {};
    if (rolAsignado !== "todos") params.rolNombre = ROL_MAP[rolAsignado];
    if (search) params.terminoBusqueda = search;

    const fetchProfesores = async () => {
      try {
        const res = await axiosInstance.get("/usuario/professors-with-roles", { params });
        const data = res.data as Array<{
          usuario: {
            id: number;
            nombres: string;
            primerApellido: string;
            segundoApellido: string;
            correoElectronico: string;
            codigoPucp: string;
          };
          rolesConcat: string;
          tesisAsesorCount?: number; // <-- NUEVO
          tesisJuradoCount?: number; // <-- NUEVO
        }>;
        console.log("Profesores desde API:", data);
        const mapped: Profesor[] = data.map((dto) => {
          const roles = (dto.rolesConcat || "")
            .toLowerCase()
            .split(",")
            .map((r: string) => r.trim())
            .filter((r): r is "asesor" | "jurado" => r === "asesor" || r === "jurado");

          return {
            id: dto.usuario.id,
            nombres: dto.usuario.nombres,
            primerApellido: dto.usuario.primerApellido,
            segundoApellido: dto.usuario.segundoApellido,
            correo: dto.usuario.correoElectronico,
            codigo: dto.usuario.codigoPucp,
            rolesAsignados: roles,
            tesisAsesor: Number(dto.tesisAsesorCount ?? 0), // <-- NUEVO
            tesisJurado: Number(dto.tesisJuradoCount ?? 0), // <-- NUEVO
            estado: "activo",
          };
        });
        setProfesores(mapped);
      } catch (error: unknown) {
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
    } catch (error: unknown) {
      if (typeof error === "object" && error && "message" in error) {
        return (error as { message?: string }).message || "Ocurrió un error al actualizar los roles.";
      }
      return "Ocurrió un error al actualizar los roles.";
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
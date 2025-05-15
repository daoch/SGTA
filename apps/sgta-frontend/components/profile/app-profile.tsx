"use client";

import { getIdByCorreo } from "@/features/asesores/hooks/perfil/perfil-apis";
import PerfilAsesor from "@/features/asesores/views/mi-perfil-asesor";
import { useAuth } from "@/features/auth";
import { UserX } from "lucide-react";
import { useEffect, useState } from "react";

export default function AppProfile() {
  const { user } = useAuth();
  const [asesorId, setAsesorId] = useState<number | null>(null);
  //const userId = /^\d+$/.test(user?.id ?? "") ? user?.id : null;
  //console.log("userId", userId);

  useEffect(() => {
    if (!user || !user.email) return;

    getIdByCorreo(user.email)
      .then((id) => {
        setAsesorId(id);
        console.log("ID del asesor obtenido:", id);
      })
      .catch((error) => {
        console.error("Error al obtener el ID del asesor:", error);
      });
  }, [user]);

  if (!user || !asesorId)
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500">
        <UserX className="w-16 h-16 mb-4" />
        <p className="text-base font-medium">Usuario no encontrado</p>
      </div>
    );

  return <PerfilAsesor userId={asesorId} editable={true} />;
}

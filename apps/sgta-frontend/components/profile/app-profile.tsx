"use client";

import { getIdByCorreo } from "@/features/asesores/hooks/perfil/perfil-apis";
import PerfilAsesor from "@/features/asesores/views/mi-perfil-asesor";
import { useAuth } from "@/features/auth";
import { Loader2, UserX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

export default function AppProfile() {
  const { user } = useAuth();
  const [asesorId, setAsesorId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetchedId = useRef(false);

  const loadAsesorId = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      const id = await getIdByCorreo(user.email);

      if (id !== null) {
        setAsesorId(id);
        console.log("ID del asesor obtenido:", id);
      } else {
        console.warn("No se encontró un asesor con ese correo.");
        // puedes mostrar un mensaje de advertencia aquí si deseas
      }
    } catch (error) {
      console.error("Error inesperado al obtener el ID del asesor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && !hasFetchedId.current) {
      hasFetchedId.current = true;
      loadAsesorId();
    }
  }, [user]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-full flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground text-lg">
          Cargando perfil...
        </span>
      </div>
    );

  if ((!user || !asesorId) && hasFetchedId.current === true)
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500">
        <UserX className="w-16 h-16 mb-4" />
        <p className="text-base font-medium">Usuario no encontrado</p>
        <div className="mt-4">
          <Button
            onClick={loadAsesorId}
            variant="outline"
            className="bg-white text-black border border-gray-300 hover:bg-gray-100"
          >
            Volver a intentar
          </Button>
        </div>
      </div>
    );

  if (user && asesorId)
    return <PerfilAsesor userId={asesorId} editable={true} />;
}

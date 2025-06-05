"use client";
import { useParams } from "next/navigation";
import PerfilAsesor from "@/features/asesores/views/mi-perfil-asesor";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function PerfilAsesorPage() {
  const { id } = useParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!id || typeof id !== "string") {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500">
        <p className="text-base font-medium">ID de asesor no válido</p>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen w-full flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground text-lg">
          Cargando perfil...
        </span>
      </div>
    );
  }

  return <PerfilAsesor userId={Number(id)} editable={false} />;
}
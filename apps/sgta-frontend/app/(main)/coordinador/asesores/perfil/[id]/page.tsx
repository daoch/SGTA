"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PerfilAsesorCard from "@/features/asesores/components/perfil-asesor-card";
import { getPerfilAsesor, getFotoUsuario } from "@/features/asesores/hooks/perfil/perfil-apis";
import type { Asesor } from "@/features/asesores/types/perfil/entidades";

export default function PerfilAsesorPage() {
  const { id } = useParams();
  const [asesor, setAsesor] = useState<Asesor | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === "string") {
      getPerfilAsesor(Number(id)).then(setAsesor);
      getFotoUsuario(Number(id))
        .then(setAvatar)
        .catch(() => setAvatar(null));
    }
  }, [id]);

  if (!asesor) return <div>Cargando...</div>;

  return (
    <PerfilAsesorCard
      asesor={asesor}
      editedData={asesor}
      isEditing={false}
      setEditedData={() => {}}
      avatar={avatar}
    />
  );
}
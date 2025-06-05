"use client";

import PerfilAsesor from "@/features/asesores/views/mi-perfil-asesor";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams();

  const asesorId = parseInt(id as string, 10);

  if (isNaN(asesorId)) {
    return (
      <div className="p-6 text-center text-red-600">ID de asesor inválido.</div>
    );
  }

  return <PerfilAsesor userId={asesorId} editable={false} />;
};

export default Page;

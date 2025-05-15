import PerfilAsesor from "@/features/asesores/views/mi-perfil-asesor";
import { useAuth } from "@/features/auth";
import { UserX } from "lucide-react";

export default function AppProfile() {
  const { user } = useAuth();
  const userId = /^\d+$/.test(user?.id ?? "") ? user?.id : null;

  console.log("userId", userId);

  if (!user || !userId)
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500">
        <UserX className="w-16 h-16 mb-4" />
        <p className="text-base font-medium">Usuario no encontrado</p>
      </div>
    );

  return <PerfilAsesor userId={+user.id} editable={true} />;
}

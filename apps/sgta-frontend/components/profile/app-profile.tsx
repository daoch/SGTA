import PerfilAsesor from "@/features/asesores/views/mi-perfil-asesor";
import { useAuth } from "@/features/auth";

export default function AppProfile() {
  const { user } = useAuth();

  if (!user) return null;

  const roles = user.roles || [];

  if (roles.includes("asesor")) {
    return <PerfilAsesor userId={+user?.id} editable={true} />;
  }

  return null;
}

import PerfilAsesorEditable from "@/features/asesores/views/mi-perfil-asesor";
import { useAuth } from "@/features/auth";

export default function AppProfile() {
  const { user } = useAuth();

  if (!user) return null;

  const roles = user.roles || [];

  if (roles.includes("asesor")) {
    return <PerfilAsesorEditable />;
  }

  // Puedes cambiar esto por un componente de fallback, loading o mensaje personalizado
  return null;
}

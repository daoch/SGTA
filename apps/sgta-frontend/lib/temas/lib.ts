import { Solicitante, User } from "@/features/temas/types/solicitudes/entities";
import { Coasesor, Tesista } from "@/features/temas/types/temas/entidades";

type UserType = Coasesor | Tesista;

export function joinUsers(users: UserType[]): string {
  if (!users || users.length === 0) return "-";
  return users
    .map((user) => `${user.nombres} ${user.primerApellido ?? ""}`.trim())
    .join(", ");
}

export function joinUsersSolicitud(users: User[]): string {
  if (!users || users.length === 0) return "-";
  return users
    .map((user) => `${user.nombres} ${user.primer_apellido ?? ""}`.trim())
    .join(", ");
}

export function usuarioCoincideConBusqueda(
  user: Coasesor | Tesista | Solicitante,
  searchBar: string,
): boolean {
  const query = searchBar.toLowerCase();

  return !!(
    user?.nombres?.toLowerCase().includes(query) ||
    user?.primerApellido?.toLowerCase().includes(query) ||
    user?.segundoApellido?.toLowerCase().includes(query) ||
    user?.correoElectronico?.toLowerCase().includes(query) ||
    user?.codigoPucp?.toLowerCase?.().includes?.(query)
  );
}


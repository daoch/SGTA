import { Coasesor, Tesista } from "@/features/temas/types/temas/entidades";

type UserType = Coasesor | Tesista;

export function joinUsers(users: UserType[]): string {
  if (!users || users.length === 0) return "-";
  return users
    .map((user) => `${user.nombres} ${user.primerApellido ?? ""}`.trim())
    .join(", ");
}


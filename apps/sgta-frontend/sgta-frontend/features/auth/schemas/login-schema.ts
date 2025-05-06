import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("El correo no es válido")
    .min(1, "El correo es obligatorio"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .min(1, "La contraseña es obligatoria"),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;

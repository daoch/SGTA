import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, AuthStore, User } from "../types/auth.types";

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          //FIXME: No olvidar de borrar
          console.log("Login", { email, password });
          const mockUser: User = {
            id: "1",
            name: "Usuario de Prueba",
            email,
            avatar:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-VfBVzrydylky0bi9OudhKyiGb320yT2y7w&s",
            roles: (() => {
              if (email.includes("alumno")) {
                return ["alumno"];
              }
              if (email.includes("revisor-asesor-jurado-coordinador")) {
                return ["jurado", "asesor", "revisor", "coordinador"];
              }
              if (email.includes("jurado-asesor-revisor")) {
                return ["jurado", "asesor", "revisor"];
              }
              if (email.includes("asesor-revisor")) {
                return ["asesor", "revisor"];
              }
              if (email.includes("jurado")) {
                return ["jurado"];
              }
              if (email.includes("coordinador")) {
                return ["coordinador"];
              }
              return ["alumno"];
            })(),
          };

          await new Promise((resolve) => setTimeout(resolve, 500));

          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({
            error: "Error al iniciar sesión. Comprueba tus credenciales.",
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({ ...initialState });
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const { user } = get();

          await new Promise((resolve) => setTimeout(resolve, 500));

          set({
            isLoading: false,
            isAuthenticated: !!user,
          });
        } catch {
          set({
            error: "Error al verificar la autenticación",
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

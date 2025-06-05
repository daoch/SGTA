// src/features/auth/types/auth.types.ts

// 1. Roles de usuario (sin cambios)
export type UserRole =
  | "alumno"
  | "jurado"
  | "asesor"
  | "coordinador"
  | "revisor"
  | "administrador";

// 2. Interfaz del usuario (sin cambios)
export interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  avatar?: string;
}

// 3. Estado de autenticación, ahora con isSessionReady
export interface AuthState {
  user: User | null;
  idToken: string | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isSessionReady: boolean;    // 👈 NUEVO: indica que ya se resolvió checkAuth (sea exitosa o no)
}

// 4. Store de autenticación, incluye la bandera en el estado
export interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  clearError: () => void;
  loginWithProvider: (provider: "Google") => void;
}

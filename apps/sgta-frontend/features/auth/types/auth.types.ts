export type UserRole =
  | "alumno"
  | "jurado"
  | "asesor"
  | "coordinador"
  | "revisor";

export interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;       
  confirmSignUp: (email: string, code: string) => Promise<void>;   
  clearError: () => void;
  loginWithProvider: (provider: "Google") => void;
}

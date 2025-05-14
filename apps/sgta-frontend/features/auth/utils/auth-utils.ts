import { useAuthStore } from "../store/auth-store";

/**
 * Returns the current authentication token from the Zustand store
 * @returns The ID token (JWT) or null if not authenticated
 */
export function getAuthToken(): string | null {
  return useAuthStore.getState().accessToken;
}

/**
 * Get the authentication header for API requests
 * @returns An object with the Authorization header or an empty object
 */
export function getAuthHeader(): { Authorization?: string } {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Interface for JWT payload
 */
export interface JwtPayload {
  exp: number;
  iat: number;
  sub: string;
  [key: string]: unknown;
}

/**
 * Parse the JWT token to get user claims
 * @param token JWT token string
 * @returns Parsed token payload or null if invalid
 */
export function parseJwt(token: string): JwtPayload | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

/**
 * Check if the current token is expired
 * @returns boolean indicating if token is expired
 */
export function isTokenExpired(): boolean {
  const token = getAuthToken();
  if (!token) return true;

  const decoded = parseJwt(token);
  if (!decoded) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

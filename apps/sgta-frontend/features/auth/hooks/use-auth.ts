import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../store/auth-store";
import { UserRole } from "../types/auth.types";

export const useAuth = (requiredRoles?: UserRole[]) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
    error,
    clearError,
  } = useAuthStore();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setIsCheckingAuth(true);
        await checkAuth();
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    verifyAuth();
  }, [checkAuth]);

  const hasRequiredRole = useCallback((): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!user) return false;
    return user.roles.some((role) => requiredRoles.includes(role));
  }, [user, requiredRoles]);

  const redirectToLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  const redirectToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        await login(email, password);
        const currentState = useAuthStore.getState();
        if (currentState.isAuthenticated) {
          redirectToDashboard();
        }
      } catch (error) {
        console.error("Login error:", error);
      }
    },
    [login, redirectToDashboard],
  );

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || isCheckingAuth,
    isCheckingAuth,
    login: handleLogin,
    logout,
    checkAuth,
    error,
    clearError,
    hasRequiredRole,
    redirectToLogin,
    redirectToDashboard,
  };
};

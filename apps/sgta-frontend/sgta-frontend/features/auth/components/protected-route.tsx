"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import { UserRole } from "../types/auth.types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, checkAuth } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  const hasRequiredRole = useCallback((): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!user) return false;
    return user.roles.some((role) => requiredRoles.includes(role));
  }, [user, requiredRoles]);

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setAuthChecked(true);
    };

    verifyAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authChecked && !isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (isAuthenticated && !hasRequiredRole()) {
        router.push("/dashboard");
      }
    }
  }, [authChecked, isLoading, isAuthenticated, router, hasRequiredRole]);

  if (isLoading || !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated || !hasRequiredRole()) {
    return null;
  }

  return <>{children}</>;
};

"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
  }, [user, requiredRoles]);  useEffect(() => {
    const verifyAuth = async () => {      try {
        // Check for authentication 
        await checkAuth();
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setAuthChecked(true);
      } catch (error) {
        console.error("Error verifying auth:", error);

        // This handles race conditions in Google OAuth flow
        const hasToken = localStorage.getItem("cognito_id_token");
        if (hasToken) {
          console.log("Detected token but auth failed, trying one more time");
          try {
            await checkAuth();
            await new Promise(resolve => setTimeout(resolve, 300));
          } catch (retryError) {
            console.error("Retry auth check failed:", retryError);
          }
        }
        setAuthChecked(true);
      }
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

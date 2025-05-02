"use client";

import { ReactNode } from "react";
import { useAuth } from "../hooks/use-auth";
import { UserRole } from "../types/auth.types";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback = null,
}) => {
  const { user } = useAuth();

  if (!user) {
    return fallback;
  }

  const hasAllowedRole = user.roles.some((role) => allowedRoles.includes(role));

  if (!hasAllowedRole) {
    return fallback;
  }

  return <>{children}</>;
};

"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAuthStore } from "@/features/auth/store/auth-store";
import type { User, UserRole } from "@/features/auth/types/auth.types";
import { jwtDecode } from "jwt-decode";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

interface IdTokenPayload {
  sub: string;
  email: string;
  name?: string;
  "cognito:groups"?: string[];
}

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const { redirectToDashboard } = useAuth();

  useEffect(() => {
    const fetchTokens = async () => {
      if (!code) return router.push("/login?error=missing_code");

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              client_id: process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID!,
              code,
              redirect_uri: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!,
            }),
          },
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error_description);

        // ✅ Decode the ID token and hydrate Zustand
        const tokenPayload = jwtDecode<IdTokenPayload>(data.id_token);
        console.log("🔍 Token Payload:", tokenPayload);
        const rawGroups = tokenPayload["cognito:groups"];
        console.log("👥 User Groups:", rawGroups);

        const roles: UserRole[] = Array.isArray(rawGroups)
          ? rawGroups.filter((g): g is UserRole =>
              ["administrador", "alumno", "jurado", "asesor", "coordinador", "revisor"].includes(g)
            )
          : [];

        const newUser: User = {
          id: tokenPayload.sub,
          name: tokenPayload.name || tokenPayload.email,
          email: tokenPayload.email,
          avatar: "",
          roles,
        };

        // Update auth store with complete user data
        useAuthStore.setState({
          user: newUser,
          idToken: data.id_token,
          accessToken: data.access_token,
          isAuthenticated: true,
          isLoading: false,
        });

        console.log("Assigned user:", newUser);

        // Store token in localStorage as a backup and in sessionStorage for quick access
        localStorage.setItem("cognito_id_token", data.id_token);
        sessionStorage.setItem("cognito_session_active", "true");

        console.log("✅ Authentication successful - redirecting to dashboard");

        // Use window.location.href for a full page refresh
        // This ensures the auth state is properly established
        window.location.href = "/dashboard";
      } catch (err) {
        console.error("OAuth token error:", err);
        window.location.href = "/login?error=oauth";
      }
    };

    if (!error) fetchTokens();
    else window.location.href = "/login?error=" + error;
  }, [code, error, router, redirectToDashboard]);

  return <p className="p-6 text-center">Validando sesión…</p>;
}

export default function Callback() {
  return (
    <Suspense fallback={<p className="p-6 text-center">Cargando...</p>}>
      <CallbackContent />
    </Suspense>
  );
}

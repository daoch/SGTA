"use client";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const fetchTokens = async () => {
      if (!code) return router.push("/login?error=missing_code");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID!,
            code,
            redirect_uri: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!,
          }),
        });        const data = await res.json();
        if (!res.ok) throw new Error(data.error_description);
        
        // Update the auth store with the token
        const { setState } = useAuthStore;
        setState({
          idToken: data.id_token,
          isAuthenticated: true,
          isLoading: false
        });
        
        await checkAuth();
        router.push("/dashboard");
      } catch (err) {
        console.error("OAuth token error:", err);
        router.push("/login?error=oauth");
      }
    };

    if (!error) fetchTokens();
    else router.push(`/login?error=${error}`);
  }, [code, error, router, checkAuth]);
  return <p className="p-6 text-center">Validando sesión…</p>;
}

export default function Callback() {
  return (
    <Suspense fallback={<p className="p-6 text-center">Cargando...</p>}>
      <CallbackContent />
    </Suspense>
  );
}

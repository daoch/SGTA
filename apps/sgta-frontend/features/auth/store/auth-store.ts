// src/features/auth/stores/auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AuthState,
  AuthStore,
  User,
  UserRole,
} from "../types/auth.types";

import { userPool } from "@/lib/cognito/cognito";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

/* ────────────────────────────────
   1. Estado inicial con isSessionReady
   ──────────────────────────────── */
const initialState: AuthState = {
  user: null,
  idToken: null,
  accessToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isSessionReady: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      /* ───────── login ───────── */
      login: (email, password) => {
        set({ isLoading: true, error: null });

        return new Promise<void>((resolve, reject) => {
          const cognitoUser = new CognitoUser({
            Username: email,
            Pool: userPool,
          });
          const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
          });

          cognitoUser.authenticateUser(authDetails, {
            onSuccess: (session) => {
              const payload = session.getIdToken().payload;
              const rawGroups = payload["cognito:groups"];
              const roles: UserRole[] = Array.isArray(rawGroups)
                ? rawGroups.filter((g): g is UserRole =>
                    [
                      "administrador",
                      "alumno",
                      "jurado",
                      "asesor",
                      "coordinador",
                      "revisor",
                    ].includes(g),
                  )
                : [];

              const newUser: User = {
                id: payload.sub!,
                name: (payload["name"] as string) || payload.email!,
                email: payload.email!,
                avatar: "",
                roles,
              };

              set({
                user: newUser,
                idToken: session.getIdToken().getJwtToken(),
                accessToken: session.getAccessToken().getJwtToken(),
                isAuthenticated: true,
                isLoading: false,
                isSessionReady: true,   // ✅ sesión lista
              });
              console.log("✅ Normal login ID token payload:", payload);
              resolve();
            },
            onFailure: (err) => {
              set({ error: err.message || JSON.stringify(err), isLoading: false });
              reject(err);
            },
          });
        });
      },

      /* ───────── logout ───────── */
      logout: () => {
        const current = userPool.getCurrentUser();
        if (current) current.signOut();

        localStorage.removeItem("idToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("cognito_id_token");
        localStorage.removeItem("auth-storage");
        sessionStorage.clear();

        set({ ...initialState, isSessionReady: false }); // ⬅️ lista = false
        console.log("✅ Logout completed: All tokens and session data cleared");
      },

      /* ───────── signUp, confirmSignUp (sin cambios) ───────── */
      signUp: (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        return new Promise<void>((resolve, reject) => {
          const parts = name.trim().split(" ");
          const givenName = parts.shift() || "";
          const familyName = parts.join(" ") || "";
          const attributes = [
            new CognitoUserAttribute({ Name: "email", Value: email }),
            new CognitoUserAttribute({ Name: "given_name", Value: givenName }),
            new CognitoUserAttribute({
              Name: "family_name",
              Value: familyName,
            }),
          ];
          userPool.signUp(email, password, attributes, [], (err) => {
            set({ isLoading: false });
            if (err) {
              set({ error: err.message || JSON.stringify(err) });
              return reject(err);
            }
            // _result.userConfirmed will be false if user must confirm code
            resolve();
          });
        });
      },

      confirmSignUp: (email: string, code: string) => {
        set({ isLoading: true, error: null });
        return new Promise<void>((resolve, reject) => {
          const user = new CognitoUser({ Username: email, Pool: userPool });
          user.confirmRegistration(code, true, (err) => {
            set({ isLoading: false });
            if (err) {
              set({ error: err.message || JSON.stringify(err) });
              return reject(err);
            }
            resolve();
          });
        });
      },

      /* ───────── checkAuth (restaurar sesión) ───────── */
      checkAuth: () => {
      set({ isLoading: true });

      // Intentar obtener el usuario actual de Cognito
      const current = userPool.getCurrentUser();

      // Verificar si hay un "backup token" en localStorage o sessionStorage
      const hasBackupToken =
        localStorage.getItem("cognito_id_token") ||
        sessionStorage.getItem("cognito_session_active");

      // Si no hay current pero sí backupToken, intentar restaurar a partir de él...
      if (!current && hasBackupToken) {
        try {
          const backupToken = localStorage.getItem("cognito_id_token");
          if (backupToken) {
            const payload = JSON.parse(atob(backupToken.split(".")[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < currentTime) {
              console.log("⚠️ Backup token expirado, limpiando");
              localStorage.removeItem("cognito_id_token");
              sessionStorage.removeItem("cognito_session_active");
              throw new Error("Token expirado");
            }

            const rawGroups = payload["cognito:groups"];
            const roles: UserRole[] = Array.isArray(rawGroups)
              ? rawGroups.filter((g): g is UserRole =>
                  ["administrador", "alumno", "jurado", "asesor", "coordinador", "revisor"].includes(g)
                )
              : [];

            const newUser: User = {
              id: payload.sub,
              name: (payload["name"] as string) || payload.email,
              email: payload.email,
              avatar: "",
              roles,
            };

            // Restaurar estado a partir del backupToken
            set({
              user: newUser,
              idToken: backupToken,
              isAuthenticated: true,
              isLoading: false,
              isSessionReady: true, // ✅ ya tengo sesión "falsa" restaurada
            });
            sessionStorage.setItem("cognito_session_active", "true");
            console.log("✅ Sesión restaurada desde backup token");
            return Promise.resolve();
          }
        } catch (e) {
          console.error("Error al restaurar sesión desde backup token:", e);
          localStorage.removeItem("cognito_id_token");
          sessionStorage.removeItem("cognito_session_active");
        }
      }

      // Si no hay current y tampoco backupToken, marcamos como "sin sesión"
      if (!current) {
        set({
          user: null,
          idToken: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          isSessionReady: true, // ✅ Ya chequé y confirmé que no hay sesión
        });
        return Promise.resolve();
      }

      // Si sí hay un usuario Cognito, validamos su sesión
      return new Promise<void>((resolve) => {
        current.getSession((err: Error | null, session: CognitoUserSession | null) => {
          // 👆 Aquí anotamos explícitamente los tipos de err y session
          if (err || !session || !session.isValid()) {
            console.log("⚠️ Sesión Cognito inválida o expirada:", err);
            localStorage.removeItem("cognito_id_token");
            sessionStorage.removeItem("cognito_session_active");

            set({
              user: null,
              idToken: null,
              accessToken: null,
              isAuthenticated: false,
              isLoading: false,
              isSessionReady: true, // ✅ Ya finalicé checkAuth y no hay sesión válida
            });
            return resolve();
          }

          // Si llegamos acá, la sesión es válida:
          const payload = session.getIdToken().payload;
          const rawGroups = payload["cognito:groups"];
          const roles: UserRole[] = Array.isArray(rawGroups)
            ? rawGroups.filter((g): g is UserRole =>
                ["administrador", "alumno", "jurado", "asesor", "coordinador", "revisor"].includes(g)
              )
            : [];

          const newUser: User = {
            id: payload.sub!,
            name: (payload["name"] as string) || payload.email!,
            email: payload.email!,
            avatar: "",
            roles,
          };

          const idToken = session.getIdToken().getJwtToken();
          const accessToken = session.getAccessToken().getJwtToken();

          set({
            user: newUser,
            idToken,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
            isSessionReady: true, // ✅ Ya finalicé checkAuth y se presentó una sesión válida
          });

          // Guardamos el token en localStorage/sessionStorage para backup
          localStorage.setItem("cognito_id_token", idToken);
          sessionStorage.setItem("cognito_session_active", "true");
          resolve();
        });
      });
    },

      clearError: () => set({ error: null }),

      loginWithProvider: (provider: "Google") => {
        set({ isLoading: true, error: null });
        try {
          if (provider === "Google") {
            // Redirect to the Cognito-hosted UI with Google as the identity provider
            const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
            const clientId = process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID!;
            const redirect = encodeURIComponent(
              process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!
            );
            const scope = encodeURIComponent("openid email profile");

            const url =
              `${domain}/oauth2/authorize` +
              `?identity_provider=${provider}` +
              `&redirect_uri=${redirect}` +
              "&response_type=code" +
              `&client_id=${clientId}` +
              `&scope=${scope}`;

            console.log("Redirecting to:", url);
            window.location.href = url;
          }
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Error initiating social login";
          set({
            error: message,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        idToken: state.idToken,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      version: 1,
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);

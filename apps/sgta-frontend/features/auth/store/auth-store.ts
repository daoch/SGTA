import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, AuthStore, User, UserRole } from "../types/auth.types";

import { userPool } from "@/lib/cognito/cognito";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

// Helper function to capitalize names properly with UTF-8 support
const capitalizeNames = (name: string): string => {
  if (!name) return name;
  return name
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      // Use proper Unicode-aware capitalization
      return word.charAt(0).toLocaleUpperCase('es-ES') + word.slice(1).toLocaleLowerCase('es-ES');
    })
    .join(' ');
};

// Helper function to extract first and last name, handling middle names
const extractFirstAndLastName = (fullName: string): { firstName: string; lastName: string } => {
  if (!fullName) return { firstName: '', lastName: '' };
  
  const nameParts = fullName.trim().split(' ').filter(part => part.length > 0);
  
  if (nameParts.length === 0) return { firstName: '', lastName: '' };
  if (nameParts.length === 1) return { firstName: nameParts[0], lastName: '' };
  
  // For Latin America: take first name and last surname (skip middle names)
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  
  return { firstName, lastName };
};

const initialState: AuthState = {
  user: null,
  idToken: null,
  accessToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      login: (email: string, password: string) => {
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
                    ["administrador", "alumno", "jurado", "asesor", "coordinador", "revisor"].includes(g)
                  )
                : [];

              const rawFirstName = payload["given_name"] as string;
              const rawLastName = payload["family_name"] as string;
              const fullName = (payload["name"] as string) || payload.email!;
              
              // Process names for proper capitalization and structure
              let firstName = rawFirstName;
              let lastName = rawLastName;
              
              // If we have a full name but no separate first/last names, extract them
              if (!firstName || !lastName) {
                const extracted = extractFirstAndLastName(fullName);
                firstName = firstName || extracted.firstName;
                lastName = lastName || extracted.lastName;
              }
              
              // Capitalize names properly
              firstName = capitalizeNames(firstName);
              lastName = capitalizeNames(lastName);
              
              const newUser: User = {
                id: payload.sub!,
                name: fullName,
                firstName,
                lastName,
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
              });
              console.log("✅ Normal login ID token payload:", payload);
              resolve();
            },
            onFailure: (err) => {
              set({
                error: err.message || JSON.stringify(err),
                isLoading: false,
              });
              reject(err);
            },
          });
        });
      },
      logout: () => {
        // 1. Clear Cognito session
        const current = userPool.getCurrentUser();
        if (current) current.signOut();

        // 2. Clear all local storage tokens and session state
        localStorage.removeItem("idToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("cognito_id_token");
        localStorage.removeItem("auth-storage"); // Clear Zustand persisted state
        sessionStorage.clear(); // Clear any session storage data

        // 3. Reset auth state in Zustand
        set({ ...initialState });

        console.log("✅ Logout completed: All tokens and session data cleared");
      },

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

      checkAuth: () => {
        set({ isLoading: true });

        // Try to get current user from Cognito
        const current = userPool.getCurrentUser();

        // Check for backup tokens from various sources (localStorage, sessionStorage)
        const hasBackupToken =
          localStorage.getItem("cognito_id_token") ||
          sessionStorage.getItem("cognito_session_active");

        // Attempt session restoration from backup token if Cognito session is missing
        if (!current && hasBackupToken) {
          try {
            const backupToken = localStorage.getItem("cognito_id_token");
            if (backupToken) {
              // Parse the backup token to extract user info
              const payload = JSON.parse(atob(backupToken.split(".")[1]));

              // Validate token expiration
              const currentTime = Math.floor(Date.now() / 1000);
              if (payload.exp && payload.exp < currentTime) {
                console.log("⚠️ Backup token expired, removing it");
                localStorage.removeItem("cognito_id_token");
                sessionStorage.removeItem("cognito_session_active");
                throw new Error("Token expired");
              }

              const rawGroups = payload["cognito:groups"];
              const roles: UserRole[] = Array.isArray(rawGroups)
                ? rawGroups.filter((g): g is UserRole =>
                    ["administrador", "alumno", "jurado", "asesor", "coordinador", "revisor"].includes(g)
                  )
                : [];

              const rawFirstName = payload["given_name"] as string;
              const rawLastName = payload["family_name"] as string;
              const fullName = (payload["name"] as string) || payload.email;
              
              // Process names for proper capitalization and structure
              let firstName = rawFirstName;
              let lastName = rawLastName;
              
              // If we have a full name but no separate first/last names, extract them
              if (!firstName || !lastName) {
                const extracted = extractFirstAndLastName(fullName);
                firstName = firstName || extracted.firstName;
                lastName = lastName || extracted.lastName;
              }
              
              // Capitalize names properly
              firstName = capitalizeNames(firstName);
              lastName = capitalizeNames(lastName);
              
              const newUser: User = {
                id: payload.sub,
                name: fullName,
                firstName,
                lastName,
                email: payload.email,
                avatar: "",
                roles,
              };

              // Restore auth state from backup token
              set({
                user: newUser,
                idToken: backupToken,
                isAuthenticated: true,
                isLoading: false,
              });
              // Refresh the session markers
              sessionStorage.setItem("cognito_session_active", "true");

              console.log("✅ Restored session from backup token");
              return Promise.resolve();
            }
          } catch (e) {
            console.error("Error restoring session from backup token:", e);
            localStorage.removeItem("cognito_id_token");
            sessionStorage.removeItem("cognito_session_active");
          }
        }
        // If no Cognito user and no backup token was found
        if (!current) {
          set({
            isLoading: false,
            isAuthenticated: false,
            accessToken: null,
            user: null,
            idToken: null,
          });
          return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
          current.getSession(
            (err: Error | null, session: CognitoUserSession | null) => {
              // If there's an error or no valid session
              if (err || !session || !session.isValid()) {
                console.log("⚠️ Cognito session invalid or expired", err);
                // Try one more time with backup token
                const backupToken = localStorage.getItem("cognito_id_token");
                if (backupToken) {
                  // We already tried to restore from backup above, so if we're here,
                  // let's try one more cleanup and force user to re-authenticate
                  localStorage.removeItem("cognito_id_token");
                  sessionStorage.removeItem("cognito_session_active");
                }

                set({
                  user: null,
                  idToken: null,
                  accessToken: null,
                  isAuthenticated: false,
                  isLoading: false,
                });

                return resolve();
              }
              // We have a valid session
              const payload = session.getIdToken().payload;
              const rawGroups = payload["cognito:groups"];
              const roles: UserRole[] = Array.isArray(rawGroups)
                ? rawGroups.filter((g): g is UserRole =>
                    ["administrador",
                      "alumno",
                      "jurado",
                      "asesor",
                      "coordinador",
                      "revisor",
                    ].includes(g),
                  )
                : [];
              const rawFirstName = payload["given_name"] as string;
              const rawLastName = payload["family_name"] as string;
              const fullName = (payload["name"] as string) || payload.email!;
              
              // Process names for proper capitalization and structure
              let firstName = rawFirstName;
              let lastName = rawLastName;
              
              // If we have a full name but no separate first/last names, extract them
              if (!firstName || !lastName) {
                const extracted = extractFirstAndLastName(fullName);
                firstName = firstName || extracted.firstName;
                lastName = lastName || extracted.lastName;
              }
              
              // Capitalize names properly
              firstName = capitalizeNames(firstName);
              lastName = capitalizeNames(lastName);
              
              const newUser: User = {
                id: payload.sub!,
                name: fullName,
                firstName,
                lastName,
                email: payload.email!,
                avatar: "",
                roles,
              };

              // Get the fresh token and store it in all locations
              const idToken = session.getIdToken().getJwtToken();
              const accessToken = session.getAccessToken().getJwtToken();

              // Update our Zustand state
              set({
                user: newUser,
                idToken: idToken,
                accessToken: accessToken,
                isAuthenticated: true,
                isLoading: false,
              });
              // Also update backup storage locations for better reliability
              localStorage.setItem("cognito_id_token", idToken);
              sessionStorage.setItem("cognito_session_active", "true");
              resolve();
            },
          );
        });
      },

      clearError: () => {
        set({ error: null });
      },

      loginWithProvider: (provider: "Google") => {
        set({ isLoading: true, error: null });
        try {
          if (provider === "Google") {
            // Redirect to the Cognito-hosted UI with Google selected as the identity provider
            const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
            const clientId = process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID!;
            const redirect = encodeURIComponent(
              process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!,
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
            error instanceof Error
              ? error.message
              : "Error initiating social login";
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
      // Force storage to update synchronously
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

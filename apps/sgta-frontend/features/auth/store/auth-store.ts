import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, AuthStore, User, UserRole } from "../types/auth.types";

import { userPool } from "@/lib/cognito/cognito"; // Adjust the import path as needed
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserSession
} from "amazon-cognito-identity-js";

const initialState: AuthState = {
  user: null,
  idToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, _get) => ({
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
                    ["alumno","jurado","asesor","coordinador","revisor"].includes(g)
                  )
                : [];              
              
                const newUser: User = {
                id:      payload.sub!,
                name:    (payload["name"] as string) || payload.email!,
                email:   payload.email!,
                avatar:  "",                                    
                roles,
              };
              set({
                user: newUser,
                idToken: session.getIdToken().getJwtToken(),
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
      },          logout: () => {
        // 1. Clear Cognito session
        const current = userPool.getCurrentUser();             
        if (current) current.signOut();
        
        // 2. Clear all local storage tokens and session state
        localStorage.removeItem("idToken");
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
           new CognitoUserAttribute({ Name: "email",       Value: email      }),
           new CognitoUserAttribute({ Name: "given_name",  Value: givenName }),
           new CognitoUserAttribute({ Name: "family_name", Value: familyName }),
         ];         userPool.signUp(email, password, attributes, [], (err, _result) => {
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
         const user = new CognitoUser({ Username: email, Pool: userPool });         user.confirmRegistration(code, true, (err, _success) => {
           set({ isLoading: false });
           if (err) {
             set({ error: err.message || JSON.stringify(err) });
             return reject(err);
           }
           resolve();
         });
       });
     },      checkAuth: () => {
        set({ isLoading: true });

        
        // Try to get current user from Cognito
        const current = userPool.getCurrentUser();
        
        // Check for backup tokens from various sources (localStorage, sessionStorage)
        const hasBackupToken = localStorage.getItem("cognito_id_token") || 
                              sessionStorage.getItem("cognito_session_active");
        
        // Attempt session restoration from backup token if Cognito session is missing
        if ((!current) && hasBackupToken) {
          try {            const backupToken = localStorage.getItem("cognito_id_token");
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
                    ["alumno","jurado","asesor","coordinador","revisor"].includes(g)
                  )
                : [];
              
              const newUser: User = {
                id: payload.sub,
                name: (payload["name"] as string) || payload.email,
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
            user: null,
            idToken: null 
          });
          return Promise.resolve();
        }
        
        return new Promise<void>((resolve) => {
          current.getSession((err: Error | null, session: CognitoUserSession | null) => {
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
                  ["alumno","jurado","asesor","coordinador","revisor"].includes(g)
                )
              : [];
            const newUser: User = {
              id:    payload.sub!,
              name:  (payload["name"] as string) || payload.email!,
              email: payload.email!,
              avatar: "",
              roles,
            };
            
            // Get the fresh token and store it in all locations
            const idToken = session.getIdToken().getJwtToken();
            
            // Update our Zustand state
            set({
              user: newUser,
              idToken: idToken,
              isAuthenticated: true,
              isLoading: false,
            });
              // Also update backup storage locations for better reliability
            localStorage.setItem("cognito_id_token", idToken);
            sessionStorage.setItem("cognito_session_active", "true");
            resolve();
          });
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
            const domain    = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
            const clientId  = process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID!;
            const redirect  = encodeURIComponent(process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!);
            const scope     = encodeURIComponent("openid email profile");
            
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
          const message = error instanceof Error ? error.message : "Error initiating social login";
          set({ 
            error: message, 
            isLoading: false 
          });
        }
      },    }),    {
      name: "auth-storage",
      partialize: (state) => ({ 
        user: state.user, 
        idToken: state.idToken,
        isAuthenticated: state.isAuthenticated 
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

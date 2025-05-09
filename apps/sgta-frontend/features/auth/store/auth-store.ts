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
    (set, get) => ({
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
                : [];              const newUser: User = {
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
      },      logout: () => {
        const current = userPool.getCurrentUser();             
        if (current) current.signOut();                       
        set({ ...initialState });
        localStorage.removeItem("idToken"); // Clear any stored token
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
         ];

         userPool.signUp(email, password, attributes, [], (err, result) => {
           set({ isLoading: false });
           if (err) {
             set({ error: err.message || JSON.stringify(err) });
             return reject(err);
           }
           // result.userConfirmed will be false if user must confirm code
           resolve();
         });
       });
     },
     
     confirmSignUp: (email: string, code: string) => {
       set({ isLoading: true, error: null });
       return new Promise<void>((resolve, reject) => {
         const user = new CognitoUser({ Username: email, Pool: userPool });
         user.confirmRegistration(code, true, (err, success) => {
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
        
        const current = userPool.getCurrentUser();             
        if (!current) {
          set({ isLoading: false, isAuthenticated: false });
          return Promise.resolve();
        }
        return new Promise<void>((resolve) => {
          current.getSession((err: Error | null, session: CognitoUserSession | null) => {
            void err;
            if (session && session?.isValid()) {
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
              };              set({
                user: newUser,
                idToken: session.getIdToken().getJwtToken(),
                isAuthenticated: true,
                isLoading: false,
              });
            } else {              set({
                user: null,
                idToken: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
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
      },
    }),    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, idToken: state.idToken }),
    },
  ),
);

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoginFormInputs, loginSchema } from "../schemas/login-schema";
import { SignUpForm } from "./signup-form";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    login,
    error,
    isLoading,
    isAuthenticated,
    isCheckingAuth,
    redirectToDashboard,
    clearError,
    loginWithProvider,
  } = useAuth();

  const [showSignUp, setShowSignUp] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDialogChange = (open: boolean, type: "signup" | "confirm") => {
    if (type === "signup") {
      setShowSignUp(open);
    } else {
      setShowConfirmation(open);
    }
    if (!open) clearError();
  };

  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated) {
      redirectToDashboard();
    }
  }, [isAuthenticated, isCheckingAuth, redirectToDashboard]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  if (isCheckingAuth || isAuthenticated) {
    return <div>Cargando...</div>;
  }

  const onSubmit = async (data: LoginFormInputs) => {
    await login(data.email, data.password);
  };

  //FIXME: Borrar cuando ya tengamos integrado con cognito
  const handleMockLogin = async (email: string) => {
    await login(email, "password");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {error && (
              <div className="p-3 text-sm text-red-800 rounded-md bg-red-50">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    id="email"
                    {...field}
                    type="email"
                    placeholder="prueba@pucp.edu.pe"
                    required
                  />
                )}
              />
              {errors.email && (
                <span className="text-sm text-red-600">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input id="password" {...field} type="password" required />
                )}
              />
              {errors.password && (
                <span className="text-sm text-red-600">
                  {errors.password.message}
                </span>
              )}
            </div>{" "}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Cargando..." : "Iniciar sesión"}
            </Button>{" "}
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              type="button"
              disabled={isLoading}
              onClick={() => loginWithProvider("Google")} //we call a custom function that calls Cognito's integration with Google Auth
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                  c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
                  c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039
                  l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
                  c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                  c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Iniciar sesión con Google
            </Button>
            {/* Sign up link */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">
                ¿No tienes una cuenta?
              </span>
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                type="button"
                onClick={() => setShowSignUp(true)}
                disabled={isLoading}
              >
                Regístrate aquí
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* Sign Up Dialog to register in Cognito User Pool */}
      <Dialog
        open={showSignUp}
        onOpenChange={(open) => handleDialogChange(open, "signup")}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regístrate</DialogTitle>
            <DialogDescription>Crea tu cuenta para continuar</DialogDescription>
          </DialogHeader>
          <SignUpForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}

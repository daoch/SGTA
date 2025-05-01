"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LoginFormInputs, loginSchema } from "../schemas/login-schema";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { login, error, isLoading, isAuthenticated, redirectToDashboard } =
    useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      redirectToDashboard();
    }
  }, [isAuthenticated, redirectToDashboard]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

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
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Cargando..." : "Iniciar sesión"}
            </Button>
            <Button variant="outline" className="w-full" disabled={isLoading}>
              Iniciar sesión con Google
            </Button>

            {/* FIXME: Borrar cuando ya tengamos impelmentado cognito */}
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleMockLogin("alumno@pucp.edu.pe")}
                disabled={isLoading}
              >
                Ingresar como Alumno
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  handleMockLogin(
                    "revisor-asesor-jurado-coordinador@pucp.edu.pe",
                  )
                }
                disabled={isLoading}
              >
                Ingresar como Revisor / Asesor / Jurado / Coordinador
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  handleMockLogin("jurado-asesor-revisor@pucp.edu.pe")
                }
                disabled={isLoading}
              >
                Ingresar como Jurado / Asesor / Revisor
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleMockLogin("asesor-revisor@pucp.edu.pe")}
                disabled={isLoading}
              >
                Ingresar como Asesor / Revisor
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleMockLogin("jurado@pucp.edu.pe")}
                disabled={isLoading}
              >
                Ingresar como Jurado
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleMockLogin("coordinador@pucp.edu.pe")}
                disabled={isLoading}
              >
                Ingresar como Coordinador
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

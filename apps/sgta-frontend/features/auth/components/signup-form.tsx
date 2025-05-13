import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/use-auth";

type Form = { email: string; password: string; givenName: string; familyName: string };

export function SignUpForm() {
  const { signUp, isLoading, error } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [emailSentTo, setEmailSentTo] = useState<string>("");
  const { register, handleSubmit, formState: { errors } } = useForm<Form>();

  const onSubmit = async (data: Form) => {
    const fullName = `${data.givenName} ${data.familyName}`;
    try {
      await signUp(data.email, data.password, fullName);
      setEmailSentTo(data.email);
      setSubmitted(true);
      // show confirmation UI next…
    } catch {}
  };

  if (submitted) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-green-700">
          ¡Registro exitoso! Hemos enviado un enlace de verificación a <strong>{emailSentTo}</strong>.
          Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
        </p>
        <Button className="w-full" type="button" onClick={() => window.location.reload()}>
          Continuar a Iniciar sesión
        </Button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {error && <div className="text-red-600 text-center">{error}</div>}

      <div className="grid gap-2">
        <Label>Nombre</Label>
        <Input {...register("givenName", { required: "El nombre es obligatorio" })} />
        {errors.givenName && <span className="text-sm text-red-600">{errors.givenName.message}</span>}
      </div>

      <div className="grid gap-2">
        <Label>Apellido</Label>
        <Input {...register("familyName", { required: "El apellido es obligatorio" })} />
        {errors.familyName && <span className="text-sm text-red-600">{errors.familyName.message}</span>}
      </div>

      <div className="grid gap-2">
        <Label>Email</Label>
        <Input type="email" {...register("email", { required: "El correo es obligatorio" })} />
        {errors.email && <span className="text-sm text-red-600">{errors.email.message}</span>}
      </div>

      <div className="grid gap-2">
        <Label>Contraseña</Label>
        <Input type="password" {...register("password", { required: "La contraseña es obligatoria" })} />
        {errors.password && <span className="text-sm text-red-600">{errors.password.message}</span>}
      </div>

      <Button className="w-full mt-4" type="submit" disabled={isLoading}>
        Registrarse
      </Button>
    </form>
  );
}
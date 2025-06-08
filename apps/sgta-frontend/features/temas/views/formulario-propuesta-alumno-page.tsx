"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth-store";
import FormularioPropuesta, {
  Estudiante,
  FormData,
  TemaSimilar,
} from "@/features/temas/components/alumno/formulario-propuesta";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, Toaster } from "sonner";

export default function FormularioPropuestaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    data: FormData,
    cotesistas: Estudiante[],
    similares: TemaSimilar[] = [],
    forzarGuardar: boolean = false
  ) => {
    setLoading(true);

    const fechaActual = new Date().toISOString();
    const fechaLimiteFinal = data.fechaLimite
      ? new Date(data.fechaLimite + "T10:00:00Z").toISOString()
      : null;

    const tipoPropuesta = data.tipo === "general" ? 0 : 1;

    const subareas = [{ id: data.area }];
    const coasesores =
      data.tipo === "directa" && data.asesor
        ? [{ id: Number(data.asesor) }]
        : [];
    const tesistas = cotesistas.map((c) => ({ id: Number(c.id) }));

    const payload = {
      id: null,
      codigo: `TEMA-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      titulo: data.titulo,
      resumen: data.descripcion,
      objetivos: data.objetivos,
      portafolioUrl:
        "https://miuniversidad.edu/repos/" +
        data.titulo.toLowerCase().replace(/ /g, "-"),
      activo: true,
      fechaCreacion: fechaActual,
      fechaModificacion: fechaActual,
      fechaLimite: fechaLimiteFinal,
      subareas,
      coasesores,
      tesistas,
    };

    try {
      const { idToken } = useAuthStore.getState();
      if (!idToken) {
        console.error("No authentication token available");
        return;
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/temas/createPropuesta?tipoPropuesta=${tipoPropuesta}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("API error");
      const dataRes = await res.json();
      const temaId = typeof dataRes === "number" ? dataRes : dataRes.id;

      if (forzarGuardar && similares.length > 0) {
        const similitudesPayload = similares.map((sim) => ({
          tema: { id: temaId },
          temaRelacion: { id: sim.tema.id },
          porcentajeSimilitud: sim.similarityScore,
        }));

        console.log("Payload para guardarSimilitudes:", similitudesPayload);

        const resSim = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/temas/guardarSimilitudes`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(similitudesPayload),
          }
        );
        if (!resSim.ok) throw new Error("Error al guardar similitudes");
      }

      toast.success("Propuesta registrada", {
        description: "Tu propuesta ha sido enviada satisfactoriamente",
        duration: 3000,
      });

      setTimeout(() => {
        router.push("/alumno/temas");
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Error", {
        description: "No se pudo registrar la propuesta",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full pt-5">
        <h1 className="text-3xl font-bold text-[#042354] mb-5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/alumno/temas")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="ml-3">Nueva Propuesta de Tema</span>
        </h1>
        <FormularioPropuesta loading={loading} onSubmit={handleSubmit} />
      </div>

      {}
      <Toaster position="bottom-right" richColors />
    </>
  );
}

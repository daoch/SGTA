"use client";

import { Button } from "@/components/ui/button";
import FormularioPropuesta, {
  Estudiante,
  FormData,
} from "@/features/temas/components/alumno/formulario-propuesta";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function FormularioPropuestaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: FormData, cotesistas: Estudiante[]) => {
    setLoading(true);

    // Mapea tu FormData a la API
    const fechaActual = new Date().toISOString();
    const fechaLimiteFinal = data.fechaLimite
      ? new Date(data.fechaLimite + "T10:00:00Z").toISOString()
      : null;

    const idUsuarioCreador = 2;
    const tipoPropuesta = data.tipo === "general" ? 0 : 1;

    // busca ids de subárea y asesor
    const subareas = [{ id: data.area }];
    const coasesores =
      data.tipo === "directa" && data.asesor
        ? [{ id: Number(data.asesor) }]
        : [];
    const tesistas = [
    { id: idUsuarioCreador },
    ...cotesistas.map((c) => ({ id: Number(c.id) }))
  ];

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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/temas/createPropuesta` +
          `?idUsuarioCreador=${idUsuarioCreador}` +
          `&tipoPropuesta=${tipoPropuesta}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("API error");
      toast.success("Propuesta creada exitosamente");
      router.push("/alumno/temas");
    } catch (err) {
      console.error(err);
      toast.error("Error al crear la propuesta");
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}

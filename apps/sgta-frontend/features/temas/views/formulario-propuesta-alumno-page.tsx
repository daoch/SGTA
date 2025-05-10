"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface Estudiante {
  codigo: string;
  nombre: string;
}

interface FormData {
  titulo: string;
  descripcion: string;
  area: string;
  objetivos: string;
  tipo: "general" | "directa";
  asesor: string;
  fechaLimite: string;
}

const areasData = [
  "Inteligencia Artificial",
  "Desarrollo Web",
  "Ciencia de Datos",
  "Internet de las Cosas",
];

const profesoresData = [
  { id: "1", nombre: "Dr. Roberto Sánchez" },
  { id: "2", nombre: "Dra. Carmen Vega" },
  { id: "3", nombre: "Dr. Miguel Torres" },
];

const estudiantesData: Estudiante[] = [
  { codigo: "20190123", nombre: "Carlos Mendoza" },
  { codigo: "20190456", nombre: "Pedro López" },
  { codigo: "20180789", nombre: "Ana García" },
];

const FormularioPropuestaPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    descripcion: "",
    area: "",
    objetivos: "",
    tipo: "general",
    asesor: "",
    fechaLimite: "",
  });
  const [codigoCotesista, setCodigoCotesista] = useState("");
  const [cotesistas, setCotesistas] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCotesista = () => {
    const estudiante = estudiantesData.find((e) => e.codigo === codigoCotesista);
    if (estudiante && !cotesistas.some((c) => c.codigo === estudiante.codigo)) {
      setCotesistas([...cotesistas, estudiante]);
      setCodigoCotesista("");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const fechaActual = new Date().toISOString();
    const idUsuarioCreador = 4;
    const asesorSeleccionado = profesoresData.find(p => p.nombre === formData.asesor);

    const idAsesor = formData.tipo === "directa" && asesorSeleccionado ? Number(asesorSeleccionado.id) : null;

    const temaPayload = {
      id: null,
      codigo: "TEMA-" + Math.floor(Math.random() * 1000).toString().padStart(3, "0"),
      titulo: formData.titulo,
      resumen: formData.descripcion,
      portafolioUrl: "https://miuniversidad.edu/repos/" + formData.titulo.toLowerCase().replace(/ /g, "-"),
      activo: true,
      fechaCreacion: fechaActual,
      fechaModificacion: fechaActual,
      idUsuarioInvolucradosList: idAsesor ? [idAsesor] : [],
      idSubAreasConocimientoList: [1],
      idEstadoTema: formData.tipo === "general" ? 8 : 7,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/temas/createPropuesta?idUsuarioCreador=${idUsuarioCreador}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(temaPayload),
      });

      if (!res.ok) throw new Error("Error en la API");

      toast.success("Propuesta creada exitosamente");
      router.push("/alumno/temas");
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al crear la propuesta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 mt-4">
      <div className="flex items-center gap-2">
        <Link href="/alumno/temas">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#042354]">Nueva Propuesta</h1>
          <p className="text-muted-foreground text-sm">Proponer un nuevo tema de tesis</p>
        </div>
      </div>

      <Card>
        <form>
          <CardHeader>
            <CardTitle>Formulario de Propuesta</CardTitle>
            <CardDescription>Complete la información para registrar una nueva propuesta</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 px-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título de la Propuesta</Label>
              <Input id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required />
            </div>

            <div className="space-y-0.5">
              <Label>Área de Investigación</Label>
              <Select value={formData.area} onValueChange={(value) => handleSelectChange("area", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un área" />
                </SelectTrigger>
                <SelectContent>
                  {areasData.map((area) => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objetivos">Objetivos</Label>
              <Textarea id="objetivos" name="objetivos" value={formData.objetivos} onChange={handleChange} required />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Tipo de Propuesta</Label>
              <RadioGroup value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value as "general" | "directa")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="general" id="general" />
                  <Label htmlFor="general">General</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="directa" id="directa" />
                  <Label htmlFor="directa">Directa</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.tipo === "directa" && (
              <div className="space-y-2">
                <Label>Asesor</Label>
                <Select value={formData.asesor} onValueChange={(value) => handleSelectChange("asesor", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un asesor" />
                  </SelectTrigger>
                  <SelectContent>
                    {profesoresData.map((p) => (
                      <SelectItem key={p.id} value={p.nombre}>{p.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fechaLimite">Fecha Límite (Opcional)</Label>
              <Input id="fechaLimite" name="fechaLimite" type="date" value={formData.fechaLimite} onChange={handleChange} />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Cotesistas (Opcional)</Label>
              <div className="flex gap-2">
                <Input placeholder="Ingrese código de estudiante" value={codigoCotesista} onChange={(e) => setCodigoCotesista(e.target.value)} />
                <Button type="button" onClick={handleAddCotesista} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {cotesistas.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm">
                  {cotesistas.map((c) => (
                    <li key={c.codigo} className="border rounded-md p-2 flex justify-between">
                      <span>{c.nombre}</span>
                      <span className="text-muted-foreground">{c.codigo}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/alumno/temas")}>Cancelar</Button>
            <Button className="bg-[#042354] hover:bg-[#0e2f7a] text-white" onClick={handleSubmit} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Guardando..." : "Guardar Propuesta"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default FormularioPropuestaPage;

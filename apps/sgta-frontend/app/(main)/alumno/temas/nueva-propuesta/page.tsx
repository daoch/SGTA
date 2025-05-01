"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Plus, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

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

const NuevaPropuestaPage = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/alumno/temas">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-[#042354]">Nueva Propuesta</h1>
      </div>

      <Card>
        <form>
          <CardHeader>
            <CardTitle>Información de la Propuesta</CardTitle>
            <CardDescription>Complete la información requerida para proponer un nuevo tema de tesis</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 px-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título de la Propuesta</Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ingrese el título de su propuesta de tesis"
                required
              />
            </div>

            <div className="space-y-0.5">
              <Label>Área de Investigación</Label>
              <Select value={formData.area} onValueChange={(value) => handleSelectChange("area", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un área" />
                </SelectTrigger>
                <SelectContent>
                  {areasData.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describa su propuesta de tesis"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objetivos">Objetivos</Label>
              <Textarea
                id="objetivos"
                name="objetivos"
                value={formData.objetivos}
                onChange={handleChange}
                placeholder="Detalle los objetivos generales y específicos de su propuesta"
                required
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Tipo de Propuesta</Label>
              <RadioGroup value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value as "general" | "directa")}>  
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="general" id="general" />
                  <Label htmlFor="general">General (para cualquier asesor del área)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="directa" id="directa" />
                  <Label htmlFor="directa">Directa (para un asesor específico)</Label>
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
                      <SelectItem key={p.id} value={p.nombre}>
                        {p.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fechaLimite">Fecha Límite (Opcional)</Label>
              <Input
                id="fechaLimite"
                name="fechaLimite"
                type="date"
                value={formData.fechaLimite}
                onChange={handleChange}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Cotesistas (Opcional)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ingrese código de estudiante"
                  value={codigoCotesista}
                  onChange={(e) => setCodigoCotesista(e.target.value)}
                />
                <Button type="button" onClick={handleAddCotesista} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Ingresa el código de los estudiantes que participarán contigo en esta tesis
              </p>
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
            <Button className="bg-[#042354] hover:bg-[#0e2f7a] text-white">
              <Save className="mr-2 h-4 w-4" /> Guardar Propuesta
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NuevaPropuestaPage;

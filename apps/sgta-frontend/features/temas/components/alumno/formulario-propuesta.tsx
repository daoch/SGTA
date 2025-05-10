"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export interface Estudiante {
  id: string;
  codigo: string;
  nombre: string;
}

export interface FormData {
  titulo: string;
  descripcion: string;
  area: number;               // ahora es number (id de área)
  objetivos: string;
  tipo: "general" | "directa";
  asesor: string;             // guarda el id del asesor como string
  fechaLimite: string;
}

interface Props {
  loading: boolean;
  onSubmit: (data: FormData, cotesistas: Estudiante[]) => Promise<void>;
}

const areasData: { id: number; nombre: string }[] = [
  { id: 1, nombre: "Inteligencia Artificial" },
  { id: 2, nombre: "Desarrollo Web" },
  { id: 3, nombre: "Ciencia de Datos" },
  { id: 4, nombre: "Internet de las Cosas" },
];

const profesoresData = [
  { id: "1", nombre: "Dr. Roberto Sánchez" },
  { id: "2", nombre: "Dra. Carmen Vega" },
  { id: "3", nombre: "Dr. Miguel Torres" },
];

const estudiantesData: Estudiante[] = [
  { id: "34", codigo: "20190123", nombre: "Carlos Mendoza" },
  { id: "31", codigo: "20190456", nombre: "Pedro López" },
  { id: "22", codigo: "20180789", nombre: "Ana García" },
];

export default function FormularioPropuesta({ loading, onSubmit }: Props) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    descripcion: "",
    area: 0,
    objetivos: "",
    tipo: "general",
    asesor: "",
    fechaLimite: "",
  });
  const [cotesistas, setCotesistas] = useState<Estudiante[]>([]);
  const [codigoCotesista, setCodigoCotesista] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});

  // Si cambia el área, limpio asesor
  useEffect(() => {
    setFormData((f) => ({ ...f, asesor: "" }));
    setErrors((e) => ({ ...e, asesor: undefined }));
  }, [formData.area]);

  const handleChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((f) => ({ ...f, [field]: e.target.value }));
      setErrors((e) => ({ ...e, [field]: undefined }));
    };

  const handleSelectNum =
    (field: keyof FormData) =>
    (value: string /* viene como string del Select */) => {
      setFormData((f) => ({ ...f, [field]: Number(value) }));
      setErrors((e) => ({ ...e, [field]: undefined }));
    };

  const handleSelectStr =
    (field: keyof FormData) =>
    (value: string) => {
      setFormData((f) => ({ ...f, [field]: value }));
      setErrors((e) => ({ ...e, [field]: undefined }));
    };

  const handleRemoveCotesista = (id: string) => {
    setCotesistas((cs) => cs.filter((c) => c.id !== id));
  };

  // 3) Al agregar, ya llevas el objeto completo (con su id)
  const handleAddCotesista = () => {
    const est = estudiantesData.find((e) => e.codigo === codigoCotesista);
    if (est && !cotesistas.some((c) => c.id === est.id)) {
      setCotesistas((cs) => [...cs, est]);
      setCodigoCotesista("");
    }
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!/[a-zA-Z]/.test(formData.titulo))
      e.titulo = "Título obligatorio y debe contener letras.";
    if (!/[a-zA-Z]/.test(formData.descripcion))
      e.descripcion = "Descripción obligatoria y debe contener letras.";
    if (!/[a-zA-Z]/.test(formData.objetivos))
      e.objetivos = "Objetivos obligatorios y deben contener letras.";
    if (!formData.area) e.area = "Debe seleccionar un área.";
    if (formData.tipo === "directa" && !formData.asesor)
      e.asesor = "Debe seleccionar un asesor.";
    if (formData.titulo.length > 255) e.titulo = "Máximo 255 caracteres.";
    if (formData.descripcion.length > 500)
      e.descripcion = "Máximo 500 caracteres.";
    if (formData.objetivos.length > 500)
      e.objetivos = "Máximo 500 caracteres.";
    if (formData.fechaLimite && formData.fechaLimite <= today)
      e.fechaLimite = "Fecha límite debe ser futura.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLocalSubmit = async () => {
    if (!validate()) return;
    await onSubmit(formData, cotesistas);
  };

  return (
    <Card>
      <form onSubmit={(e) => e.preventDefault()}>
        <CardHeader>
          <CardTitle>Información de la Propuesta</CardTitle>
          <CardDescription>
            Complete la información requerida para proponer un tema
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 px-6 py-6">
          {/* TÍTULO */}
          <div>
            <Label htmlFor="titulo" className="mb-2">Título de la Propuesta </Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={handleChange("titulo")}
              maxLength={255}
              className={errors.titulo ? "border-red-500" : ""}
            />
            <p className="text-xs text-muted-foreground mt-0.5">
              {formData.titulo.length}/255
            </p>
            {errors.titulo && (
              <p className="text-sm text-red-500">{errors.titulo}</p>
            )}
          </div>

          {/* ÁREA */}
          <div>
            <Label className="mb-2">Área de Investigación</Label>
            <Select
              value={formData.area.toString()}
              onValueChange={handleSelectNum("area")}
            >
              <SelectTrigger
                className={errors.area ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Seleccione un área" />
              </SelectTrigger>
              <SelectContent>
                {areasData.map((a) => (
                  <SelectItem key={a.id} value={a.id.toString()}>
                    {a.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.area && (
              <p className="text-sm text-red-500">{errors.area}</p>
            )}
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <Label htmlFor="descripción" className="mb-2">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={handleChange("descripcion")}
              maxLength={500}
              className={errors.descripcion ? "border-red-500" : ""}
            />
            <p className="text-xs text-muted-foreground mt-0.5">
              {formData.descripcion.length}/500
            </p>
            {errors.descripcion && (
              <p className="text-sm text-red-500">{errors.descripcion}</p>
            )}
          </div>

          {/* OBJETIVOS */}
          <div>
            <Label htmlFor="objetivos" className="mb-2">Objetivos</Label>
            <Textarea
              id="objetivos"
              value={formData.objetivos}
              onChange={handleChange("objetivos")}
              maxLength={500}
              className={errors.objetivos ? "border-red-500" : ""}
            />
            <p className="text-xs text-muted-foreground mt-0.5">
              {formData.objetivos.length}/500
            </p>
            {errors.objetivos && (
              <p className="text-sm text-red-500">{errors.objetivos}</p>
            )}
          </div>

          <Separator />

          {/* TIPO */}
          <div>
            <Label className="mb-3">Tipo de Propuesta</Label>
            <RadioGroup
              value={formData.tipo}
              onValueChange={(v: "general" | "directa") =>
                handleSelectStr("tipo")(v)
              }
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="general" id="general" />
                <Label htmlFor="general">General</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="directa" id="directa" />
                <Label htmlFor="directa">Directa</Label>
              </div>
            </RadioGroup>
          </div>

          {/* ASESOR (solo si directa) */}
          {formData.tipo === "directa" && (
            <div>
              <Label className="mb-2">Asesor</Label>
              <Select
                value={formData.asesor}
                onValueChange={handleSelectStr("asesor")}
                disabled={!formData.area}
              >
                <SelectTrigger
                  className={
                    !formData.area
                      ? "opacity-50 cursor-not-allowed"
                      : errors.asesor
                      ? "border-red-500"
                      : ""
                  }
                >
                  <SelectValue
                    placeholder={
                      !formData.area
                        ? "Elige un área primero"
                        : "Seleccione un asesor"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {profesoresData.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.asesor && (
                <p className="text-sm text-red-500">{errors.asesor}</p>
              )}
            </div>
          )}

          {/* FECHA LÍMITE */}
          <div>
            <Label htmlFor="fechaLimite" className="mb-2">Fecha Límite (Opcional)</Label>
            <Input
              id="fechaLimite"
              type="date"
              min={today}
              value={formData.fechaLimite}
              onChange={handleChange("fechaLimite")}
              className={errors.fechaLimite ? "border-red-500" : ""}
            />
            {errors.fechaLimite && (
              <p className="text-sm text-red-500">{errors.fechaLimite}</p>
            )}
          </div>

          <Separator />

          {/* COTESISTAS */}
          <div>
            <Label className="mb-2">Cotesistas (Opcional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Ingrese el código del estudiante"
                value={codigoCotesista}
                onChange={(e) => setCodigoCotesista(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddCotesista}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {cotesistas.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm">
                {cotesistas.map((c) => (
                  <li
                    key={c.id}
                    className="border rounded-md p-2 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-medium">{c.nombre}</span>
                      <span className="ml-2 text-muted-foreground">
                        ({c.codigo})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCotesista(c.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between px-6 py-4">
              <Button
                variant="outline"
                onClick={() => router.push("/alumno/temas")}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleLocalSubmit}
                className="bg-[#042354] text-white"
                disabled={loading}
              >
                <Save className="mr-2 h-4 w-4" />{" "}
                {loading ? "Guardando..." : "Guardar Propuesta"}
              </Button>
            </CardFooter>
      </form>
    </Card>
  );
}

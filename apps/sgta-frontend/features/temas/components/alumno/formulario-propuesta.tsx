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
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";
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
import { useAuthStore } from "@/features/auth/store/auth-store";
import PropuestasSimilaresCard from "@/features/temas/components/alumno/similitud-temas";
import { Usuario } from "@/features/temas/types/propuestas/entidades";


import { Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import React, { useEffect, useState } from "react";

export interface Estudiante {
  id: string;
  codigo: string;
  nombre: string;
}

export interface FormData {
  titulo: string;
  descripcion: string;
  areaGeneral: number; // <-- nuevo campo para área general
  area: number;
  objetivos: string;
  tipo: "general" | "directa";
  asesor: string;
  fechaLimite: string;
}

export interface TemaSimilar {
  tema: {
    id: number;
    titulo: string;
    resumen: string;
    fechaCreacion?: string;
  };
  similarityScore: number;
  comparedFields?: string;
}

interface Props {
  loading: boolean;
  onSubmit: (
    data: FormData,
    cotesistas: Estudiante[],
    similares?: TemaSimilar[],
    forzarGuardar?: boolean,
    subareasSeleccionadas?: { id: number, nombre: string }[]
  ) => Promise<void>;
}

export default function FormularioPropuesta({ loading, onSubmit }: Props) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const [openSimilarDialog, setOpenSimilarDialog] = useState(false);
  const [similares, setSimilares] = useState<TemaSimilar[]>([]);
  const [checkingSimilitud, setCheckingSimilitud] = useState(false);

  const [areasGenerales, setAreasGenerales] = useState<{ id: number; nombre: string }[]>([]);
  const [areas, setAreas] = useState<{ id: number; nombre: string }[]>([]);
  const [asesores, setAsesores] = useState<{ id: string; nombre: string }[]>([]);
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    descripcion: "",
    areaGeneral: 0, // <-- inicializa área general
    area: 0,
    objetivos: "",
    tipo: "general",
    asesor: "",
    fechaLimite: "",
  });
  const [cotesistas, setCotesistas] = useState<Estudiante[]>([]);
  const [codigoCotesista, setCodigoCotesista] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [subareaSearch, setSubareaSearch] = useState(""); // Nuevo estado para búsqueda
  const [subareasSeleccionadas, setSubareasSeleccionadas] = useState<{ id: number, nombre: string }[]>([]);
  const [subareaSeleccionada, setSubareaSeleccionada] = useState<string>("");

  useEffect(() => {
    async function fetchAreasGenerales() {
      try {
        const { idToken } = useAuthStore.getState();
        if (!idToken) {
          console.error("No authentication token available");
          return;
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/areaConocimiento/listarPorUsuarioSub`,
          {
            headers: {
              "Authorization": `Bearer ${idToken}`,
              "Content-Type": "application/json"
            }
          }
        );
        if (!res.ok) throw new Error("Error loading áreas generales");
        const data: Array<{ id: number; nombre: string }> = await res.json();
        setAreasGenerales(data.map((a) => ({ id: a.id, nombre: a.nombre })));
      } catch (err) {
        console.error("Error cargando áreas generales:", err);
      }
    }

    fetchAreasGenerales();
  }, []);

  // Cargar subáreas cuando cambia área general
  useEffect(() => {
    async function fetchAreas() {
      try {
        if (!formData.areaGeneral) {
          setAreas([]);
          return;
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subAreaConocimiento/list/${formData.areaGeneral}`
        );
        if (!res.ok) throw new Error("Error loading subáreas");
        const data: Array<{ id: number; nombre: string }> = await res.json();
        if (Array.isArray(data)) {
          setAreas(data.map((a) => ({ id: a.id, nombre: a.nombre })));
        } else {
          setAreas([]);
          console.error("La respuesta de subáreas no es un array:", data);
        }
      } catch (err) {
        setAreas([]);
        console.error("Error cargando subáreas:", err);
      }
    }
    if (formData.areaGeneral) {
      fetchAreas();
    } else {
      setAreas([]);
    }
  }, [formData.areaGeneral]);

  // Cargar asesores cuando el tipo es directa y hay subáreas seleccionadas
  useEffect(() => {
    const fetchAsesores = async () => {
      if (formData.tipo !== "directa" || subareasSeleccionadas.length === 0) {
        setAsesores([]);
        setFormData((f) => ({ ...f, asesor: "" })); // Borra asesor si no cumple condiciones
        return;
      }
      try {
        const { idToken } = useAuthStore.getState();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/temas/profesores-por-subareas`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${idToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(subareasSeleccionadas.map(s => s.id))
          }
        );
        if (!res.ok) throw new Error("Error cargando asesores");
        const data: Array<{ id: number; nombres: string; primerApellido: string }> = await res.json();
        setAsesores(
          data.map((u) => ({
            id: String(u.id),
            nombre: `${u.nombres} ${u.primerApellido}`.trim(),
          }))
        );
      } catch (err) {
        setAsesores([]);
        setFormData((f) => ({ ...f, asesor: "" }));
        console.error("Error cargando asesores:", err);
      }
    };
    fetchAsesores();
     
  }, [formData.tipo, subareasSeleccionadas]);

  const handleChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((f) => ({ ...f, [field]: e.target.value }));
      setErrors((e) => ({ ...e, [field]: undefined }));
    };

  const handleSelectNumGeneral =
    (field: keyof FormData) =>
    (value: string) => {
      const areaId = Number(value);

      setFormData((f) => ({
        ...f,
        [field]: areaId,
        area: 0, // limpiar subárea al cambiar área general
        asesor: "", // limpiar asesor también
      }));

      setSubareasSeleccionadas([]); // <-- limpiar subáreas seleccionadas
      setErrors((e) => ({
        ...e,
        [field]: undefined,
        area: undefined, // limpiar error de subárea
        asesor: undefined,
      }));
    };

  const handleSelectNum =
  (field: keyof FormData) =>
  (value: string) => {
    if (value === "__clear__") {
      setFormData(f => ({ ...f, area: 0, asesor: "" }));
      setErrors(e => ({ ...e, area: undefined, asesor: undefined }));
      return;
    }
    const areaId = Number(value);
    setFormData((f) => ({
      ...f,
      [field]: areaId,
      ...(field === "area" ? { asesor: "" } : {}),
    }));
    setErrors((e) => ({
      ...e,
      [field]: undefined,
      ...(field === "area" ? { asesor: undefined } : {}),
    }));
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

  const handleAddCotesista = async () => {
    if (!codigoCotesista.trim()) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/usuario/findByCodigo?codigo=${codigoCotesista.trim()}`
      );
      if (!res.ok) {
        toast.error("Error", { description: "No se encontró al estudiante",
                                  duration: 5000,
                                });
      }
      const data: Usuario = await res.json();
      const nuevo: Estudiante = {
        id: String(data.id),
        codigo: data.codigoPucp,
        nombre: `${data.nombres} ${data.primerApellido}`.trim(),
      };

      if (cotesistas.some((c) => c.id === nuevo.id)) {
        toast.error("Ya agregaste a este estudiante");
        return;
      }
      setCotesistas((cs) => [...cs, nuevo]);
      setCodigoCotesista("");
    } catch (err) {
      toast.error("Error al buscar el estudiante");
      console.error(err);
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
    if (!formData.areaGeneral) e.areaGeneral = "Debe seleccionar un área de investigación.";
    if (!subareasSeleccionadas.length) e.area = "Debe seleccionar al menos una subárea de interés.";
    if (formData.tipo === "directa" && !formData.asesor)
      e.asesor = "Debe seleccionar un asesor.";
    if (formData.titulo.length > 255) e.titulo = "Máximo 255 caracteres.";
    if (formData.descripcion.length > 4000)
      e.descripcion = "Máximo 4000 caracteres.";
    if (formData.objetivos.length > 4000)
      e.objetivos = "Máximo 4000 caracteres.";
    if (formData.fechaLimite && formData.fechaLimite <= today)
      e.fechaLimite = "Fecha límite debe ser futura.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLocalSubmit = async () => {
    if (!validate()) return;
    setCheckingSimilitud(true);

    const body = {
      id: 999999,
      titulo: formData.titulo,
      resumen: formData.descripcion,
      objetivos: formData.objetivos,
      palabrasClaves: [],
      estadoTemaNombre: "Activo",
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/temas/findSimilar?threshold=75.0`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setSimilares(data);
        setOpenSimilarDialog(true);
      } else {
        console.log("Subáreas seleccionadas:", subareasSeleccionadas);
        await onSubmit(formData, cotesistas, undefined, false, subareasSeleccionadas); // <-- agrega esto
      }
    } catch (err) {
      toast.error("Error al verificar similitud o guardar propuesta");
    } finally {
      setCheckingSimilitud(false);
    }
  };

  const handleGuardarForzado = async () => {
    setCheckingSimilitud(true);
    try {
      await onSubmit(formData, cotesistas, similares, true, subareasSeleccionadas);
      setOpenSimilarDialog(false);
    } catch (err) {
      toast.error("Error al guardar propuesta o similitudes");
      console.error(err);
    } finally {
      setCheckingSimilitud(false);
    }
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
            <Label htmlFor="titulo" className="mb-2">
              Título de la Propuesta
            </Label>
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

          {/* ÁREA DE INVESTIGACIÓN (NUEVO COMBOBOX) */}
          <div>
            <Label className="mb-2">Área de Investigación</Label>
            <Select
              value={String(formData.areaGeneral) ? String(formData.areaGeneral) : ""}
              
              onValueChange={handleSelectNumGeneral("areaGeneral")}
            >
              <SelectTrigger className={errors.areaGeneral ? "border-red-500" : ""}>
                <SelectValue placeholder="Seleccione un área de investigación" />
              </SelectTrigger>
              <SelectContent>
                {areasGenerales.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.areaGeneral && (
              <p className="text-sm text-red-500">{errors.areaGeneral}</p>
            )}
          </div>

          {/* SUBÁREAS DE INVESTIGACIÓN (NUEVO COMPONENTE) */}
          <div>
            <Label className="mb-2">Subáreas de Investigación</Label>
            <div className="flex gap-2 items-center">
              <Select
                value={subareaSeleccionada}
                onValueChange={setSubareaSeleccionada}
                disabled={!formData.areaGeneral || areas.length === 0}
              >
                <SelectTrigger className="w-72">
                  <SelectValue placeholder="Seleccione una opción" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  <div className="px-2 py-1">
                    <Input
                      placeholder="Buscar subárea..."
                      value={subareaSearch}
                      onChange={e => setSubareaSearch(e.target.value)}
                      onKeyDown={e => e.stopPropagation()}
                      className="w-full"
                    />
                  </div>
                  {areas
                    .filter(
                      a =>
                        a.nombre.toLowerCase().includes(subareaSearch.toLowerCase()) &&
                        !subareasSeleccionadas.some(s => s.id === a.id)
                    )
                    .map(a => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.nombre}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={() => {
                  const areaObj = areas.find(a => String(a.id) === subareaSeleccionada);
                  if (areaObj && !subareasSeleccionadas.some(s => s.id === areaObj.id)) {
                    setSubareasSeleccionadas([...subareasSeleccionadas, areaObj]);
                    setSubareaSeleccionada("");
                  }
                }}
                disabled={!subareaSeleccionada}
              >
                Agregar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {subareasSeleccionadas.map((sub) => (
                <span
                  key={sub.id}
                  className="bg-blue-600 text-white rounded-full px-4 py-1 flex items-center"
                >
                  {sub.nombre}
                  <button
                    type="button"
                    className="ml-2"
                    onClick={() => {
                      setSubareasSeleccionadas(subareasSeleccionadas.filter(s => s.id !== sub.id));
                      setFormData(f => ({ ...f, asesor: "" })); // Borra asesor
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {errors.area && (
              <p className="text-sm text-red-500">{errors.area}</p>
            )}
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <Label htmlFor="descripcion" className="mb-2">
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={handleChange("descripcion")}
              maxLength={4000}
              className={errors.descripcion ? "border-red-500" : ""}
            />
            <p className="text-xs text-muted-foreground mt-0.5">
              {formData.descripcion.length}/4000
            </p>
            {errors.descripcion && (
              <p className="text-sm text-red-500">{errors.descripcion}</p>
            )}
          </div>

          {/* OBJETIVOS */}
          <div>
            <Label htmlFor="objetivos" className="mb-2">
              Objetivos Preliminares
            </Label>
            <Textarea
              id="objetivos"
              value={formData.objetivos}
              onChange={handleChange("objetivos")}
              maxLength={4000}
              className={errors.objetivos ? "border-red-500" : ""}
            />
            <p className="text-xs text-muted-foreground mt-0.5">
              {formData.objetivos.length}/4000
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

          {/* ASESOR (solo directa) */}
          {formData.tipo === "directa" && (
            <div>
              <Label className="mb-2">Asesor</Label>
              <Select
                value={formData.asesor}
                onValueChange={handleSelectStr("asesor")}
                disabled={
                  formData.tipo !== "directa" ||
                  subareasSeleccionadas.length === 0 ||
                  asesores.length === 0
                }
              >
                <SelectTrigger
                  className={
                    formData.tipo !== "directa" || subareasSeleccionadas.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : errors.asesor
                      ? "border-red-500"
                      : ""
                  }
                >
                  <SelectValue
                    placeholder={
                      formData.tipo !== "directa"
                        ? "Elige tipo directa"
                        : subareasSeleccionadas.length === 0
                        ? "Elige subárea(s) primero"
                        : "Seleccione un asesor"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {asesores.map((p) => (
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
            <Label htmlFor="fechaLimite" className="mb-2">
              Fecha Límite (Opcional)
            </Label>
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
        <Dialog open={openSimilarDialog} onOpenChange={setOpenSimilarDialog}>
          <DialogContent className="max-w-xl p-0">
            <DialogTitle>
      <span className="sr-only">Temas similares encontrados</span>
    </DialogTitle>
    <PropuestasSimilaresCard
      propuestas={similares}
      onCancel={() => setOpenSimilarDialog(false)}
      onContinue={handleGuardarForzado}
      checkingSimilitud={checkingSimilitud}
/>
          </DialogContent>
        </Dialog>
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
            disabled={loading || checkingSimilitud}
          >
            <Save className="mr-2 h-4 w-4" />
            {checkingSimilitud
              ? "Consultando Similitud..."
              : loading
              ? "Guardando..."
              : "Guardar Propuesta"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
  
}

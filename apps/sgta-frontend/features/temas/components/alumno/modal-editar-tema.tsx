"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Check, Edit, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TemaData {
  id: number;
  titulo: string;
  resumen: string;
  objetivos: string;
  area: { id: number; nombre: string };
  asesor: { id: string; nombre: string };
}

interface EditTemaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tema: TemaData;
  onTemaUpdated?: (updatedTema: any) => void; // ✅ Agrega esta línea
}

export function EditTemaModal({ open, onOpenChange, tema }: EditTemaModalProps) {
  const { idToken } = useAuthStore();
  const [editingFields, setEditingFields] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    titulo: tema.titulo,
    resumen: tema.resumen,
    objetivos: tema.objetivos,
    area_id: tema.area.id,
  });
  const [justificaciones, setJustificaciones] = useState<Record<string, string>>({});
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [areas, setAreas] = useState<{ id: number; nombre: string }[]>([]);
  const [errores, setErrores] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) return;
    async function fetchAreas() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subAreaConocimiento/listarPorCarreraDeUsuario`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Error cargando áreas");
        const data: Array<{ id: number; nombre: string }> = await res.json();
        setAreas(data.map((a) => ({ id: a.id, nombre: a.nombre })));
      } catch (err) {
        toast.error("Error cargando áreas");
      }
    }
    fetchAreas();
  }, [open, idToken]);

  const fields = ["titulo", "resumen", "objetivos", "area"];

  const handleFieldEdit = (field: string) => {
    const newEditingFields = new Set(editingFields);
    if (newEditingFields.has(field)) {
      newEditingFields.delete(field);
      setFormData((prev) => ({
        ...prev,
        [field === "area" ? "area_id" : field]:
          field === "titulo"
            ? tema.titulo
            : field === "resumen"
            ? tema.resumen
            : field === "objetivos"
            ? tema.objetivos
            : field === "area"
            ? tema.area.id
            : "",
      }));
      const newJustificaciones = { ...justificaciones };
      delete newJustificaciones[field];
      setJustificaciones(newJustificaciones);
      setErrores((prev) => ({ ...prev, [field]: false }));
    } else {
      newEditingFields.add(field);
    }
    setEditingFields(newEditingFields);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleJustificacionChange = (field: string, value: string) => {
    setJustificaciones((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrores((prev) => ({ ...prev, [field]: false }));
  };

  const isFieldChanged = (field: string): boolean => {
    switch (field) {
      case "titulo":
        return formData.titulo !== tema.titulo;
      case "resumen":
        return formData.resumen !== tema.resumen;
      case "objetivos":
        return formData.objetivos !== tema.objetivos;
      case "area":
        return formData.area_id !== tema.area.id;
      default:
        return false;
    }
  };

  const canSubmit = (): boolean => {
    // Solo permite guardar si todos los campos editados tienen justificación y han cambiado
    for (const field of editingFields) {
      if (!isFieldChanged(field) || !justificaciones[field]?.trim()) {
        return false;
      }
    }
    return editingFields.size > 0;
  };

  const submitAllChanges = async () => {
    // Marca errores en los campos que faltan justificación
    let newErrores: Record<string, boolean> = {};
    let hasError = false;
    editingFields.forEach((field) => {
      if (!justificaciones[field]?.trim()) {
        newErrores[field] = true;
        hasError = true;
      }
    });
    setErrores(newErrores);
    if (hasError) {
      toast.error("Debes agregar justificación en todos los campos editados.");
      return;
    }

    setSubmitting(true);
    try {
      const solicitudes = Array.from(editingFields).map((field) => {
        switch (field) {
          case "titulo":
            return {
              tipo_solicitud_id: 2,
              titulo_nuevo: `${formData.titulo}|@@|${justificaciones[field]}`,
            };
          case "resumen":
            return {
              tipo_solicitud_id: 3,
              resumen_nuevo: `${formData.resumen}|@@|${justificaciones[field]}`,
            };
          case "objetivos":
            return {
              tipo_solicitud_id: 5,
              objetivos_nuevos: `${formData.objetivos}|@@|${justificaciones[field]}`,
            };
          case "area":
            return {
              tipo_solicitud_id: 6,
              area_nueva: formData.area_id,
            };
          default:
            return null;
        }
      }).filter(Boolean);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/temas/registrarSolicitudesModificacionTema?temaId=${tema.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(solicitudes),
        }
      );
      if (!res.ok) throw new Error("Error al enviar solicitud");

      setCompletedFields(new Set(editingFields));
      setEditingFields(new Set());
      toast.success("Los cambios han sido enviados correctamente.");
      onOpenChange(false);
    } catch (error) {
      toast.error("No se pudo enviar la solicitud de cambio.");
    } finally {
      setSubmitting(false);
    }
  };

  const getFieldDisplayValue = (field: string): string => {
    switch (field) {
      case "titulo":
        return tema.titulo;
      case "resumen":
        return tema.resumen;
      case "objetivos":
        return tema.objetivos;
      case "area":
        return tema.area.nombre;
      default:
        return "";
    }
  };

  const getFieldLabel = (field: string): string => {
    switch (field) {
      case "titulo":
        return "Título del Tema";
      case "resumen":
        return "Resumen del Proyecto";
      case "objetivos":
        return "Objetivos del Proyecto";
      case "area":
        return "Área de Investigación";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full" style={{ width: "900px", maxWidth: "96vw" }}>
        <DialogHeader>
          <DialogTitle>Editar Información del Tema</DialogTitle>
          <DialogDescription>
            Selecciona los campos que deseas modificar. Todos los cambios se enviarán juntos y requieren justificación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {fields.map((field) => (
            <Card key={field} className="border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    {getFieldLabel(field)}
                    {completedFields.has(field) && (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        <Check className="w-3 h-3 mr-1" />
                        Enviado
                      </Badge>
                    )}
                  </CardTitle>
                  <Button
                    variant={editingFields.has(field) ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => handleFieldEdit(field)}
                    disabled={completedFields.has(field)}
                  >
                    {editingFields.has(field) ? (
                      <>
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <Label className="text-sm font-medium text-gray-600 mb-1 block">Valor actual:</Label>
                  <p className="text-sm p-2 bg-gray-100 rounded border">{getFieldDisplayValue(field)}</p>
                </div>

                {editingFields.has(field) && (
                  <>
                    <Separator className="my-3" />
                    <div>
                      <Label htmlFor={`${field}-new`}>Nuevo valor:</Label>
                      {field === "titulo" && (
                        <Input
                          id={`${field}-new`}
                          value={formData.titulo}
                          onChange={(e) => handleInputChange("titulo", e.target.value)}
                          className="mt-1"
                        />
                      )}
                      {field === "resumen" && (
                        <Textarea
                          id={`${field}-new`}
                          value={formData.resumen}
                          onChange={(e) => handleInputChange("resumen", e.target.value)}
                          className="mt-1"
                          rows={4}
                        />
                      )}
                      {field === "objetivos" && (
                        <Textarea
                          id={`${field}-new`}
                          value={formData.objetivos}
                          onChange={(e) => handleInputChange("objetivos", e.target.value)}
                          className="mt-1"
                          rows={3}
                        />
                      )}
                      {field === "area" && (
                        <select
                          className="mt-1 border rounded px-2 py-1 w-full"
                          value={formData.area_id}
                          onChange={(e) => handleInputChange("area_id", e.target.value)}
                        >
                          <option value="">Seleccionar área</option>
                          {areas.map((area) => (
                            <option key={area.id} value={area.id}>
                              {area.nombre}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="mt-2">
                      <Label htmlFor={`${field}-justification`}>
                        Justificación del cambio <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id={`${field}-justification`}
                        value={justificaciones[field] || ""}
                        onChange={(e) => handleJustificacionChange(field, e.target.value)}
                        placeholder="Explica por qué necesitas realizar este cambio..."
                        className={`mt-1 ${errores[field] ? "border-red-500 focus:border-red-500" : ""}`}
                        rows={2}
                      />
                      {errores[field] && (
                        <div className="text-xs text-red-600 mt-1">
                          Debes agregar una justificación para este campo.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={submitAllChanges}
            disabled={!canSubmit() || submitting}
          >
            <Save className="w-4 h-4 mr-1" />
            Guardar cambios
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="ml-2">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
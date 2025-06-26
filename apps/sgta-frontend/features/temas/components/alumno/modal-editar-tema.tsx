"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Check, Edit, Info, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TemaData {
  id: number;
  titulo: string;
  resumen: string;
  objetivos: string;
  area: {
    id: number;
    nombre: string;
  };
  subareas: { id: number; nombre: string }[]; 
  asesor: {
    id: string;
    nombre: string;
  };
}

interface EditTemaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tema: TemaData;
  onTemaUpdated?: (updatedTema: TemaData) => void;
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
  const [subareas, setSubareas] = useState<{ id: number; nombre: string }[]>([]);
  const [selectedSubareas, setSelectedSubareas] = useState<{ id: number; nombre: string }[]>(tema.subareas || []);
  const [errores, setErrores] = useState<Record<string, boolean>>({});
  const [areasConocimiento, setAreasConocimiento] = useState<{ id: number; nombre: string }[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);

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

  useEffect(() => {
    if (!open) return;
    async function fetchSubareas() {
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
        if (!res.ok) throw new Error("Error cargando subáreas");
        const data: Array<{ id: number; nombre: string }> = await res.json();
        setSubareas(data);
      } catch (err) {
        toast.error("Error cargando subáreas");
      }
    }
    fetchSubareas();
  }, [open, idToken]);

  useEffect(() => {
    if (!open) return;
    async function fetchAreasConocimiento() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/areaConocimiento/listarPorUsuarioSub`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Error cargando áreas de conocimiento");
        const data: Array<{ id: number; nombre: string }> = await res.json();
        setAreasConocimiento(data);
      } catch (err) {
        toast.error("Error cargando áreas de conocimiento");
      }
    }
    fetchAreasConocimiento();
  }, [open, idToken]);

  useEffect(() => {
    if (!open || !selectedAreaId) {
      setSubareas([]);
      return;
    }
    async function fetchSubareas() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subAreaConocimiento/list/${selectedAreaId}`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Error cargando subáreas");
        const data: Array<{ id: number; nombre: string }> = await res.json();
        setSubareas(data);
      } catch (err) {
        toast.error("Error cargando subáreas");
      }
    }
    fetchSubareas();
  }, [open, idToken, selectedAreaId]);

  useEffect(() => {
    setSelectedSubareas([]);
  }, [selectedAreaId]);

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
        const currentIds = (tema.subareas || []).map((s) => s.id).sort().join(",");
        const selectedIds = selectedSubareas.map((s) => s.id).sort().join(",");
        return currentIds !== selectedIds;
      default:
        return false;
    }
  };

  const canSubmit = (): boolean => {
    for (const field of editingFields) {
      if (!isFieldChanged(field) || !justificaciones[field]?.trim()) {
        return false;
      }
    }
    return editingFields.size > 0;
  };

  const submitAllChanges = async () => {
    const newErrores: Record<string, boolean> = {};
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
              tipo_solicitud_id: 7,
              objetivos_nuevos: `${formData.objetivos}|@@|${justificaciones[field]}`,
            };
          case "area":
            return {
              tipo_solicitud_id: 8,
              subarea_nueva: `${selectedSubareas.map((s) => s.id).join(",")}|@@|${justificaciones[field]}`,
            };
          default:
            return null;
        }
      }).filter(Boolean);

      console.log("Solicitudes a enviar:", solicitudes);

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
        return (tema.subareas || []).map((s) => s.nombre).join(", ");
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

  const handleSubareaSelect = (id: number, nombre: string) => {
    if (!selectedSubareas.some((s) => s.id === id)) {
      setSelectedSubareas([...selectedSubareas, { id, nombre }]);
    }
  };

  const handleSubareaRemove = (id: number) => {
    setSelectedSubareas(selectedSubareas.filter((s) => s.id !== id));
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
                      {/* Solo mostrar el Label para campos que no sean "area" */}
                      {field !== "area" && (
                        <Label htmlFor={`${field}-new`}>Nuevo valor:</Label>
                      )}
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
                        <div>
                          <div className="flex items-center gap-2 mb-1 justify-between">
                            <Label htmlFor="subareas-new">Nuevo valor:</Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    <Info className="w-4 h-4 text-blue-500 cursor-pointer" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Las subáreas que escojas reemplazarán a las anteriores.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          {/* Agrega mt-4 aquí para más espacio */}
                          <div className="mb-2 mt-4">
                            <Label className="text-sm">Área de conocimiento:</Label>
                            <Select
                              value={selectedAreaId ? String(selectedAreaId) : ""}
                              onValueChange={(value) => setSelectedAreaId(Number(value))}
                            >
                              <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Selecciona un área de conocimiento" />
                              </SelectTrigger>
                              <SelectContent>
                                {areasConocimiento.map((area) => (
                                  <SelectItem key={area.id} value={String(area.id)}>
                                    {area.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {selectedAreaId && (
                            <>
                              <Input
                                type="text"
                                placeholder="Buscar subárea..."
                                className="mb-2"
                                onChange={(e) => {
                                  const value = e.target.value.toLowerCase();
                                  setSubareas(
                                    value
                                      ? subareas.filter((s) => s.nombre.toLowerCase().includes(value))
                                      : subareas
                                  );
                                }}
                              />
                              <div className="flex flex-wrap gap-2 mb-2">
                                {selectedSubareas.map((s) => (
                                  <Badge
                                    key={s.id}
                                    className="bg-blue-100 text-blue-800 cursor-pointer"
                                    onClick={() => handleSubareaRemove(s.id)}
                                  >
                                    {s.nombre} <X className="w-3 h-3 ml-1" />
                                  </Badge>
                                ))}
                              </div>
                              <div className="max-h-64 min-h-[120px] overflow-y-auto border rounded p-2 bg-white">
                                {subareas
                                  .filter((s) => !selectedSubareas.some((sel) => sel.id === s.id))
                                  .map((s) => (
                                    <div
                                      key={s.id}
                                      className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded text-xs"
                                      onClick={() => handleSubareaSelect(s.id, s.nombre)}
                                    >
                                      {s.nombre}
                                    </div>
                                  ))}
                                {subareas.length === 0 && (
                                  <div className="text-gray-400 text-sm">No hay subáreas disponibles</div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
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
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import axiosInstance from "@/lib/axios/axios-instance";
import { VariantProps, cva } from "class-variance-authority";

export interface ReunionFormData {
  titulo: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  descripcion: string;
  disponible: number;
  url: string;
  estadoAsistencia: string;
  estadoDetalle: string;
}
interface Asesor {
  id: string;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
}
interface EditarReunionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reunion: ReunionFormData) => Promise<void>;
    evento?: CalendarEvent; // ← esta línea nueva
  }

  const monthEventVariants = cva("size-2 rounded-full", {
    variants: {
      variant: {
        default: "bg-primary",
        blue: "bg-blue-500",
        green: "bg-green-500",
        pink: "bg-pink-500",
        purple: "bg-purple-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

    type CalendarEvent = {
    id: string;
    start?: Date;
    end: Date;
    title: string;
    type?: string;
    description?: string;  // <-- Añade esto
    tesista?: string;
    color?: VariantProps<typeof monthEventVariants>["variant"];
    url?: string;
    };

export const EditarReunionModal: React.FC<EditarReunionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  evento,
}) => {
  const [formData, setFormData] = useState<ReunionFormData>({
    titulo: "",
    fechaHoraInicio: "",
    fechaHoraFin: "",
    descripcion: "",
    disponible: 1,
    url: "",
    estadoAsistencia: "",
    estadoDetalle: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ReunionFormData>>({});

  const toOffsetDateTime = (localDateTime: string) => {
    const date = new Date(localDateTime);
    return date.toISOString();
  };

  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [asesorId, setAsesorId] = useState<string>("");

  useEffect(() => {
    if (evento && isOpen) {
      setFormData({
        titulo: evento.title || "",
        fechaHoraInicio: evento.start?.toISOString().slice(0, 16) || "",
        fechaHoraFin: evento.end?.toISOString().slice(0, 16) || "",
        descripcion: evento.description || "",
        disponible: 1,
        url: evento.url || "",
        estadoAsistencia: "",
        estadoDetalle: "",
      });
    }
  }, [evento, isOpen]);

  useEffect(() => {
    const fetchDatosAsistencia = async () => {
      if (!evento || !isOpen) return;
  
      const reunionId = obtenerIdReal(evento.id);
  
      try {
        // Obtener el id de la relación usuario-reunión
        const responseUsuarioReunion = await axiosInstance.get("/api/reuniones/buscarUsuarioReunion", {
          params: { reunionId },
        });
  
        const usuarioReunionId = responseUsuarioReunion.data.id;
  
        // Obtener los datos de asistencia de esa relación
        const responseAsistencia = await axiosInstance.get("/api/reuniones/getUsuarioXReunion", {
          params: { usuarioReunionId },
        });
  
        const { estadoAsistencia, estadoDetalle } = responseAsistencia.data;
  
        setFormData(prev => ({
          ...prev,
          estadoAsistencia: estadoAsistencia || "Pendiente",
          estadoDetalle: estadoDetalle || "",
        }));
      } catch (error) {
        console.error("Error al obtener datos de asistencia:", error);
      }
    };
  
    fetchDatosAsistencia();
  }, [evento, isOpen]);
  

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFormData({
        titulo: "",
        fechaHoraInicio: "",
        fechaHoraFin: "",
        descripcion: "",
        disponible: 1,
        url: "",
        estadoAsistencia: "",
        estadoDetalle: "",
      });
      setErrors({});
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const fetchAsesores = async () => {
      try {
        const response = await axiosInstance.get("/api/reuniones/getasesorxalumno");
        setAsesores(response.data);
        if (response.data.length > 0) setAsesorId(response.data[0].id);
      } catch (error) {
        console.error("Error al obtener asesores:", error);
      }
    };
    fetchAsesores();
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof ReunionFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ReunionFormData> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es requerido";
    }
    if (!formData.fechaHoraInicio) {
      newErrors.fechaHoraInicio = "La fecha y hora de inicio es requerida";
    }
    if (!formData.fechaHoraFin) {
      newErrors.fechaHoraFin = "La fecha y hora de fin es requerida";
    }
    if (formData.fechaHoraInicio && formData.fechaHoraFin) {
      const inicio = new Date(formData.fechaHoraInicio);
      const fin = new Date(formData.fechaHoraFin);
      if (fin <= inicio) {
        newErrors.fechaHoraFin = "La fecha de fin debe ser posterior a la fecha de inicio";
      }
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }
    if (formData.url && formData.url.trim()) {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = "La URL no tiene un formato válido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const obtenerIdReal = (id: string) => parseInt(id.split("-")[1], 10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
  
    try {
      if (!evento) {
        console.error("No se ha proporcionado un evento para editar");
        return;
      }
  
      const reunionId = obtenerIdReal(evento.id); // solo extrae el número, ej: "reunion-45" → 45
  
      // Obtener el usuarioXReunionId real desde el backend
      const response = await axiosInstance.get("/api/reuniones/buscarUsuarioReunion", {
        params: { reunionId },
      });
  
      const usuarioReunionId = response.data.id; // id de la tabla usuario_reunion
  
      // Llamar a la actualización
      await axiosInstance.put(
        "/api/reuniones/updateEstadoAsistencia",
        {
          estadoAsistencia: formData.estadoAsistencia,
          estadoDetalle: formData.estadoDetalle,
        },
        {
          params: {
            usuarioReunionId,
          },
        }
      );
  
      handleOpenChange(false); // cerrar modal
    } catch (error) {
      console.error("Error al actualizar asistencia:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles de la reunión</DialogTitle>
          <DialogDescription>
            Se muestran los detalles de la reunión. Puede marcar su asistencia y brindar detalles adicionales.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Campos originales (deshabilitados) */}
            <div className="grid gap-2">
              <Label htmlFor="titulo">Título <span className="text-red-500">*</span></Label>
              <Input
                id="titulo"
                name="titulo"
                placeholder="Ej: Reunión de seguimiento del proyecto"
                value={formData.titulo}
                onChange={handleInputChange}
                className={errors.titulo ? "border-red-500" : ""}
                disabled
              />
              {errors.titulo && <p className="text-sm text-red-500">{errors.titulo}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fechaHoraInicio">Fecha y hora de inicio <span className="text-red-500">*</span></Label>
              <Input
                id="fechaHoraInicio"
                name="fechaHoraInicio"
                type="datetime-local"
                value={formData.fechaHoraInicio}
                onChange={handleInputChange}
                min={getCurrentDateTime()}
                className={errors.fechaHoraInicio ? "border-red-500" : ""}
                disabled
              />
              {errors.fechaHoraInicio && <p className="text-sm text-red-500">{errors.fechaHoraInicio}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fechaHoraFin">Fecha y hora de fin <span className="text-red-500">*</span></Label>
              <Input
                id="fechaHoraFin"
                name="fechaHoraFin"
                type="datetime-local"
                value={formData.fechaHoraFin}
                onChange={handleInputChange}
                min={formData.fechaHoraInicio || getCurrentDateTime()}
                className={errors.fechaHoraFin ? "border-red-500" : ""}
                disabled
              />
              {errors.fechaHoraFin && <p className="text-sm text-red-500">{errors.fechaHoraFin}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción <span className="text-red-500">*</span></Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                placeholder="Describe el propósito y agenda de la reunión..."
                value={formData.descripcion}
                onChange={handleInputChange}
                className={`min-h-[100px] ${errors.descripcion ? "border-red-500" : ""}`}
                disabled
              />
              {errors.descripcion && <p className="text-sm text-red-500">{errors.descripcion}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="url">URL de la reunión</Label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                value={formData.url}
                onChange={handleInputChange}
                className={errors.url ? "border-red-500" : ""}
                disabled
              />
              {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
              <p className="text-xs text-muted-foreground">
                Opcional: Enlace para reunión virtual (Google Meet, Zoom, etc.)
              </p>
            </div>

            {/* Nuevos campos (habilitados) */}
            <div className="grid gap-2">
              <Label>Asistencia <span className="text-red-500">*</span></Label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="estadoAsistencia"
                    value="Asistió"
                    checked={formData.estadoAsistencia === "Asistió"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Asistió</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="estadoAsistencia"
                    value="No asistió"
                    checked={formData.estadoAsistencia === "No asistió"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span>No asistió</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="estadoAsistencia"
                    value="Pendiente"
                    checked={formData.estadoAsistencia === "Pendiente"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Pendiente</span>
                </label>
              </div>
              {errors.estadoAsistencia && <p className="text-sm text-red-500">{errors.estadoAsistencia}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="estadoDetalle">Detalles de la asistencia</Label>
              <Textarea
                id="estadoDetalle"
                name="estadoDetalle"
                placeholder="Observaciones sobre la asistencia..."
                value={formData.estadoDetalle}
                onChange={handleInputChange}
                className={`min-h-[100px] ${errors.estadoDetalle ? "border-red-500" : ""}`}
              />
              {errors.estadoDetalle && <p className="text-sm text-red-500">{errors.estadoDetalle}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#042354] hover:bg-[#042354]/90"
            >
              {isSubmitting ? "Actualizando..." : "Actualizar Reunión"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

    

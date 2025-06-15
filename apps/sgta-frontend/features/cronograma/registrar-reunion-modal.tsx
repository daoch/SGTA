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

export interface ReunionFormData {
  titulo: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  descripcion: string;
  disponible: number;
  url: string;
}
interface Asesor {
  id: string;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
}
interface RegistrarReunionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reunion: ReunionFormData) => Promise<void>;
}

export const RegistrarReunionModal: React.FC<RegistrarReunionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ReunionFormData>({
    titulo: "",
    fechaHoraInicio: "",
    fechaHoraFin: "",
    descripcion: "",
    disponible: 1,
    url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ReunionFormData>>({});
  const toOffsetDateTime = (localDateTime: string) => {
  const date = new Date(localDateTime);
  return date.toISOString();
};

  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [asesorId, setAsesorId] = useState<string>("");
  // Reset form when modal opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFormData({
        titulo: "",
        fechaHoraInicio: "",
        fechaHoraFin: "",
        descripcion: "",
        disponible: 1,
        url: "",
      });
      setErrors({});
      onClose();
    }
  };
  useEffect(() => {
    if (!isOpen) return;
    const fetchAsesores = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/reuniones/getasesorxalumno",
        );
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
    // Clear error when user starts typing
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

    // Validate that end time is after start time
    if (formData.fechaHoraInicio && formData.fechaHoraFin) {
      const inicio = new Date(formData.fechaHoraInicio);
      const fin = new Date(formData.fechaHoraFin);

      if (fin <= inicio) {
        newErrors.fechaHoraFin =
          "La fecha de fin debe ser posterior a la fecha de inicio";
      }
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }

    // Validate URL format if provided
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Solo enviar el asesorId como query param
      await axiosInstance.post(
        `/api/reuniones/crearReunionConUsuarios?usuarioIds=${asesorId}`,
        {
          ...formData,
        fechaHoraInicio: toOffsetDateTime(formData.fechaHoraInicio),
        fechaHoraFin: toOffsetDateTime(formData.fechaHoraFin),
        disponible: 1,
        },
      );

      handleOpenChange(false);
    } catch (error) {
      console.error("Error al registrar la reunión:", error);
      // Puedes mostrar un toast o mensaje de error aquí
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current datetime for min attribute
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Nueva Reunión</DialogTitle>
          <DialogDescription>
            Complete el formulario para programar una nueva reunión. Todos los
            campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/*Asesor Dropdown*/}
            <div className="grid gap-2">
              <Label htmlFor="asesor">
                Asesor <span className="text-red-500">*</span>
              </Label>
              <select
                id="asesor"
                name="asesor"
                value={asesorId}
                onChange={(e) => setAsesorId(e.target.value)}
                className="border rounded px-2 py-2"
                required
              >
                {asesores.length === 0 && (
                  <option value="">No hay asesores disponibles</option>
                )}
                {asesores.map((asesor) => (
                  <option key={asesor.id} value={asesor.id}>
                    {asesor.nombres} {asesor.primerApellido}{" "}
                    {asesor.segundoApellido}
                  </option>
                ))}
              </select>
            </div>
            {/* Título */}
            <div className="grid gap-2">
              <Label htmlFor="titulo">
                Título <span className="text-red-500">*</span>
              </Label>
              <Input
                id="titulo"
                name="titulo"
                placeholder="Ej: Reunión de seguimiento del proyecto"
                value={formData.titulo}
                onChange={handleInputChange}
                className={errors.titulo ? "border-red-500" : ""}
              />
              {errors.titulo && (
                <p className="text-sm text-red-500">{errors.titulo}</p>
              )}
            </div>

            {/* Fecha y hora de inicio */}
            <div className="grid gap-2">
              <Label htmlFor="fechaHoraInicio">
                Fecha y hora de inicio <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fechaHoraInicio"
                name="fechaHoraInicio"
                type="datetime-local"
                value={formData.fechaHoraInicio}
                onChange={handleInputChange}
                min={getCurrentDateTime()}
                className={errors.fechaHoraInicio ? "border-red-500" : ""}
              />
              {errors.fechaHoraInicio && (
                <p className="text-sm text-red-500">{errors.fechaHoraInicio}</p>
              )}
            </div>

            {/* Fecha y hora de fin */}
            <div className="grid gap-2">
              <Label htmlFor="fechaHoraFin">
                Fecha y hora de fin <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fechaHoraFin"
                name="fechaHoraFin"
                type="datetime-local"
                value={formData.fechaHoraFin}
                onChange={handleInputChange}
                min={formData.fechaHoraInicio || getCurrentDateTime()}
                className={errors.fechaHoraFin ? "border-red-500" : ""}
              />
              {errors.fechaHoraFin && (
                <p className="text-sm text-red-500">{errors.fechaHoraFin}</p>
              )}
            </div>

            {/* Descripción */}
            <div className="grid gap-2">
              <Label htmlFor="descripcion">
                Descripción <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                placeholder="Describe el propósito y agenda de la reunión..."
                value={formData.descripcion}
                onChange={handleInputChange}
                className={`min-h-[100px] ${errors.descripcion ? "border-red-500" : ""}`}
              />
              {errors.descripcion && (
                <p className="text-sm text-red-500">{errors.descripcion}</p>
              )}
            </div>

            {/* URL */}
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
              />
              {errors.url && (
                <p className="text-sm text-red-500">{errors.url}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Opcional: Enlace para reunión virtual (Google Meet, Zoom, etc.)
              </p>
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
              {isSubmitting ? "Registrando..." : "Registrar Reunión"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

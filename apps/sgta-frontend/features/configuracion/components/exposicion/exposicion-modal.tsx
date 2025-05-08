"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Monitor, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Exposicion } from "../../dtos/exposicion";

interface ExposicionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (exposicion: Exposicion) => Promise<void>;
  exposicion?: Exposicion | null;
  mode: "create" | "edit";
}

export const ExposicionModal: React.FC<ExposicionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  exposicion,
  mode,
}) => {
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState<Exposicion>({
    id: "",
    estadoPlanificacionId: 1,
    nombre: "",
    descripcion: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos de la exposición cuando cambie (en modo edición)
  useEffect(() => {
    if (isEditMode && exposicion) {
      setFormData({
        id: exposicion.id,
        nombre: exposicion.nombre,
        descripcion: exposicion.descripcion,
        estadoPlanificacionId: exposicion.estadoPlanificacionId,
      });
    } else {
      // Resetear el formulario en modo creación
      setFormData({
        id: "",
        nombre: "",
        descripcion: "",
        estadoPlanificacionId: 1,
      });
    }
  }, [exposicion, isEditMode, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      // No limpiamos el formulario aquí, ya que useEffect se encargará de eso
    } catch (error) {
      console.error(
        `Error al ${isEditMode ? "actualizar" : "crear"} la exposición:`,
        error,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Exposición" : "Nueva Exposición"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Modifique los datos de la exposición existente."
              : "Agregue una nueva exposición a la etapa. Las exposiciones son presentaciones que los estudiantes deben realizar."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="titulo">Nombre de la Exposición</Label>
              <Input
                id="txtNombreExposicion"
                name="nombre"
                placeholder="Ej: Exposición de Avance"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="txtDescripcionExposicion"
                name="descripcion"
                placeholder="Descripción general de la exposición"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              id="btnCancel"
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              id="btnSave"
              type="submit"
              className="bg-black hover:bg-gray-800"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditMode
                  ? "Guardando..."
                  : "Creando..."
                : isEditMode
                  ? "Guardar Cambios"
                  : "Crear Exposición"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

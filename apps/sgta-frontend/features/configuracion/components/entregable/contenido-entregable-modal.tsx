"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export interface ContenidoEntregableFormData {
  id?: string;
  titulo: string;
  descripcion: string;
}

interface ContenidoEntregableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contenido: ContenidoEntregableFormData) => Promise<void>;
  contenido?: ContenidoEntregableFormData | null;
  mode: "create" | "edit";
}

export const ContenidoEntregableModal: React.FC<
  ContenidoEntregableModalProps
> = ({ isOpen, onClose, onSubmit, contenido, mode }) => {
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState<ContenidoEntregableFormData>({
    titulo: "",
    descripcion: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos del contenido cuando cambie (en modo edición)
  useEffect(() => {
    if (isEditMode && contenido) {
      setFormData({
        id: contenido.id,
        titulo: contenido.titulo,
        descripcion: contenido.descripcion,
      });
    } else {
      // Resetear el formulario en modo creación
      setFormData({
        titulo: "",
        descripcion: "",
      });
    }
  }, [contenido, isEditMode, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
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
        `Error al ${isEditMode ? "actualizar" : "crear"} el contenido:`,
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
            {isEditMode
              ? "Editar Contenido Esperado"
              : "Nuevo Contenido Esperado"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Modifique los datos del contenido esperado para el entregable."
              : "Agregue un nuevo contenido esperado para el entregable."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="titulo">Nombre del Contenido</Label>
              <Input
                id="txtNombreContenido"
                name="titulo"
                placeholder="Ej: Introducción"
                value={formData.titulo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción Detallada</Label>
              <Textarea
                id="txtDescripcionContenido"
                name="descripcion"
                placeholder="Descripción detallada del contenido esperado"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
                className="min-h-[120px]"
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
                  : "Crear Contenido"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

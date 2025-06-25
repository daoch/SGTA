"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFotoChange: (nuevaFoto: string | null) => void;
  fotoActual?: string | null;
}

export default function ModalSubirFoto({
  open,
  onOpenChange,
  onFotoChange,
  fotoActual,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast.error("Archivo no válido", {
        description: "Por favor selecciona una imagen válida.",
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Archivo muy grande", {
        description: "La imagen debe ser menor a 5MB.",
      });
      return;
    }

    setIsUploading(true);

    // Convertir a base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewFoto(result);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmarFoto = () => {
    if (previewFoto) {
      onFotoChange(previewFoto);
      toast.success("Foto actualizada", {
        description:
          "La nueva foto se guardará al confirmar los cambios del perfil.",
      });
      handleCerrarModal();
    }
  };

  const handleEliminarFoto = () => {
    onFotoChange(null);
    toast.info("Foto eliminada", {
      description: "Los cambios se guardarán al confirmar.",
    });
    handleCerrarModal();
  };

  const handleCerrarModal = () => {
    setPreviewFoto(null);
    setIsUploading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleCerrarModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar foto de perfil</DialogTitle>
          <DialogDescription>
            Selecciona una nueva imagen para tu foto de perfil. Se recomienda
            una imagen cuadrada.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          {/* Preview de la foto */}
          <div className="relative">
            <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
              {previewFoto ? (
                <img
                  src={previewFoto || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : fotoActual ? (
                <img
                  src={fotoActual || "/placeholder.svg"}
                  alt="Foto actual"
                  className="w-full h-full object-cover rounded-lg opacity-50"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Sin foto</p>
                </div>
              )}
            </div>
          </div>

          {/* Botón para seleccionar archivo */}
          <Button
            onClick={handleFileSelect}
            variant="outline"
            disabled={isUploading}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Cargando..." : "Seleccionar imagen"}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {previewFoto && (
            <p className="text-sm text-green-600 text-center">
              ✓ Nueva imagen seleccionada
            </p>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {fotoActual && (
            <Button
              variant="outline"
              onClick={handleEliminarFoto}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-2" />
              Eliminar foto actual
            </Button>
          )}

          <div className="flex gap-2 flex-1">
            <Button
              variant="outline"
              onClick={handleCerrarModal}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmarFoto}
              disabled={!previewFoto}
              className="flex-1"
            >
              Confirmar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

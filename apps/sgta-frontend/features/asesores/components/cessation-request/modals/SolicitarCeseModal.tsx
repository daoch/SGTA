// src/features/asesores/components/cessation-request/modals/SolicitarCeseModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; // Ajusta la ruta a tus componentes UI
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  IAsesorTemaActivo,
  ICreateCessationRequestPayload,
  // ICessationRequestCreationResponse, // Ya no se usa directamente aquí si el hook lo maneja
} from "@/features/asesores/types/cessation-request"; // Ajusta la ruta
import { useCreateCessationRequest } from "@/features/asesores/queries/cessation-request"; // Ajusta la ruta
import axios from "axios"; // Para axios.isAxiosError
import { toast } from "react-toastify";
// import { toast } from "sonner"; // Descomenta si usas sonner para notificaciones

interface SolicitarCeseModalProps {
  isOpen: boolean;
  onClose: () => void;
  temasDisponibles: IAsesorTemaActivo[];
  isLoadingTemas: boolean;
  onSuccess?: () => void; // Callback opcional al éxito para refetchear listas, etc.
}

const SolicitarCeseModal: React.FC<SolicitarCeseModalProps> = ({
  isOpen,
  onClose,
  temasDisponibles,
  isLoadingTemas,
  onSuccess,
}) => {
  const [selectedTemaId, setSelectedTemaId] = useState<string>("");
  const [motivo, setMotivo] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    mutate: createCessationRequest,
    isPending: isSubmitting, // Estado de carga de la mutación
  } = useCreateCessationRequest();

  useEffect(() => {
    // Limpiar estado cuando el modal se cierra o cuando cambian los temas disponibles
    // (por si se reabre con una lista diferente)
    if (!isOpen) {
      setSelectedTemaId("");
      setMotivo("");
      setErrorMessage(null);
    } else {
      // Si hay temas disponibles y ninguno seleccionado, o si el seleccionado ya no está,
      // podrías resetear o seleccionar el primero por defecto.
      // Por ahora, solo limpiamos al cerrar.
    }
  }, [isOpen, temasDisponibles]);


  const handleSubmit = () => {
    if (!selectedTemaId) {
      setErrorMessage("Por favor, seleccione un tema.");
      return;
    }
    const temaSeleccionado = temasDisponibles.find(t => t.temaId.toString() === selectedTemaId);
    if (!temaSeleccionado) {
        setErrorMessage("El tema seleccionado ya no es válido. Por favor, recargue la lista de temas.");
        return;
    }

    if (motivo.trim().length < 10 || motivo.trim().length > 1000) {
      setErrorMessage("El motivo debe tener entre 10 y 1000 caracteres.");
      return;
    }
    setErrorMessage(null); // Limpiar errores previos antes de enviar

    const payload: ICreateCessationRequestPayload = {
      temaId: parseInt(selectedTemaId, 10),
      motivo: motivo.trim(),
    };

    createCessationRequest(payload, {
      onSuccess: (data) => { // data es ICessationRequestCreationResponse
        console.log("Solicitud de cese creada exitosamente:", data);
        toast.success("Solicitud de cese enviada exitosamente.");
        //alert(`Solicitud de cese para el tema "${temaSeleccionado.temaTitulo}" enviada con ID: ${data.id}`); // Placeholder
        onClose(); // Cerrar modal
        if (onSuccess) {
          onSuccess(); // Llamar al callback (ej. para refetchear listas en la página padre)
        }
      },
      onError: (error) => {
        console.error("Error al crear la solicitud de cese:", error);
        let specificMessage = "Ocurrió un error inesperado al enviar la solicitud.";
        if (axios.isAxiosError(error) && error.response) {
          if (typeof error.response.data === "string" && error.response.data.length > 0) {
            specificMessage = error.response.data;
          } else if (error.response.data && typeof error.response.data.message === "string") {
            specificMessage = error.response.data.message;
          } else if (error.message) {
            specificMessage = error.message;
          }
        } else if (error instanceof Error) {
          specificMessage = error.message;
        }
        setErrorMessage(specificMessage);
        // toast.error(specificMessage);
      },
    });
  };

  // No renderizar nada si el modal no está abierto
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => { if (!openState) onClose(); }}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Solicitar Cese de Asesoría</DialogTitle>
          <DialogDescription>
            Seleccione el tema para el cual desea solicitar el cese de su asesoría
            e ingrese el motivo detallado.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Selección de Tema */}
          <div className="grid grid-cols-1 items-center gap-2">
            <Label htmlFor="tema-cese-select" className="text-left">
              Tema de Tesis <span className="text-red-500">*</span>
            </Label>
            {isLoadingTemas ? (
              <div className="flex items-center text-sm text-muted-foreground p-2 border rounded-md">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cargando temas disponibles...
              </div>
            ) : (
              <Select value={selectedTemaId} onValueChange={setSelectedTemaId} disabled={temasDisponibles.length === 0}>
                <SelectTrigger id="tema-cese-select" className="w-full">
                  <SelectValue placeholder={temasDisponibles.length === 0 ? "No hay temas para seleccionar" : "Seleccione un tema..."} />
                </SelectTrigger>
                <SelectContent>
                  {temasDisponibles.length > 0 ? (
                    temasDisponibles.map((tema) => (
                      <SelectItem key={tema.temaId} value={tema.temaId.toString()}>
                        {tema.temaTitulo}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-3 text-sm text-center text-muted-foreground">
                      No tiene temas activos para solicitar cese.
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Motivo de la Solicitud */}
          <div className="grid grid-cols-1 items-center gap-2">
            <Label htmlFor="motivo-cese-textarea" className="text-left">
              Motivo de la Solicitud <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="motivo-cese-textarea"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Explique detalladamente la razón para solicitar el cese (mín. 10 caracteres)..."
              rows={5}
              minLength={10}
              maxLength={1000}
              disabled={isSubmitting || isLoadingTemas || temasDisponibles.length === 0}
            />
            <p className="text-xs text-muted-foreground text-right">{motivo.length}/1000</p>
          </div>

          {/* Mensaje de Error */}
          {errorMessage && (
            <div className="px-3 py-2 rounded-md bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
              {errorMessage}
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            onClick={handleSubmit} 
            disabled={isSubmitting || !selectedTemaId || isLoadingTemas || temasDisponibles.length === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Solicitud"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SolicitarCeseModal;
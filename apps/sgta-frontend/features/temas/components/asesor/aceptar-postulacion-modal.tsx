"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Postulacion } from "../../types/postulaciones/entidades";

interface AceptarPostulacionProps {
  selectedPostulacion: Postulacion | null;
  feedbackText: string;
  setFeedbackText: (feedbackText: string) => void;
  setShowAcceptDialog: (showAcceptDialog: boolean) => void;
  handleApprove: () => void;
}

export function AceptarPostulacionModal({
  selectedPostulacion,
  feedbackText,
  setFeedbackText,
  setShowAcceptDialog,
  handleApprove,
}: AceptarPostulacionProps) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Detalles de la Postulación</DialogTitle>
        <DialogDescription>
          Información completa sobre la postulación al tema
        </DialogDescription>
      </DialogHeader>

      {selectedPostulacion && (
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Título de la postulación</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="font-medium">{selectedPostulacion.titulo}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comentario">Comentario para el estudiante</Label>
            <Textarea
              id="comentario"
              placeholder="Añade un comentario para el estudiante..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              Este comentario será visible para el estudiante que propuso el
              tema.
            </p>
          </div>
        </div>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>
          Cancelar
        </Button>
        <Button
          onClick={handleApprove}
          className="bg-green-600 hover:bg-green-700"
        >
          Confirmar Aceptación
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

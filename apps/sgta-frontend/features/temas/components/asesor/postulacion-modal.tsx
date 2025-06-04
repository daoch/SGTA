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
import { Separator } from "@/components/ui/separator";
import { CheckCircle, X } from "lucide-react";
import { Postulacion } from "../../types/postulaciones/entidades";

interface PostulacionModalProps {
  selectedPostulacion: Postulacion | null;
  setSelectedPostulacion: (selectedPostulacion: Postulacion | null) => void;
  feedbackText: string;
  setFeedbackText: (feedbackText: string) => void;
  handleOpenRejectDialog: (propuesta: Postulacion) => void;
  handleOpenAcceptDialog: (propuesta: Postulacion) => void;
}

export function PostulacionModal({
  selectedPostulacion,
  setSelectedPostulacion,
  handleOpenRejectDialog,
  handleOpenAcceptDialog,
}: PostulacionModalProps) {
  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Detalles de la Postulación</DialogTitle>
        <DialogDescription>
          Información completa sobre la postulación al tema
        </DialogDescription>
      </DialogHeader>
      {selectedPostulacion && (
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Tema</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="font-medium">{selectedPostulacion.titulo}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Área</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <p>{selectedPostulacion.area}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estudiante(s)</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <ul className="space-y-1">
                  {selectedPostulacion.estudiantes.map((estudiante, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>{estudiante}</span>
                      <span className="text-sm text-muted-foreground">
                        {selectedPostulacion.codigos[index]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fechas</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Postulación:</span>
                  <span>
                    {new Date(
                      selectedPostulacion.fechaPostulacion,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm font-medium">Límite:</span>
                  <span>
                    {new Date(
                      selectedPostulacion.fechaLimite,
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Motivación</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <p>{selectedPostulacion.motivacion}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Experiencia</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <p>{selectedPostulacion.experiencia}</p>
            </div>
          </div>

          {/* Mostrar comentario si existe y el estado no es pendiente */}
          {selectedPostulacion.estado !== "pendiente" &&
            selectedPostulacion.comentario && (
              <div className="space-y-2">
                <Label>Comentario para el estudiante</Label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p>{selectedPostulacion.comentario}</p>
                </div>
              </div>
            )}
        </div>
      )}
      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={() => setSelectedPostulacion(null)}>
          Cerrar
        </Button>

        {selectedPostulacion && selectedPostulacion.estado === "pendiente" && (
          <>
            <Button
              onClick={() => handleOpenRejectDialog(selectedPostulacion)}
              variant="destructive"
            >
              <X className="mr-2 h-4 w-4" />
              Rechazar
            </Button>
            <Button
              onClick={() => handleOpenAcceptDialog(selectedPostulacion)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Aprobar
            </Button>
          </>
        )}
      </DialogFooter>
    </DialogContent>
  );
}

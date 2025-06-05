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
import { Postulacion } from "@/features/temas/types/postulaciones/entidades";
import { CheckCircle, X } from "lucide-react";

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
              <p>{selectedPostulacion.subareas[0].areaConocimiento.nombre}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estudiante(s)</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <ul className="space-y-1">
                  {selectedPostulacion.tesistas.map((tesista, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>{`${tesista.nombres} ${tesista.primerApellido} ${tesista.segundoApellido}`}</span>
                      <span className="text-sm text-muted-foreground">
                        {selectedPostulacion.tesistas[index].codigoPucp}
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
                      selectedPostulacion.fechaCreacion,
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

          <div className="space-y-2">
            <Label>Comentario</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              {selectedPostulacion.tesistas.map((tesista, index) => (
                <span key={index}>{tesista.comentario.split("@")[0]}</span>
              ))}
            </div>
          </div>

          {/* Mostrar comentario si existe y el estado no es pendiente */}
          {/*CAMBIAR CUANDO SE TENGA EL LISTADO DE COASESORES*/}
          {selectedPostulacion.estadoUsuarioTema !== "Pendiente" &&
            selectedPostulacion.tesistas && (
              <div className="space-y-2">
                <Label>Comentario para el estudiante</Label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p>
                    {selectedPostulacion.tesistas.map((tesista, index) => (
                      <span key={index}>
                        {tesista.comentario.split("@")[1]}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            )}
        </div>
      )}
      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={() => setSelectedPostulacion(null)}>
          Cerrar
        </Button>

        {selectedPostulacion &&
          selectedPostulacion.estadoUsuarioTema === "Pendiente" && (
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

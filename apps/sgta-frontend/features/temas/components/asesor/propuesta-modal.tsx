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
import { CheckCircle, Eye, Send, X } from "lucide-react";
import { useState } from "react";
import { Proyecto_M } from "../../types/propuestas/entidades";
import { EnviarPropuestaCard } from "./enviar-propuesta-card";
import { RechazarPropuestaCard } from "./rechazar-propuesta-card";

interface PropuestasModalProps {
  data?: Proyecto_M;
  setSelectedPropuesta?: (selectedPropuesta: Proyecto_M | null) => void;
  setComentario?: (comentario: string) => void;
  submitPostulacion?: () => void;
  submitAceptacion?: () => void;
  submitRechazo?: () => void;
  aceptarPropuesta?: boolean;
  setAceptarPropuesta?: (estado: boolean) => void;
  postularPropuesta?: boolean;
  setPostularPropuesta?: (estado: boolean) => void;
  rechazarPropuesta?: boolean;
  setRechazarPropuesta?: (estado: boolean) => void;
}

export function PropuestasModal({
  data,
  setSelectedPropuesta,
  setComentario,
  submitPostulacion,
  submitAceptacion,
  submitRechazo,
  aceptarPropuesta,
  setAceptarPropuesta,
  postularPropuesta,
  setPostularPropuesta,
  rechazarPropuesta,
  setRechazarPropuesta,
}: PropuestasModalProps) {
  const [postularDialog, setPostularDialog] = useState(postularPropuesta);
  const [aceptarDialog, setAceptarDialog] = useState(aceptarPropuesta);
  const [rechazarDialog, setRechazarDialog] = useState(rechazarPropuesta);

  const handlePostularClick = () => {
    setPostularDialog(true);
    setAceptarDialog(false);
    setRechazarDialog(false);
    setAceptarPropuesta?.(false);
    setPostularPropuesta?.(false);
    setRechazarPropuesta?.(false);
  };

  const handleSubmitRechazo = () => {
    // Aquí iría la lógica para rechazar la postulación
    console.log("Rechazando propuesta...");
    submitRechazo?.();
    setSelectedPropuesta?.(null);
    setComentario?.("");
    setRechazarDialog(false);
    setAceptarPropuesta?.(false);
    setPostularPropuesta?.(false);
    setRechazarPropuesta?.(false);
  };

  const handleRechazarClick = () => {
    setRechazarDialog(true);
    setPostularDialog(false);
    setAceptarDialog(false);
    setAceptarPropuesta?.(false);
    setPostularPropuesta?.(false);
    setRechazarPropuesta?.(false);
  };

  const handleAceptarClick = () => {
    setAceptarDialog(true);
    setPostularDialog(false);
    setRechazarDialog(false);
    setAceptarPropuesta?.(false);
    setPostularPropuesta?.(false);
    setRechazarPropuesta?.(false);
  };

  const handleSubmitPostulacion = () => {
    //Lógica para enviar la postulación
    console.log("Postulando propuesta general...");
    submitPostulacion?.();
    setSelectedPropuesta?.(null);
    setComentario?.("");
    setPostularDialog(false);
    setAceptarPropuesta?.(false);
    setPostularPropuesta?.(false);
    setRechazarPropuesta?.(false);
  };

  const handleSubmitAceptacion = () => {
    // Lógica para aceptar la propuesta
    console.log("Aceptando propuesta directa...");
    submitAceptacion?.();
    console.log("Ya entré y enlacé...");
    setSelectedPropuesta?.(null);
    setComentario?.("");
    setAceptarDialog(false);
    setAceptarPropuesta?.(false);
    setPostularPropuesta?.(false);
    setRechazarPropuesta?.(false);
  };

  const handleCancelar = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    console.log("Entro al handleCancelar ...");
    setSelectedPropuesta?.(null);
    setAceptarDialog(false);
    setPostularDialog(false);
    setRechazarDialog(false);
    setAceptarPropuesta?.(false);
    setAceptarPropuesta?.(false);
    setRechazarPropuesta?.(false);
  };

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Detalles de la Propuesta</DialogTitle>
        <DialogDescription>
          Información completa sobre la propuesta de tesis
        </DialogDescription>
      </DialogHeader>

      {data && !postularDialog && !aceptarDialog && !rechazarDialog && (
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="font-medium">{data.titulo}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Área</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <p>
                {data.subareas
                  .map(
                    (subareas) =>
                      `(${subareas.nombre})`,
                  )
                  .join(", ")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estudiante(s)</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <ul className="space-y-1">
                  {data.estudiantes.map((estudiante, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>
                        {`${estudiante.nombres} ${estudiante.primerApellido} 
                        ${estudiante.segundoApellido}`}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {estudiante.codigoPucp}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fecha Límite</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <p>{new Date(data.fechaLimite).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Descripción</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <p>{data.resumen}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Objetivos</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <p>{data.objetivos}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Metodología</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <p>{data.metodologia}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Recursos</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              {data.portafolioUrl && data.portafolioUrl.length > 0 ? (
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span>{data.portafolioUrl}</span>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No hay recursos disponibles
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {data && (postularDialog || aceptarDialog) && (
        <EnviarPropuestaCard data={data} setComentario={setComentario} />
      )}

      {data && rechazarDialog && (
        <RechazarPropuestaCard data={data} setComentario={setComentario} />
      )}

      <DialogFooter className="mt-6">
        {!postularDialog && !aceptarDialog && !rechazarDialog ? (
          <>
            <Button variant="outline" onClick={handleCancelar}>
              Cerrar
            </Button>

            {data && data.tipo === "general" && (
              <Button
                onClick={handlePostularClick}
                className="bg-[#042354] hover:bg-[#006699]"
              >
                <Send className="mr h-4 w-4" />
                Postular
              </Button>
            )}

            {data && data.tipo === "directa" && (
              <>
                <Button
                  onClick={handleRechazarClick}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <X className="mr h-4 w-4" />
                  Rechazar
                </Button>
                <Button
                  onClick={handleAceptarClick}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr h-4 w-4" />
                  Aceptar
                </Button>
              </>
            )}
          </>
        ) : postularDialog ? (
          <>
            <Button variant="outline" onClick={handleCancelar}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitPostulacion}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirmar
            </Button>
          </>
        ) : aceptarDialog ? (
          <>
            <Button variant="outline" onClick={handleCancelar}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitAceptacion}
              className={"bg-green-600 hover:bg-green-700"}
            >
              Confirmar
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={handleCancelar}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitRechazo}
              className={"bg-red-600 hover:bg-red-700"}
            >
              Rechazar
            </Button>
          </>
        )}
      </DialogFooter>
    </DialogContent>
  );
}

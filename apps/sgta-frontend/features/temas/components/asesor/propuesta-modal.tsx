"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, CheckCircle, X, Send } from "lucide-react";
import { EnviarPropuestaCard } from "./enviar-propuesta-card";
import { Button } from "@/components/ui/button";
import { Proyecto } from "../../types/propuestas/entidades";

interface PropuestasModalProps {
  data?: Proyecto;
  setSelectedPropuesta?: (selectedPropuesta: Proyecto | null) => void;
  setComentario?: (comentario: string) => void;
}

export function PropuestasModal({
  data,
  setSelectedPropuesta,
  setComentario,
}: PropuestasModalProps) {
  const [postularDialog, setPostularDialog] = useState(false);
  const [aceptarDialog, setAceptarDialog] = useState(false);

  const handlePostularClick = () => {
    setAceptarDialog(true);
  };

  const handleRechazar = () => {
    // Aquí iría la lógica para rechazar la postulación
    setSelectedPropuesta?.(null);
    setComentario?.("");
  };

  const handleAceptarClick = () => {
    setAceptarDialog(true);
  };

  const handleSubmitPostulacion = () => {
    // Aquí iría la lógica para enviar la postulación
    setSelectedPropuesta?.(null);
    setComentario?.("");
    setPostularDialog(false);
  };

  const handleSubmitAceptacion = () => {
    // Aquí iría la lógica para aceptar la propuesta
    setSelectedPropuesta?.(null);
    setComentario?.("");
    setAceptarDialog(false);
  };

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Detalles de la Propuesta</DialogTitle>
        <DialogDescription>
          Información completa sobre la propuesta de tesis
        </DialogDescription>
      </DialogHeader>

      {data && !postularDialog && !aceptarDialog && (
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
              <p>{data.area}</p>
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
                      <span>{estudiante}</span>
                      <span className="text-sm text-muted-foreground">
                        {data.codigos[index]}
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
              <p>{data.descripcion}</p>
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
              {data.recursos.length > 0 ? (
                <ul className="space-y-1">
                  {data.recursos.map((recurso, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span>{recurso.nombre}</span>
                      <span className="text-xs text-muted-foreground">
                        ({new Date(recurso.fecha).toLocaleDateString()})
                      </span>
                    </li>
                  ))}
                </ul>
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

      <DialogFooter className="mt-6">
        {!postularDialog && !aceptarDialog ? (
          <>
            <Button
              variant="outline"
              onClick={() => setSelectedPropuesta?.(null)}
            >
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
                  onClick={handleRechazar}
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
            <Button variant="outline" onClick={() => setPostularDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitPostulacion}
              className="bg-pucp-blue hover:bg-pucp-light"
            >
              Enviar Postulación
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setAceptarDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitAceptacion}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirmar
            </Button>
          </>
        )}
      </DialogFooter>
    </DialogContent>
  );
}

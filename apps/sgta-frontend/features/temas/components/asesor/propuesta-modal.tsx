"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CheckCircle, Send, X } from "lucide-react";
import { useState } from "react";
import { buscarTemasSimilaresALaPropuesta } from "../../types/propuestas/data";
import { Proyecto_M, TemaSimilar } from "../../types/propuestas/entidades";
import { EnviarPropuestaCard } from "./enviar-propuesta-card";
import { RechazarPropuestaCard } from "./rechazar-propuesta-card";
import { TemasSimilaresModal } from "./temas-similares-modal";

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
  setTipoRechazo?: (tipoRechazo: number) => void;
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
  setTipoRechazo,
}: PropuestasModalProps) {
  const [postularDialog, setPostularDialog] = useState(postularPropuesta);
  const [aceptarDialog, setAceptarDialog] = useState(aceptarPropuesta);
  const [rechazarDialog, setRechazarDialog] = useState(rechazarPropuesta);
  const [temasSimilares, setTemasSimilares] = useState<TemaSimilar[]>([]);
  const [loading, setLoading] = useState(false);
  const [openSimilarDialog, setOpenSimilarDialog] = useState(false);

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
    setTipoRechazo?.(0);
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
    console.log("Postulando propuesta general...");
    submitPostulacion?.();
    setSelectedPropuesta?.(null);
    setComentario?.("");
    setTipoRechazo?.(0);
    setPostularDialog(false);
    setAceptarPropuesta?.(false);
    setPostularPropuesta?.(false);
    setRechazarPropuesta?.(false);
  };

  const handleSubmitAceptacion = () => {
    console.log("Aceptando propuesta directa...");
    submitAceptacion?.();
    console.log("Ya entré y enlacé...");
    setSelectedPropuesta?.(null);
    setComentario?.("");
    setTipoRechazo?.(0);
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

  const handleListarTemasSimilares = async () => {
    if (!data || !data.id) return;
    try {
      setLoading(true);
      const ts = await buscarTemasSimilaresALaPropuesta(data?.id);
      setTemasSimilares(ts);
      setOpenSimilarDialog(true);
    } catch (error) {
      console.error("Error al listar temas similares:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(`La data es :${data}`);
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
          <div className="space-y-1">
            <Label>Título</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="font-medium">{data.titulo}</p>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Área</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <p>{data.subAreas[0].areaConocimiento.nombre}</p>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Subárea(s)</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <p>
                {data.subAreas
                  .map((subAreas) => `${subAreas.nombre}`) //Secambia subarea por subArea
                  .join("- ")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
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

            <div className="space-y-1">
              <Label>Fecha Límite</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                {data.fechaLimite === null ? (
                  <p className="text-gray-500"> No hay fecha límite </p>
                ) : (
                  <p>{new Date(data.fechaLimite).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Descripción</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <p>{data.resumen}</p>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Objetivos</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <p>{data.objetivos}</p>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Temas similares</Label>
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="outline"
                onClick={handleListarTemasSimilares}
                disabled={loading}
              >
                {loading ? "Cargando..." : "Ver Temas Similares"}
              </Button>
            </div>
            <Dialog
              open={openSimilarDialog}
              onOpenChange={setOpenSimilarDialog}
            >
              <DialogContent className="max-w-xl p-0">
                {temasSimilares.length === 0 ? (
                  <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-sm">
                    <div className="flex items-center text-green-600 gap-2 font-semibold text-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      No se han encontrado temas similares
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      Hemos detectado que la propuesta no tiene similitudes con
                      ningún proyectos de fin de carrera existentes.
                    </p>
                  </div>
                ) : (
                  <TemasSimilaresModal temasSilimares={temasSimilares} />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {data && (postularDialog || aceptarDialog) && (
        <EnviarPropuestaCard data={data} setComentario={setComentario} />
      )}

      {data && rechazarDialog && (
        <RechazarPropuestaCard
          data={data}
          setComentario={setComentario}
          setTipoRechazo={setTipoRechazo}
        />
      )}

      <DialogFooter className="mt-3">
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

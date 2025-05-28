import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Label } from "@/components/ui/label";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Calendar, Clock } from "lucide-react";
  import { Textarea } from "@/components/ui/textarea";
import { EntregableAlumnoDto } from "../../dtos/EntregableAlumnoDto";
import { useState } from "react";
  
  interface EntregablesModalProps {
    entregable?: EntregableAlumnoDto;
    setSelectedEntregable?: (selectedEntregable: EntregableAlumnoDto | null) => void;
  }

  const formatFecha = (fechaString?: string) => {
    if (!fechaString) return "Sin fecha";
    const fecha = new Date(fechaString);
    return fecha.toLocaleString("es-PE", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  
  export function EntregablesModal({
    entregable,
    setSelectedEntregable,
  }: EntregablesModalProps) {
    const [comentario, setComentario] = useState<string>("");
  
    return (
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{entregable?.entregableNombre ?? "Entregable"}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {entregable?.etapaFormativaNombre}
          </p>
        </DialogHeader>
  
        <div className="space-y-5 py-1">
            <div className="bg-gray-100 rounded-md p-4 space-y-2 text-sm text-gray-800">
                <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 mt-1 text-gray-500" />
                    <p>
                    <strong>Apertura:</strong>{" "}
                      {formatFecha(entregable?.entregableFechaInicio)}
                    </p>
                </div>
                <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-1 text-gray-500" />
                    <p>
                    <strong>Fecha límite:</strong>{" "}
                    {formatFecha(entregable?.entregableFechaFin)}
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-m">Estado de la entrega</Label>
                <div className="rounded-md border overflow-hidden text-sm">
                    <div className="grid grid-cols-2 border-b">
                        <div className="bg-gray-100 px-4 py-3 font-medium text-gray-800">Estado de la entrega</div>
                        <div className="px-4 py-3 text-gray-700">
                          {entregable?.entregableEstado === "no_iniciado" ? "Pendiente" : entregable?.entregableEstado}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-b">
                        <div className="bg-gray-100 px-4 py-3 font-medium text-gray-800">Estado de la calificación</div>
                        <div className="px-4 py-3 text-gray-700">Sin calificar</div>
                    </div>
                    <div className="grid grid-cols-2 border-b">
                        <div className="bg-gray-100 px-4 py-3 font-medium text-gray-800">Última modificación</div>
                        <div className="px-4 py-3 text-gray-700">-</div>
                    </div>
                    <div className="grid grid-cols-2 border-b">
                        <div className="bg-gray-100 px-4 py-3 font-medium text-gray-800">Archivos enviados</div>
                        <div className="px-4 py-3 text-gray-700">No hay archivos enviados</div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="bg-gray-100 px-4 py-3 font-medium text-gray-800 align-top">Comentarios de la entrega</div>
                        <div className="px-4 py-3">
                        <Textarea
                            placeholder="Añade comentarios sobre tu entrega aquí..."
                            value={comentario}
                            onChange={(e) => {
                                setComentario?.(e.target.value);
                            }}
                        />
                        </div>
                    </div>
                </div>
            </div>
        
            {/*<div className="space-y-2">
                <Label className="text-m">Añadir nuevo archivo</Label>
                <Input type="file" accept=".pdf,.doc,.docx" />
                <p className="text-xs text-muted-foreground">
                    Máximo de archivos: {entregable?.entregableMaximoDocumentos} <br />
                    Tamaño máximo: {entregable?.entregablePesoMaximoDocumento} MB <br />
                    Formatos aceptados: {entregable?.entregableExtensionesPermitidas} <br />                    
                </p>
            </div>*/}
            
        </div>
  
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setSelectedEntregable?.(null)}
          >
            Cancelar
          </Button>
          <Button className="bg-[#042354] hover:bg-[#001e44] text-white">
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    );
}
  
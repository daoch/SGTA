import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Label } from "@/components/ui/label";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { useState } from "react";
  import { Entregable } from "../../types/entregables/entidades";
  import { Calendar, Clock } from "lucide-react";
  import { Textarea } from "@/components/ui/textarea";
import { EntregableDto } from "../../dtos/EntregableDto";
  
  interface EntregablesModalProps {
    data?: EntregableDto;
    setSelectedEntregable?: (selectedEntregable: EntregableDto | null) => void;
    setComentario?: (comentario: string) => void;
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
    data,
    setSelectedEntregable,
    setComentario,
  }: EntregablesModalProps) {
    const [comentario, setComentarioLocal] = useState("");
  
    return (
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{data?.nombre || "Entregable"}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Proyecto de fin de carrera 2 (1INF46) - {data?.id}
          </p>
        </DialogHeader>
  
        <div className="space-y-5 py-1">
            <div className="bg-gray-100 rounded-md p-4 space-y-2 text-sm text-gray-800">
                <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 mt-1 text-gray-500" />
                    <p>
                    <strong>Apertura:</strong>{" "}
                      {formatFecha(data?.fechaInicio)}
                    </p>
                </div>
                <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-1 text-gray-500" />
                    <p>
                    <strong>Fecha límite:</strong>{" "}
                    {formatFecha(data?.fechaFin)}
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-m">Estado de la entrega</Label>
                <div className="rounded-md border overflow-hidden text-sm">
                    <div className="grid grid-cols-2 border-b">
                        <div className="bg-gray-100 px-4 py-3 font-medium text-gray-800">Estado de la entrega</div>
                        <div className="px-4 py-3 text-gray-700">
                          {data?.estado === "no_iniciado" ? "Pendiente" : data?.estado}
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
                                setComentarioLocal(e.target.value);
                                setComentario?.(e.target.value);
                            }}
                        />
                        </div>
                    </div>
                </div>
            </div>
  
            {/* Comentarios 
            <div className="space-y-2">
                <Label>Comentarios de la entrega</Label>
                <Input
                    placeholder="Añade comentarios sobre tu entrega aquí..."
                    value={comentario}
                    onChange={(e) => {
                        setComentarioLocal(e.target.value);
                        setComentario?.(e.target.value);
                    }}
                />
            </div>*/}
  
        
            <div className="space-y-2">
                <Label className="text-m">Añadir nuevo archivo</Label>
                <Input type="file" accept=".pdf,.doc,.docx" />
                <p className="text-xs text-muted-foreground">
                    Máximo de archivos: {data?.maximoDocumentos} <br />
                    Tamaño máximo: {data?.pesoMaximoDocumento} MB <br />
                    Formatos aceptados: {data?.extensionesPermitidas} <br />                    
                </p>
            </div>
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
  
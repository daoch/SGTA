import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Calendar, Clock } from "lucide-react";
  import { Textarea } from "@/components/ui/textarea";
import { EntregableAlumnoDto } from "../../dtos/EntregableAlumnoDto";
import { useEffect, useState } from "react";
import { DropzoneDocumentosAlumno } from "./dropzone-documentos-alumno";
import { DocumentoConVersionDto } from "../../dtos/DocumentoConVersionDto";
import axiosInstance from "@/lib/axios/axios-instance";
  
  interface EntregablesModalProps {
    entregable: EntregableAlumnoDto;
    setSelectedEntregable?: (selectedEntregable: EntregableAlumnoDto | null) => void;
    handleUpdateEntregable?: (updated: EntregableAlumnoDto) => void;
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
    handleUpdateEntregable,
  }: EntregablesModalProps) {
    const [comentario, setComentario] = useState<string>(entregable.entregableComentario ?? "");
    const [archivosSubidos, setArchivosSubidos] = useState<DocumentoConVersionDto[]>([]);
    const [archivosASubir, setArchivosASubir] = useState<File[]>([]);

    useEffect(() => {
      console.log("El comentario es:", entregable.entregableComentario);
      setComentario(entregable.entregableComentario ?? "");
    }, [entregable]);

    useEffect(() => {
      const fetchArchivosSubidos = async () => {
        try{
          const response = await axiosInstance.get(`/documento/entregable/${entregable.entregableId}`);
          setArchivosSubidos(response.data);
        } catch (error) {
          console.error("Error al cargar las etapas formativas:", error);
        }
      };
      fetchArchivosSubidos();
    }, [entregable.entregableId]);

    const handleGuardar = async () => {
      // TODO: Ver si la fecha funciona bien con la zona horaria
      const fechaActual = new Date();
      const fechaLimite = new Date(entregable.entregableFechaFin);

      let estado = "enviado_a_tiempo";
      if(fechaActual > fechaLimite) {
        estado = "enviado_tarde";
      }
      
      await axiosInstance.post(`/entregable/entregar/${entregable.entregableId}`, {
        comentario: comentario,
        estado: estado,
      });

      if (archivosASubir.length > 0) {
        const formData = new FormData();
        archivosASubir.forEach((archivo) => formData.append("archivos", archivo));
        formData.append("ciclo", entregable.cicloNombre.toString());
        formData.append("curso", entregable.etapaFormativaNombre.toString());
        formData.append("codigoAlumno", "20183178");

        await axiosInstance.post(`/documento/entregable/${entregable.entregableId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      if (handleUpdateEntregable) {
        handleUpdateEntregable({
          ...entregable,
          entregableEstado: estado,
          entregableFechaEnvio: fechaActual.toISOString(),
          entregableComentario: comentario,
        });
      }

      setSelectedEntregable?.(null);
    };
  
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
                <div className="rounded-md border overflow-hidden text-sm">
                    <div className="grid grid-cols-2 border-b">
                        <div className="bg-gray-100 px-4 py-3 font-medium text-gray-800">Estado de la entrega</div>
                        <div className="px-4 py-3 text-gray-700">
                          {estadoLabels[entregable.entregableEstado] || entregable.entregableEstado}
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
                        <div className="px-4 py-3 text-gray-700">
                          {archivosSubidos.length === 0 ? (
                            "No hay archivos enviados"
                          ) : (
                            <ul className="list-disc pl-4">
                              {archivosSubidos.map((archivo) => (
                                <li key={archivo.documentoId}>
                                  <a
                                    href={archivo.documentoLinkArchivo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                  >
                                    {archivo.documentoNombre}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
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
            <DropzoneDocumentosAlumno onFilesChange={setArchivosASubir} accept=".pdf,.doc,.docx" maxFiles={3} maxSizeMB={10} />
        </div>
  
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setSelectedEntregable?.(null)}
          >
            Cancelar
          </Button>
          <Button className="bg-[#042354] hover:bg-[#001e44] text-white" onClick={handleGuardar}>
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    );
}
  
const estadoLabels: Record<string, string> = {
    no_enviado: "Pendiente",
    enviado_a_tiempo: "Enviado a tiempo",
    enviado_tarde: "Enviado tarde",
};
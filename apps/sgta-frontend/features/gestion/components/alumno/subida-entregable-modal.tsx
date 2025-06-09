import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/lib/axios/axios-instance";
import { Calendar, Clock, Download, MoreVertical, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DocumentoConVersionDto } from "../../dtos/DocumentoConVersionDto";
import { EntregableAlumnoDto } from "../../dtos/EntregableAlumnoDto";
import { DropzoneDocumentosAlumno } from "./dropzone-documentos-alumno";

interface EntregablesModalProps {
  readonly entregable: EntregableAlumnoDto;
  readonly setSelectedEntregable?: (
    selectedEntregable: EntregableAlumnoDto | null,
  ) => void;
  readonly handleUpdateEntregable?: (updated: EntregableAlumnoDto) => void;
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
  const [comentario, setComentario] = useState<string>(
    entregable.entregableComentario ?? "",
  );
  const [archivosSubidos, setArchivosSubidos] = useState<
    DocumentoConVersionDto[]
  >([]);
  const [archivosASubir, setArchivosASubir] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setComentario(entregable.entregableComentario ?? "");
  }, [entregable]);

  useEffect(() => {
    const fetchArchivosSubidos = async () => {
      try {
        const response = await axiosInstance.get(
          `/documento/entregable/${entregable.entregableId}`,
        );
        setArchivosSubidos(response.data);
      } catch (error) {
        console.error("Error al cargar las etapas formativas:", error);
      }
    };
    fetchArchivosSubidos();
  }, [entregable.entregableId]);

  const handleGuardar = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Ver si la fecha funciona bien con la zona horaria
      const fechaActual = new Date();
      const fechaLimite = new Date(entregable.entregableFechaFin);

      let estado = "enviado_a_tiempo";
      if (fechaActual > fechaLimite) {
        estado = "enviado_tarde";
      }
      await axiosInstance.post(
        `/entregable/entregar/${entregable.entregableXTemaId}`,
        {
          comentario: comentario,
          estado: estado,
        },
      );

      if (archivosASubir.length > 0) {
        const formData = new FormData();
        archivosASubir.forEach((archivo) =>
          formData.append("archivos", archivo),
        );
        formData.append("ciclo", entregable.cicloNombre.toString());
        formData.append("curso", entregable.etapaFormativaNombre.toString());
        formData.append("codigoAlumno", "20183178");
        formData.append("temaId", entregable.temaId.toString());

        await axiosInstance.post(
          `/documento/entregable/${entregable.entregableId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEliminarDocumento = async (documentoId: number) => {
    try {
      await axiosInstance.post(`documento/borrar-documento/${documentoId}`);
      setArchivosSubidos((prev) =>
        prev.filter((archivo) => archivo.documentoId !== documentoId),
      );
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
    }
  };

  return (
    <DialogContent style={{ maxWidth: "680px", width: "100%" }}>
      <DialogHeader>
        <DialogTitle>
          {entregable?.entregableNombre ?? "Entregable"}
        </DialogTitle>
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
            <div className="grid grid-cols-[220px_1fr] border-b">
              <div className="bg-gray-100 px-4 py-3 font-medium text-gray-800">
                Estado de la entrega
              </div>
              <div className="px-4 py-3 text-gray-700">
                {estadoLabels[entregable.entregableEstado] ||
                  entregable.entregableEstado}
              </div>
            </div>
            <div className="grid grid-cols-[220px_1fr] border-b">
              <div className="bg-gray-100 px-4 py-3 font-medium text-gray-800">
                Estado de la calificación
              </div>
              <div className="px-4 py-3 text-gray-700">Sin calificar</div>
            </div>
            <div className="grid grid-cols-[220px_1fr] border-b">
              <div className="bg-gray-100 px-4 py-3 font-medium text-gray-800">
                Última modificación
              </div>
              <div className="px-4 py-3 text-gray-700">-</div>
            </div>
            <div className="grid grid-cols-[220px_1fr] border-b">
              <div className="bg-gray-100 px-4 py-3 font-medium text-gray-800">
                Archivos enviados
              </div>
              <div className="px-4 py-3 text-gray-700">
                {archivosSubidos.length === 0 ? (
                  "No hay archivos enviados"
                ) : (
                  <ul className="list-disc pl-4">
                    {archivosSubidos.map((archivo) => (
                      <li
                        key={archivo.documentoId}
                        className="flex items-center gap-2"
                      >
                        <span className="truncate">
                          {archivo.documentoNombre}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Opciones"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => { }}>
                              <Download className="w-4 h-4 mr-2" /> Descargar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleEliminarDocumento(archivo.documentoId)
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-2 text-red-600" />{" "}
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="grid grid-cols-[220px_1fr] border-b">
              <div className="bg-gray-100 px-4 py-3 font-medium text-gray-800 align-top">
                Comentarios de la entrega
              </div>
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
        {entregable.entregableMaximoDocumentos - archivosSubidos.length > 0 ? (
          <DropzoneDocumentosAlumno
            onFilesChange={setArchivosASubir}
            accept={entregable.entregableExtensionesPermitidas}
            maxFiles={
              entregable.entregableMaximoDocumentos - archivosSubidos.length
            }
            maxSizeMB={entregable.entregablePesoMaximoDocumento}
          />
        ) : (
          <div className="text-sm text-red-600 font-medium py-2">
            Se alcanzó el límite de archivos permitidos para este entregable.
            <br></br>
            Si quieres subir más archivos, elimina alguno de los ya subidos.
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => setSelectedEntregable?.(null)}>
          Cancelar
        </Button>
        <Button
          className="bg-[#042354] hover:bg-[#001e44] text-white"
          onClick={handleGuardar}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
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

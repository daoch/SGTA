import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { toast } from "sonner";
import { DocumentoConVersionDto } from "../../dtos/DocumentoConVersionDto";
import { EntregableAlumnoDto } from "../../dtos/EntregableAlumnoDto";
import { DropzoneDocumentosAlumno } from "./dropzone-documentos-alumno";
interface EntregablesModalProps {
  readonly entregable: EntregableAlumnoDto;
  readonly setSelectedEntregable?: (
    selectedEntregable: EntregableAlumnoDto | null,
  ) => void;
  readonly handleUpdateEntregable: (updated: EntregableAlumnoDto) => void;
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

const handleDescargarDocumento = async (documentoNombre: string) => {
  const documentoNombreBase64 = window.btoa(documentoNombre);
  const response = await axiosInstance.get(
    `s3/archivos/getUrlFromCloudFront/${documentoNombreBase64}`,
  );
  const fileUrl = response.data;
  window.open(fileUrl, "_blank");
};

export function EntregablesModal({
  entregable,
  setSelectedEntregable,
  handleUpdateEntregable,
}: EntregablesModalProps) {
  const [loadingArchivos, setLoadingArchivos] = useState(true);
  const [comentario, setComentario] = useState<string>(
    entregable.entregableComentario ?? "",
  );
  const [archivosSubidos, setArchivosSubidos] = useState<
    DocumentoConVersionDto[]
  >([]);
  const [archivosASubir, setArchivosASubir] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] =
    useState<null | DocumentoConVersionDto>(null);

  useEffect(() => {
    setComentario(entregable.entregableComentario ?? "");
  }, [entregable]);

  useEffect(() => {
    setLoadingArchivos(true);
    setArchivosSubidos([]);
    const fetchArchivosSubidos = async () => {
      try {
        const response = await axiosInstance.get(
          `/documento/entregable/${entregable.entregableXTemaId}`,
        );
        setArchivosSubidos(response.data);
      } catch (error) {
        console.error("Error al cargar las etapas formativas:", error);
        toast.error("Error al cargar las etapas formativas");
      } finally {
        setLoadingArchivos(false);
      }
    };
    fetchArchivosSubidos();
  }, [entregable.entregableXTemaId]);

  const handleGuardar = async () => {
    setIsSubmitting(true);
    try {
      const fechaActual = new Date();
      const fechaLimite = new Date(entregable.entregableFechaFin);

      let estado = "enviado_a_tiempo";
      if (fechaActual > fechaLimite) {
        estado = "enviado_tarde";
      }

      if (archivosASubir.length > 0) {
        const formData = new FormData();
        archivosASubir.forEach((archivo) =>
          formData.append("archivos", archivo),
        );
        formData.append("ciclo", entregable.cicloNombre.toString());
        formData.append("curso", entregable.etapaFormativaNombre.toString());
        formData.append("comentario", comentario);
        formData.append("estado", estado);

        await axiosInstance.post(
          `/documento/entregable/${entregable.entregableXTemaId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      }
      handleUpdateEntregable({
        ...entregable,
        entregableEstado: estado,
        entregableFechaEnvio: fechaActual.toISOString(),
        entregableComentario: comentario,
      });

      toast.success("Tus documentos fueron entregados correctamente.");
      setSelectedEntregable?.(null);
    } catch (error) {
      console.error("Error al guardar el entregable:", error);
      toast.error("Error al guardar el entregable");
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
      toast.success("Documento eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      toast.error("Error al eliminar el documento");
    }
  };

  let dropzoneContent;
  if (entregable.entregableMaximoDocumentos !== null) {
    if (entregable.entregableMaximoDocumentos - archivosSubidos.length > 0) {
      dropzoneContent = (
        <DropzoneDocumentosAlumno
          onFilesChange={setArchivosASubir}
          accept={
            entregable.entregableExtensionesPermitidas
              ? entregable.entregableExtensionesPermitidas
              : ""
          }
          maxFiles={
            entregable.entregableMaximoDocumentos - archivosSubidos.length
          }
          maxSizeMB={entregable.entregablePesoMaximoDocumento ?? 1000}
          archivosSubidos={archivosSubidos}
        />
      );
    } else {
      dropzoneContent = (
        <div className="text-sm text-red-600 font-medium py-2">
          Se alcanzó el límite de archivos permitidos para este entregable.
          <br />
          Si quieres subir más archivos, elimina alguno de los ya subidos.
        </div>
      );
    }
  } else {
    dropzoneContent = (
      <DropzoneDocumentosAlumno
        onFilesChange={setArchivosASubir}
        accept={
          entregable.entregableExtensionesPermitidas
            ? entregable.entregableExtensionesPermitidas
            : ""
        }
        maxFiles={1000}
        maxSizeMB={entregable.entregablePesoMaximoDocumento ?? 1000}
        archivosSubidos={archivosSubidos}
      />
    );
  }

  let archivosEnviadosContent;
  if (loadingArchivos) {
    archivosEnviadosContent = (
      <span className="text-sm text-muted-foreground">
        Cargando archivos...
      </span>
    );
  } else if (archivosSubidos.length === 0) {
    archivosEnviadosContent = "No hay archivos enviados";
  } else {
    archivosEnviadosContent = (
      <ul className="list-disc pl-4">
        {archivosSubidos.map((archivo) => (
          <li key={archivo.documentoId} className="flex items-center gap-2">
            <span className="truncate">{archivo.documentoNombre}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Opciones">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() =>
                    handleDescargarDocumento(archivo.documentoLinkArchivo)
                  }
                >
                  <Download className="w-4 h-4 mr-2" /> Descargar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setConfirmDelete(archivo)}>
                  <Trash2 className="w-4 h-4 mr-2 text-red-600" /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
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
                <div className="px-4 py-3 text-gray-700">
                  {formatFecha(entregable.entregableFechaEnvio as string)}
                </div>
              </div>
              <div className="grid grid-cols-[220px_1fr] border-b">
                <div className="bg-gray-100 px-4 py-3 font-medium text-gray-800">
                  Archivos enviados
                </div>
                <div className="px-4 py-3 text-gray-700">
                  {archivosEnviadosContent}
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
          {dropzoneContent}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setSelectedEntregable?.(null)}
          >
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
      <Dialog
        open={!!confirmDelete}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              ¿Estás seguro de que deseas eliminar el archivo{" "}
              {confirmDelete?.documentoNombre}?
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 text-sm text-muted-foreground">
            Esta acción no se puede revertir.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancelar
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={async () => {
                if (confirmDelete) {
                  await handleEliminarDocumento(confirmDelete.documentoId);
                  setConfirmDelete(null);
                }
              }}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const estadoLabels: Record<string, string> = {
  no_enviado: "Pendiente",
  enviado_a_tiempo: "Enviado a tiempo",
  enviado_tarde: "Enviado tarde",
};

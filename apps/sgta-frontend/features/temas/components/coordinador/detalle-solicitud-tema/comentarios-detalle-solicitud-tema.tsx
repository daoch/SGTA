import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TypeSolicitud } from "@/features/temas/types/solicitudes/entities";
import { MessageSquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ComentariosDetalleSolicitudTemaProps {
  comentario: string;
  setComentario: (comentario: string) => void;
  errorComentario?: string;
  setErrorComentario?: (error: string) => void;
  setTipoSolicitud?: (tipo: TypeSolicitud) => void;
  errorTipoSolicitud?: string;
}

export const ComentariosDetalleSolicitudTema: React.FC<
  ComentariosDetalleSolicitudTemaProps
> = ({
  comentario,
  setComentario,
  errorComentario,
  setErrorComentario,
  setTipoSolicitud,
  errorTipoSolicitud,
}) => (
  <Card>
    {/* Header */}
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Comentarios del Comité
      </CardTitle>
      <CardDescription>
        Obligatorio para aprobar, rechazar u observar un tema.
      </CardDescription>
    </CardHeader>

    <CardContent>
      {/* Solicitud Type */}
      <Label htmlFor="tipo-comentario" className="mb-2 block">
        Tipo de Solicitud
      </Label>
      <Select
        onValueChange={(value) => {
          if (setTipoSolicitud) setTipoSolicitud(value as "titulo" | "resumen");
        }}
      >
        <SelectTrigger id="tipo-comentario" className="w-full mb-4">
          <SelectValue placeholder="Elegir tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="titulo">Cambio de título</SelectItem>
          <SelectItem value="resumen">Cambio de resumen</SelectItem>
        </SelectContent>
      </Select>
      {errorTipoSolicitud && (
        <p className="mt-1 text-sm text-red-600">{errorTipoSolicitud}</p>
      )}

      {/* Comment */}
      <Label htmlFor="comentario" className="mt-4 mb-2 block">
        Comentario
      </Label>
      <Textarea
        id="comentario"
        value={comentario}
        onChange={(e) => {
          setComentario(e.target.value);
          if (setErrorComentario && e.target.value.trim()) {
            setErrorComentario("");
          }
        }}
        className="min-h-[120px] mb-4"
        placeholder="Escriba su comentario aquí..."
      />
      {errorComentario && (
        <p className="mt-1 text-sm text-red-600">{errorComentario}</p>
      )}
    </CardContent>
  </Card>
);


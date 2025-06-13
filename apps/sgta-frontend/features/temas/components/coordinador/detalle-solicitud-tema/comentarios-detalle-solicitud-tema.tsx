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

const texts = {
  title: "Comentarios del Comité",
  description:
    "Ingrese el tipo de solicitud y un comentario para observar un tema te tesis.",
  comentario: {
    title: "Comentario",
    placeholder: "Escriba el comentario de la solicitud aquí ...",
    placeholderSinSolicitud: "Registre un comentario opcional ...",
  },
};

interface ComentariosDetalleSolicitudTemaProps {
  comentario: string;
  setComentario: (comentario: string) => void;
  errorComentario?: string;
  setErrorComentario?: (error: string) => void;
  setTipoSolicitud?: (tipo: TypeSolicitud) => void;
  errorTipoSolicitud?: string;
  comentarioOpcional?: boolean;
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
  comentarioOpcional,
}) => (
  <Card>
    {/* Header */}
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        {texts.title}
      </CardTitle>
      <CardDescription>{texts.description}</CardDescription>
    </CardHeader>

    <CardContent>
      {/* Solicitud Type */}
      <Label htmlFor="tipo-comentario" className="mb-2 block">
        Tipo de Solicitud
      </Label>
      <Select
        onValueChange={(value) => {
          if (setTipoSolicitud) setTipoSolicitud(value as TypeSolicitud);
        }}
      >
        <SelectTrigger id="tipo-comentario" className="w-full mb-4">
          <SelectValue placeholder="Elegir tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no-enviar">Sin solicitud</SelectItem>
          <SelectItem value="titulo">Cambio de título</SelectItem>
          <SelectItem value="resumen">Cambio de resumen</SelectItem>
        </SelectContent>
      </Select>
      {errorTipoSolicitud && (
        <p className="mt-1 text-sm text-red-600">{errorTipoSolicitud}</p>
      )}

      {/* Comment */}
      <Label htmlFor="comentario" className="mt-4 mb-2 block">
        {texts.comentario.title}
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
        placeholder={
          comentarioOpcional
            ? texts.comentario.placeholderSinSolicitud
            : texts.comentario.placeholder
        }
      />
      {errorComentario && (
        <p className="mt-1 text-sm text-red-600">{errorComentario}</p>
      )}
    </CardContent>
  </Card>
);


import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

interface ComentariosDetalleSolicitudTemaProps {
  comentario: string;
  setComentario: (comentario: string) => void;
  errorComentario?: string;
  setErrorComentario?: (error: string) => void;
}

export const ComentariosDetalleSolicitudTema: React.FC<
  ComentariosDetalleSolicitudTemaProps
> = ({ comentario, setComentario, errorComentario, setErrorComentario }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Comentarios del Comité
      </CardTitle>
      <CardDescription>
        Obligatorio para aprobar, rechazar u observar
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Label htmlFor="comentario">Comentario</Label>
      <Textarea
        id="comentario"
        value={comentario}
        onChange={(e) => {
          setComentario(e.target.value);
          if (setErrorComentario && e.target.value.trim()) {
            setErrorComentario("");
          }
        }}
        className="min-h-[120px]"
      />
      {errorComentario && (
        <p className="mt-1 text-sm text-red-600">{errorComentario}</p>
      )}
    </CardContent>
  </Card>
);

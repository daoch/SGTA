import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, AlertTriangle, Eye } from "lucide-react";

interface TemaRelacionado {
  id: string;
  titulo: string;
  similitud: number;
}

interface AnalisisSimilitudTemaProps {
  similitud: {
    porcentaje: number;
    temasRelacionados: TemaRelacionado[];
  };
}

export const AnalisisSimilitudTema: React.FC<AnalisisSimilitudTemaProps> = ({
  similitud,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Target className="w-5 h-5" />
        Análisis de Similitud
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <Alert>
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription>
          Este tema presenta un <strong>{similitud.porcentaje}%</strong> de
          similitud con otros previamente aprobados. Revise antes de tomar una
          decisión.
        </AlertDescription>
      </Alert>
      <div className="space-y-3">
        {similitud.temasRelacionados.map((tema, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div>
              <p className="font-medium">{tema.titulo}</p>
              <p className="text-xs text-gray-500">ID: {tema.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{tema.similitud}%</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`/temas/${tema.id}`, "_blank")}
              >
                <Eye className="w-4 h-4 mr-1" />
                Ver
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

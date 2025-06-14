import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, AlertTriangle, Eye } from "lucide-react";
import { TemaSimilar } from "@/features/temas/types/solicitudes/entities";

interface AnalisisSimilitudTemaProps {
  similares: TemaSimilar[] | [];
}

const texts = {
  title: "Análisis de Similitud",
  defaultDescription:
    "No se encontraron temas similares. Puede solicitar una nueva revisión.",
  similitudDescription: (promedioPorcentajes: string) => (
    <>
      Este tema presenta un <strong>{promedioPorcentajes}%</strong> de similitud
      con otros previamente aprobados. Revise antes de tomar una decisión.
    </>
  ),
};

export const AnalisisSimilitudTema: React.FC<AnalisisSimilitudTemaProps> = ({
  similares,
}) => {
  const promedioPorcentajes =
    similares.length > 0
      ? (
          similares.reduce(
            (acc, tema) => acc + (tema.porcentajeSimilitud ?? 0),
            0,
          ) / similares.length
        ).toFixed(1)
      : "0";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          {texts.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          {similares.length > 0 ? (
            <>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                {texts.similitudDescription(promedioPorcentajes)}
              </AlertDescription>
            </>
          ) : (
            <AlertDescription>{texts.defaultDescription}</AlertDescription>
          )}
        </Alert>
        <div className="space-y-3">
          {similares.map((tema, idx) => (
            <div
              key={tema.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">{tema.titulo}</p>
                <p className="text-xs text-gray-500">ID: {tema.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{tema.porcentajeSimilitud}%</Badge>
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
};


"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader as CardHeaderUI, CardTitle } from "@/components/ui/card";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { TemaSimilar } from "@/features/temas/components/alumno/formulario-propuesta";
import { AlertTriangle, ExternalLink, User, Users } from "lucide-react";

interface PropuestasSimilaresCardProps {
  propuestas: TemaSimilar[];
  onCancel: () => void;
  onContinue: () => void;
  checkingSimilitud: boolean;
}

function getSimilarityColor(similarity: number) {
  if (similarity >= 90) return "bg-red-100 text-red-800 border-red-200";
  if (similarity >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-green-100 text-green-800 border-green-200";
}

function getSimilarityIcon(similarity: number) {
  if (similarity >= 90) return <AlertTriangle className="w-4 h-4 mr-1" />;
  return null;
}

export default function PropuestasSimilaresCard({
  propuestas,
  onCancel,
  onContinue,
  checkingSimilitud,
}: PropuestasSimilaresCardProps) {
  return (
    <div className="p-0">
      <DialogHeader className="flex-shrink-0 px-6 pt-1">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          <div>
            <DialogTitle className="text-xl font-semibold">Temas Similares Encontrados</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Se encontraron {propuestas.length} temas similares a tu propuesta. Por favor, revisa antes de continuar.
            </p>
          </div>
        </div>
      </DialogHeader>
      <DialogDescription />

      <div className="flex-1 overflow-y-auto px-6 max-h-[60vh] mt-6 flex flex-col items-center">
        {propuestas.map((sim) => {
          const tesistas =
            sim.tema.tesistas && sim.tema.tesistas.length > 0
              ? sim.tema.tesistas.map(
                  (t) => `${t.nombres?.split(" ")[0] || ""} ${t.primerApellido || ""}`.trim()
                )
              : [];
          const asesores =
            sim.tema.coasesores && sim.tema.coasesores.length > 0
              ? sim.tema.coasesores.map(
                  (a) => `${a.nombres?.split(" ")[0] || ""} ${a.primerApellido || ""}`.trim()
                )
              : [];
          const anio = sim.tema.fechaCreacion ? new Date(sim.tema.fechaCreacion).getFullYear() : null;
          const area = sim.tema.area?.nombre || null;

          return (
            <Card key={sim.tema.id} className="w-full max-w-2xl mx-auto mb-4">
              <CardHeaderUI className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-3">{sim.tema.titulo}</CardTitle>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="outline" className={`${getSimilarityColor(sim.similarityScore)} font-medium`}>
                        {getSimilarityIcon(sim.similarityScore)}
                        Similitud: {sim.similarityScore}%
                      </Badge>
                      {sim.tema.codigo && (
                        <Badge variant="secondary" className="text-xs">
                          {sim.tema.codigo}
                        </Badge>
                      )}
                      {anio && (
                        <Badge variant="secondary" className="text-xs">
                          {anio}
                        </Badge>
                      )}
                      {area && (
                        <Badge variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeaderUI>

              <CardContent className="pt-0 pb-0">
                <div className="grid md:grid-cols-2 gap-2 mb-2">
                  <div>
                  <div className="flex items-center gap-2 text-sm leading-none mb-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Tesistas:</span>
                  </div>
                  <div className="pl-6 -mt-1">
                    {tesistas.length > 0
                      ? tesistas.map((tesista, idx) => (
                          <div key={idx} className="text-sm text-muted-foreground leading-tight">
                            {tesista}
                          </div>
                        ))
                      : <span className="text-sm text-muted-foreground leading-tight">No registrado</span>}
                  </div>
                </div>

                  <div className="space-y-0.0">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Asesores/Coasesores:</span>
                    </div>
                    <div className="pl-6">
                      {asesores.length > 0
                        ? asesores.map((asesor, idx) => (
                            <div key={idx} className="text-sm text-muted-foreground">
                              {asesor}
                            </div>
                          ))
                        : <span className="text-sm text-muted-foreground">No registrado</span>}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">URL:</span>
                  </div>
                  {sim.tema.portafolioUrl ? (
                    <a
                      href={sim.tema.portafolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline break-all pl-6"
                    >
                      {sim.tema.portafolioUrl}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground pl-6">No registrado</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex-shrink-0 flex justify-end gap-3 pt-4 border-t px-6 pb-4">
        <Button
          type="button"
          className="bg-[#042354] text-white"
          onClick={onCancel}
          disabled={checkingSimilitud}
        >
          Revisar Propuesta
        </Button>

        <Button
          type="button"
          className="bg-[#042354] text-white"
          onClick={onContinue}
          disabled={checkingSimilitud}
        >
          {checkingSimilitud ? "Guardando..." : "Continuar de Todas Formas"}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { guardarNota, listarCriterioEntregablesNotas, RevisionCriterioEntregableDto } from "../servicios/revision-service";


// interface RubricaItem {
//   id: string
//   rubro: string
//   nivelDeseado: string
//   puntajeMaximo: number
//   nota: number
//   comentario: string
// };

interface RubricaEvaluacionProps {
  revisionId: number,
  //onComplete: () => void
  onCancel: () => void
};

export function RubricaEvaluacion({ revisionId, onCancel }: RubricaEvaluacionProps) {
  const onComplete = () => {
    async function postNotas() {
      try {
        await guardarNota(rubricaItems);
      } catch (e) {
        console.log(e);
      }
    }
    postNotas().then(() => {
      onCancel();
    });
  };
  const [rubricaItems, setRubricaItems] = useState<RevisionCriterioEntregableDto[]>([]);

  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  const handleNotaChange = (id: number, nota: number) => {
    setRubricaItems(
      rubricaItems.map((item) => (item.id === id ? { ...item, nota: Math.min(nota, item.notaMaxima) } : item)),
    );

    // Update completed items based on nota
    if (nota > 0) {
      setCompletedItems((prev) => {
        const newSet = new Set(prev);
        newSet.add(id.toString());
        return newSet;
      });
    } else {
      setCompletedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id.toString());
        return newSet;
      });
    }
  };

  const handleComentarioChange = (id: number, observacion: string) => {
    setRubricaItems(rubricaItems.map((item) => (item.id === id ? { ...item, observacion } : item)));
    console.log(id);
    //console.log(comentario);
    const item = rubricaItems.find((i) => i.id === id);
    if (item && item.nota && item.nota > 0) {
      setCompletedItems((prev) => {
        const newSet = new Set(prev);
        newSet.add(id.toString());
        return newSet;
      });
    } else {
      setCompletedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id.toString());
        return newSet;
      });
    }
  };

  const isComplete = rubricaItems.every((item) => item.nota && item.nota > 0);

  useEffect(() => {
    async function fetchCriteriosEntData() {
      try {
        const data = await listarCriterioEntregablesNotas(revisionId);
        setRubricaItems(data);
      } catch {
        console.log("Error al cargar los alumnos de la revisión");
      }
    }
    fetchCriteriosEntData();
  }, []);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-pucp-blue">Rúbrica de Evaluación</h2>
          <p className="text-muted-foreground">Entregable: {rubricaItems.length > 0 ? rubricaItems[0].entregable_descripcion : ""}</p>
        </div>
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          {completedItems.size}/{rubricaItems.length} criterios evaluados
        </Badge>
      </div>

      <div className="flex items-center justify-between mb-4 p-4 bg-muted rounded-lg">
        <div>
          <h3 className="font-medium">Puntuación Total</h3>
          <p className="text-sm text-muted-foreground">
            {rubricaItems.reduce((sum, item) => sum + (item.nota ? item.nota : 0), 0).toFixed(1)} /{" "}
            {rubricaItems.reduce((sum, item) => sum + item.notaMaxima, 0)} puntos
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          {(
            (rubricaItems.reduce((sum, item) => sum + (item.nota ? item.nota : 0), 0) /
              rubricaItems.reduce((sum, item) => sum + item.notaMaxima, 0)) *
            100
          ).toFixed(1)}
          %
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-0">
          {/* <p className="mb-4">
            Por favor, evalúe cada criterio de la rúbrica proporcionando comentarios constructivos. Puede expandir cada
            sección para ver el nivel deseado.
          </p> */}

          <Accordion type="single" collapsible className="w-full">
            {rubricaItems.map((item) => (
              <AccordionItem key={item.id} value={item.id.toString()}>
                <AccordionTrigger className="flex">
                  <div className="flex justify-between w-full">
                    <div className="flex items-center gap-2 text-left">
                      <span>{item.nombre}</span>
                      {completedItems.has(item.id.toString()) && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <Badge variant="outline" className="ml-0 right">
                      {item.notaMaxima} pts
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="rounded-md bg-muted p-4 text-sm">
                      <h4 className="font-medium mb-2">Descripción:</h4>
                      <p className="whitespace-pre-line">{item.descripcion}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Comentario:</h4>
                      <Textarea
                        placeholder="Ingrese su evaluación para este criterio..."
                        value={item.observacion ?? ""}
                        onChange={(e) => handleComentarioChange(item.id, e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Nota:</h4>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max={item.notaMaxima}
                          step="0.1"
                          placeholder="0.0"
                          value={item.nota || ""}
                          onChange={(e) => handleNotaChange(item.id, Number.parseFloat(e.target.value) || 0)}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">/ {item.notaMaxima} pts</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button className="bg-pucp-blue hover:bg-pucp-light" onClick={onComplete} disabled={!isComplete}>
          {isComplete ? "Finalizar Evaluación" : `Faltan ${rubricaItems.length - completedItems.size} criterios`}
        </Button>
      </div>
    </div>
  );
}

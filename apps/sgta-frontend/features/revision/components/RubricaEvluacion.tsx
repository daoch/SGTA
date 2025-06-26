"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { guardarNota, listarCriterioEntregablesNotas, RevisionCriterioEntregableDto } from "../servicios/revision-service"


interface RubricaItem {
  id: string
  rubro: string
  nivelDeseado: string
  puntajeMaximo: number
  nota: number
  comentario: string
}

interface RubricaEvaluacionProps {
  revisionId: number,
  //onComplete: () => void
  onCancel: () => void
}

export function RubricaEvaluacion({ revisionId,onCancel }: RubricaEvaluacionProps) {
  // Datos de ejemplo para la rúbrica del E1
//   const [rubricaItems, setRubricaItems] = useState<RubricaItem[]>([
//     {
//       id: "problematica",
//       rubro: "Problemática",
//       nivelDeseado:
//         "El estudiante contextualiza claramente el problema, respaldando y justificando fuertemente la ejecución de su proyecto, el cual tiene como objetivo desarrollar una propuesta de solución a la problemática u oportunidad de innovación que ha sido identificada.\n\nEsta es una descripción responde a las preguntas:\n- ¿Qué problema busca resolver?\n- ¿Qué resultado espera lograr?\n- ¿Qué métodos y procedimientos espera usar?",
//       puntajeMaximo: 3,
//       nota: 0,
//       comentario: "",
//     },
//     {
//       id: "literatura",
//       rubro: "Revisión de la literatura y Estado del arte",
//       nivelDeseado:
//         "El estudiante explica de forma resumida el método empleado para la revisión. El estudiante ha realizado una revisión extensa de las fuentes que son relevantes para el desarrollo de su proyecto. Realiza una apropiada citación de los estudios más pertinentes en el campo, incluyendo artículos científicos y tesis previamente realizadas. En el caso de proyectos enfocados al desarrollo de software, establece un análisis comparativo de productos similares que existen en el mercado, e indica los aspectos que diferencian a su propuesta, justificando en base a esta revisión que su proyecto es innovador, original, correcto, novedoso y suficientemente complejo como para ser un proyecto de fin de carrera de pregrado. Establece una eficiente síntesis y organización de la literatura que está claramente vinculada al problema u oportunidad de innovación. El estudiante utiliza la revisión de la literatura para fundamentar el desarrollo de su propuesta.",
//       puntajeMaximo: 3,
//       nota: 0,
//       comentario: "",
//     },
//     {
//       id: "objetivos",
//       rubro: "Objetivo General y Específicos",
//       nivelDeseado:
//         "Los objetivos guardan relación con la problemática principal, identificada a través de alguna de las técnicas para el planteamiento del problema como: árbol de problema, y el desarrollo de la propuesta de solución. Son entendibles, claros y bien delimitados. El objetivo general indica lo que se pretende alcanzar en el proyecto.\n\nLos objetivos específicos indican lo que se pretende realizar en cada una de las etapas del proceso de investigación.\n\nTanto el objetivo principal como los específicos responden a lo que se quiere alcanzar y lo que se desea lograr.\n\nExiste congruencia entre objetivo general y específicos.",
//       puntajeMaximo: 3,
//       nota: 0,
//       comentario: "",
//     },
//     {
//       id: "resultados",
//       rubro: "Resultados Esperados",
//       nivelDeseado:
//         "Los resultados están organizados apropiadamente en función de los objetivos, la solución propuesta y el planteamiento teórico que lo sustenta. Están convenientemente redactados.\n\nSe han establecido correctamente los medios de verificación en la tabla de mapeo de los resultados.",
//       puntajeMaximo: 3,
//       nota: 0,
//       comentario: "",
//     },
//     {
//       id: "cronograma",
//       rubro: "Cronograma de trabajo en el curso",
//       nivelDeseado:
//         "El estudiante presenta y justifica el cronograma propuesto en conjunto con su asesor para desarrollar los entregables del curso y que se utilizará para revisar sus avances en las exposiciones de clase.\n\nEn este cronograma se puede plantear el cambio de orden (no de fechas) en la entrega de entregables del curso siempre y cuando los justifique su asesor. Esta decisión debe ser respaldada por el asesor.",
//       puntajeMaximo: 4,
//       nota: 0,
//       comentario: "",
//     },
//     {
//       id: "redaccion",
//       rubro: "Redacción, estilo y formato",
//       nivelDeseado:
//         "La redacción es fluida, clara, concisa y entendible. La gramática y ortografía son correctas. No hay errores. Existe transiciones claras entre capítulos y párrafos (o cualquier división que se utilice). Se aplica apropiadamente el formato de citación en el texto y bibliografía con referencias correctamente descritas en todo el documento.",
//       puntajeMaximo: 4,
//       nota: 0,
//       comentario: "",
//     },
//   ])


    const onComplete = ()=>{
        async function postNotas() {
            try {
              const data = await guardarNota(rubricaItems);
            } catch(e) {
              console.log(e);
            }
          }
        postNotas().then(()=>{
            onCancel();
        });
    }
  const [rubricaItems, setRubricaItems] = useState<RevisionCriterioEntregableDto[]>([]);
  
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set())

  const handleNotaChange = (id: number, nota: number) => {
    setRubricaItems(
      rubricaItems.map((item) => (item.id === id ? { ...item, nota: Math.min(nota, item.notaMaxima) } : item)),
    )

    // Update completed items based on nota
    if (nota > 0) {
      setCompletedItems((prev) => {
        const newSet = new Set(prev)
        newSet.add(id.toString())
        return newSet
      })
    } else {
      setCompletedItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id.toString())
        return newSet
      })
    }
  }

  const handleComentarioChange = (id: number, comentario: string) => {
    setRubricaItems(rubricaItems.map((item) => (item.id === id ? { ...item, comentario } : item)))
    console.log(id);
    //console.log(comentario);
    const item = rubricaItems.find((i) => i.id === id)
    if (item && item.nota && item.nota > 0) {
      setCompletedItems((prev) => {
        const newSet = new Set(prev)
        newSet.add(id.toString())
        return newSet
      })
    } else {
      setCompletedItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id.toString())
        return newSet
      })
    }
  }

  const isComplete = rubricaItems.every((item) => item.nota && item.nota > 0)

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
          <p className="text-muted-foreground">Entregable: {rubricaItems.length>0? rubricaItems[0].entregable_descripcion :""}</p>
        </div>
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          {completedItems.size}/{rubricaItems.length} criterios evaluados
        </Badge>
      </div>

      <div className="flex items-center justify-between mb-4 p-4 bg-muted rounded-lg">
        <div>
          <h3 className="font-medium">Puntuación Total</h3>
          <p className="text-sm text-muted-foreground">
            {rubricaItems.reduce((sum, item) => sum + (item.nota? item.nota:0) , 0).toFixed(1)} /{" "}
            {rubricaItems.reduce((sum, item) => sum + item.notaMaxima, 0)} puntos
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          {(
            (rubricaItems.reduce((sum, item) => sum + (item.nota? item.nota:0), 0) /
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
                        value={item.observacion?item.observacion:""}
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
  )
}

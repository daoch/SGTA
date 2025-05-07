"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { CalificacionItem } from "../../components/item-calificacion";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

const criterios = [
  {
    titulo: "Nivel de avance",
    descripcion:
      "El estudiante expone el progreso alcanzado según el cronograma propuesto y justifica los posibles desfases.",
  },
  {
    titulo: "Presentación",
    descripcion:
      "La exposición es clara, estructurada, con uso adecuado de recursos visuales y manejo del tiempo asignado.",
  },
  {
    titulo: "Dominio del tema",
    descripcion:
      "El estudiante demuestra conocimiento profundo del tema, maneja con solvencia los conceptos clave y responde adecuadamente a las preguntas del jurado.",
  },
  {
    titulo: "Claridad y coherencia",
    descripcion:
      "La argumentación es lógica, coherente y fácil de seguir, manteniendo el hilo conductor de la investigación.",
  },
  {
    titulo: "Aporte del trabajo",
    descripcion:
      "Se identifica claramente el aporte original del trabajo, su relevancia y aplicabilidad en el campo de estudio.",
  },
];

type Props = {
  id_exposicion: string;
};

const CalificarExposicionJuradoPage: React.FC<Props> = ({ id_exposicion }) => {
  return (
    <div className="p-2 w-full mx-auto space-y-6">
      <h1 className="text-2xl font-bold">
        Registro de Observaciones del Tema de Proyecto
      </h1>

      <Label>Título del Proyecto</Label>
      <Input
        disabled
        value="Generación de imágenes de acciones específicas de una persona utilizando aprendizaje profundo"
      />

      <Label>Título del Descripción</Label>
      <Textarea
        disabled
        value={
          "Desde que aparecieron las redes GAN, se han realizado varias investigaciones sobre cómo generar imágenes en diversos ámbitos, como la generación de imágenes, conversión de imágenes, síntesis de videos, síntesis de imágenes a partir de textos y predicción de cuadros de videos. Basándose mayormente en mejorar la generación de imágenes de alta resolución y la reconstrucción o predicción de datos. El propósito de este trabajo es implementar las redes GAN en otros ámbitos, como la generación de imágenes de entidades."
        }
      />

      <Label>Estudiantes</Label>
      <div className="flex items-center gap-2 flex-1 justify-start">
        <Avatar>
          <AvatarFallback>TS</AvatarFallback>
        </Avatar>
        <span>Diego Ochoa</span>
      </div>

      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold">Criterios de Calificación</h1>
        {criterios.map((criterio, index) => (
          <CalificacionItem
            key={index}
            titulo={criterio.titulo}
            descripcion={criterio.descripcion}
          />
        ))}
      </div>
      <div className="border rounded-2xl p-4 space-y-2 shadow-sm">
        <Label className="text-lg font-semibold">Observaciones Finales</Label>
        <Textarea placeholder="Escribe tus observaciones aquí" />
      </div>
      <div className="flex justify-center gap-4">
        <Button variant="destructive" onClick={() => {}}>
          <X />
          Cancelar
        </Button>

        <Button onClick={() => {}}>
          <Save />
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default CalificarExposicionJuradoPage;

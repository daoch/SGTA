"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { AlertTriangle } from "lucide-react";

const propuestasSimilares = [
  {
    titulo: "Sistema de reconocimiento facial para control de asistencia",
    anio: 2013,
    similitud: 82,
  },
  {
    titulo: "Análisis de sentimientos en redes sociales para marketing",
    anio: 2023,
    similitud: 61,
  },
  {
    titulo: "Plataforma de gestión de proyectos académicos",
    anio: 2024,
    similitud: 47,
  },
  {
    titulo: "Sistema de detección de fraudes en transacciones financieras",
    anio: 2020,
    similitud: 88,
  },
  {
    titulo: "Desarrollo de un asistente virtual para atención al cliente",
    anio: 2020,
    similitud: 53,
  },
];

function getColorClass(similitud: number) {
  if (similitud >= 80) return "text-red-600";
  if (similitud >= 30) return "text-yellow-600";
  return "text-green-600";
}

export default function PropuestasSimilaresCard() {
  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-xl">
      <div className="flex items-center gap-2 text-red-600 font-semibold text-lg">
        <AlertTriangle className="h-5 w-5" />
        Se han encontrado propuestas similares
      </div>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        Hemos detectado que tu propuesta tiene similitudes con los siguientes proyectos de fin de carrera existentes. Revisa las coincidencias antes de continuar.
      </p>

      <div className="space-y-2">
        {propuestasSimilares.map((p, idx) => (
          <div
            key={idx}
            className="flex justify-between items-start p-3 bg-gray-50 border rounded-md"
          >
            <div>
              <p className="text-sm font-medium">{p.titulo}</p>
              <p className={clsx("text-xs font-semibold", getColorClass(p.similitud))}>
                Similitud: {p.similitud}%
              </p>
            </div>
            <span className="text-sm text-muted-foreground">{p.anio}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline">Continuar de todos modos</Button>
        <Button className="bg-blue-900 text-white hover:bg-blue-950">Cancelar</Button>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Eye } from "lucide-react";
import Link from "next/link";
import { ExposicionAlumno } from "../types/exposicion.types";

export function ExposicionCard({
  exposicion,
}: {
  exposicion: ExposicionAlumno;
}) {
  //separamos los miembros del jurado en dos grupos: asesor y jurados
  const getAsesor = () =>
    exposicion.miembrosJurado.filter((m) => m.tipo.toLowerCase() === "asesor");
  const getJurados = () =>
    exposicion.miembrosJurado.filter((m) => m.tipo.toLowerCase() === "jurado");

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm border p-5 flex flex-col md:flex-row gap-10">
      {/*HORA FECHA Y SALA*/}
      <div className="flex flex-col items-center space-y-2 md:min-w-[150px] justify-center">
        <div className="text-4xl font-semibold">
          {exposicion.datetimeInicio.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-base">
            {exposicion.datetimeFin.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="h-6 w-6" />
          <span className="text-2xl font-semibold">{exposicion.sala}</span>
        </div>
      </div>

      {/*TITULO Y JURADOS*/}
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold">{exposicion.titulo}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {getAsesor().map((asesor, index) => (
            <div key={asesor.id_persona} className="flex items-center gap-2">
              <div className="bg-gray-100 p-1 rounded-full">
                <User className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <div className="text-base font-medium  text-gray-800">
                  {index === 0 ? "Asesor" : "Coasesor"}
                </div>
                <div className="text-base">{asesor.nombre}</div>
              </div>
            </div>
          ))}

          {getJurados().map((jurado, index) => (
            <div key={jurado.id_persona} className="flex items-center gap-2">
              <div className="bg-gray-100 p-1 rounded-full">
                <User className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <div className="text-base font-medium  text-gray-800">
                  Jurado {index + 1}
                </div>
                <div className="text-base">{jurado.nombre}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*botnes de la derecha*/}
      <div className="flex flex-col md:items-end gap-3 place-content-between">
        <Badge
          variant="outline"
          className={`
            ${exposicion.estado === "programada" ? "bg-[#F9D534] text-white border-yellow-200" : ""}
            ${exposicion.estado === "completada" ? "bg-[#00BF82] text-white border-green-200" : ""}
            ${exposicion.estado === "calificada" ? "bg-red-100 text-red-800 border-red-200" : ""}
            capitalize px-2 py-1 text-sm rounded-full
          `}
        >
          {exposicion.estado}
        </Badge>
        <Button
          asChild
          variant="outline"
          size="default"
          className="text-xm flex items-center gap-1"
        >
          <Link
            href={`/alumno/mi-proyecto/exposiciones/${exposicion.exposicionId}`}
          >
            <Eye className="h-6 w-6" />
            Ver Detalles
          </Link>
        </Button>
      </div>
    </div>
  );
}

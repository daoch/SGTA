"use client";

import {
  Coasesor,
  Tema,
  Tesista,
} from "@/features/temas/types/temas/entidades";
import { Calendar, FileText, Target, User } from "lucide-react";

interface DetalleTemaProps {
  tema?: Tema;
}

export function DetalleTema({ tema }: DetalleTemaProps) {
  const nombreTesistas = tema?.tesistas
    ?.map(
      (t: Tesista) =>
        `${t.nombres} ${t.primerApellido}${t.segundoApellido ? " " + t.segundoApellido : ""}`,
    )
    .join(", ");
  console.log(tema);

  // Separa asesores y coasesores
  const asesores = tema?.coasesores?.[0] ? [tema.coasesores[0]] : [];
  const coasesores = tema?.coasesores?.slice(1) ?? [];

  const nombresAsesores =
    asesores
      ?.map(
        (a: Coasesor) =>
          `${a.nombres} ${a.primerApellido}${a.segundoApellido ? " " + a.segundoApellido : ""}`,
      )
      .join(", ") || "No hay asesor asignado";

  const nombresCoasesores =
    coasesores
      .map(
        (a: Coasesor) =>
          `${a.nombres} ${a.primerApellido}${a.segundoApellido ? " " + a.segundoApellido : ""}`,
      )
      .join(", ") || "No coasesor(es) asignados";

  const estadoColor =
    tema?.estadoTemaNombre === "REGISTRADO"
      ? "bg-green-100 text-green-700"
      : tema?.estadoTemaNombre === "INSCRITO"
        ? "bg-purple-100 text-purple-700"
        : "bg-gray-100 text-gray-700";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-3 flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">
            {tema?.titulo}
          </h1>
          <div className="flex items-center gap-3 mb-5">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoColor}`}
            >
              {tema?.estadoTemaNombre}
            </span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
              #{tema?.codigo}
            </span>
          </div>
          <div className="space-y-4 text-sm text-gray-700 mb-2">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-semibold">Estudiantes:</span>
              <span className="ml-1">{nombreTesistas}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-semibold">Asesores:</span>
              <span className="ml-1">{nombresAsesores}</span>
              {coasesores.length > 0 && (
                <>
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold ml-4">Coasesores:</span>
                  <span className="ml-1">{nombresCoasesores}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-semibold">Fecha:</span>
              <span className="ml-1">
                {tema?.fechaCreacion
                  ? new Date(tema?.fechaCreacion).toLocaleDateString("es-PE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="font-semibold mb-3 flex items-center gap-2 text-gray-900 text-base">
            Información del Tema
          </div>
          <div className="mb-4">
            <div className="font-semibold flex items-center gap-2 mb-1 text-gray-800">
              <FileText className="w-4 h-4" />
              Area del proyecto
            </div>
            <div className="text-gray-700 text-sm">
              {tema?.subareas[0]?.areaConocimiento?.nombre || "No especificado"}
            </div>
          </div>
          <div className="mb-4">
            <div className="font-semibold flex items-center gap-2 mb-1 text-gray-800">
              <FileText className="w-4 h-4" />
              Subáreas del proyecto
            </div>
            <div className="text-gray-700 text-sm">
              {tema?.subareas?.map((s) => s.nombre).join(", ")}
            </div>
          </div>
          <div className="mb-4">
            <div className="font-semibold flex items-center gap-2 mb-1 text-gray-800">
              <FileText className="w-4 h-4" />
              Resumen del proyecto
            </div>
            <div className="text-gray-700 text-sm">{tema?.resumen}</div>
          </div>
          <div>
            <div className="font-semibold flex items-center gap-2 mb-1 text-gray-800">
              <Target className="w-4 h-4" />
              Objetivos del proyecto
            </div>
            <div className="text-gray-700 text-sm">{tema?.objetivos}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

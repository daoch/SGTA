"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

import { ArrowLeft, CircleUserRound } from "lucide-react";
import { TesisAsignadaDetalle } from "@/features/jurado/types/juradoDetalle.types";
import { cn } from "@/lib/utils";

// Datos de ejemplo (en producción, estos vendrían de una API)
const tesisData: Record<string, TesisAsignadaDetalle> = {
  INF0501: {
    titulo:
      "Aplicación de Deep Learning para la detección y clasificación automática de insectos agrícolas en trampas pegantes",
    codigo: "INF0501",
    estudiante: "Angel Malpartida",
    codEstudiante: "20201242",
    resumen:
      "El presente trabajo de investigación busca hacer una revisión sistemática sobre las técnicas actuales que se usan para solucionar problemas de identificación y clasificación de plagas de insectos...",
    especialidades: ["Desarrollo Web", "Backend"],
    curso: "Proyecto de Fin de Carrera 1",
    periodo: "2025-1",
    rol: "Jurado",
    estado: "En Desarrollo",
    area: "Ciencias de la Computación",
    fechaCreacion: "19/10/2023",
    fechaAprobacion: "24/10/2023",
    asesor: "Edwin Villanueva",
    coasesor: "Freddy Paz",
    jurados: [
      { nombre: "Fernando Contreras", id: "FC001" },
      { nombre: "María Rodríguez", id: "MR002" },
    ],
    exposiciones: [
      {
        id: "EXP001",
        titulo: "Exposición de Avance 1 de Proyecto de Fin de Carrera 1",
        fecha: "19/03/2024",
        hora: "10:00",
        lugar: "Aula Virtual",
        estado: "Completada",
        curso: "Proyecto de Fin de Carrera 1",
      },
      {
        id: "EXP002",
        titulo: "Exposición de Avance 2 de Proyecto de Fin de Carrera 1",
        fecha: "21/04/2024",
        hora: "10:00",
        lugar: "Aula Virtual",
        estado: "Completada",
        curso: "Proyecto de Fin de Carrera 1",
      },
      {
        id: "EXP003",
        titulo: "Exposición Parcial de Proyecto de Fin de Carrera 1",
        fecha: "14/06/2024",
        hora: "20:00",
        lugar: "Aula Presencial V201",
        estado: "Completada",
        curso: "Proyecto de Fin de Carrera 1",
      },
    ],
  },
  INF1643: {
    titulo:
      "Identificación del nivel de complejidad de texto para el entrenamiento de chatbots basado en Machine Learning",
    codigo: "INF1643",
    estudiante: "José Morales Pariona",
    codEstudiante: "20105420",
    resumen:
      "El nivel de complejidad textual puede ser un inconveniente para algunas personas al momento de usar Chatbots, debido a que estos programas podrían dar respuestas cuyo nivel de complejidad no sea el que entienda el usuario. Entonces, aquellos Chatbots deberían ser entrenados con un conjunto de datos cuya complejidad textual sea la deseada, para evitar confusiones con los usuarios. Para ello, se define una revisión sistemática, en la cual se usan las bases de datos de Google Scholar, ACM Digital Library e IEEE Xplore, de las cuáles se obtiene la información necesaria empleando las palabras claves definidas.",
    especialidades: ["Ciencias de la Computación"],
    curso: "Proyecto de Fin de Carrera 2",
    periodo: "2025-1",
    rol: "Jurado",
    estado: "En Desarrollo",
    area: "Ciencias de la Computación",
    fechaCreacion: "19/10/2023",
    fechaAprobacion: "24/10/2023",
    asesor: "Edwin Villanueva",
    coasesor: "Freddy Paz",
    jurados: [{ nombre: "Fernando Contreras", id: "FC001" }],
    exposiciones: [],
  },
};

type TabType = "informacion" | "historial" | "exposiciones";

export function DetalleTesisJuradoView() {
  const params = useParams();
  const router = useRouter();
  const codigoTesis = params?.id as string;
  //const detalleJurado = params?.detalleJurado as string;
  const [activeTab, setActiveTab] = useState<TabType>("informacion");
  
  const idNumerico = Number(params?.id);
  //llamar al listar usando el idNumerico
  const tesis = tesisData[codigoTesis];

  if (!tesis) {
    return <p>Tesis no encontrada</p>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center text-black hover:text-gray-600 w-8 h-8 mr-2"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[#042354] font-montserrat text-[24px] font-semibold leading-[32px] tracking-[-0.144px]">
          Detalle del Tema
        </h1>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b mb-4">
        <button
          className={cn(
            "flex-1 py-2 px-4 text-center",
            activeTab === "informacion"
              ? "bg-white border border-b-0 border-gray-200 rounded-t-lg"
              : "bg-gray-50 hover:bg-gray-100",
          )}
          onClick={() => setActiveTab("informacion")}
        >
          Información
        </button>
        <button
          className={cn(
            "flex-1 py-2 px-4 text-center",
            activeTab === "historial"
              ? "bg-white border border-b-0 border-gray-200 rounded-t-lg"
              : "bg-gray-50 hover:bg-gray-100",
          )}
          onClick={() => setActiveTab("historial")}
        >
          Historial de Cambios
        </button>
        <button
          className={cn(
            "flex-1 py-2 px-4 text-center",
            activeTab === "exposiciones"
              ? "bg-white border border-b-0 border-gray-200 rounded-t-lg"
              : "bg-gray-50 hover:bg-gray-100",
          )}
          onClick={() => setActiveTab("exposiciones")}
        >
          Detalle de Exposiciones
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg">
        {activeTab === "informacion" && (
          <div>
            <div className="grid grid-cols-12 gap-6 mb-6">
              <div className="col-span-3">
                <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-[14px] font-medium leading-[14px]">
                  Código
                </p>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 font-normal">
                  {tesis.codigo}
                </div>
              </div>
              <div className="col-span-9">
                <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-[14px] font-medium leading-[14px]">
                  Título
                </p>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 font-normal">
                  {tesis.titulo}
                </div>
              </div>

              <div className="col-span-3">
                <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-[14px] font-medium leading-[14px]">
                  Curso
                </p>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 font-normal">
                  {tesis.curso}
                </div>
              </div>
              <div className="col-span-9">
                <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-[14px] font-medium leading-[14px]">
                  Estado
                </p>
                <p className="px-3 py-1 inline-block bg-green-100 text-green-800 rounded-md text-sm">
                  {tesis.estado}
                </p>
              </div>

              <div className="col-span-12">
                <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-[14px] font-medium leading-[14px]">
                  Area
                </p>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full inline-block">
                  {tesis.area}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-[14px] font-medium leading-[14px]">
                Descripcion
              </p>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 font-normal">
                {tesis.resumen}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6 mb-6">
              <div className="col-span-3">
                <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-[14px] font-medium leading-[14px]">
                  Asesor
                </p>
                <div className="flex items-center mt-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                    <CircleUserRound className="h-4 w-4 text-gray-500" />
                  </div>
                  <span>{tesis.asesor}</span>
                </div>
              </div>
              <div className="col-span-3">
                <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-[14px] font-medium leading-[14px]">
                  Coasesor
                </p>
                <div className="flex items-center mt-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                    <CircleUserRound className="h-4 w-4 text-gray-500" />
                  </div>
                  <span>{tesis.coasesor}</span>
                </div>
              </div>

              <div className="col-span-12">
                <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-[14px] font-medium leading-[14px]">
                  Estudiante
                </p>
                <div className="flex items-center mt-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                    <CircleUserRound className="h-4 w-4 text-gray-500" />
                  </div>
                  <span>{tesis.estudiante}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-3">
                <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-[14px] font-medium leading-[14px]">
                  Fecha de Creación
                </p>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 font-medium">
                  {tesis.fechaCreacion}
                </div>
              </div>
              <div className="col-span-3">
                <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-[14px] font-medium leading-[14px]">
                  Fecha de Aprobación
                </p>

                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 font-medium">
                  {tesis.fechaAprobacion}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "historial" && (
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Historial de Cambios</h3>
            <p className="text-gray-500">
              No hay cambios registrados para este tema.
            </p>
          </div>
        )}

        {activeTab === "exposiciones" && (
          <div>
            {/* Miembros de Jurado */}
            <div className="grid grid-cols-12 gap-6 mb-6">
              <div className="col-span-3">
                <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-[14px] font-medium leading-[14px]">
                  Asesor
                </p>
                <div className="flex items-center mt-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                    <CircleUserRound className="h-4 w-4 text-gray-500" />
                  </div>
                  <span>{tesis.asesor}</span>
                </div>
              </div>
              <div className="col-span-3">
                <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-[14px] font-medium leading-[14px]">
                  Coasesor
                </p>
                <div className="flex items-center mt-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                    <CircleUserRound className="h-4 w-4 text-gray-500" />
                  </div>
                  <span>{tesis.coasesor}</span>
                </div>
              </div>

              <div className="col-span-12">
                <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-[14px] font-medium leading-[14px]">
                  Estudiante
                </p>
                <div className="flex items-center mt-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                    <CircleUserRound className="h-4 w-4 text-gray-500" />
                  </div>
                  <span>{tesis.estudiante}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-[14px] font-medium leading-[14px]">
                Miembros de Jurado
              </p>
              {tesis.jurados && tesis.jurados.length > 0 ? (
                // Contenedor flex que coloca los jurados horizontalmente
                <div className="flex flex-wrap gap-4 mt-2">
                  {tesis.jurados.map((jurado) => (
                    <div key={jurado.id} className="flex items-center  ">
                      <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                        <CircleUserRound className="h-4 w-4 text-gray-500" />
                      </div>
                      <span>{jurado.nombre}</span>
                      <button className="text-red-500 text-xs ml-2">✕</button>
                    </div>
                  ))}
                </div>
              ) : (
                // Si no hay jurados, muestra un mensaje
                <p className="text-gray-500 mt-2">
                  No hay miembros del jurado asignados.
                </p>
              )}
            </div>

            {/* Exposiciones PFC1 */}
            <div className="mb-8">
              <h3 className="text-base font-semibold mb-4">
                Exposiciones de Proyecto de Fin de Carrera 1
              </h3>

              {tesis.exposiciones &&
              tesis.exposiciones.filter(
                (exp) => exp.curso === "Proyecto de Fin de Carrera 1",
              ).length > 0 ? (
                tesis.exposiciones
                  .filter((exp) => exp.curso === "Proyecto de Fin de Carrera 1")
                  .map((exposicion) => (
                    <div
                      key={exposicion.id}
                      className="border rounded-lg mb-4 overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{exposicion.titulo}</h4>
                          <span
                            className={`px-3 py-1 text-xs rounded-md ${
                              exposicion.estado === "Completada"
                                ? "bg-green-100 text-green-800"
                                : exposicion.estado === "Pendiente"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {exposicion.estado}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <p>
                            {exposicion.fecha} - {exposicion.hora}
                          </p>
                          <p>{exposicion.lugar}</p>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500">
                  No se han registrado exposiciones para el curso.
                </p>
              )}
            </div>

            {/* Exposiciones PFC2 */}
            <div>
              <h3 className="text-base font-semibold mb-4">
                Exposiciones de Proyecto de Fin de Carrera 2
              </h3>

              {tesis.exposiciones &&
              tesis.exposiciones.filter(
                (exp) => exp.curso === "Proyecto de Fin de Carrera 2",
              ).length > 0 ? (
                tesis.exposiciones
                  .filter((exp) => exp.curso === "Proyecto de Fin de Carrera 2")
                  .map((exposicion) => (
                    <div
                      key={exposicion.id}
                      className="border rounded-lg mb-4 overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{exposicion.titulo}</h4>
                          <span
                            className={`px-3 py-1 text-xs rounded-md ${
                              exposicion.estado === "Completada"
                                ? "bg-green-100 text-green-800"
                                : exposicion.estado === "Pendiente"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {exposicion.estado}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <p>
                            {exposicion.fecha} - {exposicion.hora}
                          </p>
                          <p>{exposicion.lugar}</p>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500">
                  No se han registrado exposiciones para el curso.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

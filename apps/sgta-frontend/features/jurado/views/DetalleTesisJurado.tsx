"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState,useEffect } from "react";

import { ArrowLeft, CircleUserRound } from "lucide-react";
import { TesisAsignadaDetalle ,TesisDetalleExposicion} from "@/features/jurado/types/juradoDetalle.types";
import { cn } from "@/lib/utils";
import {
  getExposicionesTema,
  desasignarJuradoTema,
} from "../services/jurado-service";

// Datos de ejemplo (en producción, estos vendrían de una API)

type TabType = "informacion" | "historial" | "exposiciones";

export function DetalleTesisJuradoView() {
  const params = useParams();
  const router = useRouter();
  const codigoTesis = params?.id as string;
  //const detalleJurado = params?.detalleJurado as string;
  const [activeTab, setActiveTab] = useState<TabType>("informacion");
  
  const idTema = Number(params?.id);
  //llamar al listar usando el idNumerico
  

  const [tesis, setTesis] = useState<TesisDetalleExposicion | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchTesisData = async () => {
      try {
        setLoading(true);
        // Verifica que el ID sea un número válido
        if (isNaN(idTema)) {
          throw new Error("ID de tema inválido");
        }
        
        // Llamar a la función para obtener los datos
        const data = await getExposicionesTema(idTema);
        setTesis(data);
        setError(null);
        
      } catch (err) {
        console.error("Error al cargar datos de la tesis:", err);
        setError("No se pudo cargar la información del tema");
      } finally {
        setLoading(false);
      }
    };

    fetchTesisData();
  }, [idTema]); 

  const handleDesasignarJurado = async (juradoId: number) => {
    try {
      const result = await desasignarJuradoTema(juradoId, idTema);
      
      if (result.success) {
        // Actualizar datos después de desasignar
        const updatedData = await getExposicionesTema(idTema);
        setTesis(updatedData);
        alert(result.message); // Puedes reemplazar con un toast
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error("Error al desasignar jurado:", err);
      alert("No se pudo desasignar al jurado");
    }
  };



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
         {/*{activeTab === "informacion" && ()
           Tab Content 
          div>
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
             
           }*/}
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
                  {tesis.asesores.find(a => a.tipo === "Asesor")?.nombre || "Sin asesor"}
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
                  {tesis.asesores.find(a => a.tipo === "Coasesor")?.nombre || "Sin coasesor"}
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
                  {tesis.estudiantes.length > 0 
                  ? tesis.estudiantes[0].nombre 
                  : "Sin estudiantes asignados"}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="flex h-[16.89px] justify-center flex-col flex-shrink-0 text-black font-montserrat text-[14px] font-medium leading-[14px]">
                Miembros de Jurado
              </p>
              {tesis.miembrosJurado && tesis.miembrosJurado.length > 0 ? (
                // Contenedor flex que coloca los jurados horizontalmente
                <div className="flex flex-wrap gap-4 mt-2">
                  {tesis.miembrosJurado.map((jurado) => (
                    <div key={jurado.id} className="flex items-center  ">
                      <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                        <CircleUserRound className="h-4 w-4 text-gray-500" />
                      </div>
                      <span>{jurado.nombre}</span>
                      <button 
                        className="text-red-500 text-xs ml-2"
                        onClick={() => handleDesasignarJurado(jurado.id)}
                      >
                        ✕
                      </button>
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

      

            {/* Exposiciones  */}
            {tesis.etapaFormativaTesis && tesis.etapaFormativaTesis.map((etapaFormativa) => (
                <div className="mb-8" key={etapaFormativa.id}>
                  <h3 className="text-base font-semibold mb-4">
                    Exposiciones de {etapaFormativa.nombre}
                  </h3>

                  {etapaFormativa.exposiciones && etapaFormativa.exposiciones.length > 0 ? (
                    etapaFormativa.exposiciones.map((exposicion) => (
                      <div
                        key={exposicion.id}
                        className="border rounded-lg mb-4 overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{exposicion.nombre}</h4>
                            <span
                              className={`px-3 py-1 text-xs rounded-md ${
                                exposicion.estado === "Completada"
                                  ? "bg-green-100 text-green-800"
                                  : exposicion.estado === "Programada"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {exposicion.estado}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            <p>
                              {new Date(exposicion.fechaInicio).toLocaleDateString()} - 
                              {new Date(exposicion.fechaInicio).toLocaleTimeString()} a 
                              {new Date(exposicion.fechaFin).toLocaleTimeString()}
                            </p>
                            <p>Sala: {exposicion.sala}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No se han registrado exposiciones para esta etapa.
                    </p>
                  )}
                </div>
              ))}



          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "lucide-react";
import { useState } from "react";
import { Proyecto } from "../../types/perfil/entidades";

interface Props {
  proyectos: Proyecto[];
}

const ITEMS_POR_PAGINA = 10;

export default function ProyectosAsesoradosResumen({
  proyectos,
}: Readonly<Props>) {
  const [pageEnProceso, setPageEnProceso] = useState(1);
  const [pageFinalizado, setPageFinalizado] = useState(1);

  const renderProyecto = (
    estado: "en_proceso" | "finalizado",
    paginaActual: number,
    setPagina: (page: number) => void,
  ) => {
    const filtradas = proyectos.filter((t) => t.estado === estado);

    if (filtradas.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          No hay proyectos{" "}
          {estado === "en_proceso" ? "en proceso" : "finalizados"} actualmente
        </div>
      );
    }

    const totalPaginas = Math.ceil(filtradas.length / ITEMS_POR_PAGINA);
    const start = (paginaActual - 1) * ITEMS_POR_PAGINA;
    const paginaProyectos = filtradas.slice(start, start + ITEMS_POR_PAGINA);

    return (
      <>
        <div className="bg-white rounded-lg shadow">
          {paginaProyectos.map((t, index) => (
            <div key={index} className="p-4 border-b last:border-b-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <h4 className="font-medium text-sm sm:text-base">{t.nombre}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full self-start">
                  <Users className="h-3 w-3" />
                  <span>{t.participantes} participantes</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                {estado === "en_proceso"
                  ? `Inicio: ${t.anioInicio}`
                  : `Finalizado: ${t.anioFin}`}
              </p>
            </div>
          ))}
        </div>

        {totalPaginas > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (paginaActual > 1) setPagina(paginaActual - 1);
                  }}
                />
              </PaginationItem>

              {[...Array(totalPaginas)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={paginaActual === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setPagina(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (paginaActual < totalPaginas)
                      setPagina(paginaActual + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Proyectos Dirigidos</h2>

      <Tabs defaultValue="en_proceso" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="en_proceso">En proceso</TabsTrigger>
          <TabsTrigger value="finalizado">Finalizados</TabsTrigger>
        </TabsList>

        <TabsContent value="en_proceso" className="space-y-4">
          {renderProyecto("en_proceso", pageEnProceso, setPageEnProceso)}
        </TabsContent>

        <TabsContent value="finalizado" className="space-y-4">
          {renderProyecto("finalizado", pageFinalizado, setPageFinalizado)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

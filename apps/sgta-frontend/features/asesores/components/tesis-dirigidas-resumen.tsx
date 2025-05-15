"use client";

import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useState } from "react";
import { Tesis } from "../types/perfil/entidades";

interface Props {
  tesis: Tesis[];
}

const ITEMS_PER_PAGE = 5;

export default function TesisDirigidasResumen({ tesis }: Props) {
  const [pageEnProceso, setPageEnProceso] = useState(40);
  const [pageTerminadas, setPageTerminadas] = useState(40);

  const renderTesis = (
    estado: "en_proceso" | "finalizada",
    currentPage: number,
    setPage: (page: number) => void,
  ) => {
    const filtradas = tesis.filter((t) => t.estado === estado);

    if (filtradas.length === 0) {
      return (
        <div className="text-center py-6 text-gray-500">
          No hay tesis {estado === "en_proceso" ? "en proceso" : "finalizada"}{" "}
          actualmente
        </div>
      );
    }

    const totalPages = Math.ceil(filtradas.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = filtradas.slice(start, start + ITEMS_PER_PAGE);

    return (
      <>
        {pageItems.map((t, index) => (
          <div
            key={index}
            className="border-b pb-3 sm:pb-4 last:border-b-0 last:pb-0"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <h4 className="font-medium text-sm sm:text-base">{t.titulo}</h4>
              <Badge
                variant="outline"
                className={`
                  self-start sm:self-auto text-xs
                  ${t.nivel === "Finalizada" ? "bg-blue-100 text-blue-800 border-blue-200" : ""}
                  ${t.nivel === "Tesis 1" ? "bg-purple-100 text-purple-800 border-purple-200" : ""}
                  ${t.nivel === "Tesis 2" ? "bg-red-100 text-red-800 border-red-200" : ""}
                `}
              >
                {t.nivel}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              {t.estudiantes} · {t.anio}
            </p>
          </div>
        ))}

        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setPage(currentPage - 1);
                  }}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(i + 1);
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
                    if (currentPage < totalPages) setPage(currentPage + 1);
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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Tesis Asesoradas</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={4}>
                <p>
                  Solo se muestran las tesis registradas en el sistema SGTA.
                  Para ver más tesis realizadas, diríjase al repositorio de
                  investigación del asesor.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Tabs defaultValue="en_proceso" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="en_proceso">En proceso</TabsTrigger>
          <TabsTrigger value="finalizada">Finalizada</TabsTrigger>
        </TabsList>

        <TabsContent value="en_proceso" className="space-y-4">
          {renderTesis("en_proceso", pageEnProceso, setPageEnProceso)}
        </TabsContent>

        <TabsContent value="finalizada" className="space-y-4">
          {renderTesis("finalizada", pageTerminadas, setPageTerminadas)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

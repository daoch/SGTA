"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CardAsesorBusqueda } from "@/features/asesores/components/directorio/card-asesor-busqueda";
import { Asesor } from "@/features/asesores/types/perfil/entidades";
import React from "react";

interface Props {
  asesores: Asesor[];
  paginatedAdvisors: Asesor[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  soloDisponible: boolean;
  renderPaginationItems: () => React.ReactNode;
  isLoadingResults: boolean;
}

export default function ResultadosAsesores({
  asesores,
  paginatedAdvisors,
  currentPage,
  totalPages,
  setCurrentPage,
  soloDisponible,
  renderPaginationItems,
  isLoadingResults,
}: Readonly<Props>) {
  if (isLoadingResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground space-y-2">
        <div className="w-6 h-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
        <p>Obteniendo resultados...</p>
      </div>
    );
  }

  if (asesores.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No se encontraron asesores con los criterios especificados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">
          Resultados ({asesores.length})
        </h2>
        <p className="text-sm text-muted-foreground">
          {soloDisponible
            ? "Mostrando los asesores disponibles encontrados"
            : "Mostrando todos los asesores encontrados"}
        </p>
      </div>

      <div className="space-y-4">
        {paginatedAdvisors.map((advisor) => (
          <CardAsesorBusqueda key={advisor.id} advisor={advisor} />
        ))}

        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                {currentPage === 1 ? (
                  <span className="px-3 py-1 text-gray-400 cursor-not-allowed">
                    Previous
                  </span>
                ) : (
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  />
                )}
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                {currentPage === totalPages ? (
                  <span className="px-3 py-1 text-gray-400 cursor-not-allowed">
                    Next
                  </span>
                ) : (
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

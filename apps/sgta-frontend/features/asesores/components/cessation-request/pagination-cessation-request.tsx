import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ICessationRequestPaginationProps } from "@/features/asesores/types/cessation-request";

const CessationRequestPagination: React.FC<ICessationRequestPaginationProps> = ({
  currentPage,  // 0-index
  totalPages,   // cantidad total de páginas
  onPageChange  // espera un 0-index
}) => {
  const MAX_PAGE_BUTTONS = 5;

  // Si solo hay una página o ninguna, no renderizamos nada
  if (totalPages <= 1) {
    return null;
  }

  // Convertimos currentPage (0-index) a 1-index para las lógicas de cálculo
  const current = currentPage + 1;

  const getPageNumbers = () => {
    const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];
    let startPage: number, endPage: number;

    if (totalPages <= MAX_PAGE_BUTTONS) {
      // Si el total de páginas cabe en MAX_PAGE_BUTTONS, las mostramos todas
      startPage = 1;
      endPage = totalPages;
    } else {
      // Cuántos botones a cada lado del actual (menos el botón actual)
      const buttonsOnEachSide = Math.floor((MAX_PAGE_BUTTONS - 1) / 2);

      if (current <= buttonsOnEachSide + 1) {
        // Estamos cerca del inicio
        startPage = 1;
        endPage = MAX_PAGE_BUTTONS - 1;
      } else if (current >= totalPages - buttonsOnEachSide) {
        // Cerca del final
        startPage = totalPages - (MAX_PAGE_BUTTONS - 2);
        endPage = totalPages;
      } else {
        // Caso “en medio”
        startPage = current - buttonsOnEachSide;
        endPage = current + buttonsOnEachSide;
      }
    }

    // Si no empezamos en la página 1, ponemos el “1” y luego puntos suspensivos
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("ellipsis-start");
      }
    }

    // Botones intermedios
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Si no terminamos en la última, agregamos “...” y la última
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                if (currentPage > 0) {
                  onPageChange(currentPage - 1);
                }
              }}
              className={currentPage <= 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              aria-disabled={currentPage <= 0}
            />
          </PaginationItem>

          {pageNumbers.map((pageNum, index) => (
            <PaginationItem key={`page-${pageNum}-${index}`}>
              {pageNum === "ellipsis-start" || pageNum === "ellipsis-end" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={pageNum === current}
                  onClick={() => {
                    // pageNum viene en 1-index, convertimos a 0-index
                    onPageChange((pageNum as number) - 1);
                  }}
                  className="cursor-pointer"
                  aria-label={`Page ${pageNum}`}
                >
                  {pageNum}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => {
                if (currentPage < totalPages - 1) {
                  onPageChange(currentPage + 1);
                }
              }}
              className={currentPage >= totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              aria-disabled={currentPage >= totalPages - 1}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CessationRequestPagination;

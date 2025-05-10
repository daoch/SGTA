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

interface ICessationRequestPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CessationRequestPagination: React.FC<ICessationRequestPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  const MAX_PAGE_BUTTONS = 5;

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages = [];
    
    let startPage: number, endPage: number;
    
    if (totalPages <= MAX_PAGE_BUTTONS) {  
      startPage = 1;
      endPage = totalPages;
    } else {
      const buttonsOnEachSide = Math.floor((MAX_PAGE_BUTTONS - 1) / 2);
      
      if (currentPage <= buttonsOnEachSide + 1) {
        startPage = 1;
        endPage = MAX_PAGE_BUTTONS - 1;
      } else if (currentPage >= totalPages - buttonsOnEachSide) {
        startPage = totalPages - (MAX_PAGE_BUTTONS - 2);
        endPage = totalPages;
      } else {
        startPage = currentPage - buttonsOnEachSide;
        endPage = currentPage + buttonsOnEachSide;
      }
    }
    
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("ellipsis-start");
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
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
              onClick={() => currentPage > 1 ? onPageChange(currentPage - 1) : null}
              className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              aria-disabled={currentPage <= 1}
            />
          </PaginationItem>
          
          {pageNumbers.map((pageNum, index) => (
            <PaginationItem key={`page-${pageNum}-${index}`}>
              {pageNum === "ellipsis-start" || pageNum === "ellipsis-end" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={pageNum === currentPage}
                  onClick={() => onPageChange(pageNum as number)}
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
                currentPage < totalPages ? onPageChange(currentPage + 1) : null
              }}
              className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              aria-disabled={currentPage >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CessationRequestPagination;
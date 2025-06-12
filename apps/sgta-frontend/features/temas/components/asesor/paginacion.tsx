import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"; // Ajusta la ruta según tu estructura
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginatedListProps {
  totalItems: number | 2;
  itemsPerPage: number | 1;
  page: number;
  setPage: (page: number) => void;
}

const PaginatedList = ({
  totalItems,
  itemsPerPage,
  page,
  setPage,
}: PaginatedListProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Cambiar de página usando setPage
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage); // Usamos setPage para actualizar el valor de la página
    }
  };

  // Generar los enlaces de página
  const renderPageLinks = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === page}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    return pages;
  };

  return (
    <div>
      {/* Componente de paginación */}
      <Pagination>
        {/* Botón para la página anterior */}
        <PaginationLink
          aria-label="Go to previous page"
          size="default"
          className="gap-1 px-2.5 sm:pl-2.5"
          onClick={() => handlePageChange(page - 1)}
        >
          <ChevronLeftIcon />
          <span className="hidden sm:block">Anterior</span>{" "}
        </PaginationLink>

        {/* Contenido de la paginación */}
        <PaginationContent>
          {renderPageLinks()}
          {page < totalPages - 1 && <PaginationEllipsis />}
        </PaginationContent>

        {/* Botón para la página siguiente */}
        <PaginationLink
          aria-label="Go to next page"
          size="default"
          className="gap-1 px-2.5 sm:pr-2.5"
          onClick={() => handlePageChange(page + 1)}
        >
          <span className="hidden sm:block">Siguiente</span>{" "}
          <ChevronRightIcon />
        </PaginationLink>
      </Pagination>
    </div>
  );
};

export default PaginatedList;

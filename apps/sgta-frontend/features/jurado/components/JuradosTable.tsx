"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JuradoUI } from "@/features/jurado/types/juradoDetalle.types";
import { ChevronLeft, ChevronRight, FileSearch, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";

interface TableJuradosProps {
  juradosData: JuradoUI[];
  onOpenModal: (id: string) => void;
}

const TableJurados: React.FC<TableJuradosProps> = ({
  juradosData,
  onOpenModal,
}) => {
  const router = useRouter();

  //PARA LA PAGINACION
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  //CALCULAR TOTAL DE PAGINAS
  const totalPages = Math.ceil(juradosData.length / itemsPerPage);

  //CALCULAR ITEMS A MOSTRAR EN LA PAGINA ACTUAL
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = juradosData.slice(indexOfFirstItem, indexOfLastItem);

  //FUNCION PARA CAMBIAR DE PAGINA
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  //GENERAR NUMEROS DE PAGINA
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  //FUNCION PARA CAMBIAR ITEMS POR PAGINA
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [juradosData]);

  const handleClick = (detalleJurado: string) => {
    router.push(`/coordinador/jurados/${detalleJurado}`);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="font-semibold">Usuario</TableCell>
            <TableCell className="font-semibold">Código</TableCell>
            <TableCell className="font-semibold">Correo Electrónico</TableCell>
            <TableCell className="font-semibold">Tipo de Dedicación</TableCell>
            <TableCell className="font-semibold">Asignados</TableCell>
            <TableCell className="font-semibold">
              Área de Especialidad
            </TableCell>
            <TableCell className="font-semibold">Estado</TableCell>
            <TableCell className="font-semibold">Acciones</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((jurado, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex gap-2 items-center">
                  <img
                    src={jurado.user.avatar}
                    alt={jurado.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{jurado.user.name}</span>
                </div>
              </TableCell>
              <TableCell>{jurado.code}</TableCell>
              <TableCell>{jurado.email}</TableCell>
              <TableCell>{jurado.dedication}</TableCell>
              <TableCell>{jurado.assigned}</TableCell>
              <TableCell>
                <div className="flex gap-1.5 flex-wrap">
                  {jurado.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-2.5 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>{jurado.status}</TableCell>
              <TableCell>
                <div className="flex gap-2 items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative cursor-pointer"
                    onClick={() => handleClick(jurado.id!)} // Cambia a la ruta de detalle del jurado
                  >
                    <FileSearch className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative cursor-pointer"
                    onClick={() => onOpenModal(jurado.id!)}
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Mostrar</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={itemsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="25">25</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">por página</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Mostrando {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, juradosData.length)} de{" "}
            {juradosData.length} registros
          </span>
        </div>

        <Pagination>
          <PaginationContent className="flex items-center gap-10">
            <PaginationItem>
              <PaginationLink
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer hover:bg-transparent"
                }
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </PaginationLink>
            </PaginationItem>

            <div className="flex items-center gap-1">
              {pageNumbers.map((number) => {
                if (
                  number === 1 ||
                  number === totalPages ||
                  (number >= currentPage - 1 && number <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={number}>
                      <PaginationLink
                        onClick={() => handlePageChange(number)}
                        isActive={currentPage === number}
                      >
                        {number}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                if (
                  (number === 2 && currentPage > 3) ||
                  (number === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return (
                    <PaginationItem key={number}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return null;
              })}
            </div>

            <PaginationItem>
              <PaginationLink
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer hover:bg-transparent"
                }
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default TableJurados;


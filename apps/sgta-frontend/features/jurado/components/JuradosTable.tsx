"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JuradoUI } from "@/features/jurado/types/juradoDetalle.types";
import { FileSearch, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

interface TableJuradosProps {
  juradosData: JuradoUI[];
}

const TableJurados: React.FC<TableJuradosProps> = ({ juradosData }) => {
  const router = useRouter();

  const handleClick = (detalleJurado: string) => {
    router.push(`/coordinador/jurados/${detalleJurado}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell className="font-semibold">Usuario</TableCell>
          <TableCell className="font-semibold">Código</TableCell>
          <TableCell className="font-semibold">Correo Electrónico</TableCell>
          <TableCell className="font-semibold">Tipo de Dedicación</TableCell>
          <TableCell className="font-semibold">Asignados</TableCell>
          <TableCell className="font-semibold">Área de Especialidad</TableCell>
          <TableCell className="font-semibold">Estado</TableCell>
          <TableCell className="font-semibold">Acciones</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {juradosData.map((jurado, index) => (
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
                  className="relative"
                  onClick={() => handleClick(jurado.code)} // Cambia a la ruta de detalle del jurado
                >
                  <FileSearch className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="relative">
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableJurados;


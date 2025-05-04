'use client'

import * as React from "react"
import { useRouter } from 'next/navigation'
import { FileSearch,Trash2 } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table" // Usamos los componentes de shadcn
import { Button } from "@/components/ui/button" // Para los botones de editar y eliminar
import { JuradoUI } from '@/features/jurado/types/juradoDetalle.types' // Importamos la interfaz JuradoUI

interface TableJuradosProps {
  juradosData: JuradoUI[]
}



const TableJurados: React.FC<TableJuradosProps> = ({ juradosData }) => {
  const router = useRouter()

  const handleClick = (detalleJurado: string) => {
    router.push(`/coordinador/jurados/${detalleJurado}`)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Usuario</TableCell>
          <TableCell>Código</TableCell>
          <TableCell>Correo Electrónico</TableCell>
          <TableCell>Tipo de Dedicación</TableCell>
          <TableCell>Asignados</TableCell>
          <TableCell>Área de Especialidad</TableCell>
          <TableCell>Estado</TableCell>
          <TableCell>Acciones</TableCell>
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
                  <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-2.5 rounded-full">
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
                <Button 
                variant="ghost"
                size="icon"
                className="relative">
                <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TableJurados
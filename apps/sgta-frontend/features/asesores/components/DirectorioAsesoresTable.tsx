// features/asesores/components/DirectorioAsesoresTable.tsx
'use client';

import { Profesor } from '@/features/asesores/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Shield } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';

type Props = {
  profesores: Profesor[];
};

export default function DirectorioAsesoresTable({ profesores }: Props) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.max(1, Math.ceil(profesores.length / rowsPerPage));

  useEffect(() => {
    setPage(1);
  }, [rowsPerPage]);

  const paginated = profesores.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(totalPages, page + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="w-full space-y-4">
      <div className="w-full overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs text-muted-foreground uppercase">
            <tr className="text-left">
              <th className="p-4">Nombre</th>
              <th className="p-4">Código PUCP</th>
              <th className="p-4 text-center">Roles Asignados</th>
              <th className="p-4 text-center">Tesis Activas</th>
              <th className="p-4 text-center">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={p.avatarUrl} alt={p.nombre} />
                      <AvatarFallback>{p.nombre[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{p.nombre}</div>
                      <div className="text-xs text-muted-foreground">{p.correo}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">{p.codigo}</td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <Badge variant={p.rolesAsignados.includes('asesor') ? 'default' : 'outline'}>
                      Asesor
                    </Badge>
                    <Badge variant={p.rolesAsignados.includes('jurado') ? 'default' : 'outline'}>
                      Jurado
                    </Badge>
                  </div>
                </td>
                <td className="p-4 text-center">{p.tesisActivas}</td>
                <td className="p-4 text-center">
                  <Badge
                    variant={p.estado === 'activo' ? 'default' : 'outline'}
                    className={p.estado === 'activo' ? 'bg-green-500 text-white' : 'bg-muted'}
                  >
                    {p.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Ver perfil
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Shield className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Administrar roles
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-2">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ‹ Anterior
          </Button>

          {getPageNumbers().map((n) => (
            <Button
              key={n}
              variant={n === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPage(n)}
            >
              {n}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente ›
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar:</span>
          <Select value={String(rowsPerPage)} onValueChange={(value) => setRowsPerPage(Number(value))}>
            <SelectTrigger className="w-[80px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

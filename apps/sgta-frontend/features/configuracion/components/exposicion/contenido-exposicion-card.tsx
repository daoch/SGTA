"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { PenLine, Trash2 } from "lucide-react";

interface ContenidoEsperadoExposicionCardProps {
  id: string;
  titulo: string;
  descripcion: string;
  puntos: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ContenidoEsperadoExposicionCard({
  id,
  titulo,
  descripcion,
  puntos,
  onEdit,
  onDelete,
}: ContenidoEsperadoExposicionCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <h3 className="font-medium">{titulo}</h3>
        <div className="flex gap-2">
          <Button
            id="btnEditContenidoEsperado"
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => onEdit && onEdit(id)}
          >
            <PenLine className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button
            id="btnDeleteContenidoEsperado"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-red-500 hover:text-red-600"
            onClick={() => onDelete && onDelete(id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Eliminar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{descripcion}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary text-secondary-foreground">
          Peso en la calificación: {puntos} puntos
        </span>
      </CardFooter>
    </Card>
  );
}

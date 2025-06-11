"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { PenLine, Trash2 } from "lucide-react";

interface CriterioExposicionCardProps {
  readonly id: string;
  readonly nombre: string;
  readonly descripcion: string;
  readonly notaMaxima: number;
  readonly onEdit?: (id: string) => void;
  readonly onDelete?: (id: string) => void;
}

export function CriterioExposicionCard({
  id,
  nombre,
  descripcion,
  notaMaxima,
  onEdit,
  onDelete,
}: CriterioExposicionCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          {/* Contenido principal */}
          <div className="flex flex-col space-y-1">
            <h3 className="font-medium">{nombre}</h3>
            <p className="text-sm text-muted-foreground">{descripcion}</p>
          </div>

          {/* Botones de acción */}
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
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary text-secondary-foreground">
          Peso en la calificación: {notaMaxima} puntos
        </span>
      </CardFooter>
    </Card>
  );
}

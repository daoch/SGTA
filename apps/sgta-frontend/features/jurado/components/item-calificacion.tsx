"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CalificacionItemProps {
  titulo: string;
  descripcion: string;
}

export function CalificacionItem({
  titulo,
  descripcion,
}: CalificacionItemProps) {
  return (
    <div className="border rounded-2xl p-4 space-y-2 shadow-sm">
      <Label className="text-lg font-semibold">{titulo}</Label>
      <p className="text-sm">{descripcion}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="flex flex-col space-y-2">
          <Label>Calificación</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              min="0"
              max="4"
              step="0.5"
              placeholder="0.0"
              className="w-24"
            />
            <span>/ 4</span>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Label>Observaciones</Label>
          <Textarea placeholder="Escribe tus observaciones aquí" />
        </div>
      </div>
    </div>
  );
}

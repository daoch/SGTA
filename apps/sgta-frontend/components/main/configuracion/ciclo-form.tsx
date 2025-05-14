"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface Ciclo {
  nombre?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: string;
  descripcion?: string;
}

export function CicloForm({ ciclo = null }: { ciclo?: Ciclo | null }) {
  const [estado, setEstado] = useState(ciclo?.estado || "Planificado");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre del Ciclo</Label>
        <Input id="nombre" placeholder="Ej: 2024-I" defaultValue={ciclo?.nombre || ""} />
        <p className="text-sm text-gray-500">Ingrese el nombre del ciclo académico (Ej: 2024-I, 2024-II)</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
          <Input id="fechaInicio" type="date" defaultValue={ciclo?.fechaInicio || ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fechaFin">Fecha de Fin</Label>
          <Input id="fechaFin" type="date" defaultValue={ciclo?.fechaFin || ""} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <Select value={estado} onValueChange={setEstado}>
          <SelectTrigger id="estado">
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Planificado">Planificado</SelectItem>
            <SelectItem value="En curso">En curso</SelectItem>
            <SelectItem value="Finalizado">Finalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción (Opcional)</Label>
        <Textarea
          id="descripcion"
          placeholder="Descripción o notas adicionales sobre el ciclo"
          rows={3}
          defaultValue={ciclo?.descripcion || ""}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Link href="/admin/configuracion/ciclos">
          <Button variant="outline">Cancelar</Button>
        </Link>
        <Button>{ciclo ? "Guardar Cambios" : "Registrar Ciclo"}</Button>
      </div>
    </div>
  );
}

// Importación ficticia de Link para evitar errores
function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href}>{children}</a>;
}

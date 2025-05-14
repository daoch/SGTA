"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

// Datos de ejemplo
const ciclos = [
  { id: 3, nombre: "2024-I" },
  { id: 4, nombre: "2024-II" },
];

const carreras = [
  { id: 1, nombre: "Ingeniería de Sistemas" },
  { id: 2, nombre: "Ingeniería Industrial" },
  { id: 3, nombre: "Administración" },
];

interface EtapaFormativa {
  nombre?: string;
  ciclo_id?: number;
  carrera_id?: number;
  orden?: number;
  creditos?: number;
  descripcion?: string;
}

export function EtapaFormativaForm({ etapaFormativa = null }: { etapaFormativa?: EtapaFormativa | null }) {
  const [ciclo, setCiclo] = useState(etapaFormativa?.ciclo_id?.toString() || "");
  const [carrera, setCarrera] = useState(etapaFormativa?.carrera_id?.toString() || "");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre de la Etapa Formativa</Label>
        <Input id="nombre" placeholder="Ej: Proyecto de Tesis 1" defaultValue={etapaFormativa?.nombre || ""} />
        <p className="text-sm text-gray-500">Ingrese el nombre del curso de tesis</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ciclo">Ciclo Académico</Label>
        <Select value={ciclo} onValueChange={setCiclo}>
          <SelectTrigger id="ciclo">
            <SelectValue placeholder="Seleccionar ciclo" />
          </SelectTrigger>
          <SelectContent>
            {ciclos.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="carrera">Carrera</Label>
        <Select value={carrera} onValueChange={setCarrera}>
          <SelectTrigger id="carrera">
            <SelectValue placeholder="Seleccionar carrera" />
          </SelectTrigger>
          <SelectContent>
            {carreras.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="orden">Orden</Label>
        <Input id="orden" type="number" min="1" placeholder="Ej: 1" defaultValue={etapaFormativa?.orden || "1"} />
        <p className="text-sm text-gray-500">
          Indica el orden de la etapa formativa dentro de la carrera (1 para el primer curso, 2 para el segundo, etc.)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="creditos">Créditos</Label>
        <Input id="creditos" type="number" min="1" placeholder="Ej: 4" defaultValue={etapaFormativa?.creditos || ""} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción (Opcional)</Label>
        <Textarea
          id="descripcion"
          placeholder="Descripción o notas adicionales sobre la etapa formativa"
          rows={3}
          defaultValue={etapaFormativa?.descripcion || ""}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Link href="/admin/configuracion/etapas-formativas">
          <Button variant="outline">Cancelar</Button>
        </Link>
        <Button>{etapaFormativa ? "Guardar Cambios" : "Registrar Etapa Formativa"}</Button>
      </div>
    </div>
  );
}

// Importación ficticia de Link para evitar errores
function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href}>{children}</a>;
}

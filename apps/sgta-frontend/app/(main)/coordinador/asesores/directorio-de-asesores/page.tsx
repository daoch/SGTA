"use client";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDirectorioAsesores } from "@/features/asesores/hooks/useDirectorioAsesores";
import DirectorioAsesoresTable from "@/features/asesores/components/DirectorioAsesoresTable";
import Breadcrumb from "@/components/layout/breadcrumb";

export default function DirectorioAsesoresPage() {
  const {
    profesores,
    search,
    setSearch,
    rolAsignado,
    setRolAsignado,
    updateRoles
  } = useDirectorioAsesores();

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl space-y-6">
      <Breadcrumb
        items={[
          { label: "Asesores", href: "/coordinador/asesores" },
          { label: "Directorio de Asesores" },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Directorio de Asesores
        </h1>
        <p className="text-muted-foreground">
          Visualiza los profesores habilitados como asesores y/o jurados.
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
          <div className="flex flex-col gap-1 w-full md:max-w-sm">
            <Label htmlFor="search">Buscar</Label>
            <Input
              id="search"
              type="text"
              placeholder="Buscar por nombre, correo o código"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="rol">Rol Asignado</Label>
              <Select value={rolAsignado} onValueChange={v => setRolAsignado(v as "todos" | "asesor" | "jurado")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="asesor">Asesor</SelectItem>
                <SelectItem value="jurado">Jurado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <p className="text-sm text-muted-foreground">
        Mostrando {profesores.length} resultado{profesores.length !== 1 && "s"} encontrado{profesores.length !== 1 && "s"}.
      </p>

      <DirectorioAsesoresTable profesores={profesores} onUpdateRoles={updateRoles} />
    </div>
  );
}

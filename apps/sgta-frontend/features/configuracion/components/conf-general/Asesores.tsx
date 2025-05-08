"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AsesoresCards() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Límite de tesistas del asesor</CardTitle>
          <CardDescription>
            Configure los límites de tesistas que puede tener un asesor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="limite-total">Límite total de asesores</Label>
            <Input
              type="number"
              id="limite-total"
              placeholder="Ej: 20"
              defaultValue="20"
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="limite-por-asesor">Límite por asesor</Label>
            <Input
              type="number"
              id="limite-por-asesor"
              placeholder="Ej: 5"
              defaultValue="5"
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="habilitar-limites">
              Habilitar límites por asesor
            </Label>
            <Switch id="habilitar-limites" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tiempo límite para revisar</CardTitle>
          <CardDescription>
            Configure el tiempo máximo que tiene un asesor para revisar un
            trabajo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="tiempo-asesor">
              Tiempo límite del asesor (días)
            </Label>
            <Input
              type="number"
              id="tiempo-asesor"
              placeholder="Ej: 7"
              defaultValue="7"
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

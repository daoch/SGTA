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

export default function ModalidadRevisionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Modalidad de revisión</CardTitle>
        <CardDescription>
          Configure las opciones de revisión y detección de plagio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="habilitar-turnitin">
            Habilitar subida de informes Turnitin
          </Label>
          <Switch id="habilitar-turnitin" defaultChecked />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="integracion-antiplagio">
            Activar integración con sistemas antiplagio
          </Label>
          <Switch id="integracion-antiplagio" />
        </div>
      </CardContent>
    </Card>
  );
}

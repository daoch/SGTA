"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function JuradosCards() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Cantidad de jurados</CardTitle>
          <CardDescription>
            Establezca el número fijo de jurados para cada proyecto de tesis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="cantidad-jurados">Número de jurados</Label>
            <Input
              type="number"
              id="cantidad-jurados"
              placeholder="Ej: 3"
              defaultValue="3"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tiempo límite para revisar</CardTitle>
          <CardDescription>
            Configure el tiempo máximo que tiene un jurado para revisar un
            trabajo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="tiempo-jurado">
              Tiempo límite del jurado (días)
            </Label>
            <Input
              type="number"
              id="tiempo-jurado"
              placeholder="Ej: 10"
              defaultValue="10"
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

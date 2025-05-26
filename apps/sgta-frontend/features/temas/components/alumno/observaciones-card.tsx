"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, Pencil } from "lucide-react";
import { useState } from "react";

interface Observacion {
  campo: "título" | "descripción" | "asesor";
  detalle: string;
  autor: string;
  fecha: string;
}

interface Props {
  observaciones: Observacion[];
}

const profesores = [
  "Dr. Roberto Sánchez",
  "Dra. Carmen Vega",
  "Dr. Miguel Torres",
  "Dra. Laura Mendoza",
  "Dr. Javier Pérez",
];

export function ObservacionesCard({ observaciones }: Props) {
  const [modoEdicion, setModoEdicion] = useState(false);

  const [titulo, setTitulo] = useState(
    "Implementación de algoritmos de aprendizaje profundo para detección de objetos en tiempo real"
  );
  const [descripcion, setDescripcion] = useState(
    "Este proyecto busca desarrollar un sistema de detección de objetos en tiempo real utilizando técnicas de aprendizaje profundo, específicamente redes neuronales convolucionales. Se implementarán algoritmos como YOLO y SSD para comparar su rendimiento en diferentes escenarios."
  );
  const [asesor, setAsesor] = useState("Dr. Roberto Sánchez");

  const [editadoTitulo, setEditadoTitulo] = useState(false);
  const [editadoDescripcion, setEditadoDescripcion] = useState(false);
  const [editadoAsesor, setEditadoAsesor] = useState(false);

  const sePuedeGuardar =
    editadoTitulo &&
    titulo.trim() !== "" &&
    editadoDescripcion &&
    descripcion.trim() !== "" &&
    editadoAsesor &&
    asesor.trim() !== "";

  const handleGuardar = () => {
    console.log({ titulo, descripcion, asesor });
    setModoEdicion(false);
  };

  return (
    <Card className="mt-4 border border-gray-300 shadow-sm rounded-xl">
      <CardHeader className="flex flex-row gap-2 items-start">
        <AlertCircle className="text-red-500 mt-1" />
        <div>
          <CardTitle className="text-red-700 text-lg">
            Observaciones del Coordinador
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Tu tesis tiene observaciones que deben ser subsanadas para continuar con el proceso
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {observaciones.map((obs) => (
          <Card
            key={obs.campo}
            className="border border-gray-300 bg-white rounded-md"
          >
            <CardContent className="space-y-2 pt-0">
              <p className="text-sm font-semibold text-red-700">
                Observación sobre el {obs.campo}
              </p>
              <p className="text-sm">{obs.detalle}</p>
              <p className="text-xs text-muted-foreground italic">
                {obs.autor} - {obs.fecha}
              </p>

              {modoEdicion && obs.campo === "título" && (
                <div className="space-y-1">
                  <Label>Título del Tema</Label>
                  <Input
                    value={titulo}
                    onChange={(e) => {
                      setTitulo(e.target.value);
                      setEditadoTitulo(true);
                    }}
                    required
                  />
                </div>
              )}

              {modoEdicion && obs.campo === "descripción" && (
                <div className="space-y-1">
                  <Label>Descripción</Label>
                  <Textarea
                    rows={4}
                    value={descripcion}
                    onChange={(e) => {
                      setDescripcion(e.target.value);
                      setEditadoDescripcion(true);
                    }}
                    required
                  />
                </div>
              )}

              {modoEdicion && obs.campo === "asesor" && (
                <div className="space-y-1">
                  <Label>Asesor Principal</Label>
                  <Select
                    value={asesor}
                    onValueChange={(value) => {
                      setAsesor(value);
                      setEditadoAsesor(true);
                    }}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un asesor" />
                    </SelectTrigger>
                    <SelectContent>
                      {profesores.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </CardContent>

      <CardFooter className="flex justify-end gap-4">
        {modoEdicion ? (
          <>
            <Button variant="outline" onClick={() => setModoEdicion(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleGuardar}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!sePuedeGuardar}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Enviar todas las subsanaciones
            </Button>
          </>
        ) : (
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => setModoEdicion(true)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Subsanar observaciones
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

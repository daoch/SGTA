"use client";

import React, { useEffect, useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { TemaForm } from "@/app/types/temas/entidades";
import {
  coasesoresDisponibles,
  estudiantesDisponibles,
  areasDeInvestigacion,
} from "@/app/types/temas/data";

interface NuevoTemaDialogProps {
  isOpen: boolean;
  setIsNuevoTemaDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  temaForm: TemaForm;
  setTemaForm: React.Dispatch<React.SetStateAction<TemaForm>>;
}

const NuevoTemaDialog: React.FC<NuevoTemaDialogProps> = ({
  isOpen,
  setIsNuevoTemaDialogOpen,
  temaForm,
  setTemaForm,
}) => {
  const [localTemaForm, setLocalTemaForm] = useState<TemaForm>(temaForm);
  const [coasesorSeleccionado, setCoasesorSeleccionado] = useState<string>("");
  const [estudianteSeleccionado, setEstudianteSeleccionado] =
    useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setLocalTemaForm(temaForm);
    }
  }, [isOpen, temaForm]);

  const handleChange = (field: keyof TemaForm, value: any) => {
    setLocalTemaForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAgregarCoasesor = () => {
    if (
      coasesorSeleccionado &&
      !localTemaForm.coasesores.includes(coasesorSeleccionado)
    ) {
      setLocalTemaForm((prev) => ({
        ...prev,
        coasesores: [...prev.coasesores, coasesorSeleccionado],
      }));
      setCoasesorSeleccionado("");
    }
  };

  const handleEliminarCoasesor = (coasesor: string) => {
    setLocalTemaForm((prev) => ({
      ...prev,
      coasesores: prev.coasesores.filter((item) => item !== coasesor),
    }));
  };

  const handleAgregarEstudiante = () => {
    if (
      estudianteSeleccionado &&
      !localTemaForm.estudiantes.includes(estudianteSeleccionado)
    ) {
      setLocalTemaForm((prev) => ({
        ...prev,
        estudiantes: [...prev.estudiantes, estudianteSeleccionado],
      }));
      setEstudianteSeleccionado("");
    }
  };

  const handleEliminarEstudiante = (estudiante: string) => {
    setLocalTemaForm((prev) => ({
      ...prev,
      estudiantes: prev.estudiantes.filter((item) => item !== estudiante),
    }));
  };

  const handleGuardar = () => {
    setTemaForm(localTemaForm); // Actualiza el estado global
    setIsNuevoTemaDialogOpen(false);
  };

  const handleCancelar = () => {
    setIsNuevoTemaDialogOpen(false);
  };

  return (
    <DialogContent className="w-2xl">
      <DialogHeader>
        <DialogTitle>Nuevo Tema de Tesis</DialogTitle>
        <DialogDescription>
          Complete la información requerida para registrar un nuevo tema de
          tesis
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Tipo de Registro */}
        <div className="space-y-2">
          <Label>Tipo de Registro</Label>
          <Select
            value={localTemaForm.tipoRegistro}
            onValueChange={(value) => handleChange("tipoRegistro", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione un tipo de registro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="libre">Tema Libre</SelectItem>
              <SelectItem value="inscripcion">
                Inscripción (Tema Inscrito)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Renderizado condicional utilizando tipoRegistro */}
        {localTemaForm.tipoRegistro !== "" && (
          <>
            {/* Título del Tema */}
            <div className="space-y-2">
              <Label>Título del Tema</Label>
              <Input
                placeholder="Ingrese el título del tema de tesis"
                value={localTemaForm.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
              />
            </div>

            {/* Área de Investigación */}
            <div className="space-y-2">
              <Label>Área de Investigación</Label>
              <Select
                value={localTemaForm.areaInvestigacion}
                onValueChange={(value) =>
                  handleChange("areaInvestigacion", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un área" />
                </SelectTrigger>
                <SelectContent>
                  {areasDeInvestigacion.map((area) => (
                    <SelectItem key={area.key} value={area.key}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                placeholder="Describa el tema de tesis propuesto"
                value={localTemaForm.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
              />
            </div>

            {/* Coasesores */}
            <div className="space-y-2">
              <Label>Coasesores (Opcional)</Label>
              <div className="flex gap-2">
                <Select
                  value={coasesorSeleccionado}
                  onValueChange={setCoasesorSeleccionado}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un coasesor" />
                  </SelectTrigger>
                  <SelectContent>
                    {coasesoresDisponibles
                      .filter(
                        (coasesor) =>
                          !localTemaForm.coasesores.includes(coasesor),
                      )
                      .map((coasesor) => (
                        <SelectItem key={coasesor} value={coasesor}>
                          {coasesor}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button variant={"outline"} onClick={handleAgregarCoasesor}>
                  Agregar
                </Button>
              </div>

              {/* Lista de coasesores seleccionados */}
              <div className="flex flex-wrap gap-2 mt-2">
                {localTemaForm.coasesores.map((coasesor, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full"
                  >
                    <span>{coasesor}</span>
                    <button
                      className="ml-2 text-white hover:text-gray-200"
                      onClick={() => handleEliminarCoasesor(coasesor)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Secciones adicionales según el tipoRegistro */}
            {localTemaForm.tipoRegistro === "inscripcion" && (
              <>
                {/* Asesor Principal */}
                <div className="space-y-2">
                  <Label>Asesor Principal</Label>
                  <Input value={localTemaForm.asesorPrincipal} disabled />
                </div>

                {/* Estudiantes */}
                <div className="space-y-2">
                  <Label>Estudiantes</Label>
                  <div className="flex gap-2">
                    <Select
                      value={estudianteSeleccionado}
                      onValueChange={setEstudianteSeleccionado}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un estudiante" />
                      </SelectTrigger>
                      <SelectContent>
                        {estudiantesDisponibles
                          .filter(
                            (estudiante) =>
                              !localTemaForm.estudiantes.includes(estudiante),
                          )
                          .map((estudiante) => (
                            <SelectItem key={estudiante} value={estudiante}>
                              {estudiante}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant={"outline"}
                      onClick={handleAgregarEstudiante}
                    >
                      Agregar
                    </Button>
                  </div>

                  {/* Lista de estudiantes seleccionados */}
                  <div className="space-y-2 mt-2">
                    {localTemaForm.estudiantes.map((estudiante, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {estudiante.split(" (")[0]}
                          </p>
                          <p className="text-xs text-gray-500">
                            {estudiante.split(" (")[1]?.replace(")", "")}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEliminarEstudiante(estudiante)}
                          className="border-0 shadow-none bg-transparent hover:bg-gray-200"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Debe agregar al menos un estudiante para temas de tipo
                    inscripción.
                  </p>
                </div>
              </>
            )}

            {localTemaForm.tipoRegistro === "libre" && (
              <div className="space-y-4">
                {/* Requisitos */}
                <div className="space-y-2">
                  <Label>Requisitos (Opcional)</Label>
                  <Textarea
                    placeholder="Requisitos para los estudiantes interesados en este tema"
                    defaultValue={localTemaForm.requisitos}
                    onChange={(e) => handleChange("requisitos", e.target.value)}
                  />
                </div>

                {/* Fecha Límite */}
                <div className="space-y-2">
                  <Label>Fecha Límite (Opcional)</Label>
                  <Input
                    type="date"
                    placeholder="mm/dd/yyyy"
                    defaultValue={localTemaForm.fechaLimite}
                    onChange={(e) =>
                      handleChange("fechaLimite", e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={handleCancelar}>
          Cancelar
        </Button>
        {localTemaForm.tipoRegistro !== "" && (
          <Button onClick={handleGuardar}>Guardar</Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

export default NuevoTemaDialog;


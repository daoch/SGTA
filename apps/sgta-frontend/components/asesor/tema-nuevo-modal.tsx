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
import { Coasesor, Tema, TemaForm, Tesista } from "@/app/types/temas/entidades";
import {
  coasesoresDisponibles,
  estudiantesDisponibles,
  areasDeInvestigacion,
  temaVacio,
} from "@/app/types/temas/data";

interface NuevoTemaDialogProps {
  isOpen: boolean;
  setIsNuevoTemaDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

enum TipoRegistro {
  NONE = "",
  LIBRE = "libre",
  INSCRIPCION = "inscripcion",
}

const NuevoTemaDialog: React.FC<NuevoTemaDialogProps> = ({
  isOpen,
  setIsNuevoTemaDialogOpen,
}) => {
  const [temaData, setTemaData] = useState<Tema>(temaVacio);
  const [tipoRegistro, setTipoRegistro] = useState(TipoRegistro.NONE);
  const [coasesorSeleccionado, setCoasesorSeleccionado] =
    useState<Coasesor | null>(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] =
    useState<Tesista | null>(null);

  const handleChange = (field: keyof Tema, value: any) => {
    setTemaData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAgregarCoasesor = () => {
    if (
      coasesorSeleccionado &&
      temaData.coasesores &&
      !temaData.coasesores?.some(
        (coasesor) => coasesor.codigoPucp === coasesorSeleccionado?.codigoPucp,
      )
    ) {
      setTemaData((prev) => ({
        ...prev,
        coasesores: prev.coasesores
          ? [...prev.coasesores, coasesorSeleccionado]
          : null,
      }));
      setCoasesorSeleccionado(null);
    }
  };

  const handleAgregarEstudiante = () => {
    if (
      estudianteSeleccionado &&
      temaData.tesistas &&
      !temaData.tesistas?.some(
        (tesista) => tesista.codigoPucp === estudianteSeleccionado?.codigoPucp,
      )
    ) {
      setTemaData((prev) => ({
        ...prev,
        tesistas: prev.tesistas
          ? [...prev.tesistas, estudianteSeleccionado]
          : null,
      }));
      setEstudianteSeleccionado(null);
    }
  };

  const handleEliminarCoasesor = (id: number) => {
    setTemaData((prev) => ({
      ...prev,
      coasesores: prev.coasesores
        ? prev.coasesores.filter((c) => c.id !== id)
        : null,
    }));
  };

  const handleEliminarEstudiante = (id: number) => {
    setTemaData((prev) => ({
      ...prev,
      tesistas: prev.tesistas ? prev.tesistas.filter((t) => t.id !== id) : null,
    }));
  };

  const handleGuardar = () => {
    // TODO: post tema
    // TODO: Manejar mensaje de usuario en caso de error/success
    setIsNuevoTemaDialogOpen(false);
    console.log("Tema creado");
  };

  const handleCancelar = () => {
    setTemaData(temaVacio);
    setIsNuevoTemaDialogOpen(false);
  };

  const onSelectCoasesor = (nombres: string) => {
    const selectedCoasesor = coasesoresDisponibles.find(
      (coasesor) => coasesor.nombres === nombres,
    );
    setCoasesorSeleccionado(selectedCoasesor || null);
  };

  const onEstudianteSeleccionado = (nombres: string) => {
    const selectedEstudiante = estudiantesDisponibles.find(
      (estudiante) => estudiante.nombres === nombres,
    );
    setEstudianteSeleccionado(selectedEstudiante || null);
  };

  const existStudent = (student: Tesista, tesistas: Tesista[]) => {
    return tesistas?.some((t) => t.codigoPucp === student.codigoPucp);
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
            value={tipoRegistro}
            onValueChange={(tipo) => setTipoRegistro(tipo as TipoRegistro)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione un tipo de registro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TipoRegistro.LIBRE}>Tema Libre</SelectItem>
              <SelectItem value={TipoRegistro.INSCRIPCION}>
                Inscripción (Tema Inscrito)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Renderizado condicional utilizando tipoRegistro */}
        {tipoRegistro !== "" && (
          <>
            {/* Título del Tema */}
            <div className="space-y-2">
              <Label>Título del Tema</Label>
              <Input
                placeholder="Ingrese el título del tema de tesis"
                value={temaData.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
              />
            </div>

            {/* Área de Investigación */}
            <div className="space-y-2">
              <Label>Área de Investigación</Label>
              <Select
              // value={temaData.areaInvestigacion}
              // onValueChange={(value) =>
              //   handleChange("areaInvestigacion", value)
              // }
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
                value={temaData.resumen}
                onChange={(e) => handleChange("resumen", e.target.value)}
              />
            </div>

            {/* Coasesores */}
            <div className="space-y-2">
              <Label>Coasesores (Opcional)</Label>
              <div className="flex gap-2">
                <Select
                  value={coasesorSeleccionado?.nombres}
                  onValueChange={onSelectCoasesor}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un coasesor" />
                  </SelectTrigger>
                  <SelectContent>
                    {coasesoresDisponibles
                      .filter(
                        (coasesor) =>
                          !temaData.coasesores?.some(
                            (c) => c.codigoPucp === coasesor.codigoPucp,
                          ),
                      )
                      .map((coasesor) => (
                        <SelectItem key={coasesor.id} value={coasesor.nombres}>
                          {coasesor.codigoPucp}: {coasesor.nombres}
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
                {temaData.coasesores?.map((coasesor, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full"
                  >
                    <span>{coasesor.nombres}</span>
                    <button
                      className="ml-2 text-white hover:text-gray-200"
                      onClick={() => handleEliminarCoasesor(coasesor.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Secciones adicionales según el tipoRegistro */}
            {tipoRegistro === TipoRegistro.INSCRIPCION && (
              <>
                {/* Asesor Principal */}
                <div className="space-y-2">
                  <Label>Asesor Principal</Label>
                  {/* <Input value={temaData.asesorPrincipal} disabled /> */}
                </div>

                {/* Estudiantes */}
                <div className="space-y-2">
                  <Label>Estudiantes</Label>
                  <div className="flex gap-2">
                    <Select
                      value={estudianteSeleccionado?.nombres}
                      onValueChange={onEstudianteSeleccionado}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un estudiante" />
                      </SelectTrigger>
                      <SelectContent>
                        {estudiantesDisponibles
                          .filter(
                            (estudiante) =>
                              !existStudent(
                                estudiante,
                                temaData.tesistas || [],
                              ),
                          )
                          .map((estudiante) => (
                            <SelectItem
                              key={estudiante.codigoPucp}
                              value={estudiante.nombres}
                            >
                              {estudiante.codigoPucp}: {estudiante.nombres}
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
                    {temaData.tesistas?.map((estudiante, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {estudiante.nombres}
                          </p>
                          <p className="text-xs text-gray-500">
                            {estudiante.codigoPucp}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleEliminarEstudiante(estudiante.id)
                          }
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

            {tipoRegistro === TipoRegistro.LIBRE && (
              <div className="space-y-4">
                {/* Requisitos */}
                {/* <div className="space-y-2">
                  <Label>Requisitos (Opcional)</Label>
                  <Textarea
                    placeholder="Requisitos para los estudiantes interesados en este tema"
                    defaultValue={temaData.requisitos}
                    onChange={(e) => handleChange("requisitos", e.target.value)}
                  />
                </div> */}

                {/* Fecha Límite */}
                <div className="space-y-2">
                  <Label>Fecha Límite (Opcional)</Label>
                  <Input
                    type="date"
                    placeholder="mm/dd/yyyy"
                    defaultValue={temaData.fechaLimite}
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
        {tipoRegistro !== TipoRegistro.NONE && (
          <Button onClick={handleGuardar}>Guardar</Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

export default NuevoTemaDialog;


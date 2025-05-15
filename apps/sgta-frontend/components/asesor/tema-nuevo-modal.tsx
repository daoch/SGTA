"use client";

import { asesorData, temaVacio } from "@/app/types/temas/data";
import {
  AreaDeInvestigacion,
  Carrera,
  Coasesor,
  Tema,
  TemaCreateInscription,
  Tesista,
} from "@/app/types/temas/entidades";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/lib/axios/axios-instance";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast, Toaster } from "sonner";
import ItemSelector from "./item-selector";

interface NuevoTemaDialogProps {
  isOpen: boolean;
  setIsNuevoTemaDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  coasesoresDisponibles: Coasesor[];
  estudiantesDisponibles: Tesista[];
  subareasDisponibles: AreaDeInvestigacion[];
  carrera: Carrera | null;
  onTemaGuardado: () => void;
}

enum TipoRegistro {
  NONE = "",
  LIBRE = "libre",
  INSCRIPCION = "inscripcion",
}

/**
 * Muestra un Dialog donde se podrá inscribir un tema o proponer tema libre.
 * @param setIsNuevoTemaDialogOpen Permite cerrar el dialog
 * @returns Dialog
 */
const NuevoTemaDialog: React.FC<NuevoTemaDialogProps> = ({
  isOpen,
  setIsNuevoTemaDialogOpen,
  coasesoresDisponibles,
  estudiantesDisponibles,
  subareasDisponibles,
  carrera,
  onTemaGuardado,
}) => {
  const [temaData, setTemaData] = useState<Tema>(temaVacio);
  const [tipoRegistro, setTipoRegistro] = useState(TipoRegistro.NONE);
  const [coasesorSeleccionado, setCoasesorSeleccionado] =
    useState<Coasesor | null>(null);
  const [areaSeleccionada, setAreaSeleccionada] =
    useState<AreaDeInvestigacion | null>(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] =
    useState<Tesista | null>(null);

  const handleChange = (field: keyof Tema, value: unknown) => {
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
        (c) => c.codigoPucp === coasesorSeleccionado?.codigoPucp,
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

  const handleAgregarSubarea = () => {
    if (
      areaSeleccionada &&
      temaData.subareas &&
      !temaData.subareas?.some((c) => c.id === areaSeleccionada?.id)
    ) {
      setTemaData((prev) => ({
        ...prev,
        subareas: prev.subareas
          ? [...prev.subareas, areaSeleccionada]
          : [areaSeleccionada],
      }));

      setAreaSeleccionada(null);
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

  const handleEliminarSubarea = (id: number) => {
    setTemaData((prev) => ({
      ...prev,
      subareas: prev.subareas ? prev.subareas.filter((a) => a.id !== id) : [],
    }));
  };

  const handleEliminarEstudiante = (id: number) => {
    setTemaData((prev) => ({
      ...prev,
      tesistas: prev.tesistas ? prev.tesistas.filter((t) => t.id !== id) : null,
    }));
  };

  /**
   * Crea un nuevo tema (Inscripción / Tema libre) y cierra el formulario.
   */
  const handleGuardar = async () => {
    try {
      if (carrera) {
        const response = await axiosInstance.post(
          "temas/createInscripcion",
          mapTemaCreateInscription(temaData, carrera),
        );

        toast.success("Tema guardado exitosamente");
        console.log("Tema guardado exitosamente:", response.data);
      } else {
        throw new Error("Falta carrera");
      }

      // Reinicia el formulario y cierra el modal
      setTemaData(temaVacio);
      setIsNuevoTemaDialogOpen(false);
      onTemaGuardado();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al guardar el tema",
      );
      console.error("Error al guardar el tema:", error);
    }
  };

  const handleCancelar = () => {
    setTemaData(temaVacio);
    setIsNuevoTemaDialogOpen(false);
  };

  const onSelectCoasesor = (nombres: string) => {
    const selectedCoasesor = coasesoresDisponibles.find(
      (c) => c.nombres === nombres,
    );
    setCoasesorSeleccionado(selectedCoasesor || null);
  };

  const onSelectSubarea = (nombre: string) => {
    const selectedArea = subareasDisponibles.find((a) => a.nombre === nombre);
    setAreaSeleccionada(selectedArea || null);
  };

  const onEstudianteSeleccionado = (nombres: string) => {
    const selectedEstudiante = estudiantesDisponibles.find(
      (e) => e.nombres === nombres,
    );
    setEstudianteSeleccionado(selectedEstudiante || null);
  };

  const existStudent = (student: Tesista, tesistas: Tesista[]) => {
    return tesistas?.some((t) => t.codigoPucp === student.codigoPucp);
  };

  return (
    <>
      <Toaster richColors position="top-right" />
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

              {/* Subareas */}
              <ItemSelector
                label="Subáreas"
                itemsDisponibles={subareasDisponibles}
                itemsSeleccionados={temaData.subareas}
                itemKey="id"
                itemLabel="nombre"
                selectedItem={areaSeleccionada}
                onSelectItem={onSelectSubarea}
                onAgregarItem={handleAgregarSubarea}
                onEliminarItem={handleEliminarSubarea}
              />

              {/* Área de Investigación */}
              {/* <div className="space-y-2">
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
                  {subareasDisponibles.map((area) => (
                    <SelectItem key={area.key} value={area.key}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

              {/* Descripción */}
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  placeholder="Describa el tema de tesis propuesto"
                  value={temaData.resumen}
                  onChange={(e) => handleChange("resumen", e.target.value)}
                />
              </div>

              {/* Objetivos */}
              <div className="space-y-2">
                <Label>Objetivos</Label>
                <Textarea
                  placeholder="Describa los objetivos del tema de tesis"
                  value={temaData.objetivos}
                  onChange={(e) => handleChange("objetivos", e.target.value)}
                />
              </div>

              {/* Coasesores */}
              <ItemSelector
                label="Coasesores (Opcional)"
                itemsDisponibles={coasesoresDisponibles}
                itemsSeleccionados={temaData.coasesores}
                itemKey="codigoPucp"
                itemLabel="nombres"
                selectedItem={coasesorSeleccionado}
                onSelectItem={onSelectCoasesor}
                onAgregarItem={handleAgregarCoasesor}
                onEliminarItem={handleEliminarCoasesor}
              />

              <Separator />

              {/* Secciones adicionales según el tipoRegistro */}
              {tipoRegistro === TipoRegistro.INSCRIPCION && (
                <>
                  {/* Asesor Principal */}
                  <div className="space-y-2">
                    <Label>Asesor Principal</Label>
                    <Input value={asesorData.name} disabled />
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
                </div>
              )}

              {/* Fecha Límite */}
              <div className="space-y-2">
                <Label>Fecha Límite (Opcional)</Label>
                <Input
                  type="date"
                  placeholder="mm/dd/yyyy"
                  defaultValue={temaData.fechaLimite}
                  onChange={(e) => handleChange("fechaLimite", e.target.value)}
                />
              </div>
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
    </>
  );
};

const mapTemaCreateInscription = (tema: Tema, carrera: Carrera) => {
  return {
    titulo: tema.titulo,
    carrera: { id: carrera.id },
    resumen: tema.resumen,
    objetivos: tema.objetivos,
    metodologia: tema.metodologia,
    fechaLimite: new Date(tema.fechaLimite + "T10:00:00Z").toISOString(),
    subareas: tema.subareas.map((a) => ({ id: a.id })),
    coasesores: [
      { id: asesorData.id },
      ...(tema.coasesores ? tema.coasesores.map((c) => ({ id: c.id })) : []),
    ],
    tesistas: tema.tesistas ? tema.tesistas.map((t) => ({ id: t.id })) : [],
  } as TemaCreateInscription;
};

export default NuevoTemaDialog;


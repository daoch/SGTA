"use client";

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
import {
  AreaConocimiento,
  AreaDeInvestigacion,
  Carrera,
  Coasesor,
  TemaCreateInscription,
  Tesista,
} from "@/features/temas/types/inscripcion/entities";
import { temaVacio } from "@/features/temas/types/inscripcion/mock";
import axiosInstance from "@/lib/axios/axios-instance";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import ItemSelector from "./item-selector";

//imports de Tema libre
import { fetchUsers } from "@/features/temas/types/inscripcion/data";
import {
  crearTemaLibre,
  fetchSubareasPorAreaConocimiento,
} from "@/features/temas/types/temas/data";
import {
  Subareas,
  Tema,
  TemaCreateLibre,
} from "@/features/temas/types/temas/entidades";
//

interface NuevoTemaDialogProps {
  setIsNuevoTemaDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  areasDisponibles: AreaConocimiento[];
  carreras: Carrera[] | null;
  onTemaGuardado: () => void;
  asesor: Coasesor;
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
  setIsNuevoTemaDialogOpen,
  areasDisponibles,
  carreras,
  onTemaGuardado,
  asesor,
}) => {
  const [temaData, setTemaData] = useState<Tema>(temaVacio);
  const [tipoRegistro, setTipoRegistro] = useState(TipoRegistro.NONE);
  const [coasesorSeleccionado, setCoasesorSeleccionado] =
    useState<Coasesor | null>(null);
  const [areaSeleccionada, setAreaSeleccionada] =
    useState<AreaDeInvestigacion | null>(null); // en realidad es la subarea
  const [estudianteSeleccionado, setEstudianteSeleccionado] =
    useState<Tesista | null>(null);
  const [errores, setErrores] = useState<{
    titulo?: string;
    resumen?: string;
    objetivos?: string;
    subareas?: string;
    tesistas?: string;
    fechaLimite?: string;
    area?: string;
  }>({});

  const [coasesoresDisponibles, setCoasesoresDisponibles] = useState<
    Coasesor[]
  >([]);
  const [estudiantesDisponibles, setEstudiantesDisponibles] = useState<
    Tesista[]
  >([]);

  // Datos de temas libres
  const [areaConocimientoSeleccionada, setAreaConocimientoSeleccionada] =
    useState<AreaConocimiento | null>(null);
  const [subAreas, setSubAreas] = useState<Subareas[]>([]);
  //

  //Llenado de datos
  useEffect(() => {
    const listarEstudiantesYAsesores = async () => {
      try {
        if (carreras) {
          const tesistasData: Tesista[] = await fetchUsers(
            carreras[0].id,
            "alumno",
          );
          setEstudiantesDisponibles(tesistasData.filter((t) => !t.asignado)); // No deben estar asignados

          const coasesoresData: Coasesor[] = await fetchUsers(
            carreras[0].id,
            "profesor",
          );

          setCoasesoresDisponibles(
            coasesoresData.filter((c) => c.id != asesor.id),
          );
        }
      } catch {
        console.log("No se pudo obtener los coasesores ni alumnos.");
      }
    };
    listarEstudiantesYAsesores();
  }, [carreras, asesor]);
  //

  useEffect(() => {
    validarCampos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temaData]);

  const handleChange = (field: keyof Tema, value: unknown) => {
    setTemaData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const cargarSubAreas = async () => {
      if (areaConocimientoSeleccionada?.id) {
        const subAreas = await fetchSubareasPorAreaConocimiento(
          areaConocimientoSeleccionada?.id,
        );
        setSubAreas(subAreas);
      }
    };
    cargarSubAreas();
  }, [areaConocimientoSeleccionada]);

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
    if (!validarCampos()) return;
    try {
      if (carreras) {
        const response = await axiosInstance.post(
          "temas/createInscripcion",
          mapTemaCreateInscription(temaData, carreras[0], asesor),
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

  const handleGuardarLibre = async () => {
    if (!validarCampos()) return;
    try {
      if (carreras) {
        await crearTemaLibre(mapTemaCreateLibre(temaData, carreras[0], asesor));
        toast.success("Tema guardado exitosamente");
        console.log("Tema libre guardado exitosamente:");
      } else {
        throw new Error("No se puede insertar el tema.");
      }

      // Reinicia el formulario y cierra el modal
      setTemaData(temaVacio);
      setAreaConocimientoSeleccionada(null);
      setIsNuevoTemaDialogOpen(false);
      onTemaGuardado();
    } catch (error) {
      toast.error("Error al guardar el tema.");
      console.error("Error al guardar el tema:", error);
    }
  };

  const handleCancelar = () => {
    setTemaData(temaVacio);
    setAreaConocimientoSeleccionada(null);
    setIsNuevoTemaDialogOpen(false);
  };

  const onSelectCoasesor = (nombres: string) => {
    const selectedCoasesor = coasesoresDisponibles.find(
      (c) => c.nombres === nombres,
    );
    setCoasesorSeleccionado(selectedCoasesor || null);
  };

  const onSelectSubarea = (nombre: string) => {
    const selectedArea = subAreas.find((a) => a.nombre === nombre);
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

  const validarCampos = () => {
    const nuevosErrores: typeof errores = {};
    if (!temaData.titulo || temaData.titulo.trim() === "") {
      nuevosErrores.titulo = "Debe ingresar el título del tema.";
    }
    if (!temaData.resumen || temaData.resumen.trim() === "") {
      nuevosErrores.resumen = "Debe ingresar la descripción del tema.";
    }
    if (!temaData.objetivos || temaData.objetivos.trim() === "") {
      nuevosErrores.objetivos = "Debe ingresar los objetivos del tema.";
    }
    if (!temaData.subareas || temaData.subareas.length === 0) {
      nuevosErrores.subareas = "Debe seleccionar al menos una subárea.";
    }
    // Solo para inscripción, validar tesistas
    if (
      tipoRegistro === TipoRegistro.INSCRIPCION &&
      (!temaData.tesistas || temaData.tesistas.length === 0)
    ) {
      nuevosErrores.tesistas =
        "Debe agregar al menos un estudiante para temas de tipo inscripción.";
    }
    if (!temaData.fechaLimite || temaData.fechaLimite.trim() === "") {
      nuevosErrores.fechaLimite = "Debe ingresar fecha límite del tema.";
    }
    //Solo para tema Libre
    if (
      tipoRegistro === TipoRegistro.LIBRE &&
      (areaConocimientoSeleccionada === null ||
        areaConocimientoSeleccionada === undefined)
    ) {
      nuevosErrores.area = "Debe seleccionar una área.";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };
  return (
    <>
      <Toaster richColors position="top-right" />
      <DialogContent className="w-3xl">
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
              onValueChange={(tipo) => {
                setTipoRegistro(tipo as TipoRegistro);
                setTemaData(temaVacio);
                setAreaConocimientoSeleccionada(null);
              }}
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
                {errores.titulo && (
                  <p className="text-red-500 text-xs mt-1">{errores.titulo}</p>
                )}
              </div>

              {/* Área de Investigación */}
              <div className="space-y-2">
                <Label>Áreas de Conocimiento</Label>
                <Select
                  onValueChange={(value) => {
                    const areaSeleccionada = areasDisponibles.find(
                      (area) => String(area.id) === value,
                    );
                    if (areaSeleccionada) {
                      setAreaConocimientoSeleccionada(areaSeleccionada);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un área" />
                  </SelectTrigger>
                  <SelectContent>
                    {areasDisponibles.map((area) => (
                      <SelectItem key={area.id} value={String(area.id)}>
                        {area.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errores.area && (
                  <p className="text-red-500 text-xs mt-1">{errores.area}</p>
                )}
              </div>

              {/* Subareas */}

              {
                <div>
                  <ItemSelector
                    label="Subáreas de Investigación"
                    itemsDisponibles={subAreas}
                    itemsSeleccionados={temaData.subareas}
                    itemKey="id"
                    itemLabel="nombre"
                    selectedItem={areaSeleccionada}
                    onSelectItem={onSelectSubarea}
                    onAgregarItem={handleAgregarSubarea}
                    onEliminarItem={handleEliminarSubarea}
                  />
                  {errores.subareas && (
                    <p className="text-red-500 text-xs mt-1">
                      {errores.subareas}
                    </p>
                  )}
                </div>
              }

              {/* Descripción */}
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  placeholder="Describa el tema de tesis propuesto"
                  value={temaData.resumen}
                  onChange={(e) => handleChange("resumen", e.target.value)}
                />
                {errores.resumen && (
                  <p className="text-red-500 text-xs mt-1">{errores.resumen}</p>
                )}
              </div>

              {/* Objetivos */}
              <div className="space-y-2">
                <Label>Objetivos</Label>
                <Textarea
                  placeholder="Describa los objetivos del tema de tesis"
                  value={temaData.objetivos}
                  onChange={(e) => handleChange("objetivos", e.target.value)}
                />
                {errores.objetivos && (
                  <p className="text-red-500 text-xs mt-1">
                    {errores.objetivos}
                  </p>
                )}
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
                    <Input value={asesor.nombres} disabled />
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
                      {temaData.tesistas?.map((estudiante) => (
                        <div
                          key={estudiante.id}
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
                    {errores.tesistas && (
                      <p className="text-red-500 text-xs mt-1">
                        {errores.tesistas}
                      </p>
                    )}
                  </div>
                </>
              )}

              {tipoRegistro === TipoRegistro.LIBRE && (
                <div className="space-y-4">
                  {/* Requisitos */}
                  {
                    <div className="space-y-2">
                      <Label>Requisitos (Opcional)</Label>
                      <Textarea
                        placeholder="Requisitos para los estudiantes interesados en este tema"
                        defaultValue={temaData.requisitos}
                        onChange={(e) =>
                          handleChange("requisitos", e.target.value)
                        }
                      />
                    </div>
                  }
                </div>
              )}

              {/* Fecha Límite */}
              {
                <div className="space-y-2">
                  <Label>Fecha Límite</Label>
                  <Input
                    type="date"
                    placeholder="mm/dd/yyyy"
                    defaultValue={temaData.fechaLimite}
                    onChange={(e) =>
                      handleChange("fechaLimite", e.target.value)
                    }
                  />
                  {errores.fechaLimite && (
                    <p className="text-red-500 text-xs mt-1">
                      {errores.fechaLimite}
                    </p>
                  )}
                </div>
              }
            </>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleCancelar}>
            Cancelar
          </Button>
          {tipoRegistro === TipoRegistro.INSCRIPCION && (
            <Button
              onClick={handleGuardar}
              disabled={Object.keys(errores).length > 0}
            >
              Guardar
            </Button>
          )}
          {tipoRegistro === TipoRegistro.LIBRE && (
            <Button
              onClick={handleGuardarLibre}
              disabled={Object.keys(errores).length > 0}
            >
              Guardar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </>
  );
};

const mapTemaCreateInscription = (
  tema: Tema,
  carrera: Carrera,
  asesor: Coasesor,
) => {
  return {
    titulo: tema.titulo,
    carrera: { id: carrera.id },
    resumen: tema.resumen,
    objetivos: tema.objetivos,
    metodologia: tema.metodologia,
    fechaLimite: new Date(tema.fechaLimite + "T10:00:00Z").toISOString(),
    subareas: tema.subareas.map((a) => ({ id: a.id })),
    coasesores: [
      { id: asesor.id },
      ...(tema.coasesores ? tema.coasesores.map((c) => ({ id: c.id })) : []),
    ],
    tesistas: tema.tesistas ? tema.tesistas.map((t) => ({ id: t.id })) : [],
  } as TemaCreateInscription;
};

const mapTemaCreateLibre = (tema: Tema, carrera: Carrera, asesor: Coasesor) => {
  return {
    titulo: tema.titulo,
    carrera: { id: carrera.id },
    resumen: tema.resumen,
    objetivos: tema.objetivos,
    metodologia: tema.metodologia,
    fechaLimite: new Date(tema.fechaLimite + "T10:00:00Z").toISOString(),
    subareas: tema.subareas.map((a) => ({ id: a.id })),
    coasesores: [
      { id: asesor.id },
      ...(tema.coasesores ? tema.coasesores.map((c) => ({ id: c.id })) : []),
    ],
    requisitos: tema.requisitos,
  } as TemaCreateLibre;
};

export default NuevoTemaDialog;

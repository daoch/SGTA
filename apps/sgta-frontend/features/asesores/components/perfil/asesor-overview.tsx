"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Mail, Pencil, Plus, X } from "lucide-react";
import { useState } from "react";

import {
  AreaTematica,
  AsesorPerfil,
  Enlace,
  PlataformaType,
  Proyecto,
  TemaInteres,
  Tesis,
} from "../../types/perfil/entidades";
import { EstadisticasAsesorCard } from "./indicadores-asesor";
import { ItemCopiable } from "./item-copia";
import ModalSubirFoto from "./modal-subir-foto";
import { PLATAFORMAS_DISPONIBLES, PlatformIcon } from "./plataforma-icons";

interface Props {
  asesor: AsesorPerfil;
  editedData: AsesorPerfil;
  isEditing: boolean;
  setEditedData: (data: AsesorPerfil) => void;
  avatar?: string | null;
  tesis: Tesis[];
  proyectos: Proyecto[];
  areasFiltered: AreaTematica[];
  temasFiltered: TemaInteres[];
  selectedArea: AreaTematica | null;
  selectedTema: TemaInteres | null;
  openAreaCombobox: boolean;
  openTemaCombobox: boolean;
  recentlyAddedArea: number | null;
  setSelectedArea: (area: AreaTematica | null) => void;
  setSelectedTema: (tema: TemaInteres | null) => void;
  setOpenAreaCombobox: (open: boolean) => void;
  setOpenTemaCombobox: (open: boolean) => void;
  addAreaTematica: (area: AreaTematica) => void;
  addTemaInteres: () => void;
  initiateAreaDelete: (area: AreaTematica) => void;
  removeTemaInteres: (idTema: number) => void;
  isAsesor: boolean;
  onFotoChange?: (nuevaFoto: string | null) => void;
}

export default function OverviewSection({
  asesor,
  editedData,
  isEditing,
  setEditedData,
  avatar,
  tesis,
  proyectos,
  areasFiltered,
  temasFiltered,
  selectedArea,
  selectedTema,
  openAreaCombobox,
  openTemaCombobox,
  recentlyAddedArea,
  setSelectedArea,
  setSelectedTema,
  setOpenAreaCombobox,
  setOpenTemaCombobox,
  addAreaTematica,
  addTemaInteres,
  initiateAreaDelete,
  removeTemaInteres,
  isAsesor,
  onFotoChange,
}: Readonly<Props>) {
  const [newEnlace, setNewEnlace] = useState<{
    nombrePlataforma?: PlataformaType;
    plataforma: string;
    enlace: string;
  }>({
    nombrePlataforma: undefined,
    plataforma: "",
    enlace: "",
  });
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [isModalFotoOpen, setIsModalFotoOpen] = useState(false);

  const tesisEnProceso = tesis.filter((t) => t.estado === "en_proceso").length;
  const totalProyectos = proyectos.length;
  const totalTemas =
    editedData.areasTematicas.length + editedData.temasIntereses.length;

  // Obtener ORCID ID de los enlaces
  const orcidEnlace = editedData.enlaces.find(
    (enlace) => enlace.nombrePlataforma === "ORCID",
  );
  const enlacesSinOrcid = editedData.enlaces.filter(
    (enlace) => enlace.nombrePlataforma !== "ORCID",
  );

  const addEnlace = () => {
    if (newEnlace.plataforma.trim() && newEnlace.enlace.trim()) {
      // No asignamos ID para nuevos enlaces
      const nuevoEnlace: Enlace = {
        plataforma: newEnlace.plataforma.trim(),
        enlace: newEnlace.enlace,
      };

      // Si se seleccionó una plataforma predefinida, la guardamos
      if (
        newEnlace.nombrePlataforma &&
        newEnlace.nombrePlataforma !== "Otras"
      ) {
        nuevoEnlace.nombrePlataforma = newEnlace.nombrePlataforma;
      }

      setEditedData({
        ...editedData,
        enlaces: [...editedData.enlaces, nuevoEnlace],
      });

      setNewEnlace({ nombrePlataforma: undefined, plataforma: "", enlace: "" });
    }
  };

  const removeEnlace = (index: number) => {
    const newEnlaces = [...editedData.enlaces];
    newEnlaces.splice(index, 1);
    setEditedData({
      ...editedData,
      enlaces: newEnlaces,
    });
  };

  const updateEnlace = (
    index: number,
    field: keyof Enlace,
    value: string | PlataformaType | undefined,
  ) => {
    // Clonar los enlaces profundamente
    const newEnlaces = editedData.enlaces.map((enlace) => ({ ...enlace }));

    if (field === "nombrePlataforma") {
      if (value === "Otras") {
        newEnlaces[index].nombrePlataforma = undefined;
      } else {
        newEnlaces[index].nombrePlataforma = value as PlataformaType;
        newEnlaces[index].plataforma = value as string;
      }
    } else if (field === "plataforma") {
      newEnlaces[index].plataforma = value as string;
    } else if (field === "enlace") {
      newEnlaces[index].enlace = value as string;
    }

    setEditedData({
      ...editedData,
      enlaces: newEnlaces,
    });
  };

  const handlePlatformTypeChange = (value: PlataformaType) => {
    if (value === "Otras") {
      setNewEnlace({ ...newEnlace, nombrePlataforma: value, plataforma: "" });
    } else {
      setNewEnlace({
        ...newEnlace,
        nombrePlataforma: value,
        plataforma: value,
      });
    }
  };

  const handleOpenModalFoto = () => {
    setIsModalFotoOpen(true);
  };

  const handleFotoChange = (nuevaFoto: string | null) => {
    if (onFotoChange) {
      onFotoChange(nuevaFoto);
    }
  };

  const displayedTopics = showAllTopics
    ? [
        ...editedData.areasTematicas.map((item) => ({
          ...item,
          tipo: "Área Temática" as const,
        })),
        ...editedData.temasIntereses.map((item) => ({
          ...item,
          tipo: "Tema de Interés" as const,
        })),
      ]
    : [
        ...editedData.areasTematicas.map((item) => ({
          ...item,
          tipo: "Área Temática" as const,
        })),
        ...editedData.temasIntereses.map((item) => ({
          ...item,
          tipo: "Tema de Interés" as const,
        })),
      ].slice(0, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Columna izquierda - Foto y información básica */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar className="w-32 h-32 rounded-lg mb-2">
                <AvatarImage
                  src={avatar || undefined}
                  alt={asesor?.nombre || "Usuario"}
                />
                <AvatarFallback className="rounded-lg">
                  {asesor?.nombre
                    ? asesor.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "US"}
                </AvatarFallback>
              </Avatar>

              {isEditing && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 shadow-md hover:shadow-lg transition-shadow"
                  onClick={handleOpenModalFoto}
                  title="Cambiar foto"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>

            <h2 className="text-2xl font-bold mb-2">{asesor?.nombre}</h2>
            <p className="text-gray-600 mb-4">{asesor?.especialidad}</p>

            <div
              className={`px-3 py-1 rounded-full text-sm mb-6
              ${asesor.estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {asesor.estado ? "Disponible" : "No disponible"}
            </div>

            {/* Topics/Tags */}
            {isAsesor && (
              <div className="w-full">
                <div className="flex flex-wrap gap-2 justify-center mb-3">
                  {displayedTopics.map((item, index) => (
                    <Badge
                      key={`${item.nombre}-${index}`}
                      variant="secondary"
                      className={`text-xs ${
                        item.tipo === "Área Temática"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {item.nombre}
                    </Badge>
                  ))}
                </div>

                {totalTemas > 6 && (
                  <button
                    onClick={() => setShowAllTopics(!showAllTopics)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {showAllTopics
                      ? "Mostrar menos"
                      : `Mostrar todos los ${totalTemas} temas`}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Columna central - Expertise y Links */}
      <div className="lg:col-span-6">
        <div className="space-y-8">
          {/* Expertise Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Experiencia</h3>
            <div className="bg-white rounded-lg shadow p-6">
              {isEditing ? (
                <Textarea
                  value={editedData.biografia ?? ""}
                  onChange={(e) =>
                    setEditedData({ ...editedData, biografia: e.target.value })
                  }
                  className="min-h-[150px] w-full"
                  placeholder="Describe tu experiencia y especialización..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {editedData.biografia ||
                    "No hay información de experiencia disponible."}
                </p>
              )}
            </div>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Enlaces</h3>
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              {isEditing ? (
                <div className="space-y-4">
                  {/* Enlaces existentes */}
                  {editedData.enlaces.map((enlace, index) => (
                    <div key={index} className="space-y-3 md:space-y-0">
                      {/* Layout responsive: stack en móvil, grid en desktop */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start md:items-center">
                        {/* Tipo de plataforma - 3 columnas en desktop */}
                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                            Tipo de plataforma
                          </label>
                          <div className="flex items-center gap-2">
                            <Select
                              value={enlace.nombrePlataforma ?? "Otras"}
                              onValueChange={(value: PlataformaType) =>
                                updateEnlace(index, "nombrePlataforma", value)
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {PLATAFORMAS_DISPONIBLES.map((plataforma) => (
                                  <SelectItem
                                    key={plataforma}
                                    value={plataforma}
                                  >
                                    <div className="flex items-center gap-2">
                                      <PlatformIcon
                                        nombrePlataforma={plataforma}
                                        plataforma={plataforma}
                                      />
                                      <span>{plataforma}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Nombre de plataforma - 4 columnas en desktop */}
                        <div className="md:col-span-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                            Nombre de la plataforma
                          </label>
                          <Input
                            placeholder="Nombre de la plataforma"
                            value={enlace.plataforma}
                            onChange={(e) =>
                              updateEnlace(index, "plataforma", e.target.value)
                            }
                            className="w-full"
                            disabled={
                              enlace.nombrePlataforma !== undefined &&
                              enlace.nombrePlataforma !== "Otras"
                            }
                          />
                        </div>

                        {/* Enlace - 4 columnas en desktop */}
                        <div className="md:col-span-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                            Enlace
                          </label>
                          <Input
                            placeholder="https://..."
                            value={enlace.enlace}
                            onChange={(e) =>
                              updateEnlace(index, "enlace", e.target.value)
                            }
                            className="w-full"
                          />
                        </div>

                        {/* Botón eliminar - 1 columna en desktop */}
                        <div className="md:col-span-1 flex justify-end">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeEnlace(index)}
                            className="shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Formulario para nuevo enlace */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Agregar nuevo enlace
                    </h4>
                    <div className="space-y-3 md:space-y-0">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start md:items-center">
                        {/* Tipo de plataforma */}
                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                            Tipo de plataforma
                          </label>
                          <div className="flex items-center gap-2">
                            {newEnlace.nombrePlataforma && (
                              <PlatformIcon
                                nombrePlataforma={newEnlace.nombrePlataforma}
                                plataforma={newEnlace.plataforma}
                              />
                            )}
                            <Select
                              value={newEnlace.nombrePlataforma}
                              onValueChange={handlePlatformTypeChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar..." />
                              </SelectTrigger>
                              <SelectContent>
                                {PLATAFORMAS_DISPONIBLES.map((plataforma) => (
                                  <SelectItem
                                    key={plataforma}
                                    value={plataforma}
                                  >
                                    <div className="flex items-center gap-2">
                                      <PlatformIcon
                                        nombrePlataforma={plataforma}
                                        plataforma={plataforma}
                                      />
                                      {plataforma}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Nombre de plataforma */}
                        <div className="md:col-span-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                            Nombre de la plataforma
                          </label>
                          <Input
                            placeholder="Nombre de la plataforma"
                            value={newEnlace.plataforma}
                            onChange={(e) =>
                              setNewEnlace({
                                ...newEnlace,
                                plataforma: e.target.value,
                              })
                            }
                            className="w-full"
                            disabled={
                              newEnlace.nombrePlataforma !== undefined &&
                              newEnlace.nombrePlataforma !== "Otras"
                            }
                          />
                        </div>

                        {/* Enlace */}
                        <div className="md:col-span-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                            Enlace
                          </label>
                          <Input
                            placeholder="https://..."
                            value={newEnlace.enlace}
                            onChange={(e) =>
                              setNewEnlace({
                                ...newEnlace,
                                enlace: e.target.value,
                              })
                            }
                            className="w-full"
                          />
                        </div>

                        {/* Botón agregar */}
                        <div className="md:col-span-1 flex justify-end">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={addEnlace}
                            disabled={
                              !newEnlace.plataforma.trim() ||
                              !newEnlace.enlace.trim()
                            }
                            className="shrink-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {enlacesSinOrcid.length > 0 ? (
                    enlacesSinOrcid.map((enlace, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <PlatformIcon
                          nombrePlataforma={enlace.nombrePlataforma}
                          plataforma={enlace.plataforma}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {enlace.plataforma}
                          </div>
                          <a
                            href={enlace.enlace}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block"
                          >
                            {enlace.enlace}
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No hay enlaces registrados
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Areas y Temas de Interés - Solo en modo edición */}
          {isEditing && isAsesor && (
            <>
              {/* Áreas Temáticas */}
              <div>
                <h3 className="text-xl font-bold mb-4">Áreas Temáticas</h3>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {editedData.areasTematicas.map((area) => (
                        <div
                          key={area.idArea}
                          className={`flex items-center px-3 py-1 rounded-full text-sm
                            ${
                              recentlyAddedArea === area.idArea
                                ? "bg-yellow-100 text-yellow-800 animate-pulse"
                                : "bg-green-100 text-green-800"
                            }`}
                        >
                          <span>{area.nombre}</span>
                          <button
                            onClick={() => initiateAreaDelete(area)}
                            className="ml-2 text-green-800 hover:text-green-950"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Popover
                        open={openAreaCombobox}
                        onOpenChange={setOpenAreaCombobox}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openAreaCombobox}
                            className="flex-1 justify-between"
                          >
                            {selectedArea
                              ? selectedArea.nombre
                              : "Seleccionar área temática..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar área temática..." />
                            <CommandList>
                              <CommandEmpty>
                                No se encontraron áreas temáticas.
                              </CommandEmpty>
                              <CommandGroup className="max-h-60 overflow-auto">
                                {areasFiltered.map((area) => (
                                  <CommandItem
                                    key={area.idArea}
                                    value={area.nombre}
                                    onSelect={() => {
                                      setSelectedArea(
                                        selectedArea?.idArea === area.idArea
                                          ? null
                                          : area,
                                      );
                                      setOpenAreaCombobox(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedArea?.idArea === area.idArea
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {area.nombre}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <Button
                        onClick={() => {
                          if (selectedArea) {
                            addAreaTematica(selectedArea);
                            setSelectedArea(null);
                          }
                        }}
                        variant="outline"
                        size="icon"
                        disabled={!selectedArea}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Temas de Interés */}
              <div>
                <h3 className="text-xl font-bold mb-4">Temas de Interés</h3>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {editedData.temasIntereses.map((tema) => (
                        <div
                          key={tema.idTema}
                          className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                        >
                          <span>{tema.nombre}</span>
                          <button
                            onClick={() => removeTemaInteres(tema.idTema)}
                            className="ml-2 text-purple-800 hover:text-purple-950"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Popover
                        open={openTemaCombobox}
                        onOpenChange={setOpenTemaCombobox}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openTemaCombobox}
                            className="flex-1 justify-between"
                          >
                            {selectedTema
                              ? selectedTema.nombre
                              : "Seleccionar tema de interés..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar tema de interés..." />
                            <CommandList>
                              <CommandEmpty>
                                No se encontraron temas de interés.
                              </CommandEmpty>
                              <CommandGroup className="max-h-60 overflow-auto">
                                {temasFiltered.map((tema) => {
                                  const areaYaSeleccionada =
                                    editedData.areasTematicas?.some(
                                      (a) =>
                                        a.idArea === tema.areaTematica?.idArea,
                                    );

                                  return (
                                    <CommandItem
                                      key={tema.idTema}
                                      value={tema.nombre}
                                      onSelect={() => {
                                        setSelectedTema(
                                          selectedTema?.idTema === tema.idTema
                                            ? null
                                            : tema,
                                        );
                                        setOpenTemaCombobox(false);
                                      }}
                                      className="flex items-center justify-between"
                                    >
                                      <div className="flex items-center">
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedTema?.idTema === tema.idTema
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                        <span>{tema.nombre}</span>
                                      </div>
                                      {!areaYaSeleccionada && (
                                        <Badge
                                          variant="outline"
                                          className="ml-2 bg-yellow-100 text-yellow-800 text-xs"
                                        >
                                          + {tema.areaTematica.nombre}
                                        </Badge>
                                      )}
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <Button
                        onClick={addTemaInteres}
                        variant="outline"
                        size="icon"
                        disabled={!selectedTema}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Columna derecha - Información de contacto y estadísticas */}
      <div className="lg:col-span-3">
        <div className="space-y-6">
          {/* Global ID (ORCID) */}
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold text-gray-900 mb-3">ORCID</h4>
            <div className="space-y-2">
              {orcidEnlace ? (
                <div className="flex items-center gap-2">
                  <PlatformIcon
                    nombrePlataforma="ORCID"
                    plataforma="ORCID"
                    className="h-5 w-5"
                  />
                  <a
                    href={orcidEnlace.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-mono text-sm"
                  >
                    {orcidEnlace.enlace.replace("https://orcid.org/", "")}
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <PlatformIcon
                    nombrePlataforma="ORCID"
                    plataforma="ORCID"
                    className="h-5 w-5"
                  />
                  <span className="text-sm">No registrado</span>
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Email</h4>
            {isEditing ? (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <Input
                  value={editedData.email}
                  onChange={(e) =>
                    setEditedData({ ...editedData, email: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <ItemCopiable
                  valor={editedData.email}
                  nombre="correo electrónico"
                />
              </div>
            )}
          </div>

          {/* Estadísticas */}
          {isAsesor && (
            <EstadisticasAsesorCard
              tesisEnProceso={tesisEnProceso}
              totalProyectos={totalProyectos}
              tesistasActuales={asesor.tesistasActuales}
              limiteTesis={asesor.limiteTesis}
            />
          )}
        </div>
      </div>
      <ModalSubirFoto
        open={isModalFotoOpen}
        onOpenChange={setIsModalFotoOpen}
        onFotoChange={handleFotoChange}
        fotoActual={avatar}
      />
    </div>
  );
}

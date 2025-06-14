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
import {
  Check,
  ChevronsUpDown,
  Clock,
  Mail,
  Plus,
  User,
  Users,
  X,
} from "lucide-react";
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
import { ItemCopiable } from "./item-copia";
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
    const newEnlaces = [...editedData.enlaces];

    if (field === "nombrePlataforma") {
      // Si cambia a una plataforma predefinida, actualizamos el nombre de la plataforma
      if (value === "Otras") {
        newEnlaces[index].nombrePlataforma = undefined;
      } else {
        newEnlaces[index].nombrePlataforma = value as PlataformaType;
        // Si selecciona una plataforma predefinida, usamos ese nombre como plataforma
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

  const displayedTopics = showAllTopics
    ? [...editedData.areasTematicas, ...editedData.temasIntereses]
    : [...editedData.areasTematicas, ...editedData.temasIntereses].slice(0, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Columna izquierda - Foto y información básica */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-48 h-48 rounded-lg mb-4">
              <AvatarImage
                src={avatar || undefined}
                alt={asesor?.nombre || "Usuario"}
              />
              <AvatarFallback className="rounded-lg text-2xl">
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

            <h2 className="text-2xl font-bold mb-2">{asesor?.nombre}</h2>
            <p className="text-gray-600 mb-4">{asesor?.especialidad}</p>

            <div
              className={`px-3 py-1 rounded-full text-sm mb-6
              ${asesor.estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {asesor.estado ? "Disponible" : "No disponible"}
            </div>

            {/* Topics/Tags */}
            <div className="w-full">
              <div className="flex flex-wrap gap-2 justify-center mb-3">
                {displayedTopics.map((item, index) => (
                  <Badge
                    key={`${item.nombre}-${index}`}
                    variant="secondary"
                    className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
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
            <div className="bg-white rounded-lg shadow p-6">
              {isEditing ? (
                <div className="space-y-4">
                  {editedData.enlaces.map((enlace, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <PlatformIcon
                          nombrePlataforma={enlace.nombrePlataforma}
                          plataforma={enlace.plataforma}
                        />
                        <Select
                          value={enlace.nombrePlataforma || "Otras"}
                          onValueChange={(value: PlataformaType) =>
                            updateEnlace(index, "nombrePlataforma", value)
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PLATAFORMAS_DISPONIBLES.map((plataforma) => (
                              <SelectItem key={plataforma} value={plataforma}>
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

                      {/* Campo para nombre de plataforma */}
                      <Input
                        placeholder="Nombre de la plataforma"
                        value={enlace.plataforma}
                        onChange={(e) =>
                          updateEnlace(index, "plataforma", e.target.value)
                        }
                        className="flex-1"
                        disabled={
                          enlace.nombrePlataforma !== undefined &&
                          enlace.nombrePlataforma !== "Otras"
                        }
                      />

                      <Input
                        placeholder="Enlace"
                        value={enlace.enlace}
                        onChange={(e) =>
                          updateEnlace(index, "enlace", e.target.value)
                        }
                        className="flex-2"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeEnlace(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex gap-2 items-center pt-2 border-t">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
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
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Plataforma" />
                        </SelectTrigger>
                        <SelectContent>
                          {PLATAFORMAS_DISPONIBLES.map((plataforma) => (
                            <SelectItem key={plataforma} value={plataforma}>
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

                    {/* Campo para nombre de plataforma */}
                    <Input
                      placeholder="Nombre de la plataforma"
                      value={newEnlace.plataforma}
                      onChange={(e) =>
                        setNewEnlace({
                          ...newEnlace,
                          plataforma: e.target.value,
                        })
                      }
                      className="flex-1"
                      disabled={
                        newEnlace.nombrePlataforma !== undefined &&
                        newEnlace.nombrePlataforma !== "Otras"
                      }
                    />

                    <Input
                      placeholder="Nuevo enlace"
                      value={newEnlace.enlace}
                      onChange={(e) =>
                        setNewEnlace({ ...newEnlace, enlace: e.target.value })
                      }
                      className="flex-2"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={addEnlace}
                      disabled={
                        !newEnlace.plataforma.trim() || !newEnlace.enlace.trim()
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {enlacesSinOrcid.length > 0 ? (
                    enlacesSinOrcid.map((enlace, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <PlatformIcon
                          nombrePlataforma={enlace.nombrePlataforma}
                          plataforma={enlace.plataforma}
                        />
                        <a
                          href={enlace.enlace}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {enlace.plataforma}
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No hay enlaces registrados</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Areas y Temas de Interés - Solo en modo edición */}
          {isEditing && (
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
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Estadísticas</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    Tesis en Proceso
                  </span>
                </div>
                <span className="font-semibold text-blue-600">
                  {tesisEnProceso}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-gray-600">
                    Proyectos Realizados
                  </span>
                </div>
                <span className="font-semibold text-purple-600">
                  {totalProyectos}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Capacidad</span>
                </div>
                <span className="font-semibold text-green-600">
                  {asesor.tesistasActuales}/{asesor.limiteTesis}
                </span>
              </div>

              {/* Barra de capacidad */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  {(() => {
                    const tesistas = asesor.tesistasActuales ?? 0;
                    const limite = asesor.limiteTesis ?? 0;
                    const proporcion = limite > 0 ? tesistas / limite : 0;
                    const color =
                      proporcion >= 1
                        ? "bg-red-500"
                        : proporcion >= 0.5
                          ? "bg-yellow-400"
                          : "bg-green-500";

                    return (
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${color}`}
                        style={{ width: `${proporcion * 100}%` }}
                      ></div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

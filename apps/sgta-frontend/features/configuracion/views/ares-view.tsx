"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, X, ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getAllAreasByCarreraId,
  createArea,
  deleteAreaById,
  createSubArea,
  deleteSubAreaById,
  getAllSubAreasByAreaId,
} from "@/features/configuracion/services/configuracion-service";
import { AreaResponse, AreaType, SubAreaType } from "@/features/configuracion/types/Area.type";
import { ConfirmarEliminarModal } from "../components/configuracion/confirmar-eliminar-modal";

export default function AreasPage() {
  const [areas, setAreas] = useState<AreaType[]>([]);
  const [newArea, setNewArea] = useState("");
  const [newAreaDescripcion, setNewAreaDescripcion] = useState("");
  const [newSubArea, setNewSubArea] = useState("");
  const [showSubAreaInput, setShowSubAreaInput] = useState<number | null>(null);
  const [expandedAreas, setExpandedAreas] = useState<Set<number>>(new Set());
  const [loadingOperation, setLoadingOperation] = useState<{
    type: "addArea" | "addSubArea" | "deleteArea" | "deleteSubArea" | "save" | null;
    id?: number;
  }>({ type: null });
  const [modalEliminar, setModalEliminar] = useState<{
    tipo: "area" | "subarea" | null;
    idArea?: number;
    idSubArea?: number;
  }>({ tipo: null });

  // Cargar áreas al montar el componente
  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      setLoadingOperation({ type: "save" });
      const areasData = await getAllAreasByCarreraId();

      // Para cada área, cargar sus subáreas
      const areasWithSubareas = await Promise.all(
        areasData.map(async (area: AreaResponse) => {
          const subareas = await getAllSubAreasByAreaId(area.id);
          return {
            id: area.id,
            nombre: area.nombre,
            descripcion: area.descripcion || "",
            subAreas: subareas.map((sub: SubAreaType) => ({
              id: sub.id,
              nombre: sub.nombre,
            })),
            idCarrera: area.idCarrera,
          };
        }),
      );

      setAreas(areasWithSubareas);
    } catch (error) {
      console.error("Error al cargar áreas:", error);
      toast.error("Error al cargar las áreas");
    } finally {
      setLoadingOperation({ type: null });
    }
  };

  const handleAddArea = async () => {
    if (newArea.trim()) {
      try {
        setLoadingOperation({ type: "addArea" });
        const response = await createArea({
          nombre: newArea,
          activo: true,
          descripcion: newAreaDescripcion,
          subAreas: []
        });

        const newAreaWithSubareas = {
          id: response.id,
          nombre: response.nombre,
          descripcion: response.descripcion,
          subAreas: [],
          idCarrera: response.idCarrera,
        };

        setAreas((prev) => [...prev, newAreaWithSubareas]);
        setNewArea("");
        setNewAreaDescripcion("");
        toast.success("Área creada exitosamente");
      } catch (error) {
        console.error("Error al agregar el área:", error);
        toast.error("Error al crear el área");
      } finally {
        setLoadingOperation({ type: null });
      }
    }
  };

  const handleDeleteArea = async (id: number) => {
    setModalEliminar({ tipo: "area", idArea: id });
  };

  const handleAddSubArea = async (areaId: number) => {
    if (newSubArea.trim()) {
      try {
        setLoadingOperation({ type: "addSubArea", id: areaId });
        const response = await createSubArea({
          nombre: newSubArea,
          idAreaConocimiento: areaId,
        });

        setAreas((prev) =>
          prev.map((area) =>
            area.id === areaId
              ? {
                  ...area,
                  subAreas: [
                    ...area.subAreas,
                    {
                      id: response.id,
                      nombre: response.nombre,
                    },
                  ],
                }
              : area,
          ),
        );

        setNewSubArea("");
        setShowSubAreaInput(null);
        toast.success("Subárea creada exitosamente");
      } catch (error) {
        console.error("Error al agregar la subárea:", error);
        toast.error("Error al crear la subárea");
      } finally {
        setLoadingOperation({ type: null });
      }
    }
  };

  const handleDeleteSubArea = async (areaId: number, subAreaId: number) => {
    setModalEliminar({ tipo: "subarea", idArea: areaId, idSubArea: subAreaId });
  };

  const confirmarEliminar = async () => {
    if (modalEliminar.tipo === "area" && modalEliminar.idArea) {
      try {
        setLoadingOperation({ type: "deleteArea", id: modalEliminar.idArea });
        await deleteAreaById(modalEliminar.idArea);
        setAreas((prev) => prev.filter((area) => area.id !== modalEliminar.idArea));
        setExpandedAreas((prev) => {
          const newSet = new Set(prev);
          newSet.delete(modalEliminar.idArea!);
          return newSet;
        });
        toast.success("Área eliminada exitosamente");
      } catch (error) {
        console.error("Error al eliminar el área:", error);
        toast.error("Error al eliminar el área");
      } finally {
        setLoadingOperation({ type: null });
        setModalEliminar({ tipo: null });
      }
    } else if (modalEliminar.tipo === "subarea" && modalEliminar.idArea && modalEliminar.idSubArea) {
      try {
        setLoadingOperation({ type: "deleteSubArea", id: modalEliminar.idArea });
        await deleteSubAreaById(modalEliminar.idSubArea);
        setAreas((prev) =>
          prev.map((area) =>
            area.id === modalEliminar.idArea
              ? {
                  ...area,
                  subAreas: area.subAreas.filter((sub) => sub.id !== modalEliminar.idSubArea),
                }
              : area,
          ),
        );
        toast.success("Subárea eliminada exitosamente");
      } catch (error) {
        console.error("Error al eliminar la subárea:", error);
        toast.error("Error al eliminar la subárea");
      } finally {
        setLoadingOperation({ type: null });
        setModalEliminar({ tipo: null });
      }
    }
  };

  const toggleAreaExpansion = (areaId: number) => {
    setExpandedAreas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(areaId)) {
        newSet.delete(areaId);
      } else {
        newSet.add(areaId);
      }
      return newSet;
    });
  };

  const isAreaExpanded = (areaId: number) => expandedAreas.has(areaId);

  return (
    <div className="">
      <div className="flex items-center gap-2 mt-5 mb-4">
        <Link
          href="/coordinador/configuracion/general"
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
        >
          <ArrowLeft size={11} />
        </Link>
        <h1 className="text-2xl font-bold text-[#042354]">
          Áreas y Sub-áreas de Investigación
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <Input
              placeholder="Nueva área de investigación"
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddArea();
                }
              }}
            />
            <Button
              onClick={handleAddArea}
              disabled={loadingOperation.type === "addArea" || !newArea.trim()}
            >
              {loadingOperation.type === "addArea" ? "Agregando..." : "Agregar"}
            </Button>
          </div>
          <div className="grid grid-cols-1 items-center gap-2">
            <Input
              placeholder="Descripción del área"
              value={newAreaDescripcion}
              onChange={(e) => setNewAreaDescripcion(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddArea();
                }
              }}
            />
          </div>
        </div>

        <Separator className="my-6" />

        <ScrollArea className="h-[500px] pr-4">
          {areas && areas.length > 0 ? (
            areas.map((area: AreaType) => (
              <div key={`area-${area.id}`} className="mb-4 bg-gray-50 rounded-lg overflow-hidden">
                {/* Header del área */}
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleAreaExpansion(area.id)}
                >
                  <div className="flex items-center gap-3">
                    {isAreaExpanded(area.id) ? (
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-600" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{area.nombre}</h4>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {area.subAreas.length} subárea{area.subAreas.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {area.descripcion && (
                        <p className="text-sm text-gray-500">{area.descripcion}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSubAreaInput(area.id);
                        // Expand the area if it's not already expanded
                        if (!isAreaExpanded(area.id)) {
                          toggleAreaExpansion(area.id);
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar Subárea
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalEliminar({ tipo: "area", idArea: area.id });
                      }}
                      disabled={
                        loadingOperation.type === "deleteArea" &&
                        loadingOperation.id === area.id
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Contenido expandible */}
                {isAreaExpanded(area.id) && (
                  <div className="border-t border-gray-200 bg-white">
                    <div className="p-4">
                      {showSubAreaInput === area.id && (
                        <div className="flex items-center gap-2 mb-4">
                          <Input
                            placeholder="Nueva subárea"
                            value={newSubArea}
                            onChange={(e) => setNewSubArea(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleAddSubArea(area.id);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleAddSubArea(area.id)}
                            disabled={
                              (loadingOperation.type === "addSubArea" &&
                                loadingOperation.id === area.id) ||
                              !newSubArea.trim()
                            }
                          >
                            {loadingOperation.type === "addSubArea" &&
                            loadingOperation.id === area.id
                              ? "Agregando..."
                              : "Agregar"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowSubAreaInput(null);
                              setNewSubArea("");
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      )}
                      
                      {area.subAreas && area.subAreas.length > 0 ? (
                        <div className="space-y-2">
                          {area.subAreas.map((subArea) => (
                            <div
                              key={`subarea-${area.id}-${subArea.id}`}
                              className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded border"
                            >
                              <span className="text-sm">{subArea.nombre}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModalEliminar({ tipo: "subarea", idArea: area.id, idSubArea: subArea.id });
                                }}
                                disabled={
                                  loadingOperation.type === "deleteSubArea" &&
                                  loadingOperation.id === area.id
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No hay subáreas definidas
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 italic">
                No hay áreas de investigación definidas
              </p>
            </div>
          )}
        </ScrollArea>
      </div>

      <ConfirmarEliminarModal
        isOpen={modalEliminar.tipo !== null}
        onClose={() => setModalEliminar({ tipo: null })}
        onConfirm={confirmarEliminar}
        title={modalEliminar.tipo === "area" ? "Eliminar área" : "Eliminar subárea"}
        description={modalEliminar.tipo === "area"
          ? "¿Estás seguro de que deseas eliminar esta área? Se eliminarán también todas sus subáreas."
          : "¿Estás seguro de que deseas eliminar esta subárea?"}
        isLoading={loadingOperation.type === "deleteArea" || loadingOperation.type === "deleteSubArea"}
      />
    </div>
  );
} 
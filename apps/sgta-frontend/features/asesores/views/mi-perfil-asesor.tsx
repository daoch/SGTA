"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import EditarPerfilActions from "../components/perfil/acciones-editar-perfil";
import AreasTematicasCard from "../components/perfil/areas-tematicas-card";
import SaveConfirmationDialog from "../components/perfil/confirmation-dialog";
import AlertaValidacionDialog from "../components/perfil/modal-alerta-validacion-areas";
import EliminarAreaDialog from "../components/perfil/modal-eliminar-area-con-temas";
import PerfilAsesorCard from "../components/perfil/perfil-asesor-card";
import PresentacionCard from "../components/perfil/presentacion-card";
import TemasInteresCard from "../components/perfil/subareas-tematicas-card";
import TesisDirigidasResumen from "../components/perfil/tesis-dirigidas-resumen";

import {
  editarAsesor,
  getFotoUsuario,
  getListaProyectos,
  getListaTesisPorAsesor,
  getPerfilAsesor,
  listarAreasTematicas,
  listarTemasInteres,
} from "@/features/asesores/hooks/perfil/perfil-apis";

import {
  AreaTematica,
  Asesor,
  Proyecto,
  TemaInteres,
  Tesis,
} from "../types/perfil/entidades";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import IndicadoresAsesor from "../components/perfil/indicadores-asesor";
import ProyectosAsesoradosResumen from "../components/perfil/proyectos-asesorados-resumen";

interface Props {
  userId: number;
  editable: boolean;
}

export default function PerfilAsesor({ userId, editable }: Props) {
  const router = useRouter();

  const [asesor, setAsesor] = useState<Asesor | null>(null);
  const [areasDisponibles, setAreasDisponibles] = useState<AreaTematica[]>([]);
  const [temasDisponibles, setTemasDisponibles] = useState<TemaInteres[]>([]);
  const [tesis, setTesis] = useState<Tesis[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Asesor | null>(null);

  const [openAreaCombobox, setOpenAreaCombobox] = useState(false);
  const [openTemaCombobox, setOpenTemaCombobox] = useState(false);
  const [selectedArea, setSelectedArea] = useState<AreaTematica | null>(null);
  const [selectedTema, setSelectedTema] = useState<TemaInteres | null>(null);
  const [recentlyAddedArea, setRecentlyAddedArea] = useState<number | null>(
    null,
  );

  const [foto, setFoto] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Estado para el diálogo de confirmación de eliminación
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<AreaTematica | null>(null);
  const [temasToDelete, setTemasToDelete] = useState<TemaInteres[]>([]);

  // Estado para el diálogo de alerta de validación
  const [isValidationAlertOpen, setIsValidationAlertOpen] = useState(false);

  // Estado para el diálogo de confirmación de guardado
  const [isSaveConfirmationOpen, setIsSaveConfirmationOpen] = useState(false);

  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    getPerfilAsesor(userId).then(setAsesor).catch(console.error);
  }, [userId]);

  useEffect(() => {
    getListaTesisPorAsesor(userId).then(setTesis).catch(console.error);
  }, [userId]);

  useEffect(() => {
    getListaProyectos(userId).then(setProyectos).catch(console.error);
  }, [userId]);

  useEffect(() => {
    if (asesor) {
      setEditedData(asesor);
    }
  }, [asesor]);

  useEffect(() => {
    getFotoUsuario(userId)
      .then((base64) => {
        setFoto(`data:image/jpeg;base64,${base64}`);
      })
      .catch(console.error);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const [allAreas, allTemas] = await Promise.all([
          listarAreasTematicas(userId),
          listarTemasInteres(userId),
        ]);
        setAreasDisponibles(allAreas);
        setTemasDisponibles(allTemas);
      } catch (e) {
        console.error("Error al cargar filtros:", e);
      }
    })();
  }, [userId]);

  // Efecto para resaltar visualmente un área recién agregada
  useEffect(() => {
    if (recentlyAddedArea !== null) {
      const timer = setTimeout(() => {
        setRecentlyAddedArea(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [recentlyAddedArea]);

  if (
    !asesor ||
    !tesis ||
    !proyectos ||
    !editedData ||
    !areasDisponibles ||
    !temasDisponibles
  ) {
    return (
      <div className="flex items-center justify-center h-screen w-full flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground text-lg">
          Cargando perfil...
        </span>
      </div>
    );
  }

  const areasFiltered = areasDisponibles.filter(
    (area) =>
      !(editedData.areasTematicas ?? []).some((a) => a.idArea === area.idArea),
  );

  const temasFiltered = temasDisponibles.filter(
    (tema) =>
      !(editedData.temasIntereses ?? []).some((t) => t.idTema === tema.idTema),
  );

  const handleSave = () => {
    setIsSaveConfirmationOpen(true);
  };

  const handleCancel = () => {
    setEditedData(asesor);
    setIsEditing(false);
  };

  const confirmSave = async () => {
    try {
      setIsLoading(true);

      await editarAsesor(editedData);

      toast.success("Cambios guardados con éxito", {
        description: "Tu perfil ha sido actualizado.",
      });

      setIsEditing(false);
      setIsSaveConfirmationOpen(false);
    } catch (error) {
      toast.error("Error al guardar", {
        description: "Ocurrió un error al intentar guardar los cambios.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addAreaTematica = (area: AreaTematica) => {
    if (
      area &&
      !editedData.areasTematicas.some((a) => a.idArea === area.idArea)
    ) {
      setEditedData({
        ...editedData,
        areasTematicas: [...editedData.areasTematicas, area],
      });
      setRecentlyAddedArea(area.idArea);
      return true;
    }
    return false;
  };

  const initiateAreaDelete = (area: AreaTematica) => {
    // Encontrar temas de interés relacionados con esta área
    const temasRelacionados = editedData.temasIntereses.filter(
      (tema) => tema.areaTematica.idArea === area.idArea,
    );

    if (temasRelacionados.length > 0) {
      // Si hay temas relacionados, mostrar diálogo de confirmación
      setAreaToDelete(area);
      setTemasToDelete(temasRelacionados);
      setIsDeleteDialogOpen(true);
    } else {
      // Si no hay temas relacionados, eliminar directamente
      removeAreaTematica(area);
    }
  };

  const removeAreaTematica = (area: AreaTematica) => {
    // Eliminar el área temática
    setEditedData({
      ...editedData,
      areasTematicas: editedData.areasTematicas.filter(
        (a) => a.idArea !== area.idArea,
      ),
    });
  };

  const confirmAreaDelete = () => {
    if (areaToDelete) {
      // Eliminar el área temática
      const newAreas = editedData.areasTematicas.filter(
        (a) => a.idArea !== areaToDelete.idArea,
      );

      // Eliminar los temas de interés relacionados
      const newTemas = editedData.temasIntereses.filter(
        (tema) => tema.areaTematica.idArea !== areaToDelete.idArea,
      );

      setEditedData({
        ...editedData,
        areasTematicas: newAreas,
        temasIntereses: newTemas,
      });

      // Mostrar notificación de éxito
      toast.success("Eliminación completada", {
        description: `Se ha eliminado "${areaToDelete.nombre}" y ${temasToDelete.length} tema(s) relacionado(s).`,
      });

      // Limpiar estados
      setAreaToDelete(null);
      setTemasToDelete([]);
      setIsDeleteDialogOpen(false);
    }
  };

  const cancelAreaDelete = () => {
    // Limpiar estados sin realizar cambios
    setAreaToDelete(null);
    setTemasToDelete([]);
    setIsDeleteDialogOpen(false);
  };

  const addTemaInteres = () => {
    if (
      selectedTema &&
      !editedData.temasIntereses.some((t) => t.idTema === selectedTema.idTema)
    ) {
      // Verificar si necesitamos agregar el área temática relacionada
      let newAreas = [...editedData.areasTematicas];
      let areaAdded = false;

      if (
        !editedData.areasTematicas.some(
          (a) => a.idArea === selectedTema.areaTematica.idArea,
        )
      ) {
        // Agregar el área temática relacionada
        newAreas = [...newAreas, selectedTema.areaTematica];
        setRecentlyAddedArea(selectedTema.areaTematica.idArea);
        areaAdded = true;
      }

      // Agregar el tema de interés y actualizar el estado en una sola operación
      setEditedData({
        ...editedData,
        areasTematicas: newAreas,
        temasIntereses: [...editedData.temasIntereses, selectedTema],
      });

      if (areaAdded) {
        toast.info("Área temática agregada automáticamente", {
          description: `Se ha agregado "${selectedTema.areaTematica.nombre}" porque está relacionada con el tema "${selectedTema.nombre}".`,
        });
      }

      setSelectedTema(null);
    }
  };

  const removeTemaInteres = (temaId: number) => {
    setEditedData({
      ...editedData,
      temasIntereses: editedData.temasIntereses.filter(
        (t) => t.idTema !== temaId,
      ),
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-12 w-full max-w-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          {!editable && (
            <button
              onClick={() => router.back()}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl sm:text-2xl font-bold">
            {editable ? "Mi perfil" : "Perfil del asesor"}
          </h1>
        </div>
        {editable && (
          <EditarPerfilActions
            isEditing={isEditing}
            onStartEdit={() => setIsEditing(true)}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>

      {/* Diálogos */}
      <EliminarAreaDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        areaToDelete={areaToDelete}
        temasToDelete={temasToDelete}
        onCancel={cancelAreaDelete}
        onConfirm={confirmAreaDelete}
      />

      <SaveConfirmationDialog
        open={isSaveConfirmationOpen}
        onOpenChange={setIsSaveConfirmationOpen}
        onConfirm={confirmSave}
      />

      <AlertaValidacionDialog
        open={isValidationAlertOpen}
        onOpenChange={setIsValidationAlertOpen}
      />

      {/* Tabs de navegación */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mb-6"
      >
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
          >
            Información General
          </TabsTrigger>
          <TabsTrigger
            value="tesis"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
          >
            Tesis Asesoradas
          </TabsTrigger>
          <TabsTrigger
            value="proyectos"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
          >
            Proyectos
          </TabsTrigger>
        </TabsList>

        {/* Contenido de las tabs */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda - Información personal */}
            <div className="space-y-6">
              <PerfilAsesorCard
                asesor={asesor}
                editedData={editedData}
                isEditing={isEditing}
                setEditedData={setEditedData}
                avatar={foto}
              />
            </div>

            {/* Columna derecha - Biografía, Áreas y Temas */}
            <div className="lg:col-span-2 space-y-6">
              {/* Biografía */}
              <PresentacionCard
                isEditing={isEditing}
                biografia={editedData.biografia}
                setBiografia={(value: string) =>
                  setEditedData({ ...editedData, biografia: value })
                }
              />

              {/* Áreas Temáticas */}
              <AreasTematicasCard
                isEditing={isEditing}
                editedAreas={editedData.areasTematicas}
                areasFiltered={areasFiltered}
                selectedArea={selectedArea}
                openAreaCombobox={openAreaCombobox}
                recentlyAddedArea={recentlyAddedArea}
                setSelectedArea={setSelectedArea}
                setOpenAreaCombobox={setOpenAreaCombobox}
                addAreaTematica={addAreaTematica}
                initiateAreaDelete={initiateAreaDelete}
              />

              {/* Temas de Interés */}
              <TemasInteresCard
                isEditing={isEditing}
                temasInteres={editedData.temasIntereses}
                temasFiltered={temasFiltered}
                selectedTema={selectedTema}
                openTemaCombobox={openTemaCombobox}
                editedAreasTematicas={editedData.areasTematicas}
                setSelectedTema={setSelectedTema}
                setOpenTemaCombobox={setOpenTemaCombobox}
                addTemaInteres={addTemaInteres}
                removeTemaInteres={removeTemaInteres}
              />

              {/* Indicadores */}
              <IndicadoresAsesor tesis={tesis} proyectos={proyectos} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tesis" className="mt-6">
          <TesisDirigidasResumen tesis={tesis} />
        </TabsContent>

        <TabsContent value="proyectos" className="mt-6">
          <ProyectosAsesoradosResumen proyectos={proyectos} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

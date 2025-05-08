"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import EditarPerfilActions from "../components/acciones-editar-perfil";
import AreasTematicasCard from "../components/areas-tematicas-card";
import SaveConfirmationDialog from "../components/confirmation-dialog";
import AlertaValidacionDialog from "../components/modal-alerta-validacion-areas";
import EliminarAreaDialog from "../components/modal-eliminar-area-con-temas";
import PerfilAsesorCard from "../components/perfil-asesor-card";
import PresentacionCard from "../components/presentacion-card";
import TemasInteresCard from "../components/subareas-tematicas-card";
import TesisDirigidasResumen from "../components/tesis-dirigidas-resumen";

import {
  editarAsesor,
  getPerfilAsesor,
  listarAreasTematicas,
  listarTemasInteres,
} from "@/features/asesores/hooks/perfil/perfil-apis";

import {
  AreaTematica,
  Asesor,
  AsesorDTO,
  TemaInteres,
} from "../types/perfil/entidades";

import { useAuth } from "@/features/auth";

export default function PerfilAsesorEditable() {
  const { user } = useAuth();

  const [asesor, setAsesor] = useState<Asesor | null>(null);
  const [areasDisponibles, setAreasDisponibles] = useState<AreaTematica[]>([]);
  const [temasDisponibles, setTemasDisponibles] = useState<TemaInteres[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Asesor | null>(null);

  const [openAreaCombobox, setOpenAreaCombobox] = useState(false);
  const [openTemaCombobox, setOpenTemaCombobox] = useState(false);
  const [selectedArea, setSelectedArea] = useState<AreaTematica | null>(null);
  const [selectedTema, setSelectedTema] = useState<TemaInteres | null>(null);
  const [recentlyAddedArea, setRecentlyAddedArea] = useState<number | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(false);

  // Estado para el diálogo de confirmación de eliminación
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<AreaTematica | null>(null);
  const [temasToDelete, setTemasToDelete] = useState<TemaInteres[]>([]);

  // Estado para el diálogo de alerta de validación
  const [isValidationAlertOpen, setIsValidationAlertOpen] = useState(false);

  // Estado para el diálogo de confirmación de guardado
  const [isSaveConfirmationOpen, setIsSaveConfirmationOpen] = useState(false);

  const userId = +(user?.id ?? 0);

  useEffect(() => {
    getPerfilAsesor(userId).then(setAsesor).catch(console.error);
  }, [userId]);

  useEffect(() => {
    if (asesor) {
      setEditedData(asesor);
    }
  }, [asesor]);

  //useEffect(() => {
  // Cargar los datos mockeados una vez al iniciar
  //const asesorData = getAsesorMock();
  //setAsesor(asesorData);
  //setEditedData(asesorData);
  // Cargar áreas y temas disponibles
  //setAreasDisponibles(getAreasDisponibles());
  //setTemasDisponibles(getTemasDisponibles());
  //}, []);

  useEffect(() => {
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
  }, []);

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
    !user ||
    !asesor ||
    !editedData ||
    !areasDisponibles ||
    !temasDisponibles
  ) {
    return <div>Cargando perfil...</div>;
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
    // Verificar que haya al menos un área temática
    if (editedData.areasTematicas.length === 0) {
      setIsValidationAlertOpen(true);
      return;
    }
    setIsSaveConfirmationOpen(true);
  };

  const handleCancel = () => {
    setEditedData(asesor);
    setIsEditing(false);
  };

  const confirmSave = async () => {
    try {
      setIsLoading(true);

      const asesorDTO: AsesorDTO = {
        id: userId,
        nombre: editedData.nombre,
        especialidad: editedData.especialidad,
        email: editedData.email,
        linkedin: editedData.linkedin,
        repositorio: editedData.repositorio,
        biografia: editedData.biografia,
        estado: null,
        limiteTesis: editedData.limiteTesis,
        tesistasActuales: editedData.tesis?.length ?? 0,
        areasTematicas: editedData.areasTematicas,
        temasIntereses: editedData.temasIntereses,
      };

      await editarAsesor(asesorDTO);

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
        <div className="flex items-center">
          <h1 className="text-xl sm:text-2xl font-bold">Mi perfil</h1>
        </div>
        {/* Botones para edicion de perfil */}
        <EditarPerfilActions
          isEditing={isEditing}
          onStartEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
      {/* Diálogo de confirmación para eliminar área temática */}
      <EliminarAreaDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        areaToDelete={areaToDelete}
        temasToDelete={temasToDelete}
        onCancel={cancelAreaDelete}
        onConfirm={confirmAreaDelete}
      />

      {/* Diálogo de confirmación para guardar cambios */}
      <SaveConfirmationDialog
        open={isSaveConfirmationOpen}
        onOpenChange={setIsSaveConfirmationOpen}
        onConfirm={confirmSave}
      />

      {/* Diálogo de alerta para validación */}
      <AlertaValidacionDialog
        open={isValidationAlertOpen}
        onOpenChange={setIsValidationAlertOpen}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Columna izquierda - Información personal */}
        <div className="space-y-6">
          <PerfilAsesorCard
            asesor={asesor}
            editedData={editedData}
            isEditing={isEditing}
            setEditedData={setEditedData}
            avatar={user?.avatar}
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
        </div>

        {/* Columna derecha - Biografía y Tesis */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Biografía */}
          <PresentacionCard
            isEditing={isEditing}
            biografia={editedData.biografia}
            setBiografia={(value: string) =>
              setEditedData({ ...editedData, biografia: value })
            }
          />

          {/* Tesis Dirigidas */}
          <TesisDirigidasResumen tesis={asesor.tesis} />
        </div>
      </div>
    </div>
  );
}

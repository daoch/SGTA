"use client";
import { useEffect, useState } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, PenLine, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { CriterioExposicionCard } from "../components/exposicion/criterio-exposicion-card";
import {
  CriterioExposicionFormData,
  CriterioExposicionModal,
} from "../components/exposicion/criterio-exposicion-modal";
import { ExposicionModal } from "../components/exposicion/exposicion-modal";
import { Exposicion } from "../dtos/exposicion";
import { CriterioExposicion } from "../dtos/criterio-exposicion";
import axiosInstance from "@/lib/axios/axios-instance";
import { NuevoCriterioExposicionModal } from "../components/exposicion/nuevo-criterio-exposicion-modal";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DetalleExposicionPageProps {
  etapaId: string;
  exposicionId: string;
}

const DetalleExposicionPage: React.FC<DetalleExposicionPageProps> = ({
  etapaId,
  exposicionId,
}) => {
  const router = useRouter();

  const [isCriterioModalOpen, setIsCriterioModalOpen] = useState(false);
  const [isNuevoCriterioModalOpen, setIsNuevoCriterioModalOpen] = useState(false);
  const [isExposicionModalOpen, setIsExposicionModalOpen] = useState(false);
  const [criterioSeleccionado, setCriterioSeleccionado] =
    useState<CriterioExposicionFormData | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [criterioAEliminar, setCriterioAEliminar] = useState<CriterioExposicion | null>(null);

  const [exposicion, setExposicion] = useState<Exposicion>({
    id: "",
    nombre: "",
    descripcion: "",
    estadoPlanificacionId: 1,
  });

  const [criterios, setCriterios] = useState<CriterioExposicion[]>([]);

  useEffect(() => {
    const fetchExposicion = async () => {
      try {
        const response = await axiosInstance.get(`/exposicion/${exposicionId}`);
        setExposicion(response.data);
      } catch (error) {
        console.error("Error al cargar la exposicion:", error);
      }
    };

    fetchExposicion();
  }, [exposicionId]);

  useEffect(() => {
    const fetchCriterios = async () => {
      try {
        const response = await axiosInstance.get(`/criterio-exposicion/exposicion/${exposicionId}`);
        setCriterios(response.data);
      } catch (error) {
        console.error("Error al cargar los criterios:", error);
      }
    };

    fetchCriterios();
  }, [exposicionId]);

  const createCriterio = async (nuevoCriterio: CriterioExposicion) => {
    try {
      const response = await axiosInstance.post(`/criterio-exposicion/exposicion/${exposicionId}`, nuevoCriterio);
      console.log("Criterio creado exitosamente:", response.data);
      return response.data; // Devuelve el criterio creado si es necesario
    } catch (error) {
      console.error("Error al crear el criterio:", error);
      throw error; // Lanza el error para manejarlo en el lugar donde se llame
    }
  };

  const handleCreateCriterios = async (nuevosCriterios: CriterioExposicion[]) => {
  try {
    const criteriosCreados = await Promise.all(
      nuevosCriterios.map(async (criterio) => {
        const idCriterio = await createCriterio(criterio);
        return { ...criterio, id: idCriterio }; // Agregar el ID devuelto por la API
      })
    );

    // Actualizar el estado local con los criterios creados
    setCriterios((prev) => [...prev, ...criteriosCreados]);

    // Cerrar el modal
    setIsNuevoCriterioModalOpen(false);
  } catch (error) {
    console.error("Error al crear los criterios:", error);
  }
};

  const updateCriterio = async (updatedCriterio: CriterioExposicion) => {
    try {
      const response = await axiosInstance.put(
        "/criterio-exposicion/update",
        updatedCriterio,
      );
      console.log("Criterio actualizado exitosamente:", response.data);
      return response.data; // Devuelve el criterio actualizado si es necesario
    } catch (error) {
      console.error("Error al actualizar el criterio:", error);
      throw error; // Lanza el error para manejarlo en el lugar donde se llame
    }
  };

  const handleUpdateCriterio = async (updatedCriterio: CriterioExposicion) => {
      try {
        await updateCriterio(updatedCriterio);
        setCriterios((prev) =>
          prev.map((c) =>
            c.id === updatedCriterio.id
              ? {
                  ...updatedCriterio,
                  id: updatedCriterio.id,
                } // Asegurar que id sea un string
              : c,
          ),
        );
     
        // Cerrar el modal
        setIsCriterioModalOpen(false);
      } catch (error) {
        console.error("Error al actualizar el criterio:", error);
      }
    };

    const handleEditCriterio = (id: string) => {
      const criterio = criterios.find((c) => c.id === id);
      if (criterio) {
        setCriterioSeleccionado(criterio);
        setModalMode("edit");
        setIsCriterioModalOpen(true);
      }
    };

    const handleDeleteCriterio = (id: string) => {
      const criterio = criterios.find((c) => c.id === id);
      if (criterio) {
        setCriterioAEliminar(criterio);
        setIsDeleteModalOpen(true);
      }
    };

    const deleteCriterio = async () => {
      if (!criterioAEliminar) return;

      try {
        await axiosInstance.put("/criterio-exposicion/delete", criterioAEliminar.id);
        setCriterios((prev) => prev.filter((c) => c.id !== criterioAEliminar.id));
        setIsDeleteModalOpen(false);
        setCriterioAEliminar(null);
        console.log("Criterio eliminado exitosamente");
      } catch (error) {
        console.error("Error al eliminar el criterio:", error);
      }
    };

    const cancelDeleteCriterio = () => {
      setIsDeleteModalOpen(false);
      setCriterioAEliminar(null);
    };

    const updateExposicion = async (updatedExposicion: Exposicion) => {
      try {
        const response = await axiosInstance.put(
          "/exposicion/update",
          updatedExposicion,
        );
        console.log("Exposicion actualizada exitosamente:", response.data);
        return response.data; // Devuelve el criterio actualizado si es necesario
      } catch (error) {
        console.error("Error al actualizar la Exposicion:", error);
        throw error; // Lanza el error para manejarlo en el lugar donde se llame
      }
    };

    const handleUpdateExposicion = async (updatedExposicion: Exposicion) => {
        try {
          await updateExposicion(updatedExposicion);
          setExposicion(updatedExposicion);
          // Cerrar el modal
          setIsExposicionModalOpen(false);
        } catch (error) {
          console.error("Error al actualizar la Exposicion:", error);
        }
      };


  return (
    <div className="w-full px-6 py-6">
      {/* Header con botón de regreso */}
      <div className="flex items-center mb-6">
        <Button
          id="btnBack"
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Detalles de la Exposición</h1>
      </div>

      {/* Información de la exposición */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-semibold">{exposicion.nombre}</h2>
            <Button
              id="btnEditExposicion"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setIsExposicionModalOpen(true)}
            >
              <PenLine className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Etapa
              </h3>
              <p>Proyecto de fin de carrera 1</p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Descripción
            </h3>
            <p>{exposicion.descripcion}</p>
          </div>
        </CardContent>
      </Card>

      {/* Criterios Esperados */}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">Criterios de calificación</h2>
        </div>
        <Button
          id="btnNewCriterio"
          className="bg-black hover:bg-gray-800"
          onClick={() => setIsNuevoCriterioModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Nuevo Criterio
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Suma total de criterios: {criterios.reduce((acc, criterio) => acc + criterio.notaMaxima, 0)} puntos
      </p>

      {criterios.reduce((acc, criterio) => acc + criterio.notaMaxima, 0) < 20 && (
            <p className="text-sm text-orange-500">
              La suma de los criterios debe ser 20
            </p>
      )}

      <div className="space-y-4">
        {criterios.map((criterio) => (
          <CriterioExposicionCard
            key={criterio.id}
            id={criterio.id ?? ""}
            nombre={criterio.nombre}
            descripcion={criterio.descripcion}
            notaMaxima={criterio.notaMaxima}
            onEdit={handleEditCriterio}
            onDelete={handleDeleteCriterio}
          />
        ))}
      </div>
      <CriterioExposicionModal
        isOpen={isCriterioModalOpen}
        onClose={() => setIsCriterioModalOpen(false)}
        onSubmit={handleUpdateCriterio}
        criterio={criterioSeleccionado}
        mode={modalMode}
        criteriosExistentes={criterios}
      />
      {/* Modal para Editar Exposición */}
      <ExposicionModal
        isOpen={isExposicionModalOpen}
        onClose={() => setIsExposicionModalOpen(false)}
        onSubmit={handleUpdateExposicion}
        exposicion={exposicion}
        mode="edit"
      />
      <NuevoCriterioExposicionModal
        isOpen={isNuevoCriterioModalOpen}
        onClose={() => setIsNuevoCriterioModalOpen(false)} // Cerrar el modal
        onSubmit={(criteriosSeleccionados) => {
          handleCreateCriterios(criteriosSeleccionados); // Enviar los criterios seleccionados al backend
        }}
        criteriosExistentes={criterios}
      />
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar Criterio</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el criterio{" "}
              <strong>{criterioAEliminar?.nombre}</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDeleteCriterio}>
              No
            </Button>
            <Button variant="destructive" onClick={deleteCriterio}>
              Sí, eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetalleExposicionPage;

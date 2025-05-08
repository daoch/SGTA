"use client";
import { useEffect, useState } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, PenLine, Plus, Monitor, Users } from "lucide-react";
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
  const [isExposicionModalOpen, setIsExposicionModalOpen] = useState(false);
  const [criterioSeleccionado, setCriterioSeleccionado] =
    useState<CriterioExposicionFormData | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

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

  const handleCreateCriterio = async (nuevoCriterio: CriterioExposicion) => {
      try {
        const idCriterio = await createCriterio(nuevoCriterio);
        const nuevoCriterioConId: CriterioExposicion = {
          ...nuevoCriterio,
          id: idCriterio, // Asignar el ID devuelto por la API
        };
    
          // Actualizar el estado local con el criterio creado
        setCriterios((prev) => [...prev, nuevoCriterioConId]);
     
        // Cerrar el modal
        setIsCriterioModalOpen(false);
      } catch (error) {
        console.error("Error al crear el criterio:", error);
      }
  };

  const handleNuevoCriterio = () => {
    setCriterioSeleccionado(null);
    setModalMode("create");
    setIsCriterioModalOpen(true);
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
      // TO DO: Implementar la lógica para eliminar un criterio
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
        <h2 className="text-lg font-semibold">Criterios Esperados</h2>
        <Button
          id="btnNewCriterio"
          className="bg-black hover:bg-gray-800"
          onClick={handleNuevoCriterio}
        >
          <Plus className="h-4 w-4 mr-1" />
          Nuevo Criterio
        </Button>
      </div>

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
        onSubmit={modalMode === "edit" ? handleUpdateCriterio : handleCreateCriterio}
        criterio={criterioSeleccionado}
        mode={modalMode}
      />
      {/* Modal para Editar Exposición */}
      <ExposicionModal
        isOpen={isExposicionModalOpen}
        onClose={() => setIsExposicionModalOpen(false)}
        onSubmit={handleUpdateExposicion}
        exposicion={exposicion}
        mode="edit"
      />
    </div>
  );
};

export default DetalleExposicionPage;

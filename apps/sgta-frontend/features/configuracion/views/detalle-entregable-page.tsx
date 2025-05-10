import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, PenLine, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { CriterioEntregableCard } from "../components/entregable/criterio-entregable-card";
import { EntregableModal } from "../components/entregable/entregable-modal";
import { Entregable } from "../dtos/entregable";
import {
  CriterioEntregableFormData,
  CriterioEntregableModal,
} from "../components/entregable/criterio-entregable-modal";
import axiosInstance from "@/lib/axios/axios-instance";
import { CriterioEntregable } from "../dtos/criterio-entregable";

interface DetalleEntregablePageProps {
  etapaId: string;
  entregableId: string;
}

const DetalleEntregablePage: React.FC<DetalleEntregablePageProps> = ({
  etapaId,
  entregableId,
}) => {
  const router = useRouter();
  const [isCriterioModalOpen, setIsCriterioModalOpen] = useState(false);
  const [isEntregableModalOpen, setIsEntregableModalOpen] = useState(false);
  const [criterioSeleccionado, setCriterioSeleccionado] =
    useState<CriterioEntregableFormData | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const [entregable, setEntregable] = useState<Entregable>({
    id: "",
    nombre: "",
    fechaInicio: "",
    fechaFin: "",
    esEvaluable: false,
    descripcion: "",
  });

  const [criterios, setCriterios] = useState<CriterioEntregable[]>([]);

  useEffect(() => {
    const fetchEntregable = async () => {
      try {
        const response = await axiosInstance.get(`/entregable/${entregableId}`);
        setEntregable(response.data);
      } catch (error) {
        console.error("Error al cargar el entregable:", error);
      }
    };

    fetchEntregable();
  }, [entregableId]);

  useEffect(() => {
    const fetchCriterios = async () => {
      try {
        const response = await axiosInstance.get(`/criterio-entregable/entregable/${entregableId}`);
        setCriterios(response.data);
      } catch (error) {
        console.error("Error al cargar los criterios:", error);
      }
    };

    fetchCriterios();
  }, [entregableId]);

  const createCriterio = async (nuevoCriterio: CriterioEntregable) => {
    try {
      const response = await axiosInstance.post(`/criterio-entregable/entregable/${entregableId}`, nuevoCriterio);
      console.log("Criterio creado exitosamente:", response.data);
      return response.data; // Devuelve el criterio creado si es necesario
    } catch (error) {
      console.error("Error al crear el criterio:", error);
      throw error; // Lanza el error para manejarlo en el lugar donde se llame
    }
  };

  const handleCreateCriterio = async (nuevoCriterio: CriterioEntregable) => {
    try {
      const idCriterio = await createCriterio(nuevoCriterio);
      const nuevoCriterioConId: CriterioEntregable = {
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

  const updateCriterio = async (updatedCriterio: CriterioEntregable) => {
    try {
      const response = await axiosInstance.put(
        "/criterio-entregable/update",
        updatedCriterio,
      );
      console.log("Criterio actualizado exitosamente:", response.data);
      return response.data; // Devuelve el criterio actualizado si es necesario
    } catch (error) {
      console.error("Error al actualizar el criterio:", error);
      throw error; // Lanza el error para manejarlo en el lugar donde se llame
    }
  };

  const handleUpdateCriterio = async (updatedCriterio: CriterioEntregable) => {
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

  const handleDeleteCriterio = async (id: string) => {
    //TO DO: Implementar la lógica para eliminar un criterio
  };

  const updateEntregable = async (updatedEntregable: Entregable) => {
    try {
      const response = await axiosInstance.put(
        "/entregable/update",
        updatedEntregable,
      );
      console.log("Entregable actualizado exitosamente:", response.data);
      return response.data; // Devuelve el criterio actualizado si es necesario
    } catch (error) {
      console.error("Error al actualizar el Entregable:", error);
      throw error; // Lanza el error para manejarlo en el lugar donde se llame
    }
  };

  const handleUpdateEntregable = async (updatedEntregable: Entregable) => {
    try {
      await updateEntregable(updatedEntregable);
      setEntregable(updatedEntregable);
      // Cerrar el modal
      setIsEntregableModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar el Entregable:", error);
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
        <h1 className="text-xl font-semibold">Detalles del Entregable</h1>
      </div>

      {/* Información del entregable */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-semibold">{entregable.nombre}</h2>
            <Button
              id="btnEditEntregable"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setIsEntregableModalOpen(true)}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Fecha de apertura
              </h3>
              <p>
                {new Date(entregable.fechaInicio).toLocaleString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Fecha de cierre
                </h3>
                <p>
                  {new Date(entregable.fechaFin).toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Descripción
              </h3>
              <p>{entregable.descripcion}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                ¿Es evaluable?
              </h3>
              <p>{entregable.esEvaluable ? "Sí" : "No"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenidos Esperados */}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Criterios de calificación</h2>
        <Button
          id="btnNewContenido"
          className="bg-black hover:bg-gray-800"
          onClick={handleNuevoCriterio}
        >
          <Plus className="h-4 w-4 mr-1" />
          Nuevo Criterio
        </Button>
      </div>

      <div className="space-y-4">
        {criterios.map((criterio) => (
          <CriterioEntregableCard
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

      {/* Modal para Nuevo Contenido */}
      <CriterioEntregableModal
        isOpen={isCriterioModalOpen}
        onClose={() => setIsCriterioModalOpen(false)}
        onSubmit={modalMode === "edit" ? handleUpdateCriterio : handleCreateCriterio}
        criterio={criterioSeleccionado}
        mode={modalMode}
      />

      {/* Modal para Editar Entregable */}
      <EntregableModal
        isOpen={isEntregableModalOpen}
        onClose={() => setIsEntregableModalOpen(false)}
        onSubmit={handleUpdateEntregable}
        entregable={entregable}
        mode="edit"
      />
    </div>
  );
};

export default DetalleEntregablePage;

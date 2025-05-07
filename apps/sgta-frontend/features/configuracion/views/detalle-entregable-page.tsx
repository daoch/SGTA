import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, PenLine, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ContenidoEsperadoEntregableCard } from "../components/entregable/contenido-entregable-card";
import { EntregableModal } from "../components/entregable/entregable-modal";
import { Entregable } from "../dtos/entregable";
import {
  ContenidoEntregableFormData,
  ContenidoEntregableModal,
} from "../components/entregable/contenido-entregable-modal";

interface DetalleEntregablePageProps {
  etapaId: string;
  entregableId: string;
}

const DetalleEntregablePage: React.FC<DetalleEntregablePageProps> = ({
  etapaId,
  entregableId,
}) => {
  const router = useRouter();
  // TODO: Cargar datos desde el backend
  const [isContenidoModalOpen, setIsContenidoModalOpen] = useState(false);
  const [isEntregableModalOpen, setIsEntregableModalOpen] = useState(false);
  const [contenidoSeleccionado, setContenidoSeleccionado] =
    useState<ContenidoEntregableFormData | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const [entregable, setEntregable] = useState<Entregable>({
    id: entregableId,
    nombre: "Propuesta de Proyecto",
    descripcion:
      "Documento que describe el problema a resolver y la propuesta de solución.",
    fechaInicio: "2023-05-15T23:59:00Z",
    fechaFin: "2023-06-15T23:59:00Z",
    esEvaluable: true,
  })

  const [contenidosEsperados, setContenidosEsperados] = useState([
    {
      id: "1",
      titulo: "Introducción",
      descripcion: "Presentación general del problema y contexto del proyecto.",
    },
    {
      id: "2",
      titulo: "Problemática",
      descripcion:
        "Descripción detallada del problema a resolver, incluyendo estadísticas y evidencias.",
    },
    {
      id: "3",
      titulo: "Objetivos",
      descripcion: "Objetivo general y objetivos específicos del proyecto.",
    },
    {
      id: "4",
      titulo: "Propuesta de solución",
      descripcion:
        "Descripción general de la solución propuesta y su justificación.",
    },
    {
      id: "5",
      titulo: "Plan de trabajo",
      descripcion:
        "Cronograma de actividades y entregables para el desarrollo del proyecto.",
    },
  ]);

  const handleEditContenido = (id: string) => {
    const contenido = contenidosEsperados.find((c) => c.id === id);
    if (contenido) {
      setContenidoSeleccionado(contenido);
      setModalMode("edit");
      setIsContenidoModalOpen(true);
    }
  };

  const handleDeleteContenido = (id: string) => {
    console.log("Eliminar contenido:", id);
    // Aquí iría la lógica para eliminar el contenido
    setContenidosEsperados(
      contenidosEsperados.filter((contenido) => contenido.id !== id),
    );
  };

  const handleNuevoContenido = () => {
    setContenidoSeleccionado(null);
    setModalMode("create");
    setIsContenidoModalOpen(true);
  };

  const handleSubmitContenido = async (
    contenidoData: ContenidoEntregableFormData,
  ) => {
    // Simular llamada a la API
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (modalMode === "create") {
      // Crear nuevo contenido con ID único
      const nuevoContenido = {
        ...contenidoData,
        id: "6",
      };

      // Actualizar estado local
      setContenidosEsperados((prev) => [...prev, nuevoContenido]);
    } else {
      // Actualizar contenido existente
      setContenidosEsperados((prev) =>
        prev.map((c) =>
          c.id === contenidoData.id
            ? {
                ...contenidoData,
                id: contenidoData.id ?? Date.now().toString(),
              } // Asegurar que id sea un string
            : c,
        ),
      );
    }

    // Cerrar modal
    setIsContenidoModalOpen(false);
  };

  const handleUpdateEntregable = async (entregableData: Entregable) => {
    // Simular llamada a la API
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Actualizar estado local
    setEntregable({
      ...entregable,
      nombre: entregableData.nombre,
      fechaInicio: entregableData.fechaInicio,
      descripcion: entregableData.descripcion,
    });

    // Cerrar modal
    setIsEntregableModalOpen(false);
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
              <p>CAMBIAR ETAPA</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Fecha y hora límite
              </h3>
              <p>{`${entregable.fechaInicio} HORA`}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Descripción
            </h3>
            <p>{entregable.descripcion}</p>
          </div>
        </CardContent>
      </Card>

      {/* Contenidos Esperados */}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Contenidos Esperados</h2>
        <Button
          id="btnNewContenido"
          className="bg-black hover:bg-gray-800"
          onClick={handleNuevoContenido}
        >
          <Plus className="h-4 w-4 mr-1" />
          Nuevo Contenido
        </Button>
      </div>

      <div className="space-y-4">
        {contenidosEsperados.map((contenido) => (
          <ContenidoEsperadoEntregableCard
            key={contenido.id}
            id={contenido.id}
            titulo={contenido.titulo}
            descripcion={contenido.descripcion}
            onEdit={handleEditContenido}
            onDelete={handleDeleteContenido}
          />
        ))}
      </div>

      {/* Modal para Nuevo Contenido */}
      <ContenidoEntregableModal
        isOpen={isContenidoModalOpen}
        onClose={() => setIsContenidoModalOpen(false)}
        onSubmit={handleSubmitContenido}
        contenido={contenidoSeleccionado}
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

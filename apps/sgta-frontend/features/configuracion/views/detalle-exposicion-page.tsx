import { useState } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, PenLine, Plus, Monitor, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { ContenidoEsperadoExposicionCard } from "../components/exposicion/contenido-exposicion-card";
import {
  ContenidoExposicionFormData,
  ContenidoExposicionModal,
} from "../components/exposicion/contenido-exposicion-modal";
import { Exposicion } from "../types/exposicion";
import { ExposicionModal } from "../components/exposicion/exposicion-modal";

interface DetalleExposicionPageProps {
  etapaId: string;
  exposicionId: string;
}

const DetalleExposicionPage: React.FC<DetalleExposicionPageProps> = ({
  etapaId,
  exposicionId,
}) => {
  const router = useRouter();

  // TODO: Cargar datos desde el backend
  const [isContenidoModalOpen, setIsContenidoModalOpen] = useState(false);
  const [isExposicionModalOpen, setIsExposicionModalOpen] = useState(false);
  const [contenidoSeleccionado, setContenidoSeleccionado] =
    useState<ContenidoExposicionFormData | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const [exposicion, setExposicion] = useState<Exposicion>({
    id: exposicionId,
    titulo: "Exposición Parcial",
    etapa: "Proyecto de Fin de Carrera 1",
    fechas: "20/08/2023 - 25/08/2023",
    fechaInicio: "20/08/2023",
    fechaFin: "25/08/2023",
    descripcion: "Presentación final del primer curso.",
    duracion: "20 min",
    modalidad: "Presencial",
    jurados: "Con jurados",
  });

  const [contenidosEsperados, setContenidosEsperados] = useState([
    {
      id: "1",
      titulo: "Introducción y contexto",
      descripcion: "Presentación del problema y contexto del proyecto.",
      puntos: 3,
    },
    {
      id: "2",
      titulo: "Estado del arte",
      descripcion: "Revisión de literatura y soluciones existentes.",
      puntos: 4,
    },
    {
      id: "3",
      titulo: "Propuesta de solución",
      descripcion: "Descripción detallada de la solución propuesta.",
      puntos: 5,
    },
    {
      id: "4",
      titulo: "Avances de implementación",
      descripcion: "Demostración de los avances en la implementación.",
      puntos: 5,
    },
    {
      id: "5",
      titulo: "Conclusiones y trabajo futuro",
      descripcion:
        "Conclusiones preliminares y plan de trabajo para el siguiente curso.",
      puntos: 3,
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
    contenidoData: ContenidoExposicionFormData,
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

  const handleEditExposicion = () => {
    setIsExposicionModalOpen(true);
  };

  const handleUpdateExposicion = async (exposicionData: Exposicion) => {
    // Simular llamada a la API
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Formatear fechas para mostrar
    let fechasFormateadas = "";

    if (exposicionData.fechaInicio === exposicionData.fechaFin) {
      // Si es un solo día
      fechasFormateadas = format(
        new Date(exposicionData.fechaInicio),
        "dd/MM/yyyy",
      );
    } else {
      // Si es un rango de fechas
      fechasFormateadas = `${format(new Date(exposicionData.fechaInicio), "dd/MM/yyyy")} - ${format(
        new Date(exposicionData.fechaFin),
        "dd/MM/yyyy",
      )}`;
    }

    // Actualizar estado local
    setExposicion({
      ...exposicion,
      titulo: exposicionData.titulo,
      fechas: fechasFormateadas,
      descripcion: exposicionData.descripcion,
      duracion: exposicionData.duracion,
      modalidad: exposicionData.modalidad,
      jurados: exposicionData.jurados,
    });

    // Cerrar modal
    setIsExposicionModalOpen(false);
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
            <h2 className="text-xl font-semibold">{exposicion.titulo}</h2>
            <Button
              id="btnEditExposicion"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleEditExposicion}
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
              <p>{exposicion.etapa}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Fechas
              </h3>
              <p>{exposicion.fechas}</p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Descripción
            </h3>
            <p>{exposicion.descripcion}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Duración
            </h3>
            <p>{exposicion.duracion}</p>
          </div>

          <div className="flex gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary text-secondary-foreground">
              {exposicion.modalidad === "Virtual" ? (
                <Monitor className="h-3 w-3 mr-1" />
              ) : (
                <Users className="h-3 w-3 mr-1" />
              )}
              {exposicion.modalidad}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary text-secondary-foreground">
              {exposicion.jurados}
            </span>
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
          <ContenidoEsperadoExposicionCard
            key={contenido.id}
            id={contenido.id}
            titulo={contenido.titulo}
            descripcion={contenido.descripcion}
            puntos={contenido.puntos}
            onEdit={handleEditContenido}
            onDelete={handleDeleteContenido}
          />
        ))}
      </div>
      <ContenidoExposicionModal
        isOpen={isContenidoModalOpen}
        onClose={() => setIsContenidoModalOpen(false)}
        onSubmit={handleSubmitContenido}
        contenido={contenidoSeleccionado}
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

function format(date: Date, formatString: string): string {
  // Implementación simple de format para fechas
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  return formatString
    .replace("dd", day)
    .replace("MM", month)
    .replace("yyyy", year);
}

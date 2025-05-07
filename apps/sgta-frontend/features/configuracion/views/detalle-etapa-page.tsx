"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, PenLine, Plus } from "lucide-react";
import { EntregableCard } from "../components/entregable/entregable-card";
import { ExposicionCard } from "../components/exposicion/exposicion-card";
import { Entregable } from "../dtos/entregable";
import { Exposicion } from "../types/exposicion";
import { EntregableModal } from "../components/entregable/entregable-modal";
import { ExposicionModal } from "../components/exposicion/exposicion-modal";
import axiosInstance from "@/lib/axios/axios-instance";

interface DetalleEtapaPageProps {
  etapaId: string;
}

const DetalleEtapaPage: React.FC<DetalleEtapaPageProps> = ({ etapaId }) => {
  const [isEntregableModalOpen, setIsEntregableModalOpen] = useState(false);
  const [isExposicionModalOpen, setIsExposicionModalOpen] = useState(false);
  /*
  const [entregables, setEntregables] = useState<Entregable[]>([
    {
      id: "1",
      titulo: "Propuesta de Proyecto",
      fecha: "15/05/2023",
      hora: "23:59",
      descripcion:
        "Documento que describe el problema a resolver y la propuesta de solución.",
    },
    {
      id: "2",
      titulo: "Estado del Arte",
      fecha: "30/06/2023",
      hora: "23:59",
      descripcion:
        "Documento que presenta la revisión de literatura y soluciones existentes.",
    },
    {
      id: "3",
      titulo: "Informe Final",
      fecha: "15/08/2023",
      hora: "23:59",
      descripcion:
        "Documento final que integra todos los componentes del proyecto.",
    },
  ]);
  */
  const [entregables, setEntregables] = useState<Entregable[]>([]);

  const [exposiciones, setExposiciones] = useState<Exposicion[]>([
    {
      id: "1",
      titulo: "Exposición de Avance 1",
      fechaInicio: "20/05/2023",
      fechaFin: "25/05/2023",
      fechas: "20/05/2023 - 25/05/2023",
      descripcion: "Primera presentación de avance del proyecto.",
      duracion: "20 min",
      modalidad: "Virtual",
      jurados: "Sin jurados",
    },
    {
      id: "2",
      titulo: "Exposición de Avance 2",
      fechaInicio: "10/07/2023",
      fechaFin: "15/07/2023",
      fechas: "10/07/2023 - 15/07/2023",
      descripcion: "Segunda presentación de avance del proyecto.",
      duracion: "20 min",
      modalidad: "Virtual",
      jurados: "Sin jurados",
    },
    {
      id: "3",
      titulo: "Exposición Parcial",
      fechas: "15/08/2023",
      fechaInicio: "15/08/2023",
      fechaFin: "15/08/2023",
      descripcion: "Presentación final del primer curso.",
      duracion: "40 min",
      modalidad: "Presencial",
      jurados: "Con jurados",
    },
  ]);

  useEffect(() => {
    const fetchEntregables = async () => {
      try {
        const response = await axiosInstance.get(`/entregable/etapaFormativaXCiclo/${etapaId}`);
        setEntregables(response.data);
      } catch (error) {
        console.error("Error al cargar los entregables:", error);
      }
    };

    fetchEntregables();
  }, [etapaId]);

  const createEntregable = async (nuevoEntregable: Entregable) => {
    try {
      const response = await axiosInstance.post(`/entregable/etapaFormativaXCiclo/${etapaId}`, nuevoEntregable);
      console.log("Entregable creado exitosamente:", response.data);
      return response.data; // Devuelve el entregable creado si es necesario
    } catch (error) {
      console.error("Error al crear el entregable:", error);
      throw error; // Lanza el error para manejarlo en el lugar donde se llame
    }
  };

  const truncateMilliseconds = (dateString: string) => {
    return dateString.split(".")[0] + "Z";
  };


  const handleCreateEntregable = async (nuevoEntregable: Entregable) => {
    try {
      const nuevoEntregableFormatoISO: Entregable = {
        ...nuevoEntregable,
        fechaInicio: new Date(nuevoEntregable.fechaInicio).toISOString(),
        fechaFin: new Date(nuevoEntregable.fechaFin).toISOString(),
      };

      console.log("Datos enviados al backend:", nuevoEntregableFormatoISO);
      
      const idEntregable = await createEntregable(nuevoEntregable);
  
      const nuevoEntregableConId: Entregable = {
        ...nuevoEntregable,
        id: idEntregable, // Asignar el ID devuelto por la API
      };

      // Actualizar el estado local con el entregable creado
      setEntregables((prev) => [...prev, nuevoEntregableConId]);
  
      // Cerrar el modal
      setIsEntregableModalOpen(false);
    } catch (error) {
      console.error("Error al crear el entregable:", error);
    }
  };

  const handleCreateExposicion = async (nuevaExposicion: Exposicion) => {
    // TODO: Llamar a la API para crear la nueva exposición
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Formatear fechas para mostrar
    let fechasFormateadas = "";

    if (nuevaExposicion.fechaInicio === nuevaExposicion.fechaFin) {
      // Si es un solo día
      fechasFormateadas = format(
        new Date(nuevaExposicion.fechaInicio),
        "dd/MM/yyyy",
      );
    } else {
      // Si es un rango de fechas
      fechasFormateadas = `${format(new Date(nuevaExposicion.fechaInicio), "dd/MM/yyyy")} - ${format(
        new Date(nuevaExposicion.fechaFin),
        "dd/MM/yyyy",
      )}`;
    }

    // Crear nueva exposición con ID único
    const nuevaExposicionConId: Exposicion = {
      id: "4",
      titulo: nuevaExposicion.titulo,
      fechaInicio: nuevaExposicion.fechaInicio,
      fechaFin: nuevaExposicion.fechaFin,
      fechas: fechasFormateadas,
      descripcion: nuevaExposicion.descripcion,
      duracion: nuevaExposicion.duracion,
      modalidad: nuevaExposicion.modalidad,
      jurados: nuevaExposicion.jurados,
    };

    // Actualizar estado local
    setExposiciones((prev) => [...prev, nuevaExposicionConId]);

    // Cerrar modal
    setIsExposicionModalOpen(false);
  };

  return (
    <div className="w-full px-6 py-6">
      {/* Header con botón de regreso */}
      <div className="flex items-center mb-6">
        <Button id="btnBack" variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Detalles de la Etapa</h1>
      </div>

      {/* Información del proyecto */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">
            Proyecto de Fin de Carrera 1
          </CardTitle>
          <Button id="btnEditEtapa" variant="outline" size="sm" className="h-8">
            <PenLine className="h-4 w-4 mr-1" />
            Editar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Descripción</h3>
              <p className="text-sm text-muted-foreground">
                Primera fase del proyecto de fin de carrera enfocada en la
                definición del problema y la propuesta de solución.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Objetivos</h3>
              <p className="text-sm text-muted-foreground">
                Definir el problema, realizar el estado del arte, proponer una
                solución preliminar.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Entregables y Exposiciones */}
      <Tabs defaultValue="entregables" className="mb-6">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger id="tabEntregables" value="entregables">
            Entregables
          </TabsTrigger>
          <TabsTrigger id="tabExposiciones" value="exposiciones">
            Exposiciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entregables" className="space-y-4">
          {/* Botón de Nuevo Entregable */}
          <div className="flex justify-end mb-4">
            <Button
              id="btnNewEntregable"
              className="bg-black hover:bg-gray-800"
              onClick={() => setIsEntregableModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Nuevo Entregable
            </Button>
          </div>

          {/* Lista de entregables */}
          {entregables.map((entregable) => (
            <EntregableCard
              key={entregable.id}
              etapaId={etapaId}
              entregableId={entregable.id ?? ""}
              nombre={entregable.nombre}
              descripcion={entregable.descripcion}
              fechaInicio={entregable.fechaInicio}
              fechaFin={entregable.fechaFin}
              esEvaluable={entregable.esEvaluable}
            />
          ))}
        </TabsContent>

        <TabsContent value="exposiciones" className="space-y-4">
          {/* Botón de Nueva Exposición */}
          <div className="flex justify-end mb-4">
            <Button
              id="btnNewExposicion"
              className="bg-black hover:bg-gray-800"
              onClick={() => setIsExposicionModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Nueva Exposición
            </Button>
          </div>

          {/* Lista de exposiciones */}
          {exposiciones.map((exposicion) => (
            <ExposicionCard
              key={exposicion.id}
              etapaId={etapaId}
              exposicionId={exposicion.id ?? ""}
              titulo={exposicion.titulo}
              fechaInicio={exposicion.fechaInicio}
              fechaFin={exposicion.fechaFin}
              descripcion={exposicion.descripcion}
              duracion={exposicion.duracion}
              modalidad={exposicion.modalidad}
              jurados={exposicion.jurados}
            />
          ))}
        </TabsContent>
      </Tabs>
      {/* Modal para Nuevo Entregable */}
      <EntregableModal
        isOpen={isEntregableModalOpen}
        onClose={() => setIsEntregableModalOpen(false)}
        onSubmit={handleCreateEntregable}
        mode={"create"}
      />

      {/* Modal para Nueva Exposición */}
      <ExposicionModal
        isOpen={isExposicionModalOpen}
        onClose={() => setIsExposicionModalOpen(false)}
        onSubmit={handleCreateExposicion}
        mode={"create"}
      />
    </div>
  );
};

export default DetalleEtapaPage;

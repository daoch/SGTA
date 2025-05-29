"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, PenLine, Plus } from "lucide-react";
import { EntregableCard } from "../components/entregable/entregable-card";
import { ExposicionCard } from "../components/exposicion/exposicion-card";
import { Entregable } from "../dtos/entregable";
import { Exposicion } from "../dtos/exposicion";
import { EntregableModal } from "../components/entregable/entregable-modal";
import { ExposicionModal } from "../components/exposicion/exposicion-modal";
import axiosInstance from "@/lib/axios/axios-instance";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DetalleEtapaPageProps {
  etapaId: string;
}

const DetalleEtapaPage: React.FC<DetalleEtapaPageProps> = ({ etapaId }) => {
  const [isEntregableModalOpen, setIsEntregableModalOpen] = useState(false);
  const [isExposicionModalOpen, setIsExposicionModalOpen] = useState(false);
  const [entregables, setEntregables] = useState<Entregable[]>([]);
  const [exposiciones, setExposiciones] = useState<Exposicion[]>([]);

  const [isDeleteEntregableModalOpen, setIsDeleteEntregableModalOpen] = useState(false);
  const [entregableAEliminar, setEntregableAEliminar] = useState<Entregable | null>(null);

  const [isDeleteExposicionModalOpen, setIsDeleteExposicionModalOpen] = useState(false);
  const [exposicionAEliminar, setExposicionAEliminar] = useState<Exposicion | null>(null);

  useEffect(() => {
    const fetchEntregables = async () => {
      try {
        const response = await axiosInstance.get(
          `/entregable/etapa-formativa-x-ciclo/${etapaId}`,
        );
        setEntregables(response.data);
      } catch (error) {
        console.error("Error al cargar los entregables:", error);
      }
    };

    fetchEntregables();
  }, [etapaId]);

  useEffect(() => {
    const fetchExposiciones = async () => {
      try {
        const response = await axiosInstance.get(
          `/exposicion/etapa-formativa-x-ciclo/${etapaId}`,
        );
        setExposiciones(response.data);
      } catch (error) {
        console.error("Error al cargar las exposiciones:", error);
      }
    };

    fetchExposiciones();
  }, [etapaId]);

  const createEntregable = async (nuevoEntregable: Entregable) => {
    try {
      const response = await axiosInstance.post(
        `/entregable/etapa-formativa-x-ciclo/${etapaId}`,
        nuevoEntregable,
      );
      console.log("Entregable creado exitosamente:", response.data);
      return response.data; // Devuelve el entregable creado si es necesario
    } catch (error) {
      console.error("Error al crear el entregable:", error);
      throw error; // Lanza el error para manejarlo en el lugar donde se llame
    }
  };

  const createExposicion = async (nuevaExposicion: Exposicion) => {
    try {
      const response = await axiosInstance.post(
        `/exposicion/etapa-formativa-x-ciclo/${etapaId}`,
        nuevaExposicion,
      );
      console.log("Exposición creada exitosamente:", response.data);
      return response.data; // Devuelve la exposición creada si es necesario
    } catch (error) {
      console.error("Error al crear la exposición:", error);
      throw error; // Lanza el error para manejarlo en el lugar donde se llame
    }
  };

  const handleCreateEntregable = async (nuevoEntregable: Entregable) => {
    try {
      const nuevoEntregableFormatoISO: Entregable = {
        ...nuevoEntregable,
        fechaInicio:
          new Date(nuevoEntregable.fechaInicio).toISOString().split(".")[0] +
          "Z",
        fechaFin:
          new Date(nuevoEntregable.fechaFin).toISOString().split(".")[0] + "Z",
      };

      console.log("Datos enviados al backend:", nuevoEntregableFormatoISO);

      const idEntregable = await createEntregable(nuevoEntregableFormatoISO);

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
    try {
      const idExposicion = await createExposicion(nuevaExposicion);

      const nuevaExposicionConId: Exposicion = {
        ...nuevaExposicion,
        id: idExposicion, // Asignar el ID devuelto por la API
      };

      // Actualizar el estado local con el entregable creado
      setExposiciones((prev) => [...prev, nuevaExposicionConId]);

      // Cerrar el modal
      setIsExposicionModalOpen(false);
    } catch (error) {
      console.error("Error al crear la exposicion:", error);
    }
  };

  const handleOpenDeleteEntregableModal = (entregable: Entregable) => {
    setEntregableAEliminar(entregable);
    setIsDeleteEntregableModalOpen(true);
  };

  const handleOpenDeleteExposicionModal = (exposicion: Exposicion) => {
    setExposicionAEliminar(exposicion);
    setIsDeleteExposicionModalOpen(true);
  };

  const confirmDeleteEntregable = async () => {
    if (!entregableAEliminar) return;

    try {
      await axiosInstance.put("/entregable/delete",entregableAEliminar.id);
      setEntregables((prev) => prev.filter((e) => e.id !== entregableAEliminar.id));
      console.log("Entregable eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar el entregable:", error);
    } finally {
      setIsDeleteEntregableModalOpen(false);
      setEntregableAEliminar(null);
    }
  };

  const confirmDeleteExposicion = async () => {
    if (!exposicionAEliminar) return;

    try {
      await axiosInstance.put("/exposicion/delete",exposicionAEliminar.id);
      setExposiciones((prev) => prev.filter((e) => e.id !== exposicionAEliminar.id));
      console.log("Exposición eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar la exposición:", error);
    } finally {
      setIsDeleteExposicionModalOpen(false);
      setExposicionAEliminar(null);
    }
  };

  const cancelDeleteEntregable = () => {
    setIsDeleteEntregableModalOpen(false);
    setEntregableAEliminar(null);
  };

  const cancelDeleteExposicion = () => {
    setIsDeleteExposicionModalOpen(false);
    setExposicionAEliminar(null);
  };

  return (
    <div className="w-full px-6 py-6">
      {/* Header con botón de regreso */}
      <div className="flex items-center mb-6">
        <Link
          href="/coordinador/configuracion/proceso"
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
        >
          <ArrowLeft size={11} />
        </Link>
        <h1 className="text-xl font-semibold">Detalles de la Etapa</h1>
      </div>

      {/* Información del proyecto */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">
            Proyecto de Fin de Carrera 1
          </CardTitle>
          {/*<Button id="btnEditEtapa" variant="outline" size="sm" className="h-8">
            <PenLine className="h-4 w-4 mr-1" />
            Editar
          </Button>*/}
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
              className="bg-primary hover:bg-gray-800"
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
              entregable={entregable}
              onDelete={() => handleOpenDeleteEntregableModal(entregable)}
            />
          ))}
        </TabsContent>

        <TabsContent value="exposiciones" className="space-y-4">
          {/* Botón de Nueva Exposición */}
          <div className="flex justify-end mb-4">
            <Button
              id="btnNewExposicion"
              className="bg-primary hover:bg-gray-800"
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
              exposicion={exposicion}
              onDelete={() => handleOpenDeleteExposicionModal(exposicion)}
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

      <Dialog open={isDeleteEntregableModalOpen} onOpenChange={setIsDeleteEntregableModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar Entregable</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el entregable{" "}
              <strong>{entregableAEliminar?.nombre}</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDeleteEntregable}>
              No
            </Button>
            <Button variant="destructive" onClick={confirmDeleteEntregable}>
              Sí, eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteExposicionModalOpen} onOpenChange={setIsDeleteExposicionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar Exposición</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la exposición{" "}
              <strong>{exposicionAEliminar?.nombre}</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDeleteExposicion}>
              No
            </Button>
            <Button variant="destructive" onClick={confirmDeleteExposicion}>
              Sí, eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetalleEtapaPage;

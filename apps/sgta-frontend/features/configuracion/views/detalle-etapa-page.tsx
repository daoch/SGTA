"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus } from "lucide-react";
import { EntregableCard } from "../components/entregable/entregable-card";
import { ExposicionCard } from "../components/exposicion/exposicion-card";
import { Entregable } from "../dtos/entregable";
import { Exposicion } from "../dtos/exposicion";
import { EntregableModal } from "../components/entregable/entregable-modal";
import { ExposicionModal } from "../components/exposicion/exposicion-modal";
import axiosInstance from "@/lib/axios/axios-instance";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EtapaFormativaXCiclo } from "../dtos/etapa-formativa-x-ciclo";
import { toast } from "sonner";
import AppLoading from "@/components/loading/app-loading";

interface DetalleEtapaPageProps {
  etapaId: string;
}

const DetalleEtapaPage: React.FC<DetalleEtapaPageProps> = ({ etapaId }) => {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const nombreEtapa = searchParams.get("nombreEtapa");
  const ciclo = searchParams.get("ciclo");

  const [isEntregableModalOpen, setIsEntregableModalOpen] = useState(false);
  const [isExposicionModalOpen, setIsExposicionModalOpen] = useState(false);
  const [etapaFormativaXCiclo, setEtapaFormativaXCiclo] =
    useState<EtapaFormativaXCiclo>();
  const [entregables, setEntregables] = useState<Entregable[]>([]);
  const [exposiciones, setExposiciones] = useState<Exposicion[]>([]);

  const [isDeleteEntregableModalOpen, setIsDeleteEntregableModalOpen] =
    useState(false);
  const [entregableAEliminar, setEntregableAEliminar] =
    useState<Entregable | null>(null);

  const [isDeleteExposicionModalOpen, setIsDeleteExposicionModalOpen] =
    useState(false);
  const [exposicionAEliminar, setExposicionAEliminar] =
    useState<Exposicion | null>(null);

  useEffect(() => {
    const fetchEtapaFormativaXCiclo = async () => {
      try {
        const response = await axiosInstance.get(
          `/etapa-formativa-x-ciclo/etapaXCiclo/${etapaId}`,
        );
        setEtapaFormativaXCiclo(response.data);
      } catch (error) {
        console.error("Error al cargar la etapa formativa por ciclo:", error);
        toast.error("Error al cargar la etapa formativa por ciclo");
      } finally {
        setLoading(false);
      }
    };
    fetchEtapaFormativaXCiclo();
  });

  useEffect(() => {
    const fetchEntregables = async () => {
      try {
        const response = await axiosInstance.get(
          `/entregable/etapa-formativa-x-ciclo/${etapaId}`,
        );
        setEntregables(response.data);
      } catch (error) {
        console.error("Error al cargar los entregables:", error);
        toast.error("Error al cargar los entregables");
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
        toast.error("Error al cargar las exposiciones");
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
      await axiosInstance.put("/entregable/delete", entregableAEliminar.id);
      setEntregables((prev) =>
        prev.filter((e) => e.id !== entregableAEliminar.id),
      );
      toast.success("Entregable eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar el entregable:", error);
      toast.error("Error al eliminar el entregable");
    } finally {
      setIsDeleteEntregableModalOpen(false);
      setEntregableAEliminar(null);
    }
  };

  const confirmDeleteExposicion = async () => {
    if (!exposicionAEliminar) return;

    try {
      await axiosInstance.put("/exposicion/delete", exposicionAEliminar.id);
      setExposiciones((prev) =>
        prev.filter((e) => e.id !== exposicionAEliminar.id),
      );
      toast.success("Exposición eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar la exposición:", error);
      toast.error("Error al eliminar la exposición");
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

  if (loading) {
    return <AppLoading />;
  }

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
        <div className="ml-4">
          <h1 className="text-2xl font-bold text-[#042354]">{nombreEtapa}</h1>
          <p className="text-gray-600">Ciclo: {ciclo}</p>
        </div>
      </div>

      {/* Información del proyecto */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">
            {etapaFormativaXCiclo?.nombreEtapaFormativa} - Ciclo:{" "}
            {etapaFormativaXCiclo?.nombreCiclo}
          </CardTitle>
          {/*<Button id="btnEditEtapa" variant="outline" size="sm" className="h-8">
            <PenLine className="h-4 w-4 mr-1" />
            Editar
          </Button>*/}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Creditaje por tema</h3>
              <p className="text-sm text-muted-foreground">
                {etapaFormativaXCiclo?.creditajePorTema} créditos
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Duración de las exposiciones</h3>
              <p className="text-sm text-muted-foreground">
                {etapaFormativaXCiclo?.duracionExposicion} minutos
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

      <Dialog
        open={isDeleteEntregableModalOpen}
        onOpenChange={setIsDeleteEntregableModalOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar Entregable</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el entregable{" "}
              <strong>{entregableAEliminar?.nombre}</strong>? Esta acción no se
              puede deshacer.
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

      <Dialog
        open={isDeleteExposicionModalOpen}
        onOpenChange={setIsDeleteExposicionModalOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar Exposición</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la exposición{" "}
              <strong>{exposicionAEliminar?.nombre}</strong>? Esta acción no se
              puede deshacer.
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

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  etapasFormativasService,
  type EtapaFormativaDetail,
  type EtapaFormativaListItem,
} from "@/features/configuracion/services/etapas-formativas";
import { Edit, Eye, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { ConfirmarEliminarModal } from "./confirmar-eliminar-modal";
import { EditarEtapaFormativaModal } from "./editar-etapa-formativa-modal";

const TODAS_CARRERAS = "TODAS";
const TODOS_ESTADOS = "TODOS";

const estados = [
  { id: 1, nombre: "EN_CURSO", label: "En curso" },
  { id: 2, nombre: "FINALIZADO", label: "Finalizado" },
];

export type EtapasFormativasListRef = {
  loadEtapasFormativas: () => Promise<void>;
};

export const EtapasFormativasList = forwardRef<EtapasFormativasListRef>(
  (props, ref) => {
    const [carreraSeleccionada, setCarreraSeleccionada] =
      useState<string>(TODAS_CARRERAS);
    const [estadoSeleccionado, setEstadoSeleccionado] =
      useState<string>(TODOS_ESTADOS);
    const [busqueda, setBusqueda] = useState<string>("");
    const [etapasFormativas, setEtapasFormativas] = useState<
      EtapaFormativaListItem[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [etapaToDelete, setEtapaToDelete] =
      useState<EtapaFormativaListItem | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [etapaToEdit, setEtapaToEdit] = useState<EtapaFormativaDetail | null>(
      null,
    );
    const [editLoading, setEditLoading] = useState(false);

    // Exponer la función de carga al componente padre
    useImperativeHandle(ref, () => ({
      loadEtapasFormativas,
    }));

    useEffect(() => {
      loadEtapasFormativas();
    }, []);

    const loadEtapasFormativas = async () => {
      try {
        setIsLoading(true);
        const data = await etapasFormativasService.getAll();
        setEtapasFormativas(data);
      } catch (error) {
        console.error("Error al cargar etapas formativas:", error);
        toast.error("Error al cargar las etapas formativas");
      } finally {
        setIsLoading(false);
      }
    };

    const openEditModal = async (id: number) => {
      try {
        setEditLoading(true);
        const etapa = await etapasFormativasService.getById(id.toString());
        setEtapaToEdit(etapa);
        setEditModalOpen(true);
      } catch (error) {
        console.error("Error al cargar etapa formativa:", error);
        toast.error("Error al cargar la etapa formativa");
      } finally {
        setEditLoading(false);
      }
    };

    const closeEditModal = () => {
      setEditModalOpen(false);
      setEtapaToEdit(null);
    };

    const handleEditSuccess = () => {
      loadEtapasFormativas();
      closeEditModal();
    };

    // Obtener carreras únicas del listado de etapas formativas
    const carreras = useMemo(() => {
      const carrerasUnicas = [
        ...new Set(etapasFormativas.map((etapa) => etapa.carreraNombre)),
      ];
      return carrerasUnicas.map((nombre, index) => ({
        id: index + 1,
        nombre: nombre,
      }));
    }, [etapasFormativas]);

    const openDeleteModal = (etapa: EtapaFormativaListItem) => {
      setEtapaToDelete(etapa);
      setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
      setDeleteModalOpen(false);
      setEtapaToDelete(null);
    };

    const handleDelete = async () => {
      if (!etapaToDelete) return;

      try {
        setDeleteLoading(true);
        await etapasFormativasService.delete(etapaToDelete.id);
        toast.success("Etapa formativa eliminada con éxito");
        loadEtapasFormativas();
      } catch (error) {
        console.error("Error al eliminar etapa formativa:", error);
        toast.error("Error al eliminar la etapa formativa");
      } finally {
        setDeleteLoading(false);
        closeDeleteModal();
      }
    };

    const getEstadoLabel = (estado: string) => {
      return estados.find((e) => e.nombre === estado)?.label || estado;
    };

    // Filtrar etapas formativas
    const etapasFiltradas = etapasFormativas.filter((etapa) => {
      const coincideCarrera =
        carreraSeleccionada === TODAS_CARRERAS ||
        etapa.carreraNombre === carreraSeleccionada;
      const coincideEstado =
        estadoSeleccionado === TODOS_ESTADOS ||
        etapa.estado === estadoSeleccionado;
      const coincideBusqueda =
        !busqueda ||
        etapa.nombre.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCarrera && coincideEstado && coincideBusqueda;
    });

    if (isLoading) {
      return (
        <div className="text-center py-4">Cargando etapas formativas...</div>
      );
    }

    return (
      <div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar etapa formativa..."
                className="pl-8"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <Select
              value={carreraSeleccionada}
              onValueChange={setCarreraSeleccionada}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por carrera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODAS_CARRERAS}>
                  Todas las carreras
                </SelectItem>
                {carreras.map((carrera) => (
                  <SelectItem key={carrera.id} value={carrera.nombre}>
                    {carrera.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-64">
            <Select
              value={estadoSeleccionado}
              onValueChange={setEstadoSeleccionado}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS_ESTADOS}>Todos los estados</SelectItem>
                {estados.map((estado) => (
                  <SelectItem key={estado.id} value={estado.nombre}>
                    {estado.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Nombre
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Carrera
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Estado
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {etapasFiltradas.length > 0 ? (
                etapasFiltradas.map((etapa) => (
                  <tr key={etapa.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">
                      {etapa.nombre}
                    </td>
                    <td className="px-4 py-3 text-sm">{etapa.carreraNombre}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge
                        variant={
                          etapa.estado === "EN_CURSO" ? "default" : "secondary"
                        }
                      >
                        {getEstadoLabel(etapa.estado)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <Link
                          href={`/administrador/configuracion/etapas-formativas/${etapa.id}`}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye size={16} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditModal(etapa.id)}
                          disabled={editLoading}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => openDeleteModal(etapa)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-3 text-sm text-center text-gray-500"
                  >
                    No se encontraron etapas formativas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal de confirmación para eliminar */}
        <ConfirmarEliminarModal
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          title="Eliminar Etapa Formativa"
          description={`¿Está seguro que desea eliminar la etapa formativa "${etapaToDelete?.nombre}"? Esta acción no se puede deshacer.`}
          isLoading={deleteLoading}
        />

        {/* Modal para editar etapa formativa */}
        {etapaToEdit && (
          <EditarEtapaFormativaModal
            isOpen={editModalOpen}
            onClose={closeEditModal}
            onSuccess={handleEditSuccess}
            etapaFormativa={etapaToEdit}
          />
        )}
      </div>
    );
  },
);

EtapasFormativasList.displayName = "EtapasFormativasList";

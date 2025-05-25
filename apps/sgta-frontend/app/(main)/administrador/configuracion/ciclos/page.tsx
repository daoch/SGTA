"use client";

import { Button } from "@/components/ui/button";
import {
  CicloEtapas,
  CrearCicloDto,
} from "@/features/administrador/types/ciclo.type"; // Asegúrate de importar el tipo correcto
import {
  crearCiclo,
  listarCiclosConEtapas,
} from "@/features/administrador/types/services/cicloService";
import { CiclosList } from "@/features/configuracion/components/configuracion/ciclos-list";
import { NuevoCicloModal } from "@/features/configuracion/components/configuracion/nuevo-ciclo-modal";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CiclosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ciclosActivos, setCiclosActivos] = useState<CicloEtapas[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mueve fetchCiclos al scope del componente para que esté disponible en handleRegistrar
  const fetchCiclos = async () => {
    try {
      const ciclos: CicloEtapas[] = await listarCiclosConEtapas();
      setCiclosActivos(ciclos);
    } catch (error) {
      console.error("Error al cargar ciclos con etapas", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCiclos();
  }, []);

  // Función para manejar la creación de un nuevo ciclo
  const handleRegistrar = async (
    formData: CrearCicloDto,
  ): Promise<CrearCicloDto> => {
    try {
      const nuevoCiclo = await crearCiclo(formData);
      setIsModalOpen(false);
      await fetchCiclos(); // <-- Recarga la lista
      return nuevoCiclo;
    } catch (error) {
      console.error(error);
      throw error; // Propaga el error para que el modal pueda manejarlo si es necesario
    }
  };

  return (
    <div className="py-6 px-2">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/administrador/configuracion">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Gestión de Ciclos</h1>
      </div>

      <div className="flex justify-end mb-4">
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          <span>Nuevo Ciclo</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <p className="text-gray-500">
            Administre los ciclos académicos disponibles en el sistema. Cada
            ciclo puede tener diferentes etapas formativas asociadas según la
            carrera.
          </p>
        </div>

        {isLoading ? (
          <p className="text-gray-500">Cargando ciclos...</p>
        ) : (
          <CiclosList ciclos={ciclosActivos} />
        )}
      </div>

      <NuevoCicloModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRegistrar={handleRegistrar}
      />
    </div>
  );
}

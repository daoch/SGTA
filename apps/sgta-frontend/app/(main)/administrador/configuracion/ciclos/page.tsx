"use client";

import { CiclosList } from "@/components/main/configuracion/ciclos-list";
import { NuevoCicloModal } from "@/components/main/configuracion/nuevo-ciclo-modal";
import { Button } from "@/components/ui/button";
import { Ciclo } from "@/features/administrador/types/ciclo.type"; // Asegúrate de importar el tipo correcto
import { crearCiclo } from "@/features/administrador/types/services/cicloService";
import { getCiclos } from "@/features/jurado/services/exposicion-service"; //Para los
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CiclosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ciclosActivos, setCiclosActivos] = useState<Ciclo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCiclos = async () => {
      try {
        const allCiclos = await getCiclos();
        const ciclosTodos = allCiclos.map((ciclo: Ciclo) => ({
        ...ciclo,
        estadoDescripcion: ciclo.estado ? "En curso" : "Finalizado",
      }));
        setCiclosActivos(ciclosTodos);
      } catch (error) {
        console.error("Error al cargar ciclos activos", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCiclos();
  }, []);


  // Función para manejar la creación de un nuevo ciclo
  const handleRegistrar = async (formData: Ciclo) => {
  try {
    await crearCiclo(formData);
    setIsModalOpen(false); // Cierra el modal
    // Opcional: notifica éxito o recarga la lista de ciclos
  } catch (error) {
    // Maneja el error (mostrar mensaje, etc.)
    console.error(error);
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
        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Nuevo Ciclo</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <p className="text-gray-500">
            Administre los ciclos académicos disponibles en el sistema. Cada ciclo puede tener diferentes etapas
            formativas asociadas según la carrera.
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

"use client";

import { Button } from "@/components/ui/button";
import { EtapasFormativasList, EtapasFormativasListRef } from "@/features/configuracion/components/configuracion/etapas-formativas-list";
import { NuevaEtapaFormativaModal } from "@/features/configuracion/components/configuracion/nueva-etapa-formativa-modal";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

export default function EtapasFormativasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const etapasListRef = useRef<EtapasFormativasListRef>(null);

  const handleModalSuccess = () => {
    // Refrescar la lista de etapas formativas después de crear una nueva
    if (etapasListRef.current) {
      etapasListRef.current.loadEtapasFormativas();
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
        <h1 className="text-2xl font-bold">Gestión de Etapas Formativas</h1>
      </div>

      <div className="flex justify-end mb-4">
        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Nueva Etapa Formativa</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <p className="text-gray-500">
            Administre las etapas formativas (cursos de tesis) disponibles en el sistema. Cada etapa formativa está
            vinculada a un ciclo académico y a una carrera específica.
          </p>
        </div>

        <EtapasFormativasList ref={etapasListRef} />
      </div>

      <NuevaEtapaFormativaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}

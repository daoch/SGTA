"use client";

import { CarrerasList, CarrerasListRef } from "@/features/configuracion/components/configuracion/carreras-list";
import { NuevaCarreraModal } from "@/features/configuracion/components/configuracion/nueva-carrera-modal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

export default function CarrerasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const carrerasListRef = useRef<CarrerasListRef>(null);

  const handleCarreraCreated = () => {
    // Refresh the carreras list when a new carrera is created
    if (carrerasListRef.current) {
      carrerasListRef.current.refresh();
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
        <h1 className="text-2xl font-bold">Gestión de Carreras</h1>
      </div>

      <div className="flex justify-end mb-4">
        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Nueva Carrera</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <p className="text-gray-500">
            Administre las carreras disponibles en el sistema. Cada carrera puede tener diferentes configuraciones de
            etapas formativas.
          </p>
        </div>

        <CarrerasList ref={carrerasListRef} />
      </div>

      <NuevaCarreraModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCarreraCreated}
      />
    </div>
  );
}

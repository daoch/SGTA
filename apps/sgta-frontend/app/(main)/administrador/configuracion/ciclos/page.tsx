"use client";

import { CiclosList } from "@/components/main/configuracion/ciclos-list";
import { NuevoCicloModal } from "@/components/main/configuracion/nuevo-ciclo-modal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CiclosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

        <CiclosList />
      </div>

      <NuevoCicloModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

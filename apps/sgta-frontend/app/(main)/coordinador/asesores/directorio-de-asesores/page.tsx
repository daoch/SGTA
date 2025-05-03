'use client';

import { Card } from '@/components/ui/card';
import { useAsesorHabilitation } from '@/features/asesores/hooks/useAsesorHabilitation';
import AsesorFilters from '@/features/asesores/components/AsesorFilters';
import AsesorTable from '@/features/asesores/components/AsesorTable';
import MassActionsToolbar from '@/features/asesores/components/MassActionsToolbar';

export default function DirectorioAsesoresPage() {
  const {
    asesores,
    isLoading,
    searchTerm,
    setSearchTerm,
    toggleHabilitacion,
    selectedKeys,
    setSelectedKeys
  } = useAsesorHabilitation();

  const selectedAsesores = asesores.filter(a => selectedKeys.has(a.id));

  const handleMassAction = (action: 'habilitar' | 'inhabilitar') => {
    selectedAsesores.forEach(a => {
      if ((action === 'habilitar' && !a.habilitado) || (action === 'inhabilitar' && a.habilitado)) {
        toggleHabilitacion(a.id);
      }
    });
    setSelectedKeys(new Set());
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
          Directorio de Asesores
        </h1>
        <p className="text-muted-foreground max-w-4xl">
          Administra el estado de habilitación de los asesores académicos para dirigir tesis.
        </p>
      </div>

      <MassActionsToolbar
        selectedCount={selectedKeys.size}
        selectedAsesores={selectedAsesores}
        onClearSelection={() => setSelectedKeys(new Set())}
        onExecuteMassAction={handleMassAction}
      />

      <Card className="p-4 border">
        <AsesorFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </Card>

      <Card className="p-0">
        <AsesorTable
          asesores={asesores}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          onToggleHabilitacion={toggleHabilitacion}
        />
      </Card>
    </div>
  );
}

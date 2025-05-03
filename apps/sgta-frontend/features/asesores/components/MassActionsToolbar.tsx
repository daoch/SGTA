'use client';

import { Button } from '@/components/ui/button';
import { Asesor } from '../types';

interface Props {
  selectedCount: number;
  selectedAsesores: Asesor[];
  onClearSelection: () => void;
  onExecuteMassAction: (action: 'habilitar' | 'inhabilitar') => void;
  isLoading?: boolean;
}

export default function MassActionsToolbar({
  selectedCount,
  selectedAsesores,
  onClearSelection,
  onExecuteMassAction,
  isLoading,
}: Props) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-4 border rounded bg-muted">
      <div className="text-sm text-muted-foreground">
        {selectedCount} asesor{selectedCount > 1 ? 'es' : ''} seleccionado{selectedCount > 1 ? 's' : ''}
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={isLoading}
          onClick={() => onExecuteMassAction('habilitar')}
        >
          Habilitar
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={isLoading}
          onClick={() => onExecuteMassAction('inhabilitar')}
        >
          Inhabilitar
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onClearSelection}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}

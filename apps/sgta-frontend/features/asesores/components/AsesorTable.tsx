// features/asesores/components/AsesorTable.tsx
'use client';

import { Asesor } from '../types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

type Props = {
  asesores: Asesor[];
  selectedKeys: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onToggleHabilitacion: (id: string) => void;
};

export default function AsesorTable({ asesores, selectedKeys, onSelectionChange, onToggleHabilitacion }: Props) {
  const toggleSelect = (id: string) => {
    const newSelection = new Set(selectedKeys);
    newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
    onSelectionChange(newSelection);
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="p-3 text-left">
              <Checkbox
                checked={selectedKeys.size === asesores.length}
                onCheckedChange={checked => {
                  onSelectionChange(checked ? new Set(asesores.map(a => a.id)) : new Set());
                }}
              />
            </th>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Correo</th>
            <th className="p-3 text-left">Especialidad</th>
            <th className="p-3 text-center">Tesis Activas</th>
            <th className="p-3 text-center">Estado</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asesores.map(asesor => (
            <tr key={asesor.id} className="border-t">
              <td className="p-3">
                <Checkbox
                  checked={selectedKeys.has(asesor.id)}
                  onCheckedChange={() => toggleSelect(asesor.id)}
                />
              </td>
              <td className="p-3">{asesor.nombre}</td>
              <td className="p-3">{asesor.correo}</td>
              <td className="p-3">{asesor.especialidad}</td>
              <td className="p-3 text-center">{asesor.tesisActivas}</td>
              <td className="p-3 text-center">
                <span className={asesor.habilitado ? 'text-green-600' : 'text-red-600'}>
                  {asesor.habilitado ? 'Habilitado' : 'Inhabilitado'}
                </span>
              </td>
              <td className="p-3 text-center">
                <Button variant="outline" size="sm" onClick={() => onToggleHabilitacion(asesor.id)}>
                  {asesor.habilitado ? 'Inhabilitar' : 'Habilitar'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

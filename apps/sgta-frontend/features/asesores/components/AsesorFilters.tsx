'use client';

import { Input } from '@/components/ui/input';

type Props = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

export default function AsesorFilters({ searchTerm, onSearchChange }: Props) {
  return (
    <div className="flex items-center gap-4">
      <Input
        type="text"
        placeholder="Buscar por nombre o correo"
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}

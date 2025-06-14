"use client";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/features/asesores/hooks/use-debounce";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Props {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusValue: string;
  onStatusValueChange: (value: string) => void;
  clearTerm: () => void;
}

const RequestSearchFilters: React.FC<Props> = ({
  searchTerm,
  onSearchChange,
  statusValue,
  onStatusValueChange,
  clearTerm,
}) => {
  const [localTerm, setLocalTerm] = useState(searchTerm);
  const debouncedTerm = useDebounce(localTerm, 1000);

  useEffect(() => {
    if (debouncedTerm !== searchTerm) {
      onSearchChange(debouncedTerm);
    }
  }, [debouncedTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.length > 50) value = value.slice(0, 50);
    if (/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ@. ]*$/.test(value)) {
      setLocalTerm(value);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <Tabs value={statusValue} onValueChange={onStatusValueChange}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="approved">Aprobadas</TabsTrigger>
          <TabsTrigger value="rejected">Rechazadas</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          className="pl-10 w-full"
          placeholder="Buscar por nombre o correo"
          value={localTerm}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default RequestSearchFilters;

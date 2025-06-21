"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
// import { IRequestTerminationConsultancyRequestStatus } from "@/features/asesores/types/cessation-request"; // Ya no se usa directamente aquí
import { CessationRequestFrontendStatusFilter } from "@/features/asesores/types/cessation-request"; // Usar este tipo
import { useDebounce } from "@/features/asesores/hooks/use-debounce";

interface ISearchFilterParams {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusValue: CessationRequestFrontendStatusFilter; // Tipo para las pestañas
  onStatusValueChange: (value: CessationRequestFrontendStatusFilter) => void;
}

const RequestSearchFilters: React.FC<ISearchFilterParams> = ({
  searchTerm,
  onSearchChange,
  statusValue,
  onStatusValueChange,
}) => {
  const [localTerm, setLocalTerm] = useState(searchTerm);
  const debouncedTerm = useDebounce(localTerm, 1500);

  useEffect(() => {
    // Sincronizar localTerm si searchTerm cambia desde el store (ej. por clear)
    setLocalTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    // Solo llamar a onSearchChange si el término debounced es diferente del que ya está en el store,
    // para evitar bucles si onSearchChange también actualiza searchTerm en el store.
    // Sin embargo, setFullNameEmailPage en el store ya resetea la página,
    // por lo que el refetch de React Query ocurrirá de todas formas.
    onSearchChange(debouncedTerm);
  }, [debouncedTerm, onSearchChange]);

  const validPattern = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ@. ]*$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.length > 50) value = value.slice(0, 50);
    if (validPattern.test(value)) setLocalTerm(value);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <Tabs
        value={statusValue}
        onValueChange={(key) => onStatusValueChange(key as CessationRequestFrontendStatusFilter)}
      >
        <TabsList className="flex-wrap">
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger> {/* Solo dos pestañas */}
        </TabsList>
      </Tabs>

      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          className="pl-10 w-full"
          placeholder="Buscar por nombre o correo"
          value={localTerm}
          onChange={handleChange}
          // maxLength={30} // Ya manejado en handleChange
        />
      </div>
    </div>
  );
};

export default RequestSearchFilters;
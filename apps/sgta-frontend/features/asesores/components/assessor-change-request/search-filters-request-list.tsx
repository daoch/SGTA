'use client'
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/features/asesores/hooks/use-debounce";
import { IAssessorChangeRequestSearchFilterProps, IAssessorChangeRequestStatus } from "@/features/asesores/types/assessor-change-request";


const RequestSearchFilters: React.FC<IAssessorChangeRequestSearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  statusValue,
  onStatusValueChange
  
}) => {
    const [localTerm, setLocalTerm] = useState(searchTerm);
    const debouncedTerm = useDebounce(localTerm, 1500);
    useEffect(() => {
        if (debouncedTerm !== searchTerm) {
          onSearchChange(debouncedTerm);
        }
    }, [debouncedTerm, onSearchChange, searchTerm]);

    const validPattern = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ@. ]*$/;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
  
      if (value.length > 50) {
        value = value.slice(0, 50);
      }

      if (validPattern.test(value)) {
        setLocalTerm(value);
      }
    };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Tabs de filtro */}
      <Tabs value={statusValue} onValueChange={(key) => onStatusValueChange(key as IAssessorChangeRequestStatus)}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="answered">Respondidas</TabsTrigger>
          <TabsTrigger value="approved">Aprobadas</TabsTrigger>
          <TabsTrigger value="rejected">Rechazadas</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Campo de búsqueda */}
      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          className="pl-10 w-full"
          placeholder="Buscar por nombre o correo"
          value={localTerm}
          onChange={handleChange}
          maxLength={30}
        />
      </div>
    </div>
  );
};

export default RequestSearchFilters;

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@/features/asesores/hooks/use-debounce";
import {
  IAssessorChangeAvailableAssessorsListProps,
  IAssessorChangeRequestSearchCriteriaAvailableAdvisorList,
} from "@/features/asesores/types/cambio-asesor/entidades";
import { Loader2, User, UserMinus, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AssessorChangeRequestPagination from "@/features/asesores/components/assessor-change-request/pagination-assessor-change-request";
import { Image } from "@radix-ui/react-avatar";
import { useAssessorChangeRequestAdvisorPerThematicArea } from "../../queries/assessor-change-request";

export default function AssessorListAssessorChangeRequest({
  selectedAssessorId,
  setSelectedAssessorId,
  selectedIdThematicAreas,
}: Readonly<IAssessorChangeAvailableAssessorsListProps>) {
  const initialStateSearchCriteria: IAssessorChangeRequestSearchCriteriaAvailableAdvisorList =
    {
      idThematicAreas: selectedIdThematicAreas,
      fullNameEmailCode: "",
      page: 1,
    };
  const [searchCriteria, setSearchCriteria] = useState(
    initialStateSearchCriteria,
  );
  const debouncedSearchTerm = useDebounce(
    searchCriteria.fullNameEmailCode,
    2000,
  );
  const [localTerm, setLocalTerm] = useState(searchCriteria.fullNameEmailCode);
  const { isLoading, data } =
    useAssessorChangeRequestAdvisorPerThematicArea(searchCriteria);

  const debouncedTerm = useDebounce(localTerm, 1500);
  useEffect(() => {
    if (debouncedTerm !== searchCriteria.fullNameEmailCode) {
      setSearchCriteria((prev) => ({
        ...prev,
        fullNameEmailCode: debouncedTerm,
        page: 1,
      }));
    }
  }, [debouncedTerm, searchCriteria.fullNameEmailCode]);

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

  const handlePageChange = (page: number) => {
    setSearchCriteria((prev) => ({
      ...prev,
      page: page,
    }));
  };

  const handleUnselectAssessor = () => {
    setSelectedAssessorId(null);
  };

  const handleSelectAssessor = (id: number) => {
    return () => {
      setSelectedAssessorId(id);
    };
  };

  useEffect(() => {
    setSearchCriteria((prev) => ({
      ...prev,
      fullNameEmail: debouncedSearchTerm,
      page: 1,
    }));
  }, [debouncedSearchTerm]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input
          placeholder="Buscar por nombre, código o correo"
          value={localTerm}
          onChange={handleChange}
          className="flex-1"
        />
      </div>
      <div className="rounded-md border overflow-hidden flex-1">
        <div className="overflow-y-auto h-[calc(100%-2px)]">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Asesor</TableHead>
                <TableHead>Áreas Temáticas</TableHead>
                <TableHead className="text-center">Capacidad</TableHead>
                <TableHead className="w-[100px] text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                if (isLoading) {
                  return (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground w-full">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <p className="mt-4">Cargando asesores...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }

                if (!data?.assessors?.length) {
                  return (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No se encontraron asesores
                      </TableCell>
                    </TableRow>
                  );
                }

                return data.assessors.map((advisor) => {
                  const advisorAssignedCount =
                    advisor.assignedStudentsQuantity +
                    (advisor.id === selectedAssessorId ? 1 : 0);
                  const isAtCapacity = advisorAssignedCount >= advisor.capacity;
                  const wasAssigned = advisor.id === selectedAssessorId;
                  const assignedAndAtCapacity =
                    wasAssigned || (isAtCapacity && wasAssigned);

                  return (
                    <TableRow key={advisor.id}>
                      <TableCell>
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <Avatar className="h-8 w-8">
                            {advisor.urlPhoto ? (
                              <Image
                                src={advisor.urlPhoto}
                                alt={`User-photo-${advisor.firstName}`}
                                className="rounded-full"
                              />
                            ) : (
                              <AvatarFallback className="bg-gray-400" />
                            )}
                          </Avatar>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {advisor.firstName} {advisor.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {advisor.email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {advisor.code}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {advisor.thematicAreas.map((area) => (
                            <Badge key={area.id} variant="outline">
                              {area.description}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={isAtCapacity ? "text-red-500" : ""}>
                          {advisorAssignedCount} / {advisor.capacity}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {(() => {
                          if (assignedAndAtCapacity)
                            return (
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-red-500 hover:bg-red-800"
                                onClick={handleUnselectAssessor}
                              >
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            );
                          if (!isAtCapacity)
                            return (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={handleSelectAssessor(advisor.id)}
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            );
                          return (
                            <Button size="sm" variant="outline" disabled>
                              <User className="h-4 w-4" />
                            </Button>
                          );
                        })()}
                      </TableCell>
                    </TableRow>
                  );
                });
              })()}
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  <AssessorChangeRequestPagination
                    currentPage={searchCriteria.page}
                    totalPages={data?.totalPages ?? 1}
                    onPageChange={handlePageChange}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

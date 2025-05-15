import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ICessationRequestHistoryTableProps, IRequestTerminationConsultancyRequestData } from "@/features/asesores/types/cessation-request";
import { differenceInDays, format } from "date-fns";

const RequestHistoryTable: React.FC<ICessationRequestHistoryTableProps> = ({
  requests,
  onViewDetails,
}) => {
  const columns = [
    { name: "PROFESOR", uid: "assessor" },
    { name: "FECHA SOLICITUD", uid: "requestDate" },
    { name: "TESIS AFECTADAS", uid: "students" },
    { name: "ESTADO", uid: "status" },
    { name: "FECHA DECISIÓN", uid: "answerDate" },
    { name: "ACCIONES", uid: "actions" },
  ];


  const renderCell = (request: IRequestTerminationConsultancyRequestData, columnKey: string) => {
    switch (columnKey) {
      case "assessor":
        return (
          <div className="flex items-center gap-2 ">
            <Avatar className="h-8 w-8">
                {request.assessor.urlPhoto ? (
                    <img
                        src={request.assessor.urlPhoto}
                        alt={`User-photo-${request.assessor.id}`}
                    />
                ) : (
                    <AvatarFallback className="bg-gray-400" />
                )}
            </Avatar>
            <div>
              <p className="text-sm font-medium">{`${request.assessor.name} ${request.assessor.lastName}`}</p>
              <p className="text-xs text-muted-foreground">{request.assessor.email}</p>
            </div>
          </div>
        );
      case "requestDate":
        return (
          <div>
            <span className="font-medium text-gray-800 block">{`${format(request.registerTime, 'dd/MM/yyyy')} - ${format(request.registerTime, 'hh:mm a')}`}</span>
            <span className="text-gray-500 block">{`Hace ${differenceInDays(new Date(), request.registerTime)} días`}</span>
          </div>
        );
      case "students":
        return (
          <div className="w-full text-center">
            <Badge variant="secondary" className="text-xs">
              {request.students.length}
            </Badge>
          </div>
        );
      case "status":
        return (
          <Badge
            variant="outline"
            className={
              request.status === "rejected"
                ? "border-red-500 text-red-600"
                : "border-green-500 text-green-600"
            }
          >
            {request.status === "approved" ? "Aprobada" : "Rechazada"}
          </Badge>
        );
      case "answerDate":
        return (
          <div>
            <span className="font-medium text-gray-800 block">{`${format(request.responseTime, 'dd/MM/yyyy')} - ${format(request.responseTime, 'hh:mm a')}`}</span>
            <span className="text-gray-500 block">{`Hace ${differenceInDays(new Date(), request.responseTime)} días`}</span>
          </div>
        );
      case "actions":
        return (
          <div className="flex justify-left">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(request.id)}
            >
              Detalles
            </Button>
          </div>
        );
      default:
        return <span className="text-sm">Not found</span>;
    }
  };

  return (
    <div className="border rounded-md overflow-x-auto px-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.uid}
                className={column.uid === "acciones" ? "text-right" : ""}
              >
                {column.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12">
                No hay solicitudes en el historial para los filtros seleccionados.
              </TableCell>
            </TableRow>
          ) : (
            requests.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={column.uid}>
                    {renderCell(item, column.uid)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RequestHistoryTable;

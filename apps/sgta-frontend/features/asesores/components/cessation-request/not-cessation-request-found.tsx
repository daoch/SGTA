import { Card } from "@/components/ui/card";
import { JSX } from "react";
import { INotCessationRequestFoundProps } from "../../types/cessation-request";

export default function NotFoundCessationRequests({
  type,
  appliedFilters,
}: Readonly<INotCessationRequestFoundProps>): JSX.Element {
  const getMessage = (defaultMsg: string, filterMsg: string) => (
    <Card className="p-12 text-center shadow-sm">
      <p className="text-lg text-muted-foreground mb-2">{defaultMsg}</p>
      {appliedFilters && <p className="text-sm text-muted-foreground">{filterMsg}</p>}
    </Card>
  );

  switch (type) {
    case "pending":
      return getMessage(
        appliedFilters ? "No se encontraron solicitudes pendientes" : "No hay solicitudes pendientes registradas",
        "Ajuste los filtros o el término de búsqueda."
      );
    case "answered":
      return getMessage(
        appliedFilters ? "No se encontraron solicitudes respondidas" : "No hay solicitudes respondidas registradas",
        "Ajuste los filtros o el término de búsqueda."
      );
    case "approved":
      return getMessage(
        appliedFilters ? "No se encontraron solicitudes aprobadas" : "No hay solicitudes aprobadas registradas",
        "Ajuste los filtros o el término de búsqueda."
      );
    case "rejected":
      return getMessage(
        appliedFilters ? "No se encontraron solicitudes rechazadas" : "No hay solicitudes rechazadas registradas",
        "Ajuste los filtros o el término de búsqueda."
      );
    default:
      return <p>No se encontraron solicitudes</p>;
  }
}
import { CessationRequestFrontendStatusFilter } from "../../types/cessation-request";

interface Props {
  statusFilter: CessationRequestFrontendStatusFilter;
  appliedFilters?: boolean;
}

export function NotCessationRequestFound({ statusFilter, appliedFilters }: Props) {
  const getMessage = (title: string, subtitle: string) => (
    <div className="text-center py-8">
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );

  switch (statusFilter) {
    case "pending":
      return getMessage(
        appliedFilters ? "No se encontraron solicitudes pendientes" : "No hay solicitudes pendientes registradas",
        "Ajuste los filtros o el término de búsqueda."
      );
    case "history":
      return getMessage(
        appliedFilters ? "No se encontraron solicitudes historial" : "No hay historial de solicitudes",
        "Ajuste los filtros o el término de búsqueda."
      );
    default:
      return null;
  }
}

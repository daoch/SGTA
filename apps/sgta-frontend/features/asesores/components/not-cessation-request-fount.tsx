import { Card } from "@/components/ui/card";
import { IRequestTerminationConsultancyRequestStatusFilter } from "@/features/asesores/types/solicitud-cese-asesoria";

export default function NotCessationRequestFound({type, appliedFilters}: {type: IRequestTerminationConsultancyRequestStatusFilter, appliedFilters: boolean}){
    const RendeNotFoundComponent = () => {
        switch (type) {
            case "pending":
                if (appliedFilters)
                    return (
                        <Card className="p-12 text-center shadow-sm">
                            <p className="text-lg text-muted-foreground mb-2">No se encontraron solicitudes pendientes</p>
                            <p className="text-sm text-muted-foreground">Ajuste los filtros o el término de búsqueda.</p>
                        </Card>
                    );
                else
                    return (
                        <Card className="p-12 text-center shadow-sm">
                            <p className="text-lg text-muted-foreground mb-2">No hay solicitudes pendientes registradas</p>
                        </Card>
                    );
          case "answered":
            if (appliedFilters)
                return (
                    <Card className="p-12 text-center shadow-sm">
                        <p className="text-lg text-muted-foreground mb-2">No se encontraron solicitudes respondidas</p>
                        <p className="text-sm text-muted-foreground">Ajuste los filtros o el término de búsqueda.</p>
                    </Card>
                );
            else
                return (
                    <Card className="p-12 text-center shadow-sm">
                        <p className="text-lg text-muted-foreground mb-2">No hay solicitudes respondidas registradas</p>
                    </Card>
                );
          case "approved":
            if (appliedFilters)
                return (
                    <Card className="p-12 text-center shadow-sm">
                        <p className="text-lg text-muted-foreground mb-2">No se encontraron solicitudes aprobadas</p>
                        <p className="text-sm text-muted-foreground">Ajuste los filtros o el término de búsqueda.</p>
                    </Card>
                );
            else
                return (
                    <Card className="p-12 text-center shadow-sm">
                        <p className="text-lg text-muted-foreground mb-2">No hay solicitudes aprobadas registradas</p>
                    </Card>
                );
            case "rejected":
                if (appliedFilters)
                    return (
                        <Card className="p-12 text-center shadow-sm">
                            <p className="text-lg text-muted-foreground mb-2">No se encontraron solicitudes rechazadas</p>
                            <p className="text-sm text-muted-foreground">Ajuste los filtros o el término de búsqueda.</p>
                        </Card>
                    );
                else
                    return (
                        <Card className="p-12 text-center shadow-sm">
                            <p className="text-lg text-muted-foreground mb-2">No hay solicitudes rechazadas registradas</p>
                        </Card>
                    );

          default:
            return <p>No se encontraron solicitudes</p>;
        }
      };
    
    
    return (
        <RendeNotFoundComponent />   
    )
}
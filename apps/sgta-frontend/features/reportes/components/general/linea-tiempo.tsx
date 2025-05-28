import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { addDays, isBefore, parseISO } from "date-fns";
// Fecha actual simulada para el ejemplo
const currentDate = new Date("2023-04-18");

export function LineaTiempoReporte() {
    const [timeFilter, setTimeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showStatusFilter, setShowStatusFilter] = useState(false);

    const timelineEvents = [
        { date: "15/01/2023", event: "Propuesta de proyecto aprobada", status: "Completado" },
        { date: "30/01/2023", event: "Asignación de asesor: Dr. Rodríguez", status: "Completado" },
        { date: "15/02/2023", event: "Plan de trabajo aprobado", status: "Completado" },
        { date: "01/03/2023", event: "Primera reunión con asesor", status: "Completado" },
        { date: "15/03/2023", event: "Entrega parcial de marco teórico", status: "Completado" },
        { date: "30/03/2023", event: "Revisión de marco teórico", status: "En progreso" },
        { date: "15/04/2023", event: "Entrega de metodología", status: "Pendiente", isLate: true },
        { date: "30/04/2023", event: "Revisión de metodología", status: "Pendiente" },
        { date: "15/05/2023", event: "Avance de implementación", status: "Pendiente" },
        { date: "30/05/2023", event: "Revisión de implementación", status: "Pendiente" },
        { date: "15/06/2023", event: "Entrega de resultados", status: "Pendiente" },
        { date: "30/06/2023", event: "Revisión de resultados", status: "Pendiente" },
        { date: "15/07/2023", event: "Documento final", status: "Pendiente" },
        { date: "30/07/2023", event: "Defensa de proyecto", status: "Pendiente" },
    ].map((event) => {
        // Convertir fecha de string a objeto Date
        const eventDate = parseISO(`${event.date.split("/").reverse().join("-")}T00:00:00`);

        // Calcular días restantes
        const daysRemaining = Math.ceil((eventDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

        // Determinar si está en riesgo (menos de 3 días para completar y no está completado ni en progreso)
        const isAtRisk =
            daysRemaining > 0 &&
            daysRemaining <= 3 &&
            event.status !== "Completado" &&
            event.status !== "En progreso" &&
            !event.isLate;

        return {
            ...event,
            daysRemaining,
            isAtRisk,
        };
    });
    
    const filteredByTime = timelineEvents.filter((event) => {
        const eventDate = parseISO(`${event.date.split("/").reverse().join("-")}T00:00:00`);

        switch (timeFilter) {
            case "past":
                return isBefore(eventDate, currentDate);
            case "upcoming30":
                return !isBefore(eventDate, currentDate) && isBefore(eventDate, addDays(currentDate, 30));
            case "upcoming90":
                return !isBefore(eventDate, currentDate) && isBefore(eventDate, addDays(currentDate, 90));
            case "all":
            default:
                return true;
        }
    });

    // Filtrar eventos por estado
    const filteredEvents = filteredByTime.filter((event) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "completed" && event.status === "Completado") return true;
        if (statusFilter === "inProgress" && event.status === "En progreso") return true;
        if (statusFilter === "pending" && event.status === "Pendiente" && !event.isLate && !event.isAtRisk) return true;
        if (statusFilter === "late" && event.isLate) return true;
        if (statusFilter === "atRisk" && event.isAtRisk) return true;
        return false;
    });
    const pendingDeliveries = [
        {
            name: "Metodología",
            dueDate: "15/04/2023",
            isLate: true,
            daysLate: 3,
        },
    ];




    // Verificar si hay entregas retrasadas
    const lateDeliveries = pendingDeliveries.filter((delivery) => delivery.isLate);
    const hasLateDeliveries = lateDeliveries.length > 0;

    // Función para manejar el clic en el botón de filtro por estado
    const handleStatusFilterClick = () => {
        setShowStatusFilter(!showStatusFilter);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Avances y Entregas</CardTitle>
                <div className="flex items-center gap-2">
                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrar por tiempo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los eventos</SelectItem>
                            <SelectItem value="past">Eventos pasados</SelectItem>
                            <SelectItem value="upcoming30">Próximos 30 días</SelectItem>
                            <SelectItem value="upcoming90">Próximos 90 días</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="relative">
                        <Button variant="outline" onClick={handleStatusFilterClick}>
                            Filtrar por estado
                        </Button>
                        {showStatusFilter && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border">
                                <div className="p-3 space-y-2">
                                    <h4 className="font-medium text-sm">Estado</h4>
                                    <div className="space-y-1">
                                        <Button
                                            variant={statusFilter === "all" ? "default" : "outline"}
                                            size="sm"
                                            className="w-full justify-start"
                                            onClick={() => {
                                                setStatusFilter("all");
                                                setShowStatusFilter(false);
                                            }}
                                        >
                                            Todos
                                        </Button>
                                        <Button
                                            variant={statusFilter === "completed" ? "default" : "outline"}
                                            size="sm"
                                            className="w-full justify-start"
                                            onClick={() => {
                                                setStatusFilter("completed");
                                                setShowStatusFilter(false);
                                            }}
                                        >
                                            Completado
                                        </Button>
                                        <Button
                                            variant={statusFilter === "inProgress" ? "default" : "outline"}
                                            size="sm"
                                            className="w-full justify-start"
                                            onClick={() => {
                                                setStatusFilter("inProgress");
                                                setShowStatusFilter(false);
                                            }}
                                        >
                                            En progreso
                                        </Button>
                                        <Button
                                            variant={statusFilter === "pending" ? "default" : "outline"}
                                            size="sm"
                                            className="w-full justify-start"
                                            onClick={() => {
                                                setStatusFilter("pending");
                                                setShowStatusFilter(false);
                                            }}
                                        >
                                            Pendiente
                                        </Button>
                                        <Button
                                            variant={statusFilter === "late" ? "default" : "outline"}
                                            size="sm"
                                            className="w-full justify-start"
                                            onClick={() => {
                                                setStatusFilter("late");
                                                setShowStatusFilter(false);
                                            }}
                                        >
                                            Retrasado
                                        </Button>
                                        <Button
                                            variant={statusFilter === "atRisk" ? "default" : "outline"}
                                            size="sm"
                                            className="w-full justify-start"
                                            onClick={() => {
                                                setStatusFilter("atRisk");
                                                setShowStatusFilter(false);
                                            }}
                                        >
                                            En riesgo
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative border-l border-gray-200 ml-3 pl-8 space-y-6">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event, index) => (
                            <div key={index} className="relative">
                                <div
                                    className={`absolute -left-10 mt-1.5 h-4 w-4 rounded-full border ${event.status === "Completado"
                                            ? "bg-green-500 border-green-500"
                                            : event.status === "En progreso"
                                                ? "bg-blue-500 border-blue-500"
                                                : event.isLate
                                                    ? "bg-red-500 border-red-500"
                                                    : event.isAtRisk
                                                        ? "bg-yellow-500 border-yellow-500"
                                                        : "bg-gray-300 border-gray-300"
                                        }`}
                                ></div>
                                <div>
                                    <time className="mb-1 text-xs font-normal text-gray-500">{event.date}</time>
                                    <h3 className="text-sm font-medium">
                                        {event.event}
                                        {event.isLate && (
                                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800">Retrasado</span>
                                        )}
                                        {event.isAtRisk && (
                                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                                                En riesgo ({event.daysRemaining} días)
                                            </span>
                                        )}
                                    </h3>
                                    <p
                                        className={`text-xs ${event.status === "Completado"
                                                ? "text-green-600"
                                                : event.status === "En progreso"
                                                    ? "text-blue-600"
                                                    : event.isLate
                                                        ? "text-red-600"
                                                        : event.isAtRisk
                                                            ? "text-yellow-600"
                                                            : "text-gray-600"
                                            }`}
                                    >
                                        {event.status}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No hay eventos que coincidan con los filtros seleccionados
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
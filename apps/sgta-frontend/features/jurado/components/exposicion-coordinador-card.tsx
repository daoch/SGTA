import { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ListExposicionXCoordinadorDTO } from "../dtos/ListExposicionXCoordiandorDTO";
import { useRouter } from "next/navigation";

export const ExposicionItem: FC<{ item: ListExposicionXCoordinadorDTO }> = ({
  item,
}) => {
  const router = useRouter();
  return (
    <Card
      className="border rounded-lg shadow hover:cursor-pointer hover:shadow-lg transition duration-200"
      onClick={() => {
        router.push(
          `/coordinador/exposiciones/planificacion/${item.exposicionId}`,
        );
      }}
    >
      <CardHeader>
        <CardTitle>{item.nombre}</CardTitle>
        <CardDescription>{item.descripcion}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-sm">Etapa: {item.etapaFormativaNombre}</div>
        <div className="text-sm">Ciclo: {item.cicloNombre}</div>
        <div className="text-xs text-muted-foreground">
          Estado: {item.estadoPlanificacionNombre}
        </div>
      </CardContent>
    </Card>
  );
};

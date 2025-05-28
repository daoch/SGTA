import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { FC } from "react";
import { Asesor } from "../../types/perfil/entidades"; // Ajusta esta importación según tu estructura

interface CardAsesorBusquedaProps {
  advisor: Asesor;
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const CardAsesorBusqueda: FC<CardAsesorBusquedaProps> = ({
  advisor,
}) => {
  return (
    <Link
      href={`/alumno/directorio-de-asesores/perfil/${advisor.id}`}
      key={advisor.id}
    >
      <Card className="w-full hover:bg-muted/50 transition-colors cursor-pointer">
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Avatar */}
            <Avatar className="h-20 w-20 flex-shrink-0">
              <AvatarImage
                src={advisor.fotoPerfil ?? undefined}
                alt={advisor.nombre}
              />
              <AvatarFallback className="text-lg">
                {advisor.nombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            {/* Información principal */}
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{advisor.nombre}</h3>
                  <p className="text-muted-foreground">
                    {advisor.especialidad}
                  </p>
                </div>
                {advisor.estado ? (
                  <Badge className="bg-green-50 text-green-700 border-green-200">
                    Disponible
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200"
                  >
                    No disponible
                  </Badge>
                )}
              </div>

              {/* Biografía */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {advisor.biografia ? truncateText(advisor.biografia, 300) : ""}
              </p>

              {/* Áreas temáticas y temas de interés */}
              <div className="flex flex-wrap gap-1 pt-1">
                {advisor.areasTematicas.map((area) => (
                  <Badge
                    key={`thematic-${area.idArea}`}
                    variant="secondary"
                    className="text-xs"
                  >
                    {area.nombre}
                  </Badge>
                ))}
                {advisor.temasIntereses.map((tema) => (
                  <Badge
                    key={`interest-${tema.idTema}`}
                    variant="outline"
                    className="text-xs"
                  >
                    {tema.nombre}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

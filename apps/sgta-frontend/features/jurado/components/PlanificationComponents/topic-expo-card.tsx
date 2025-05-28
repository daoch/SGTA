"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tema } from "@/features/jurado/types/jurado.types";
import React from "react";

interface Props {
  exposicion: Tema;
}

const TemaExposicionCard: React.FC<Props> = ({ exposicion }) => {
  return (
    <Card>
      <CardHeader className="select-none">
        <CardTitle>
          {exposicion.codigo} - {exposicion.titulo}
        </CardTitle>
        <CardDescription>
          <strong>Miembros de jurado :</strong>
          {exposicion?.usuarios
            ?.filter((u) => u.rol?.nombre === "Asesor")
            .map((a) => (
              <li key={a.idUsario}>
                {a.nombres} {a.apellidos}
              </li>
            ))}
          {exposicion?.usuarios
            ?.filter((u) => u.rol?.nombre === "Jurado")
            .map((j) => (
              <li key={j.idUsario}>
                {j.nombres} {j.apellidos}
              </li>
            ))}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default React.memo(TemaExposicionCard);

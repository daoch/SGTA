"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Tema, Jurado } from "@/features/jurado/types/jurado.types";

interface Props {
  exposicion: Tema;
}

const CardTemaExposicion: React.FC<Props> = ({ exposicion }) => {
  return (
    <Card
      className="border-2 border-gray-300 "
      style={{ backgroundColor: "#F9FAFB" }}
    >
      <CardHeader className="">
        <CardTitle>
          {exposicion.codigo} - {exposicion.titulo}
        </CardTitle>
        <CardDescription className="text-black">
          <span>
            {" "}
            <span className="font-semibold">Asesor: </span> {exposicion?.asesor}
          </span>
          <br />
          <span className="font-semibold"> Jurados: </span>
          {exposicion?.jurados?.map((jurado: Jurado) => (
            <span key={jurado.code} className="mr-2">
              {jurado.name}
            </span>
          ))}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default CardTemaExposicion;

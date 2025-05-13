import { FC } from "react";
import { ExposicionItem } from "./exposicion-coordinador-card";
import { ListExposicionXCoordinadorDTO } from "../dtos/ListExposicionXCoordiandorDTO";

export const ExposicionList: FC<{ items: ListExposicionXCoordinadorDTO[] }> = ({
  items,
}) => (
  <div className="flex flex-col w-full">
    {items.map((item) => (
      <ExposicionItem key={item.exposicionId} item={item} />
    ))}
  </div>
);

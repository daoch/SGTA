"use client";
import React from "react";

interface DetalleExposicionProps {
  id: string;
}

export default function DetalleExposicion({ id }: DetalleExposicionProps) {
  return <div>Mostrando detalle para exposición ID: {id}</div>;
}

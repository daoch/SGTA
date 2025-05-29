export interface Solicitud {
  id: string;
  nombre: string;
  descripcion: string;
  icono: React.ElementType;
  acciones: {
    label: string;
    ruta: string;
    variante: "default" | "outline";
    icono: React.ElementType;
  }[];
}

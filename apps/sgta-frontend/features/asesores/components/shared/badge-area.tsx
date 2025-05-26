import { Badge } from "@/components/ui/badge";

interface BadgeAreaProps {
  id?: string | number; // opcional, útil si necesitas pasarlo como data attribute o callback
  text: string;
  color?: "green" | "blue" | "red" | "yellow";
  className?: string;
}

const colorClasses: Record<string, string> = {
  green: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
  blue: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
  red: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
  yellow: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
};

export default function BadgeArea({
  id,
  text,
  color = "green",
  className = "",
}: BadgeAreaProps) {
  return (
    <Badge
      variant="outline"
      className={`${colorClasses[color]} text-xs sm:text-sm ${className}`}
      data-id={id} // si lo necesitas para pruebas, tracking o lógica
    >
      {text}
    </Badge>
  );
}

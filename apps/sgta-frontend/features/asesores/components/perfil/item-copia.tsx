import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

interface Props {
  valor: string;
  nombre: string;
}

export function ItemCopiable({ valor, nombre }: Props) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch (err) {
      console.error(`Error al copiar el ${nombre}:`, err);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap min-w-0">
      <a
        href={
          nombre.toLowerCase().includes("correo")
            ? `mailto:${valor}`
            : undefined
        }
        className="text-blue-600 hover:underline break-all truncate text-sm flex-1 min-w-0"
        title={valor}
      >
        {valor}
      </a>
      <Button size="icon" variant="ghost" onClick={copiar} className="shrink-0">
        <Copy className="h-4 w-4" />
      </Button>
      {copiado && (
        <span className="text-sm text-green-500 shrink-0">¡Copiado!</span>
      )}
    </div>
  );
}

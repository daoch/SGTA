import { Button } from "@/components/ui/button";
import MisTemasTabs from "@/features/temas/components/alumno/mis-temas-tabs";
import Link from "next/link";

const Page = () => {
  return (
    <div className="space-y-8 mt-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#042354]">Mis Temas</h1>
          <p className="text-muted-foreground">
            Gestión de tus temas de proyecto de fin de carrera, postulaciones y propuestas
          </p>
        </div>
        <Link href="/alumno/temas/nueva-propuesta">
          <Button className="bg-[#042354] hover:bg-[#0e2f7a] text-white">+ Nueva Propuesta</Button>
        </Link>
      </div>

      <MisTemasTabs />
    </div>
  );
};

export default Page;

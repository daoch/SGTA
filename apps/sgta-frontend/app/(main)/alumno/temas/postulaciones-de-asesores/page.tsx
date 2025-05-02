import PostulacionesRecibidas from "@/components/alumno/postulaciones-recibidas";

const page = () => {
  return (
    <div className="space-y-8 mt-4">
      <div>
        <h1 className="text-3xl font-bold text-[#042354]">Postulaciones Recibidas</h1>
        <p className="text-muted-foreground">
          Postulaciones de asesores interesados en tus propuestas de proyecto de fin de carrera
        </p>
      </div>
      <PostulacionesRecibidas />
    </div>
  );
};

export default page;

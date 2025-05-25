import ConfiguracionSistema from "@/features/configuracion/views/ConfiguracionSistema";

export default function ConfiguracionGeneralPage() {
  return (
    <ConfiguracionSistema />
    // <div className="py-6 px-2">
    //   <div className="flex items-center justify-between mb-6">
    //     <h1 className="text-2xl font-bold">Configuración General</h1>
    //   </div>

    //   <Tabs defaultValue="cursos" className="w-full">
    //     <TabsList className="grid w-full grid-cols-3 mb-6">
    //       <TabsTrigger value="cursos">Cursos (Fases)</TabsTrigger>
    //       <TabsTrigger value="entregables">Entregables</TabsTrigger>
    //       <TabsTrigger value="exposiciones">Exposiciones</TabsTrigger>
    //     </TabsList>

    //     <TabsContent value="cursos" className="space-y-4">
    //       <div className="flex justify-end mb-4">
    //         <Button className="flex items-center gap-2">
    //           <Plus size={16} />
    //           <span>Nuevo Curso</span>
    //         </Button>
    //       </div>
    //       <CursosList />
    //     </TabsContent>

    //     <TabsContent value="entregables" className="space-y-4">
    //       <div className="flex justify-end mb-4">
    //         <Button className="flex items-center gap-2">
    //           <Plus size={16} />
    //           <span>Nuevo Entregable</span>
    //         </Button>
    //       </div>
    //       <EntregablesList />
    //     </TabsContent>

    //     <TabsContent value="exposiciones" className="space-y-4">
    //       <div className="flex justify-end mb-4">
    //         <Button className="flex items-center gap-2">
    //           <Plus size={16} />
    //           <span>Nueva Exposición</span>
    //         </Button>
    //       </div>
    //       <ExposicionesList />
    //     </TabsContent>
    //   </Tabs>
    // </div>
  );
}

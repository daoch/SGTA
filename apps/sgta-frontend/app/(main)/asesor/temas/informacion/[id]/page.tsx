import InformacionTemaAsesor from "@/features/temas/views/informacion-tema-asesor-page";

const Page = ({ params }: { params: { id: string } }) => {
  console.log(`${params.id}`);
  return <InformacionTemaAsesor params={params.id}></InformacionTemaAsesor>;
};

export default Page;

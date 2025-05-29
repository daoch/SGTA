import InformacionTemaAsesor from "@/features/temas/views/informacion-tema-asesor-page";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  console.log(resolvedParams.id);
  return <InformacionTemaAsesor params={resolvedParams.id} />;
};

export default Page;

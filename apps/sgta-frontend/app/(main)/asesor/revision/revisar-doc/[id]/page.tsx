import RevisarDocumentoPage from "@/features/revision/views/RevisionDocumentoPage";

export default function Page({ params }: { params: { id: string } }) {
    return <RevisarDocumentoPage params={params} />;
}
"use client";
import RevisarDocumentoPage from "@/features/revision/views/RevisionDocumentoPage";
import { useParams } from "next/navigation";


export default function Page() {
    const { id } = useParams();

    if (typeof id !== "string") {
        throw new Error("Invalid parameter: id must be a string");
    }

    return <RevisarDocumentoPage params={{ id }} />;
}
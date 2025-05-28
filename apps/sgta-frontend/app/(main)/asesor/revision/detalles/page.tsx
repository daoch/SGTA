"use client";
import RevisionDetailPage from "@/features/revision/views/detalles-revision-page";
import { useParams } from "next/navigation";

export default function Page() {
	const { id } = useParams();

	if (typeof id !== "string") {
		return <div>Error: id inválido</div>;
	}

	return <RevisionDetailPage params={{ id }} />;
}

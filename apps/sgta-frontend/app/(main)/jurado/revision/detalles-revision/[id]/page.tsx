"use client";
import RevisionDetailPage from "@/features/revision/views/detalles-revision-page";
import { useParams } from "next/navigation";

export default function Page() {
	const { id } = useParams();

	if (typeof id !== "string") {
		throw new Error("Invalid parameter: id must be a string");
	}

	return <RevisionDetailPage params={{ id , rol_id: 2}} />;
}

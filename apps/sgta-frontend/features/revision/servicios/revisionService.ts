import axiosInstance from "@/lib/axios/axios-instance";
import { RevisionDocumentoAsesorDto } from "../dtos/RevisionDocumentoAsesorDto";

export async function getRevisionById(id: string): Promise<RevisionDocumentoAsesorDto> {
	const res = await axiosInstance.get("/revision/detalle", {
		params: { revisionId: id }
	});
	return res.data;
}

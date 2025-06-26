import { saveAs } from "file-saver";
import axiosInstance from "@/lib/axios/axios-instance";

export const useDownloadAnnotated = (revisionId: number) => {
  return async () => {
    try {
      const response = await axiosInstance.get(
        `/revision/${revisionId}/annotated-pdf`,
        {
          responseType: "blob"
        }
      );
      
      saveAs(response.data, `revision_${revisionId}_comentado.pdf`);
    } catch (err) {
      console.error("Descarga falló:", err);
    }
  };
};

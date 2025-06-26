import { saveAs } from "file-saver";

export const useDownloadAnnotated = (revisionId: number) => {
  return async () => {
    try {
      console.log("revisionId", revisionId);
      console.log(`${process.env.NEXT_PUBLIC_API_URL}revision/${revisionId}/annotated-pdf`);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}revision/${revisionId}/annotated-pdf`,
        { headers: { /* Authorization: `Bearer ${token}` if you need it */ } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      saveAs(blob, `revision_${revisionId}_comentado.pdf`);
    } catch (err) {
      console.error("Descarga falló:", err);
      // optional toast
    }
  };
};

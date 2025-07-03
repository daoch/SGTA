package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.model.Observacion;

import java.util.List;

/**
 * Service interface for creating annotated PDFs with text highlights for observations.
 */
public interface PdfAnnotationService {

    /**
     * Embeds comments as text highlight annotations in a PDF document.
     * 
     * @param original PDF document as byte array
     * @param observations List of observations to embed as annotations
     * @return Annotated PDF as byte array
     * @throws Exception if PDF processing fails
     */
    byte[] embedComments(byte[] original, List<Observacion> observations) throws Exception;
} 
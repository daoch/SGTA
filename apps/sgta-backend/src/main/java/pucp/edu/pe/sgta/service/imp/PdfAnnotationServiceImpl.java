package pucp.edu.pe.sgta.service.imp;

import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.apache.pdfbox.pdmodel.graphics.color.PDColor;
import org.apache.pdfbox.pdmodel.graphics.color.PDDeviceRGB;
import org.apache.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState;
import org.apache.pdfbox.pdmodel.interactive.annotation.*;
import org.apache.pdfbox.pdmodel.interactive.annotation.PDAnnotationPopup;
import pucp.edu.pe.sgta.service.inter.HistorialAccionService;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.model.Observacion;
import pucp.edu.pe.sgta.service.inter.PdfAnnotationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.util.List;

/**
 * Implementation of PdfAnnotationService for creating annotated PDFs with text highlights for observations.
 */
@Service
public class PdfAnnotationServiceImpl implements PdfAnnotationService {

    private static final Logger logger = LoggerFactory.getLogger(PdfAnnotationServiceImpl.class);

    /**
     * Embeds comments as text highlight annotations in a PDF document.
     * 
     * @param original PDF document as byte array
     * @param observations List of observations to embed as annotations
     * @return Annotated PDF as byte array
     * @throws Exception if PDF processing fails
     */
    @Override
    public byte[] embedComments(byte[] original, List<Observacion> observations) throws Exception {
        try (PDDocument doc = PDDocument.load(original)) {
            // Set document title instead of "Documento sin título"
            if (doc.getDocumentInformation() == null) {
                doc.setDocumentInformation(new PDDocumentInformation());
            }
            doc.getDocumentInformation().setTitle("Documento con Comentarios de Revisión");
            doc.getDocumentInformation().setSubject("Documento revisado con observaciones del asesor");
            doc.getDocumentInformation().setCreator("Sistema de Gestión de Tesis y Asesorías (SGTA)");
            for (Observacion obs : observations) {
                if (obs.getBoundingRect() == null || obs.getNumeroPaginaInicio() == null) {
                    continue; // Skip observations without valid position data
                }

                // Get page index (0-based)
                int pageIdx = Math.max(0, obs.getNumeroPaginaInicio() - 1);
                if (pageIdx >= doc.getNumberOfPages()) {
                    continue; // Skip if page number is out of range
                }

                PDPage page = doc.getPage(pageIdx);
                PDRectangle media = page.getMediaBox();
                float pageHeight = media.getHeight();
                
                // Get bounding rectangle from observation (frontend coordinates: top-left origin)
                var boundingRect = obs.getBoundingRect();
                
                float x1 = boundingRect.getX1().floatValue();
                float y1 = boundingRect.getY1().floatValue();
                float x2 = boundingRect.getX2() != null ? boundingRect.getX2().floatValue() : x1 + 100; // fallback
                float y2 = boundingRect.getY2() != null ? boundingRect.getY2().floatValue() : y1 + 20;  // fallback
                
                // Calculate actual selection dimensions using x2,y2 coordinates
                float actualWidth = Math.abs(x2 - x1);
                float actualHeight = Math.abs(y2 - y1);
                
                // Apply reasonable scaling - these should be much smaller numbers for text
                float scaleX = media.getWidth() / 926.0f;  // Still use this for consistency
                float scaleY = media.getHeight() / 1308.0f;
                
                // Apply scaling to actual selection coordinates
                float pdfLeft = x1 * scaleX;
                float pdfWidth = actualWidth * scaleX;
                float pdfHeight = actualHeight * scaleY;
                
                // Fix Y-axis: PDF coordinates have origin at bottom-left, frontend coordinates have origin at top-left
                float pdfTop = pageHeight - (y1 * scaleY);  // Flip Y-axis
                float pdfBottom = pdfTop - pdfHeight;       // Bottom is below top in PDF coordinates

                // Create text markup annotation for highlighting with improved styling
                PDAnnotationTextMarkup highlight = 
                    new PDAnnotationTextMarkup(PDAnnotationTextMarkup.SUB_TYPE_HIGHLIGHT);
                
                // Set the rectangle for the annotation (using PDF coordinates)
                highlight.setRectangle(new PDRectangle(pdfLeft, pdfBottom, pdfWidth, pdfHeight));
                
                // Handle multiline text by using the rect collection if available
                java.util.List<Float[]> quadsList = new java.util.ArrayList<>();
                
                if (obs.getRects() != null && !obs.getRects().isEmpty()) {
                    // Multi-line text: use individual rects for each line
                    for (var rect : obs.getRects()) {
                        // Use x2,y2 for rects as well
                        float rectX1 = rect.getX1().floatValue();
                        float rectY1 = rect.getY1().floatValue();
                        float rectX2 = rect.getX2() != null ? rect.getX2().floatValue() : rectX1 + 50; // smaller fallback
                        float rectY2 = rect.getY2() != null ? rect.getY2().floatValue() : rectY1 + 15; // smaller fallback
                        
                        float rectActualWidth = Math.abs(rectX2 - rectX1);
                        float rectActualHeight = Math.abs(rectY2 - rectY1);
                        
                        // Apply same scaling to individual rects
                        float rectPdfLeft = rectX1 * scaleX;
                        float rectPdfWidth = rectActualWidth * scaleX;
                        float rectPdfHeight = rectActualHeight * scaleY;
                        float rectPdfRight = rectPdfLeft + rectPdfWidth;
                        
                        // Fix Y-axis for rects too
                        float rectPdfTop = pageHeight - (rectY1 * scaleY);  // Flip Y-axis
                        float rectPdfBottom = rectPdfTop - rectPdfHeight;   // Bottom is below top
                        
                        // Add quad points for this rect (PDF spec: x1,y1,x2,y2,x3,y3,x4,y4)
                        // Order: bottom-left, bottom-right, top-left, top-right
                        quadsList.add(new Float[]{
                            rectPdfLeft, rectPdfBottom,     // bottom-left
                            rectPdfRight, rectPdfBottom,    // bottom-right
                            rectPdfLeft, rectPdfTop,        // top-left
                            rectPdfRight, rectPdfTop        // top-right
                        });
                    }
                } else {
                    // Single line text: use bounding rectangle
                    float pdfRight = pdfLeft + pdfWidth;
                    
                    quadsList.add(new Float[]{
                        pdfLeft, pdfBottom,     // bottom-left
                        pdfRight, pdfBottom,    // bottom-right
                        pdfLeft, pdfTop,        // top-left
                        pdfRight, pdfTop        // top-right
                    });
                }
                
                // Convert to float array for PDFBox
                float[] quads = new float[quadsList.size() * 8];
                int index = 0;
                for (Float[] quad : quadsList) {
                    quads[index++] = quad[0]; // x1
                    quads[index++] = quad[1]; // y1
                    quads[index++] = quad[2]; // x2
                    quads[index++] = quad[3]; // y2
                    quads[index++] = quad[4]; // x3
                    quads[index++] = quad[5]; // y3
                    quads[index++] = quad[6]; // x4
                    quads[index++] = quad[7]; // y4
                }
                
                highlight.setQuadPoints(quads);
                
                // Create enhanced comment text with better formatting
                String commentText = formatAnnotationText(obs);
                highlight.setContents(commentText);
                
                // Set color based on observation type for better UI
                PDColor color = getLighterColorForObservationType(obs);
                highlight.setColor(color);
                
                // Set the same background color for the comment popup
                highlight.setInteriorColor(color);
                
                // Set annotation appearance and font
                try {
                    // Set font to Helvetica (closest to Geist - modern, clean sans-serif)
                    highlight.setTitlePopup("Observación"); // Title for the popup
                    
                    // Calculate better annotation size based on content length
                    int contentLength = commentText.length();
                    float dynamicWidth = Math.min(300f, Math.max(200f, contentLength * 2.5f)); // Adaptive width
                    float dynamicHeight = Math.min(150f, Math.max(60f, (contentLength / 40f) * 20f)); // Adaptive height
                    
                    // Position the comment popup near the highlight but offset to avoid overlap
                    float popupX = pdfLeft + pdfWidth + 10f; // 10pt offset to the right
                    float popupY = pdfTop - 10f; // 10pt offset above
                    
                    // Ensure popup stays within page bounds
                    if (popupX + dynamicWidth > media.getWidth()) {
                        popupX = pdfLeft - dynamicWidth - 10f; // Move to left side if doesn't fit
                    }
                    if (popupY - dynamicHeight < 0) {
                        popupY = pdfBottom + dynamicHeight + 10f; // Move below if doesn't fit
                    }
                    
                    // Set the popup rectangle with calculated dimensions
                    highlight.setPopup(new PDAnnotationPopup());
                    highlight.getPopup().setRectangle(new PDRectangle(popupX, popupY - dynamicHeight, dynamicWidth, dynamicHeight));
                    highlight.getPopup().setContents(commentText);
                    highlight.getPopup().setColor(color);
                    
                    // Set default appearance to use Helvetica font (closest to Geist)
                    highlight.setDefaultAppearance("/Helv 10 Tf 0 0 0 rg");
                    
                } catch (Exception e) {
                    logger.debug("Could not set annotation appearance: {}", e.getMessage());
                }
                
                // Set annotation opacity for better visibility
                try {
                    PDExtendedGraphicsState extGState = new PDExtendedGraphicsState();
                    extGState.setNonStrokingAlphaConstant(0.8f); // 80% opacity for better visibility
                    // Note: Opacity may not be fully supported in all PDF viewers
                } catch (Exception e) {
                    logger.debug("Could not set annotation opacity: {}", e.getMessage());
                }
                
                // Add annotation to the page
                page.getAnnotations().add(highlight);
            }

            // Save the annotated PDF to byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            doc.save(outputStream);
            return outputStream.toByteArray();
        }
    }

    /**
     * Formats annotation text with enhanced styling and structure.
     * 
     * @param observation The observation to format text for
     * @return Formatted annotation text
     */
    private String formatAnnotationText(Observacion observation) {
        StringBuilder formattedText = new StringBuilder();
        
        // Add quoted content if available
        if (observation.getContenido() != null && !observation.getContenido().trim().isEmpty()) {
            formattedText.append("\"").append(observation.getContenido().trim()).append("\"\n\n");
        }
        
        // Add observation type as header
        if (observation.getTipoObservacion() != null && observation.getTipoObservacion().getNombreTipo() != null) {
            String tipoName = observation.getTipoObservacion().getNombreTipo();
            formattedText.append(tipoName).append("\n");
        }
        
        // Add the main comment
        if (observation.getComentario() != null && !observation.getComentario().trim().isEmpty()) {
            formattedText.append(observation.getComentario().trim());
        }
        
        return formattedText.toString();
    }
    
    /**
     * Gets more visible colors for highlighting based on observation type.
     * 
     * @param observation The observation to get color for
     * @return PDColor for the highlight with better visibility
     */
    private PDColor getLighterColorForObservationType(Observacion observation) {
        // Default to yellow if no type is specified
        if (observation.getTipoObservacion() == null) {
            return new PDColor(new float[]{1f, 0.95f, 0.6f}, PDDeviceRGB.INSTANCE); // Medium yellow
        }

        String tipeName = observation.getTipoObservacion().getNombreTipo();
        if (tipeName == null) {
            return new PDColor(new float[]{1f, 0.95f, 0.6f}, PDDeviceRGB.INSTANCE); // Medium yellow
        }

        // Map observation types to more visible colors
        switch (tipeName.toLowerCase()) {
            case "contenido":
                return new PDColor(new float[]{1f, 0.95f, 0.6f}, PDDeviceRGB.INSTANCE); // Medium yellow
            case "similitud":
                return new PDColor(new float[]{1f, 0.85f, 0.85f}, PDDeviceRGB.INSTANCE); // Light red
            case "citado":
                return new PDColor(new float[]{0.8f, 0.9f, 1f}, PDDeviceRGB.INSTANCE); // Light blue
            case "inteligencia artificial":
                return new PDColor(new float[]{0.85f, 1f, 0.85f}, PDDeviceRGB.INSTANCE); // Light green
            default:
                return new PDColor(new float[]{1f, 0.95f, 0.6f}, PDDeviceRGB.INSTANCE); // Medium yellow
        }
    }
} 
package pucp.edu.pe.sgta.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.color.PDColor;
import org.apache.pdfbox.pdmodel.graphics.color.PDDeviceRGB;
import org.apache.pdfbox.pdmodel.interactive.annotation.*;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.model.Observacion;
import pucp.edu.pe.sgta.service.inter.PdfAnnotationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.awt.Color;
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
                
                // Debug: Log original coordinates and page dimensions
                logger.debug("Original coords: x={}, y={}, w={}, h={}, pageHeight={}, pageWidth={}", 
                    boundingRect.getX1(), boundingRect.getY1(), boundingRect.getWidth(), 
                    boundingRect.getHeight(), pageHeight, media.getWidth());
                
                // PROBLEM ANALYSIS: The coordinates width=926, height=1308 are clearly wrong for text selection
                // These seem to be viewport container dimensions, not text selection coordinates
                // Let's use x2, y2 coordinates instead to get the actual selection area
                
                float x1 = boundingRect.getX1().floatValue();
                float y1 = boundingRect.getY1().floatValue();
                float x2 = boundingRect.getX2() != null ? boundingRect.getX2().floatValue() : x1 + 100; // fallback
                float y2 = boundingRect.getY2() != null ? boundingRect.getY2().floatValue() : y1 + 20;  // fallback
                
                // Calculate actual selection dimensions using x2,y2 coordinates
                float actualWidth = Math.abs(x2 - x1);
                float actualHeight = Math.abs(y2 - y1);
                
                logger.debug("Using x2,y2 coords: x1={}, y1={}, x2={}, y2={}", x1, y1, x2, y2);
                logger.debug("Calculated dimensions: actualWidth={}, actualHeight={}", actualWidth, actualHeight);
                
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
                
                // Debug: Log final coordinates
                logger.debug("Scale factors: scaleX={}, scaleY={}", scaleX, scaleY);
                logger.debug("PDF coords (actual): left={}, top={}, bottom={}, width={}, height={}", 
                    pdfLeft, pdfTop, pdfBottom, pdfWidth, pdfHeight);

                // Create text markup annotation for highlighting
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
                
                // Set the comment text as the annotation content
                String commentText = obs.getComentario();
                if (obs.getContenido() != null && !obs.getContenido().trim().isEmpty()) {
                    commentText = "\"" + obs.getContenido() + "\"\n\n" + commentText;
                }
                highlight.setContents(commentText);
                
                // Set color based on observation type
                PDColor color = getColorForObservationType(obs);
                highlight.setColor(color);
                
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
     * Gets the appropriate color for highlighting based on observation type.
     * 
     * @param observation The observation to get color for
     * @return PDColor for the highlight
     */
    private PDColor getColorForObservationType(Observacion observation) {
        // Default to yellow if no type is specified
        if (observation.getTipoObservacion() == null) {
            return new PDColor(new float[]{1f, 1f, 0f}, PDDeviceRGB.INSTANCE); // Yellow
        }

        String tipeName = observation.getTipoObservacion().getNombreTipo();
        if (tipeName == null) {
            return new PDColor(new float[]{1f, 1f, 0f}, PDDeviceRGB.INSTANCE); // Yellow
        }

        // Map observation types to colors
        switch (tipeName.toLowerCase()) {
            case "contenido":
                return new PDColor(new float[]{1f, 1f, 0f}, PDDeviceRGB.INSTANCE); // Yellow
            case "similitud":
                return new PDColor(new float[]{1f, 0.5f, 0.5f}, PDDeviceRGB.INSTANCE); // Light red
            case "citado":
                return new PDColor(new float[]{0.5f, 0.8f, 1f}, PDDeviceRGB.INSTANCE); // Light blue
            case "inteligencia artificial":
                return new PDColor(new float[]{0.5f, 1f, 0.5f}, PDDeviceRGB.INSTANCE); // Light green
            default:
                return new PDColor(new float[]{1f, 1f, 0f}, PDDeviceRGB.INSTANCE); // Yellow
        }
    }
} 
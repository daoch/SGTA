package pucp.edu.pe.sgta.controller;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import freemarker.template.Configuration;
import freemarker.template.Template;
import pucp.edu.pe.sgta.model.HistorialAccion;
import pucp.edu.pe.sgta.model.RevisionDocumento;
import pucp.edu.pe.sgta.repository.RevisionDocumentoRepository;
import pucp.edu.pe.sgta.service.inter.HistorialAccionService;
import pucp.edu.pe.sgta.service.inter.S3DownloadService;

import java.io.ByteArrayOutputStream;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/s3/archivos")
public class S3FileController {

    private final S3DownloadService downloadService;
    @Autowired
    private RevisionDocumentoRepository revisionDocumentoRepository;
    @Autowired
    private HistorialAccionService historialAccionService;

    @Autowired
    public S3FileController(S3DownloadService downloadService) {
        this.downloadService = downloadService;
    }

    @GetMapping("/descargar/{key:.+}")
    public ResponseEntity<?> download(@PathVariable String key) {
        try {
            byte[] data = downloadService.download(key);
            ByteArrayResource resource = new ByteArrayResource(data);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + key + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(data.length)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Archivo no encontrado o error al descargar: " + e.getMessage());
        }
    }
    
    @GetMapping("/descargar-por-revision/{revisionId}")
    public ResponseEntity<?> downloadByRevisionId(@PathVariable Integer revisionId) {
        RevisionDocumento revision = revisionDocumentoRepository.findById(revisionId)
            .orElse(null);

        if (revision == null || revision.getLinkArchivoRevision() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("No se encontró la revisión o no tiene archivo asociado.");
        }

        String key = revision.getLinkArchivoRevision();
        try {
            byte[] data = downloadService.download(key);
            ByteArrayResource resource = new ByteArrayResource(data);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + key + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(data.length)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Archivo no encontrado o error al descargar: " + e.getMessage());
        }
    }
    // Aquí podrías añadir más endpoints relacionados con S3 (p.ej. listar, borrar,
    // etc.)

    @GetMapping("/getUrlFromCloudFront/{key:.+}")
    public ResponseEntity<String> getUrlFromCloudFront(@PathVariable String key) {
        try {
            byte[] decodedKeyBytes = Base64.getDecoder().decode(key);
            String decodedKey = new String(decodedKeyBytes);
            String url = downloadService.getUrlFromCloudFront(decodedKey);
            return ResponseEntity.ok(url);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se pudo generar la url para el archivo: " + e.getMessage());
        }
    }
    @GetMapping("/existe-plagio-json/{revisionId}")
    public ResponseEntity<Boolean> existePlagioJson(@PathVariable Integer revisionId) {
        RevisionDocumento revision = revisionDocumentoRepository.findById(revisionId)
            .orElse(null);

        if (revision == null || revision.getLinkArchivoRevision() == null) {
            return ResponseEntity.ok(false);
        }

        String key = revision.getLinkArchivoRevision();
        String jsonKey = key.replaceAll("\\.[^.]+$", ".json");

        boolean exists = downloadService.existsInS3(jsonKey);
        return ResponseEntity.ok(exists);
    }
    @GetMapping("/get-plagio-json/{revisionId}")
    public ResponseEntity<String> getJsonPlagio(@PathVariable Integer revisionId) {
        RevisionDocumento revision = revisionDocumentoRepository.findById(revisionId)
            .orElse(null);

        if (revision == null || revision.getLinkArchivoRevision() == null) {
            return ResponseEntity.ok("no existe");
        }

        String key = revision.getLinkArchivoRevision();
        String jsonKey = key.replaceAll("\\.[^.]+$", ".json");

        byte[] data  = downloadService.download(jsonKey);
        if (data == null || data.length == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Archivo de plagio no encontrado o vacío.");
        }
        String json = new String(data, java.nio.charset.StandardCharsets.UTF_8);
        return ResponseEntity.ok(json);

    }
    @GetMapping("/get-IA-json/{revisionId}")
    public ResponseEntity<String> getIAPlagio(@PathVariable Integer revisionId) {
        RevisionDocumento revision = revisionDocumentoRepository.findById(revisionId)
            .orElse(null);

        if (revision == null || revision.getLinkArchivoRevision() == null) {
            return ResponseEntity.ok("no existe");
        }

        String key = revision.getLinkArchivoRevision();
        // Reemplaza la extensión del archivo original por .json
        // para obtener el archivo de IA
        // Aquí asumimos que el archivo de IA tiene el mismo nombre pero con _ia.json
        // al final del nombre del archivo original 
        // Ejemplo: si el archivo original es "documento.pdf", el archivo de IA sería
        // "documento_ia.json"
        
        String jsonKey = key.replaceAll("\\.[^.]+$", "_ia.json");

        byte[] data  = downloadService.download(jsonKey);
        if (data == null || data.length == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Archivo de plagio no encontrado o vacío.");
        }
        String json = new String(data, java.nio.charset.StandardCharsets.UTF_8);
        
        return ResponseEntity.ok(json);
    }
    @GetMapping("/get-reporte-similitud/{revisionId}")
    public ResponseEntity<byte[]> getReporteSimilitud(@PathVariable Integer revisionId) {
        RevisionDocumento revision = revisionDocumentoRepository.findById(revisionId)
            .orElse(null);

        if (revision == null || revision.getLinkArchivoRevision() == null) {
            return ResponseEntity.ok("no existe".getBytes(java.nio.charset.StandardCharsets.UTF_8));
        }

        String key = revision.getLinkArchivoRevision();
        String jsonKey = key.replaceAll("\\.[^.]+$", ".json");
        String iaKey = key.replaceAll("\\.[^.]+$", "_ia.json");

        byte[] data  = downloadService.download(jsonKey);
        byte[] iaData = downloadService.download(iaKey);
        if (data == null || data.length == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Archivo de plagio no encontrado o vacío.".getBytes(java.nio.charset.StandardCharsets.UTF_8));
        }
        String json = new String(data, java.nio.charset.StandardCharsets.UTF_8);
        String iaJson = new String(iaData, java.nio.charset.StandardCharsets.UTF_8);
        // 1. Convertir el JSON a un objeto Java (puedes personalizar el mapeo según tu estructura)
        ObjectMapper mapper = new ObjectMapper();

        try {
            JsonNode rootNode = mapper.readTree(json);
            JsonNode iaNode = mapper.readTree(iaJson);
            /* ------------------------------------------------------------------
            * 2. Preparar el modelo para la plantilla
            * (solo pasamos los nodos que la plantilla espera: result + sources)
            * ------------------------------------------------------------------ */
            Map<String, Object> model = new HashMap<>();
            model.put("result",  mapper.convertValue(rootNode.path("result"),  Map.class));
            model.put("sources", mapper.convertValue(rootNode.path("sources"), List.class));
            Map<String, Object> ia = new HashMap<>();
             ia.put("score", iaNode.path("score").asDouble());

        // Convertir sentences a List<Map<String,Object>>
            ia.put("sentences",
            mapper.convertValue(
                iaNode.path("sentences"),
                new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, Object>>>() {}));

            model.put("ia", ia);   // 🔹 NEW
            // 2. Generar HTML usando FreeMarker
            Configuration cfg = new Configuration(Configuration.VERSION_2_3_31);
            cfg.setClassForTemplateLoading(this.getClass(), "/templates");
            cfg.setDefaultEncoding("UTF-8");

            Template tpl = cfg.getTemplate("reporte.ftl");   // el template que generamos antes

            StringWriter htmlWriter = new StringWriter();
            tpl.process(model, htmlWriter);
            String html = htmlWriter.toString();

            ByteArrayOutputStream pdf = new ByteArrayOutputStream();
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withHtmlContent(html, null);        // baseURI = null si no hay imágenes locales
            builder.toStream(pdf);
            builder.run();
            historialAccionService.registrarAccion(revision.getUsuario().getIdCognito(),
                    "Se ha descargado un reporte de similitud/IA de la revisión con ID: " + revisionId);
            // 3. Devolver el PDF como respuesta
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=reporte_similitud_" + revisionId + ".pdf")
                    .body(pdf.toByteArray());
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(("Error al procesar el JSON: " + e.getMessage()).getBytes(java.nio.charset.StandardCharsets.UTF_8));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(("Error al generar el reporte: " + e.getMessage())
                        .getBytes(java.nio.charset.StandardCharsets.UTF_8));
        }
    }
}

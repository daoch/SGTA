package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import pucp.edu.pe.sgta.model.RevisionDocumento;
import pucp.edu.pe.sgta.repository.RevisionDocumentoRepository;
import pucp.edu.pe.sgta.service.inter.S3DownloadService;
import java.util.Base64;
import java.util.logging.Logger;

@RestController
@RequestMapping("/s3/archivos")
public class S3FileController {

    private final S3DownloadService downloadService;
    @Autowired
    private RevisionDocumentoRepository revisionDocumentoRepository;

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
}

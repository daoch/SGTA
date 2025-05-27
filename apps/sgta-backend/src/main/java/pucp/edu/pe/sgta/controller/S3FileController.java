package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.service.inter.S3DownloadService;

@RestController
@RequestMapping("/s3/archivos")
public class S3FileController {

    private final S3DownloadService downloadService;

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

    // Aquí podrías añadir más endpoints relacionados con S3 (p.ej. listar, borrar,
    // etc.)
}

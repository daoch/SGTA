package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pucp.edu.pe.sgta.model.RevisionDocumento;
import pucp.edu.pe.sgta.repository.RevisionDocumentoRepository;
import pucp.edu.pe.sgta.service.imp.PlagiarismServiceImpl;
import pucp.edu.pe.sgta.service.inter.S3DownloadService;

@RestController
@RequestMapping("/plagiarism")
public class PlagiarismController {

    private final PlagiarismServiceImpl plagiarismService;
    private final S3DownloadService downloadService;
    private final RevisionDocumentoRepository revisionDocumentoRepository;

    @Autowired
    public PlagiarismController(
        PlagiarismServiceImpl plagiarismService,
        S3DownloadService downloadService,
        RevisionDocumentoRepository revisionDocumentoRepository
    ) {
        this.plagiarismService = plagiarismService;
        this.downloadService = downloadService;
        this.revisionDocumentoRepository = revisionDocumentoRepository;
    }

    // Endpoint para analizar un archivo de S3 por su key
    // @GetMapping("/check/{key:.+}")
    // public ResponseEntity<String> checkPlagiarism(@PathVariable String key) {
    //     try {
    //         String result = plagiarismService.checkPlagiarismFromS3(key);
    //         return ResponseEntity.ok(result);
    //     } catch (Exception e) {
    //         return ResponseEntity.status(500).body("Error al analizar plagio: " + e.getMessage());
    //     }
    // }
     @GetMapping("/check/{revisionId}")
    public ResponseEntity<String> checkPlagiarism(@PathVariable Integer revisionId) {
        RevisionDocumento revision = revisionDocumentoRepository.findById(revisionId)
            .orElse(null);

        if (revision == null || revision.getLinkArchivoRevision() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("No se encontró la revisión o no tiene archivo asociado.");
        }

        String key = revision.getLinkArchivoRevision();
        try {
            String jsonKey = key.replaceAll("\\.[^.]+$", ".json"); // reemplaza la última extensión por .json
            String result = plagiarismService.checkPlagiarismFromS3(key);
            String result_IA = plagiarismService.checkIAFromS3(key);
            downloadService.guardarJsonEnS3(jsonKey, result);
            downloadService.guardarJsonEnS3(jsonKey.replace(".json", "_ia.json"), result_IA);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al analizar plagio: " + e.getMessage());
        }
    }
}
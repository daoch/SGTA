package pucp.edu.pe.sgta.controller;

import java.lang.Runtime.Version;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.math3.util.IntegerSequence;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.JsonNode;

import pucp.edu.pe.sgta.model.RevisionDocumento;
import pucp.edu.pe.sgta.model.RevisionXDocumento;
import pucp.edu.pe.sgta.model.VersionXDocumento;
import pucp.edu.pe.sgta.repository.RevisionDocumentoRepository;
import pucp.edu.pe.sgta.repository.VersionXDocumentoRepository;
import pucp.edu.pe.sgta.service.imp.PlagiarismServiceImpl;
import pucp.edu.pe.sgta.service.inter.S3DownloadService;

@RestController
@RequestMapping("/plagiarism")
public class PlagiarismController {

    private final PlagiarismServiceImpl plagiarismService;
    private final S3DownloadService downloadService;
    private final RevisionDocumentoRepository revisionDocumentoRepository;
    private final VersionXDocumentoRepository versionDocumentoRepository;
    @Autowired
    public PlagiarismController(
        PlagiarismServiceImpl plagiarismService,
        S3DownloadService downloadService,
        RevisionDocumentoRepository revisionDocumentoRepository,
        VersionXDocumentoRepository versionDocumentoRepository
    ) {
        this.plagiarismService = plagiarismService;
        this.downloadService = downloadService;
        this.revisionDocumentoRepository = revisionDocumentoRepository;
        this.versionDocumentoRepository = versionDocumentoRepository;
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
            // Aqui descargo el archivo de S3 y lo envio como bytes para analizar plagio 
            // y IA, luego guardo los resultados en S3
            byte[] pdfBytes = downloadService.download(key);
            //String result = plagiarismService.checkPlagiarismFromS3(pdfBytes);
            //String result_IA = plagiarismService.checkIAFromS3(pdfBytes);
            //downloadService.guardarJsonEnS3(jsonKey, result);
            //downloadService.guardarJsonEnS3(jsonKey.replace(".json", "_ia.json"), result_IA);
            return ResponseEntity.ok("Análisis de plagio iniciado para la revisión con ID: " + revisionId);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al analizar plagio: " + e.getMessage());
        }
    }
    @GetMapping("/check-async/similitud/{revisionId}")
    public ResponseEntity<String> checkPlagiarismAsync(@PathVariable Integer revisionId) {
        RevisionDocumento revision = revisionDocumentoRepository.findById(revisionId).orElse(null);
        if (revision == null || revision.getLinkArchivoRevision() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("No se encontró la revisión o no tiene archivo asociado.");
        }
        String key = revision.getLinkArchivoRevision();
        VersionXDocumento versionDocumento = revision.getVersionDocumento();
        if (versionDocumento == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("No se encontró la versión del documento asociada a la revisión.");
        }
        versionDocumento.setEstadoProcesamiento("EN_PROCESO");
        revisionDocumentoRepository.save(revision); // Actualiza el estado de procesamiento en la base de
        
        // Lanza el análisis en background
        runAnalysisAsync(versionDocumento.getId(), key);
        return ResponseEntity.ok(versionDocumento.getEstadoProcesamiento());
    }
    @Async
    public void runAnalysisAsync(Integer versionDocumentoId, String key) {
        
        VersionXDocumento versionDocumento = versionDocumentoRepository.findById(versionDocumentoId).orElse(null);
        if (versionDocumento == null) {
            return; // Manejar el caso donde la versión del documento no existe
        }
        try {
            String jsonKey = key.replaceAll("\\.[^.]+$", ".json");
            byte[] pdfBytes = downloadService.download(key);
            //FALTA HACER QUE ESTAS FUNCIONES RETORNEN UN JSON CON EL RESULTADO PARA PODER GUARDAR EL PORCENTAJESIMILITUD Y PORCENTAJEDIA
            // Aqui descargo el archivo de S3 y lo envio como bytes para analizar plagio
            JsonNode result = plagiarismService.checkPlagiarismFromS3(pdfBytes);
            JsonNode result_IA = plagiarismService.checkIAFromS3(pdfBytes);
            String jsonResult = result.toString();
            String jsonResult_IA = result_IA.toString();
            downloadService.guardarJsonEnS3(jsonKey, jsonResult);
            downloadService.guardarJsonEnS3(jsonKey.replace(".json", "_ia.json"), jsonResult_IA);
            
            versionDocumento.setEstadoProcesamiento("COMPLETADO");
            // El porcentaje de similitud está en result.result.score
            versionDocumento.setPorcentajeSimilitud(result.path("result").path("score").asDouble(0.0));
            versionDocumento.setPorcentajeIA(result_IA.path("score").asDouble(0.0));
            versionDocumentoRepository.save(versionDocumento);
        } catch (Exception e) {
            if (versionDocumento != null) {
                versionDocumento.setEstadoProcesamiento("ERROR" );
                versionDocumentoRepository.save(versionDocumento);
            }
            e.printStackTrace(); // Manejar el error de manera adecuada
        }
    }
    @GetMapping("/check-async/status/{revisionId}")
    public ResponseEntity<String> getStatus(@PathVariable Integer revisionId) {
        RevisionDocumento revision = revisionDocumentoRepository.findById(revisionId).orElse(null);
        if (revision == null || revision.getVersionDocumento() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("No se encontró la revisión o no tiene versión de documento asociada.");
        }
        VersionXDocumento versionDocumento = revision.getVersionDocumento();
        String status = versionDocumento.getEstadoProcesamiento();
        return ResponseEntity.ok(status);
    }
}
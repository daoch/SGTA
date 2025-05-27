package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.service.imp.PlagiarismServiceImpl;

@RestController
@RequestMapping("/plagiarism")
public class PlagiarismController {

    private final PlagiarismServiceImpl plagiarismService;

    @Autowired
    public PlagiarismController(PlagiarismServiceImpl plagiarismService) {
        this.plagiarismService = plagiarismService;
    }

    // Endpoint para analizar un archivo de S3 por su key
    @GetMapping("/check/{key:.+}")
    public ResponseEntity<String> checkPlagiarism(@PathVariable String key) {
        try {
            String result = plagiarismService.checkPlagiarismFromS3(key);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al analizar plagio: " + e.getMessage());
        }
    }
}
package pucp.edu.pe.sgta.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sgta.dto.DocumentoConVersionDto;
import pucp.edu.pe.sgta.model.Documento;
import pucp.edu.pe.sgta.model.EntregableXTema;
import pucp.edu.pe.sgta.model.VersionXDocumento;
import pucp.edu.pe.sgta.service.inter.DocumentoService;
import pucp.edu.pe.sgta.service.inter.RevisionDocumentoService;
import pucp.edu.pe.sgta.service.inter.S3DownloadService;
import pucp.edu.pe.sgta.service.inter.VersionXDocumentoService;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/documento")
public class DocumentoController {

    private final Logger logger = Logger.getLogger(DocumentoController.class.getName());
    private final DocumentoService documentoService;
    private final VersionXDocumentoService versionXDocumentoService;
    private final RevisionDocumentoService revisionDocumentoService;
    private final S3DownloadService s3DownloadService;
    private static final String S3_PATH_DELIMITER = "/";

    public DocumentoController(DocumentoService documentoService, S3DownloadService s3DowloadService,
            VersionXDocumentoService versionXDocumentoService, RevisionDocumentoService revisionDocumentoService) {
        this.documentoService = documentoService;
        this.s3DownloadService = s3DowloadService;
        this.versionXDocumentoService = versionXDocumentoService;
        this.revisionDocumentoService = revisionDocumentoService;
    }

    @GetMapping("/entregable/{entregableXTemaId}")
    public List<DocumentoConVersionDto> listarDocumentosPorEntregable(@PathVariable Integer entregableXTemaId) {
        return documentoService.listarDocumentosPorEntregable(entregableXTemaId);
    }

    @PostMapping("/entregable/{entregableXTemaId}")
    public ResponseEntity<String> subirDocumentos(@PathVariable Integer entregableXTemaId,
            @RequestParam("archivos") MultipartFile[] archivos,
            @RequestParam("ciclo") String ciclo,
            @RequestParam("curso") String curso,
            @RequestParam("codigoAlumno") String codigoAlumno,
            @RequestParam("temaId") Integer temaId) throws IOException {
        return documentoService.subirDocumentos(entregableXTemaId, archivos, ciclo, curso, codigoAlumno, temaId);
    }

    @PostMapping("/borrar-documento/{documentoId}")
    public void borrarDocumento(@PathVariable Integer documentoId) {
        documentoService.borrarDocumento(documentoId);
    }
}

package pucp.edu.pe.sgta.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sgta.dto.DocumentoConVersionDto;
import pucp.edu.pe.sgta.model.Documento;
import pucp.edu.pe.sgta.model.EntregableXTema;
import pucp.edu.pe.sgta.model.RevisionDocumento;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.model.VersionXDocumento;
import pucp.edu.pe.sgta.service.inter.DocumentoService;
import pucp.edu.pe.sgta.service.inter.RevisionDocumentoService;
import pucp.edu.pe.sgta.service.inter.S3DownloadService;
import pucp.edu.pe.sgta.service.inter.VersionXDocumentoService;
import pucp.edu.pe.sgta.util.EstadoRevision;

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

    public DocumentoController(DocumentoService documentoService, S3DownloadService s3DowloadService, VersionXDocumentoService versionXDocumentoService, RevisionDocumentoService revisionDocumentoService) {
        this.documentoService = documentoService;
        this.s3DownloadService = s3DowloadService;
        this.versionXDocumentoService = versionXDocumentoService;
        this.revisionDocumentoService = revisionDocumentoService;
    }

    @GetMapping("/entregable/{entregableId}")
    public List<DocumentoConVersionDto> listarDocumentosPorEntregable(@PathVariable Integer entregableId) {
        return documentoService.listarDocumentosPorEntregable(entregableId);
    }

    @PostMapping("/entregable/{entregableId}")
    public ResponseEntity<String> subirDocumentos(@PathVariable Integer entregableId,
            @RequestParam("archivos") MultipartFile[] archivos,
            @RequestParam("ciclo") String ciclo,
            @RequestParam("curso") String curso,
            @RequestParam("codigoAlumno") String codigoAlumno,
            @RequestParam("temaId") Integer temaId) throws IOException {
        for (MultipartFile archivo : archivos) {
            try {
                String filename = ciclo + S3_PATH_DELIMITER + curso + S3_PATH_DELIMITER +
                        codigoAlumno + S3_PATH_DELIMITER + archivo.getOriginalFilename();
                logger.info("Subiendo archivo: " + filename);
                s3DownloadService.upload(filename, archivo);

                Documento documento = new Documento();
                documento.setId(null);
                documento.setNombreDocumento(archivo.getOriginalFilename());
                documento.setFechaSubida(OffsetDateTime.now());
                documento.setUltimaVersion(1);
                Integer documentoId = documentoService.create(documento);
                VersionXDocumento version = new VersionXDocumento();
                version.setId(null);
                documento.setId(documentoId);
                version.setDocumento(documento);
                version.setFechaUltimaSubida(OffsetDateTime.now());
                version.setNumeroVersion(1);
                version.setLinkArchivoSubido(filename);
                EntregableXTema entregableXTema = new EntregableXTema();
                entregableXTema.setEntregableXTemaId(entregableId);
                version.setEntregableXTema(entregableXTema);
                versionXDocumentoService.create(version);
                revisionDocumentoService.crearRevisiones(entregableId, temaId);
            } catch (Exception e) {
                logger.severe("Error al crear el documento: " + e.getMessage());
                return ResponseEntity.status(500).body("Error al crear el documento: " + e.getMessage());
            }
        }
        return ResponseEntity.ok("Archivos subidos exitosamente");
    }

    @PostMapping("/borrar-documento/{documentoId}")
    public void borrarDocumento(@PathVariable Integer documentoId) {
        documentoService.borrarDocumento(documentoId);
    }
}

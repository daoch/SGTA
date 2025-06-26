package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ContentDisposition;

import jakarta.servlet.http.HttpServletRequest;
import pucp.edu.pe.sgta.dto.RevisionDocumentoAsesorDto;
import pucp.edu.pe.sgta.dto.RevisionDocumentoRevisorDto;
import pucp.edu.pe.sgta.dto.RevisionDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.model.RevisionDocumento;
import pucp.edu.pe.sgta.model.Observacion;
import pucp.edu.pe.sgta.service.inter.JwtService;
import pucp.edu.pe.sgta.service.inter.RevisionDocumentoService;
import pucp.edu.pe.sgta.service.inter.S3DownloadService;
import pucp.edu.pe.sgta.service.inter.PdfAnnotationService;
import pucp.edu.pe.sgta.repository.RevisionDocumentoRepository;
import pucp.edu.pe.sgta.repository.ObservacionRepository;
import pucp.edu.pe.sgta.util.EstadoRevision;
import java.util.Map;
import java.util.List;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/revision")
@CrossOrigin(origins = "*")
public class RevisionDocumentoController {

    @Autowired
    JwtService jwtService;

    @Autowired
    private RevisionDocumentoService revisionDocumentoService;

    @Autowired
    private S3DownloadService s3DownloadService;

    @Autowired
    private PdfAnnotationService pdfAnnotationService;

    @Autowired
    private RevisionDocumentoRepository revisionDocumentoRepository;

    @Autowired
    private ObservacionRepository observacionRepository;

    @GetMapping("/findAll")
    public List<RevisionDto> getAllRevisiones() {
        return revisionDocumentoService.findAllRevisionesCompletas();
    }

    @GetMapping("/findByRevisor")
    public List<RevisionDto> getRevisionesByRevisor(@RequestParam("revisorId") Integer revisorId) {
        return revisionDocumentoService.findRevisionesByRevisorId(revisorId);
    }

    @GetMapping("/findByUsuario")
    public List<RevisionDocumento> getRevisionesByUsuario(@RequestParam("idUsuario") Integer usuarioId) {
        return revisionDocumentoService.findByUsuarioId(usuarioId);
    }

    @GetMapping("/findByDocumento")
    public List<RevisionDocumento> getRevisionesByDocumento(@RequestParam("idDocumento") Integer documentoId) {
        return revisionDocumentoService.findByVersionDocumentoDocumentoId(documentoId);
    }

    @GetMapping("/findByEstado")
    public ResponseEntity<List<RevisionDocumento>> getRevisionesByEstado(@RequestParam("estado") String estado) {
        try {
            EstadoRevision estadoRevision = EstadoRevision.valueOf(estado.toUpperCase());
            return ResponseEntity.ok(revisionDocumentoService.findByEstadoRevision(estadoRevision));
        } catch (IllegalArgumentException e) {
            // Si el estado no es válido, retornar una lista vacía con un estado 200
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/asesor")
    public List<RevisionDocumentoAsesorDto> listarRevisionDocumentosPorAsesor(HttpServletRequest request) {
        String asesorId = jwtService.extractSubFromRequest(request);
        System.out.println("AsesorId extraído del token: " + asesorId);
        return revisionDocumentoService.listarRevisionDocumentosPorAsesor(asesorId);
    }

    @GetMapping("/revisor")
    public List<RevisionDocumentoRevisorDto> listarRevisionDocumentosPorRevisor(HttpServletRequest request) {
        String revisorId = jwtService.extractSubFromRequest(request);
        System.out.println("RevisorId extraído del token: " + revisorId);
        return revisionDocumentoService.listarRevisionDocumentosPorRevisor(revisorId);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Integer id, @RequestBody Map<String, String> payload) {
        try {
            String nuevoEstado = payload.get("estado");
            revisionDocumentoService.actualizarEstadoRevision(id, nuevoEstado);
            return ResponseEntity.ok("Estado actualizado");
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error actualizando estado");
        }
    }

    @GetMapping("/detalle")
    public RevisionDocumentoAsesorDto obtenerRevisionDocumentoPorId(@RequestParam("revisionId") Integer revisionId) {
        return revisionDocumentoService.obtenerRevisionDocumentoPorId(revisionId);
    }

    @GetMapping("/getStudents")
    public List<UsuarioDto> getStudentsByRevisor(@RequestParam("revisionId") Integer revisionId) {
        return revisionDocumentoService.getStudentsByRevisor(revisionId);
    }

    @GetMapping("/{id}/annotated-pdf")
    public ResponseEntity<byte[]> downloadAnnotatedPdf(@PathVariable Integer id) throws Exception {
        // Find the revision
        RevisionDocumento revision = revisionDocumentoRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Revision not found with id: " + id));

        // Get all observations for this revision
        List<Observacion> observations = observacionRepository.findByRevisionDocumento_Id(id);

        // Download the original PDF from S3
        String fileKey = revision.getLinkArchivoRevision();
        if (fileKey == null || fileKey.trim().isEmpty()) {
            throw new EntityNotFoundException("No file associated with revision id: " + id);
        }

        byte[] originalPdf;
        try {
            originalPdf = s3DownloadService.download(fileKey);
        } catch (Exception e) {
            throw new RuntimeException("Failed to download original PDF from S3: " + e.getMessage(), e);
        }

        // Create annotated PDF
        byte[] annotatedPdf = pdfAnnotationService.embedComments(originalPdf, observations);

        // Prepare response headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        
        // Create a meaningful filename
        String filename = "revision_" + id + "_comentado.pdf";
        if (revision.getVersionDocumento() != null && 
            revision.getVersionDocumento().getEntregableXTema() != null &&
            revision.getVersionDocumento().getEntregableXTema().getTema() != null) {
            String tituloTema = revision.getVersionDocumento().getEntregableXTema().getTema().getTitulo();
            if (tituloTema != null && !tituloTema.trim().isEmpty()) {
                filename = tituloTema.replaceAll("\\s+", "_") + "_comentado.pdf";
            }
        }
        
        headers.setContentDisposition(ContentDisposition
            .attachment()
            .filename(filename)
            .build());

        return new ResponseEntity<>(annotatedPdf, headers, HttpStatus.OK);
    }
  
    @GetMapping("/jurado")
    public List<RevisionDocumentoAsesorDto> listarRevisionDocumentosPorJurado(HttpServletRequest request) {
        String juradoId = jwtService.extractSubFromRequest(request);
        System.out.println("JuradoId extraído del token: " + juradoId);
        return revisionDocumentoService.listarRevisionDocumentosPorJurado(juradoId);
    }
}

package pucp.edu.pe.sgta.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sgta.dto.DocumentoConVersionDto;
import pucp.edu.pe.sgta.service.inter.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/documento")
public class DocumentoController {

    private final DocumentoService documentoService;
    private final JwtService jwtService;

    public DocumentoController(DocumentoService documentoService, JwtService jwtService) {
        this.documentoService = documentoService;
        this.jwtService = jwtService;
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
                                                  @RequestParam("comentario") String comentario,
                                                  @RequestParam("estado") String estado,
                                                  @RequestParam("documentoPrincipalNombre") String documentoPrincipalNombre,
                                                  HttpServletRequest request) throws IOException {
        String cognitoId = jwtService.extractSubFromRequest(request);
        return documentoService.subirDocumentos(entregableXTemaId, archivos, ciclo, curso, comentario, estado, documentoPrincipalNombre, cognitoId);
    }

    @PostMapping("/borrar-documento/{documentoId}")
    public void borrarDocumento(@PathVariable Integer documentoId) {
        documentoService.borrarDocumento(documentoId);
    }
}

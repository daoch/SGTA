package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import pucp.edu.pe.sgta.dto.RevisionDocumentoAsesorDto;
import pucp.edu.pe.sgta.dto.RevisionDto;
import pucp.edu.pe.sgta.model.RevisionDocumento;
import pucp.edu.pe.sgta.service.inter.JwtService;
import pucp.edu.pe.sgta.service.inter.RevisionDocumentoService;
import pucp.edu.pe.sgta.util.EstadoRevision;

import java.util.List;

@RestController
@RequestMapping("/revision")
public class RevisionDocumentoController {

    @Autowired
    JwtService jwtService;

    @Autowired
    private RevisionDocumentoService revisionDocumentoService;

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
        return revisionDocumentoService.listarRevisionDocumentosPorAsesor(asesorId);
    }

    @GetMapping("/detalle")
    public RevisionDocumentoAsesorDto obtenerRevisionDocumentoPorId(@RequestParam("revisionId") Integer revisionId) {
        return revisionDocumentoService.obtenerRevisionDocumentoPorId(revisionId);
    }
}
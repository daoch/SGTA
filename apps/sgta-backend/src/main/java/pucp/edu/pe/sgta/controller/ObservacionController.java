package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import pucp.edu.pe.sgta.dto.ObservacionesRevisionDTO;
import pucp.edu.pe.sgta.dto.revision.HighlightDto;
import pucp.edu.pe.sgta.model.Observacion;
import pucp.edu.pe.sgta.service.imp.ObservacionServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/revision")
public class ObservacionController {

    @Autowired
    private ObservacionServiceImpl observacionService;

    @PostMapping("/{revisionId}/observaciones")
    public ResponseEntity<?> guardarObservaciones(
            @PathVariable("revisionId") Integer revisionId,
            @RequestBody List<HighlightDto> highlights,
            @RequestParam("usuarioId") Integer usuarioId) {


            try {
        ObjectMapper mapper = new ObjectMapper();
        System.out.println(mapper.writeValueAsString(highlights));
        } catch (Exception e) {
            e.printStackTrace();
        }
        //observacionService.guardarObservaciones(revisionId, highlights, usuarioId);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/{revisionId}/observacion")
    public ResponseEntity<Integer> guardarObservacion(
            @PathVariable("revisionId") Integer revisionId,
            @RequestBody HighlightDto highlight,
            @RequestParam("usuarioId") Integer usuarioId) {

        Integer id = observacionService.guardarObservaciones(revisionId, highlight, usuarioId);
        System.out.println("ID de la observación guardada: " + id);
        return ResponseEntity.ok(id);
    }
    @GetMapping("/{revisionId}/observaciones")
    public ResponseEntity<List<HighlightDto>> getObservacionesByRevision(
            @PathVariable("revisionId") Integer revisionId) {
        List<HighlightDto> highlights = observacionService.obtenerHighlightsPorRevision(revisionId);
        return ResponseEntity.ok(highlights);
    }
    @GetMapping("/tema/{temaId}/entregable/{entregableId}/observaciones")
    public ResponseEntity<List<ObservacionesRevisionDTO>> obtenerObservacionesPorEntregableYTema(
        @PathVariable("temaId") Integer temaId,
        @PathVariable("entregableId") Integer entregableId) {

    List<ObservacionesRevisionDTO> observaciones = observacionService.obtenerObservacionesPorEntregableYTema(entregableId, temaId);
    return ResponseEntity.ok(observaciones);
    }
    @DeleteMapping("/observaciones/{observacionId}")
    public ResponseEntity<?> borrarLogicamenteObservacion(@PathVariable Integer observacionId) {
    observacionService.borradoLogicoObservacion(observacionId);
    return ResponseEntity.ok().build();
    }

}
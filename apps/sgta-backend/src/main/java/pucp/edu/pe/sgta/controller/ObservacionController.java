package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import pucp.edu.pe.sgta.service.inter.JwtService;

import com.fasterxml.jackson.databind.ObjectMapper;

import pucp.edu.pe.sgta.dto.ObservacionesRevisionDTO;
import pucp.edu.pe.sgta.dto.revision.HighlightDto;
import pucp.edu.pe.sgta.service.imp.ObservacionServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/revision")
public class ObservacionController {

    @Autowired
    private ObservacionServiceImpl observacionService;

    @Autowired
    private JwtService jwtService;

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
  @GetMapping("/tema/{temaId}/entregable/{entregableId}/observaciones")
public ResponseEntity<List<ObservacionesRevisionDTO>> obtenerObservacionesPorEntregableYTema(
        @PathVariable("temaId") Integer temaId,
        @PathVariable("entregableId") Integer entregableId) {

    List<ObservacionesRevisionDTO> observaciones = observacionService.obtenerObservacionesPorEntregableYTema(entregableId, temaId);
    return ResponseEntity.ok(observaciones);
}
}
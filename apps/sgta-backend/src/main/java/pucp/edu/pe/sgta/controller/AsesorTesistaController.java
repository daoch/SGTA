package pucp.edu.pe.sgta.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.service.inter.AsesorTesistaService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/asesor-tesista")
@RequiredArgsConstructor
public class AsesorTesistaController {
    @Autowired
    AsesorTesistaService asesorTesistaService;

    @GetMapping("/listar-por-carrera")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAsesorTesistas(@RequestParam String carrera) {
        try {
            return new ResponseEntity<>(this.asesorTesistaService.findAsesorTesista(carrera), HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("mensaje", "Ocurrió un error al buscar asesores y tesistas.");
            errorResponse.put("detalle", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
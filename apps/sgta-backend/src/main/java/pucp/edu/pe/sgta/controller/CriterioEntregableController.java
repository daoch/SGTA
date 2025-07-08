package pucp.edu.pe.sgta.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.CriterioEntregableDto;
import pucp.edu.pe.sgta.model.CriterioEntregable;
import pucp.edu.pe.sgta.service.inter.CriterioEntregableService;
import pucp.edu.pe.sgta.dto.RevisionCriterioEntregableDto;
import pucp.edu.pe.sgta.service.inter.JwtService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/criterio-entregable")

public class CriterioEntregableController {

    @Autowired
    CriterioEntregableService criterioEntregableService;

    @Autowired
    JwtService jwtService;

    @GetMapping("/entregable/{entregableId}")
    public List<CriterioEntregableDto> listarCriteriosEntregableXEntregable(@PathVariable Integer entregableId) {
        return criterioEntregableService.listarCriteriosEntregableXEntregable(entregableId);
    }

    @PostMapping("/entregable/{entregableId}")
    public int crearCriterioEntregable(@PathVariable Integer entregableId, @RequestBody CriterioEntregableDto criterioEntregableDto,
            HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        return criterioEntregableService.crearCriterioEntregable(entregableId, criterioEntregableDto, cognitoId);
    }

    @PutMapping("/update")
    public void update(@RequestBody CriterioEntregableDto criterioEntregableDto, HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        criterioEntregableService.update(criterioEntregableDto, cognitoId);
    }

    @PutMapping("/delete")
    public void delete(@RequestBody Integer criterioEntregableId, HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        criterioEntregableService.delete(criterioEntregableId, cognitoId);
    }

    @GetMapping("/{id}")
    public Optional<CriterioEntregable> findById(@PathVariable int id) {
        return criterioEntregableService.findById(id);
    }

    @GetMapping("/revision/{revision_entregable_id}")
    public List<CriterioEntregableDto> listarCriterioEntregableByRevisionEntregableId(@PathVariable int revision_entregable_id) {
        return criterioEntregableService.listar_criterio_entregable_x_revisionID(revision_entregable_id);
    }

    @PostMapping("/revision_nota/registrar_nota")
    public void upsertRevisionCriterioEntregable(@RequestBody List<CriterioEntregableDto> listaCriterioEntregable) {
        for (CriterioEntregableDto dto : listaCriterioEntregable) {
            criterioEntregableService.insertar_actualizar_revision_criterio_entregable(dto);
        }
    }
    @GetMapping("/revision/entregable-tema/{entregableXtemaId}")
    public List<RevisionCriterioEntregableDto> listarRevisionCriterioPorEntregableXTema(@PathVariable Integer entregableXtemaId) {
        return criterioEntregableService.listarRevisionCriterioPorEntregableXTema(entregableXtemaId);
    }
}

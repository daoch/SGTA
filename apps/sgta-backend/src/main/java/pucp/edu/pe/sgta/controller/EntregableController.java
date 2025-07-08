package pucp.edu.pe.sgta.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import pucp.edu.pe.sgta.dto.EntregableAlumnoDto;
import pucp.edu.pe.sgta.dto.EntregableDto;
import pucp.edu.pe.sgta.dto.EntregableSubidoDto;
import pucp.edu.pe.sgta.service.inter.EntregableService;

import java.util.List;

import pucp.edu.pe.sgta.dto.EntregableXTemaDto;
import pucp.edu.pe.sgta.service.inter.JwtService;

@RestController
@RequestMapping("/entregable")

public class EntregableController {
    @Autowired
    EntregableService entregableService;

    @Autowired
    JwtService jwtService;

    @GetMapping("/etapa-formativa-x-ciclo/{etapaFormativaXCicloId}")
    public List<EntregableDto> listarEntregablesXEtapaFormativaXCiclo(@PathVariable Integer etapaFormativaXCicloId) {
        return entregableService.listarEntregablesXEtapaFormativaXCiclo(etapaFormativaXCicloId);
    }

    @GetMapping("/etapa-formativa-x-ciclo/{etapaFormativaXCicloId}/tema/{temaId}")
    public List<EntregableXTemaDto> listarEntregablesConEnvioXEtapaFormativaXCiclo(
        @PathVariable Integer etapaFormativaXCicloId,
        @PathVariable Integer temaId
    ) {
        return entregableService.listarEntregablesConEnvioXEtapaFormativaXCiclo(etapaFormativaXCicloId, temaId);
    }


    @PostMapping("/etapa-formativa-x-ciclo/{etapaFormativaXCicloId}")
    public Integer create(@PathVariable Integer etapaFormativaXCicloId, @RequestBody EntregableDto entregableDto,
                          HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        return entregableService.create(etapaFormativaXCicloId, entregableDto, cognitoId);
    }

    @PutMapping("/update")
    public void update(@RequestBody EntregableDto entregableDto, HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        entregableService.update(entregableDto, cognitoId);
    }

    @PutMapping("/delete")
    public void delete(@RequestBody Integer entregableId, HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        entregableService.delete(entregableId, cognitoId);
    }

    @GetMapping("/getAll") // Obtiene la lista de entregables
    public List<EntregableDto> getAll() {
        return entregableService.getAll();
    }

    @GetMapping("/{id}")
    public EntregableDto findById(@PathVariable Integer id) { return entregableService.findById(id); }

    @GetMapping("/alumno")
    public List<EntregableAlumnoDto> listarEntregablesPorAlumno(HttpServletRequest request) {
        String alumnoId = jwtService.extractSubFromRequest(request);
        return entregableService.listarEntregablesPorAlumno(alumnoId);
    }

    @GetMapping("/{entregableId}/tema/{temaId}/detalle-simplificado")
    public EntregableAlumnoDto  obtenerDetalleSimplificado(
        @PathVariable Integer entregableId,
        @PathVariable Integer temaId
    ) {
        return entregableService.obtenerDetalleXTema(entregableId, temaId);
    }
}

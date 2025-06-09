package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloXCarreraDto;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaXCicloService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;
import pucp.edu.pe.sgta.dto.UpdateEtapaFormativaRequest;
import jakarta.servlet.http.HttpServletRequest;
import pucp.edu.pe.sgta.service.inter.JwtService;
@RestController
@RequestMapping("/etapa-formativa-x-ciclo")
public class EtapaFormativaXCicloController {

    @Autowired
    private EtapaFormativaXCicloService etapaFormativaXCicloService;

    @Autowired
    private JwtService jwtService;
    
    @GetMapping("/{id}")
    public ResponseEntity<EtapaFormativaXCicloDto> findById(@PathVariable Integer id) {
        EtapaFormativaXCicloDto etapaFormativaXCiclo = etapaFormativaXCicloService.findById(id);
        return ResponseEntity.ok(etapaFormativaXCiclo);
    }

    
    @PostMapping("/create")
    public ResponseEntity<EtapaFormativaXCicloDto> create(@RequestBody EtapaFormativaXCicloDto etapaFormativaXCicloDto) {
        EtapaFormativaXCicloDto createdEtapaFormativaXCiclo = etapaFormativaXCicloService.create(etapaFormativaXCicloDto);
        return ResponseEntity.ok(createdEtapaFormativaXCiclo);
    }

    @GetMapping("/carrera/{id}")
    public ResponseEntity<List<EtapaFormativaXCicloDto>> getAllByCarreraId(HttpServletRequest request) {
        String idCognito = jwtService.extractSubFromRequest(request);
        List<EtapaFormativaXCicloDto> etapaFormativaXCiclos = etapaFormativaXCicloService.getAllByCarreraId(idCognito);
        return ResponseEntity.ok(etapaFormativaXCiclos);
    }

    @GetMapping("/carrera/{carreraId}/ciclo/{cicloId}")
    public ResponseEntity<List<EtapaFormativaXCicloDto>> getAllByCarreraIdAndCicloId(@PathVariable Integer carreraId, @PathVariable Integer cicloId) {
        List<EtapaFormativaXCicloDto> etapaFormativaXCiclos = etapaFormativaXCicloService.getAllByCarreraIdAndCicloId(carreraId, cicloId);
        return ResponseEntity.ok(etapaFormativaXCiclos);
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        etapaFormativaXCicloService.delete(id);
        return ResponseEntity.noContent().build();
    }

     @PutMapping("/actualizar-relacion/{relacionId}") 
    public ResponseEntity<EtapaFormativaXCicloDto> actualizarEstadoRelacion(
        @PathVariable Integer relacionId,
        @RequestBody UpdateEtapaFormativaRequest request) {

        EtapaFormativaXCicloDto updatedRelacion = 
            etapaFormativaXCicloService.actualizarEstadoRelacion(relacionId, request);
        return ResponseEntity.ok(updatedRelacion);
    }

    @GetMapping("/listarEtapasFormativasXCicloXCarrera/{carreraId}")
    public List<EtapaFormativaXCicloXCarreraDto> listarEtapasFormativasXCicloXCarrera(@PathVariable Integer carreraId) {
        return etapaFormativaXCicloService.listarEtapasFormativasXCicloXCarrera(carreraId);
    }

}
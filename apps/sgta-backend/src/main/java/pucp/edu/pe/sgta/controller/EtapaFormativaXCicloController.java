package pucp.edu.pe.sgta.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloXCarreraDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloTesistaDto;
import pucp.edu.pe.sgta.dto.UsuarioXCarreraDto;
import pucp.edu.pe.sgta.dto.PageResponseDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloPageRequestDto;
import pucp.edu.pe.sgta.dto.ErrorResponse;
import pucp.edu.pe.sgta.model.UsuarioXCarrera;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaXCicloService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;
import pucp.edu.pe.sgta.dto.UpdateEtapaFormativaRequest;
import pucp.edu.pe.sgta.service.inter.JwtService;
import pucp.edu.pe.sgta.service.inter.UsuarioXCarreraService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
@RestController
@RequestMapping("/etapa-formativa-x-ciclo")
public class EtapaFormativaXCicloController {

    @Autowired
    private EtapaFormativaXCicloService etapaFormativaXCicloService;
    @Autowired
    private UsuarioXCarreraService usuarioXCarreraService;

    @Autowired
    private JwtService jwtService;
    
    @GetMapping("/{id}")
    public ResponseEntity<EtapaFormativaXCicloDto> findById(@PathVariable Integer id) {
        EtapaFormativaXCicloDto etapaFormativaXCiclo = etapaFormativaXCicloService.findById(id);
        return ResponseEntity.ok(etapaFormativaXCiclo);
    }

    
    @PostMapping("/create")
    public ResponseEntity<?> create(HttpServletRequest request, @RequestBody EtapaFormativaXCicloDto etapaFormativaXCicloDto) {
        try {
            String idCognito = jwtService.extractSubFromRequest(request);
            EtapaFormativaXCicloDto createdEtapaFormativaXCiclo = etapaFormativaXCicloService.create(idCognito, etapaFormativaXCicloDto);
            return ResponseEntity.ok(createdEtapaFormativaXCiclo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/carreraList")
    public ResponseEntity<List<EtapaFormativaXCicloDto>> getAllByCarreraId(HttpServletRequest request) {
        String idCognito = jwtService.extractSubFromRequest(request);
        List<EtapaFormativaXCicloDto> etapaFormativaXCiclos = etapaFormativaXCicloService.getAllByCarreraId(idCognito);
        return ResponseEntity.ok(etapaFormativaXCiclos);
    }

    @GetMapping("/carreraListPaginated")
    public ResponseEntity<PageResponseDto<EtapaFormativaXCicloDto>> getAllByCarreraIdPaginated(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) Integer anio,
            @RequestParam(required = false) String semestre) {
        
        String idCognito = jwtService.extractSubFromRequest(request);
        
        EtapaFormativaXCicloPageRequestDto requestDto = EtapaFormativaXCicloPageRequestDto.builder()
            .page(page)
            .size(size)
            .search(search)
            .estado(estado)
            .anio(anio)
            .semestre(semestre)
            .build();
            
        PageResponseDto<EtapaFormativaXCicloDto> response = etapaFormativaXCicloService.getAllByCarreraIdPaginated(idCognito, requestDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/carrera/{carreraId}/ciclo/{cicloId}")
    public ResponseEntity<List<EtapaFormativaXCicloDto>> getAllByCarreraIdAndCicloId(@PathVariable Integer carreraId, @PathVariable Integer cicloId) {
        List<EtapaFormativaXCicloDto> etapaFormativaXCiclos = etapaFormativaXCicloService.getAllByCarreraIdAndCicloId(carreraId, cicloId);
        return ResponseEntity.ok(etapaFormativaXCiclos);
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<Void> delete(HttpServletRequest request, @PathVariable Integer id) {
        String idCognito = jwtService.extractSubFromRequest(request);
        etapaFormativaXCicloService.delete(idCognito, id);
        return ResponseEntity.noContent().build();
    }

     @PutMapping("/actualizar-relacion/{relacionId}") 
    public ResponseEntity<EtapaFormativaXCicloDto> actualizarEstadoRelacion(
        HttpServletRequest requestHttp,
        @PathVariable Integer relacionId,
        @RequestBody UpdateEtapaFormativaRequest request) {

        String idCognito = jwtService.extractSubFromRequest(requestHttp);

        EtapaFormativaXCicloDto updatedRelacion = 
            etapaFormativaXCicloService.actualizarEstadoRelacion(idCognito, relacionId, request);
        return ResponseEntity.ok(updatedRelacion);
    }


    @GetMapping("/listarEtapasFormativasXCicloXCarrera")
    public List<EtapaFormativaXCicloXCarreraDto> listarEtapasFormativasXCicloXCarrera(HttpServletRequest request) {
        String coordinadorId = jwtService.extractSubFromRequest(request);
        UsuarioXCarrera usuarioXCarrera = usuarioXCarreraService.getCarreraPrincipalCoordinador(coordinadorId);
        return etapaFormativaXCicloService.listarEtapasFormativasXCicloXCarrera(usuarioXCarrera.getCarrera().getId());
    }

    @GetMapping("/etapaXCiclo/{etapaXCicloId}")
    public EtapaFormativaXCicloDto getEtapaFormativaXCicloByEtapaId(@PathVariable Integer etapaXCicloId) {
        return etapaFormativaXCicloService.getEtapaFormativaXCicloByEtapaId(etapaXCicloId);
    }

    @GetMapping("/tesista")
    public ResponseEntity<List<EtapaFormativaXCicloTesistaDto>> listarEtapasFormativasXCicloTesista(HttpServletRequest request) {
        String idCognito = jwtService.extractSubFromRequest(request);
        List<EtapaFormativaXCicloTesistaDto> etapas = etapaFormativaXCicloService.listarEtapasFormativasXCicloTesista(idCognito);
        return ResponseEntity.ok(etapas);
    }

}
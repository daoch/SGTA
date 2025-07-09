package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import pucp.edu.pe.sgta.dto.ExposicionDto;
import pucp.edu.pe.sgta.dto.ExposicionEstudianteDTO;
import pucp.edu.pe.sgta.dto.ExposicionNombreDTO;
import pucp.edu.pe.sgta.dto.ExposicionSinInicializarDTO;
import pucp.edu.pe.sgta.dto.ListExposicionXCoordinadorDTO;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.service.inter.ExposicionService;
import pucp.edu.pe.sgta.service.inter.JwtService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;

import org.springframework.http.HttpHeaders;
import java.util.List;

@RestController
@RequestMapping("/exposicion")
public class ExposicionController {
    @Autowired
    ExposicionService exposicionService;

    @Autowired
    JwtService jwtService;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/etapa-formativa-x-ciclo/{etapaFormativaXCicloId}")
    public List<ExposicionDto> listarExposicionesXEtapaFormativaXCiclo(@PathVariable Integer etapaFormativaXCicloId) {
        return exposicionService.listarExposicionesXEtapaFormativaXCiclo(etapaFormativaXCicloId);
    }

    @PostMapping("/etapa-formativa-x-ciclo/{etapaFormativaXCicloId}")
    public Integer create(@PathVariable Integer etapaFormativaXCicloId, @RequestBody ExposicionDto exposicionDto,
                          HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        return exposicionService.create(etapaFormativaXCicloId, exposicionDto, cognitoId);
    }

    @PutMapping("/update")
    public void update(@RequestBody ExposicionDto exposicionDto, HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        exposicionService.update(exposicionDto, cognitoId);
    }

    @PutMapping("/delete")
    public void delete(@RequestBody Integer exposicionId, HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        exposicionService.delete(exposicionId, cognitoId);
    }

    @GetMapping("/getAll") // Obtiene la lista de entregables
    public List<ExposicionDto> getAll() {
        return exposicionService.getAll();
    }

    @GetMapping("/{id}")
    public ExposicionDto findById(@PathVariable Integer id) {
        return exposicionService.findById(id);
    }

    @GetMapping("/listarExposicionXCicloActualEtapaFormativa")
    public List<ExposicionNombreDTO> listarExposicionXCicloActualEtapaFormativa(
            @RequestParam("etapaFormativaId") Integer etapaFormativaId) {
        return exposicionService.listarExposicionXCicloActualEtapaFormativa(etapaFormativaId);
    }

    @GetMapping("/listarExposicionesInicializadasXCoordinador")
    public List<ListExposicionXCoordinadorDTO> listarExposicionesInicializadasXCoordinador(HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        UsuarioDto coordinador = this.usuarioService.findByCognitoId(cognitoId);
        return exposicionService.listarExposicionesInicializadasXCoordinador(coordinador.getId());
    }

    @GetMapping("/listarExposicionesSinInicializarByEtapaFormativaEnCicloActual/{etapaFormativaId}")
    public List<ExposicionSinInicializarDTO> listarExposicionesSinInicializarByEtapaFormativaEnCicloActual(
            @PathVariable Integer etapaFormativaId) {
        return exposicionService.listarExposicionesSinInicializarByEtapaFormativaEnCicloActual(etapaFormativaId);
    }

    @GetMapping("/listarExposicionesPorUsuario")
    public List<ExposicionEstudianteDTO> listarExposicionesPorUsuario(HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        UsuarioDto usuario = this.usuarioService.findByCognitoId(cognitoId);
        return exposicionService.findExposicionesEstudianteById(usuario.getId());
    }

    @GetMapping("/export-excel/{idExposicion}")
    public ResponseEntity<byte[]> exportarExcel(@PathVariable Integer idExposicion) {
        byte[] archivo = exposicionService.exportarExcel(idExposicion); // Llama a tu servicio

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition
                .attachment()
                .filename("reporte.xlsx")
                .build());

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(archivo); // ✅ Ya no hay error aquí
    }

}

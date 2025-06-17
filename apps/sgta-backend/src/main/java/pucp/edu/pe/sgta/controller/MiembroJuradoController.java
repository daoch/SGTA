package pucp.edu.pe.sgta.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.server.ResponseStatusException;
import pucp.edu.pe.sgta.dto.*;
import pucp.edu.pe.sgta.dto.calificacion.ExposicionCalificacionDto;
import pucp.edu.pe.sgta.dto.calificacion.ExposicionCalificacionJuradoDTO;
import pucp.edu.pe.sgta.dto.calificacion.ExposicionCalificacionRequest;
import pucp.edu.pe.sgta.dto.calificacion.ExposicionObservacionRequest;
import pucp.edu.pe.sgta.dto.calificacion.RevisionCriteriosRequest;
import pucp.edu.pe.sgta.dto.coordinador.ExposicionCoordinadorDto;
import pucp.edu.pe.sgta.dto.etapas.EtapasFormativasDto;
import pucp.edu.pe.sgta.dto.exposiciones.EstadoControlExposicionRequest;
import pucp.edu.pe.sgta.dto.exposiciones.EstadoExposicionJuradoRequest;
import pucp.edu.pe.sgta.dto.exposiciones.ExposicionTemaMiembrosDto;
import pucp.edu.pe.sgta.dto.temas.DetalleTemaDto;
import pucp.edu.pe.sgta.service.inter.JwtService;
import pucp.edu.pe.sgta.service.inter.MiembroJuradoService;
import pucp.edu.pe.sgta.dto.exposiciones.EstadoExposicionDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import pucp.edu.pe.sgta.service.inter.JwtService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;

@RestController
@RequestMapping("/jurado")
public class MiembroJuradoController {

    private final MiembroJuradoService juradoService;
    private final JwtService jwtService;

    @Autowired
    public MiembroJuradoController(MiembroJuradoService autorService, JwtService jwtService) {
        this.juradoService = autorService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public List<MiembroJuradoDto> obtenerUsuarioTemaInfo() {
        return juradoService.obtenerUsuarioTemaInfo();
    }

    @GetMapping("/estado/{estado}")
    public List<MiembroJuradoDto> obtenerUsuariosPorEstado(@PathVariable Boolean estado) {
        return juradoService.obtenerUsuariosPorEstado(estado);
    }

    @GetMapping("/area/{areaConocimientoId}")
    public List<MiembroJuradoDto> obtenerUsuariosPorAreaConocimiento(
            @PathVariable Integer areaConocimientoId) {
        return juradoService.obtenerUsuariosPorAreaConocimiento(areaConocimientoId);
    }

    // Coordinador
    @DeleteMapping("/{usuarioId}")
    public ResponseEntity<Map<String, Object>> deleteUserJurado(@PathVariable Integer usuarioId) {
        Optional<Map<String, Object>> result = juradoService.deleteUserJurado(usuarioId);

        if (result.isPresent()) {
            Map<String, Object> data = result.get();
            boolean eliminado = (boolean) data.get("eliminado");

            Map<String, Object> response = new HashMap<>();
            response.put("data", data);
            response.put("exito", eliminado);

            if (eliminado) {
                response.put("mensaje", "Se ha eliminado exitosamente el Jurado");
                return ResponseEntity.ok(response);
            } else {
                response.put("mensaje", "No se pudo eliminar el Jurado ya que tiene exposiciones pendientes");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("exito", false);
            response.put("mensaje", "El jurado no existe");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Coordinador
    @GetMapping("/{usuarioId}/areas-conocimiento")
    public ResponseEntity<JuradoXAreaConocimientoDto> obtenerAreasConocimientoPorUsuario(
            @PathVariable Integer usuarioId) {

        List<JuradoXAreaConocimientoDto> result = juradoService.findAreaConocimientoByUser(usuarioId);
        if (result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(result.get(0));
    }

    // Coordinador
    @PostMapping("/asignar-tema")
    public ResponseEntity<?> asignarJuradoATema(@RequestBody AsignarJuradoRequest request) {
        return juradoService.asignarJuradoATema(request);
    }

    // Coordinador
    @GetMapping("/temas/{usuarioId}")
    public ResponseEntity<List<MiembroJuradoXTemaDto>> obtenerTemasPorMiembroJurado(@PathVariable Integer usuarioId) {
        List<MiembroJuradoXTemaDto> temas = juradoService.findByUsuarioIdAndActivoTrueAndRolId(usuarioId);
        return ResponseEntity.ok(temas);
    }

    // Coordinador
    @GetMapping("/temas-tesis/{usuarioId}")
    public ResponseEntity<List<MiembroJuradoXTemaTesisDto>> obtenerTemasTesisPorMiembroJurado(
            @PathVariable Integer usuarioId) {
        List<MiembroJuradoXTemaTesisDto> temas = juradoService.findTemaTesisByUsuario(usuarioId);
        return ResponseEntity.ok(temas);
    }

    // Coordinador
    @GetMapping("/temas-otros-jurados/{usuarioId}")
    public ResponseEntity<List<MiembroJuradoXTemaDto>> obtenerTemasDeOtrosJurados(@PathVariable Integer usuarioId) {
        List<MiembroJuradoXTemaDto> temas = juradoService.findTemasDeOtrosJurados(usuarioId);
        return ResponseEntity.ok(temas);
    }
    // Coordinador

    @PutMapping("/desasignar-jurado")
    public ResponseEntity<?> desasignarJuradoDeTema(@RequestBody AsignarJuradoRequest request) {
        return juradoService.desasignarJuradoDeTema(request);
    }

    // Coordinador
    @PutMapping("/desasignar-jurado-tema-todos/{usuarioId}")
    public ResponseEntity<?> desasignarJuradoDeTemaTodos(@PathVariable Integer usuarioId) {
        return juradoService.desasignarJuradoDeTemaTodos(usuarioId);
    }

    // Coordinador
    @GetMapping("/{idTema}/detalle")
    public ResponseEntity<DetalleTemaDto> obtenerDetalleTema(@PathVariable Integer idTema) {
        DetalleTemaDto detalle = juradoService.obtenerDetalleTema(idTema);
        return ResponseEntity.ok(detalle);
    }
    // Jurado-Asesor
    @GetMapping("/exposiciones")
    public ResponseEntity<List<ExposicionTemaMiembrosDto>> listarExposicionesPorJurado(
            HttpServletRequest request) {
        try {
            String juradoId = jwtService.extractSubFromRequest(request);
            List<ExposicionTemaMiembrosDto> exposiciones = juradoService.listarExposicionXJuradoId(juradoId);
            return ResponseEntity.ok(exposiciones);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
    }
    // Jurado-Asesor
    @PutMapping("/conformidad")
    public ResponseEntity<?> actualizarEstadoExposicion(@RequestBody EstadoExposicionJuradoRequest request) {
        return juradoService.actualizarEstadoExposicionJurado(request);
    }

    // Jurado-Asesor
    @PutMapping("/control")
    public ResponseEntity<?> actualizarControlEstadoExposicion(HttpServletRequest request,
            @RequestBody EstadoControlExposicionRequest requestControl) {
        try {
            String juradoId = jwtService.extractSubFromRequest(request);
            return juradoService.actualizarEstadoControlExposicion(requestControl, juradoId);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }

    }

    @GetMapping("/estados")
    public ResponseEntity<List<EstadoExposicionDto>> listarEstados() {
        return ResponseEntity.ok(juradoService.listarEstados());
    }

    // Jurado-Asesor
    @GetMapping("/criterios")
    public ResponseEntity<ExposicionCalificacionDto> listarExposicionCalificacion(HttpServletRequest request,
            @RequestParam("exposicion_tema_id") Long exposicionTemaId) {

        System.out.println("exposicion_tema_id recibido: " + exposicionTemaId);
        System.out.println("Headers de autorización: " + request.getHeader("Authorization"));

        ExposicionCalificacionRequest requestExpo = new ExposicionCalificacionRequest();
        requestExpo.setExposicion_tema_id(exposicionTemaId.intValue());

        try {
            String juradoId = jwtService.extractSubFromRequest(request);
            return juradoService.listarExposicionCalificacion(requestExpo, juradoId);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
    }

    @PutMapping("/criterios")
    public ResponseEntity<?> actualizarCriterios(@RequestBody RevisionCriteriosRequest request) {
        return juradoService.actualizarRevisionCriterios(request);
    }

    @PutMapping("/observacionfinal")
    public ResponseEntity<?> actualizarObservacionFinal(@RequestBody ExposicionObservacionRequest request) {
        return juradoService.actualizarObservacionFinal(request);
    }
    // Jurado-Asesor
    @GetMapping("/calificacion-exposicion")
    public ResponseEntity<List<ExposicionCalificacionJuradoDTO>> obtenerCalificacionExposicion(
            @RequestParam("exposicion_tema_id") Integer exposicionTemaId) {
        ExposicionCalificacionRequest request = new ExposicionCalificacionRequest();
        request.setExposicion_tema_id(exposicionTemaId);
        return juradoService.obtenerCalificacionExposicionJurado(request);
    }

    @GetMapping("/etapas-formativas")
    public ResponseEntity<?> obtenerEtapasFormativas(HttpServletRequest request){
        try {
            String usuarioId = jwtService.extractSubFromRequest(request);
            List<EtapasFormativasDto> etapas = juradoService.obtenerEtapasFormativasPorUsuario(usuarioId);
            Map<String, Object> response = Map.of("etapas_formativas", etapas);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
    }

    @GetMapping("/exposiciones-coordinador")
    public ResponseEntity<?> listarExposicionesPorCoordinador(HttpServletRequest request){
        try{
            String usuarioId = jwtService.extractSubFromRequest(request);
            List<ExposicionCoordinadorDto> exposiciones = juradoService.listarExposicionesPorCoordinador(usuarioId);
            return ResponseEntity.ok(exposiciones);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
    }
}

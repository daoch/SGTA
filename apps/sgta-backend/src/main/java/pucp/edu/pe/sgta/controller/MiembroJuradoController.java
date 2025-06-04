package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.*;
import pucp.edu.pe.sgta.dto.exposiciones.EstadoControlExposicionRequest;
import pucp.edu.pe.sgta.dto.exposiciones.EstadoExposicionJuradoRequest;
import pucp.edu.pe.sgta.dto.exposiciones.ExposicionTemaMiembrosDto;
import pucp.edu.pe.sgta.dto.temas.DetalleTemaDto;
import pucp.edu.pe.sgta.service.inter.MiembroJuradoService;
import pucp.edu.pe.sgta.dto.exposiciones.EstadoExposicionDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/jurado")
public class MiembroJuradoController {

    private final MiembroJuradoService juradoService;

    @Autowired
    public MiembroJuradoController(MiembroJuradoService autorService) {
        this.juradoService = autorService;
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

    @GetMapping("/{usuarioId}/areas-conocimiento")
    public ResponseEntity<JuradoXAreaConocimientoDto> obtenerAreasConocimientoPorUsuario(
            @PathVariable Integer usuarioId) {

        List<JuradoXAreaConocimientoDto> result = juradoService.findAreaConocimientoByUser(usuarioId);
        if (result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(result.get(0));
    }

    @PostMapping("/asignar-tema")
    public ResponseEntity<?> asignarJuradoATema(@RequestBody AsignarJuradoRequest request) {
        return juradoService.asignarJuradoATema(request);
    }

    @GetMapping("/temas/{usuarioId}")
    public ResponseEntity<List<MiembroJuradoXTemaDto>> obtenerTemasPorMiembroJurado(@PathVariable Integer usuarioId) {
        List<MiembroJuradoXTemaDto> temas = juradoService.findByUsuarioIdAndActivoTrueAndRolId(usuarioId);
        return ResponseEntity.ok(temas);
    }

    @GetMapping("/temas-tesis/{usuarioId}")
    public ResponseEntity<List<MiembroJuradoXTemaTesisDto>> obtenerTemasTesisPorMiembroJurado(
            @PathVariable Integer usuarioId) {
        List<MiembroJuradoXTemaTesisDto> temas = juradoService.findTemaTesisByUsuario(usuarioId);
        return ResponseEntity.ok(temas);
    }

    @GetMapping("/temas-otros-jurados/{usuarioId}")
    public ResponseEntity<List<MiembroJuradoXTemaDto>> obtenerTemasDeOtrosJurados(@PathVariable Integer usuarioId) {
        List<MiembroJuradoXTemaDto> temas = juradoService.findTemasDeOtrosJurados(usuarioId);
        return ResponseEntity.ok(temas);
    }

    @PutMapping("/desasignar-jurado")
    public ResponseEntity<?> desasignarJuradoDeTema(@RequestBody AsignarJuradoRequest request) {
        return juradoService.desasignarJuradoDeTema(request);
    }

    @PutMapping("/desasignar-jurado-tema-todos/{usuarioId}")
    public ResponseEntity<?> desasignarJuradoDeTemaTodos(@PathVariable Integer usuarioId) {
        return juradoService.desasignarJuradoDeTemaTodos(usuarioId);
    }

    @GetMapping("/{idTema}/detalle")
    public ResponseEntity<DetalleTemaDto> obtenerDetalleTema(@PathVariable Integer idTema) {
        DetalleTemaDto detalle = juradoService.obtenerDetalleTema(idTema);
        return ResponseEntity.ok(detalle);
    }

    @GetMapping("/{usuarioId}/exposiciones")
    public ResponseEntity<List<ExposicionTemaMiembrosDto>> listarExposicionesPorJurado(
            @PathVariable Integer usuarioId) {
        List<ExposicionTemaMiembrosDto> exposiciones = juradoService.listarExposicionXJuradoId(usuarioId);
        return ResponseEntity.ok(exposiciones);
    }

    @PutMapping("/conformidad")
    public ResponseEntity<?> actualizarEstadoExposicion(@RequestBody EstadoExposicionJuradoRequest request) {
        return juradoService.actualizarEstadoExposicionJurado(request);
    }

    @PutMapping("/control")
    public ResponseEntity<?> actualizarControlEstadoExposicion(@RequestBody EstadoControlExposicionRequest request) {
        return juradoService.actualizarEstadoControlExposicion(request);
    }

    @GetMapping("/estados")
    public ResponseEntity<List<EstadoExposicionDto>> listarEstados() {
        return ResponseEntity.ok(juradoService.listarEstados());
    }

}

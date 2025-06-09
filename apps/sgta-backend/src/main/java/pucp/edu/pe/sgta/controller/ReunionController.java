package pucp.edu.pe.sgta.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.ReunionDto;
import pucp.edu.pe.sgta.dto.ReunionesXUsuariosDto;
import pucp.edu.pe.sgta.dto.UsuarioXReunionDto;
import pucp.edu.pe.sgta.mapper.ReunionMapper;
import pucp.edu.pe.sgta.mapper.UsuarioXReunionMapper;
import pucp.edu.pe.sgta.model.Reunion;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.model.UsuarioXReunion;
import pucp.edu.pe.sgta.service.inter.ReunionService;
import pucp.edu.pe.sgta.service.inter.UsuarioXReunionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/reuniones")
@RequiredArgsConstructor
@Tag(name = "Reuniones", description = "Controller para gestión de reuniones")
public class ReunionController {

    private final ReunionService reunionService;
    private final UsuarioXReunionService usuarioXReunionService;
    private final ReunionMapper reunionMapper;
    private final UsuarioXReunionMapper usuarioXReunionMapper;

    @GetMapping
    @Operation(summary = "Listar reuniones", description = "Obtiene todas las reuniones activas")
    public ResponseEntity<List<ReunionDto>> listarReuniones() {
        List<ReunionDto> reuniones = reunionMapper.toDTOList(reunionService.findAll());
        return ResponseEntity.ok(reuniones);
    }

    @GetMapping("/ordenadas")
    @Operation(summary = "Listar reuniones ordenadas", description = "Obtiene todas las reuniones activas ordenadas por fecha")
    public ResponseEntity<List<ReunionDto>> listarReunionesOrdenadas() {
        List<ReunionDto> reuniones = reunionMapper.toDTOList(reunionService.findAllOrderedByDate());
        return ResponseEntity.ok(reuniones);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener reunión", description = "Obtiene una reunión específica por ID")
    public ResponseEntity<ReunionDto> obtenerReunion(
            @Parameter(description = "ID de la reunión") @PathVariable Integer id) {
        return reunionService.findById(id)
                .map(reunion -> ResponseEntity.ok(reunionMapper.toDTO(reunion)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{reunionId}/usuarios")
    @Operation(summary = "Listar usuarios de reunión", description = "Obtiene todos los usuarios inscritos en una reunión")
    public ResponseEntity<List<UsuarioXReunionDto>> listarUsuariosPorReunion(
            @Parameter(description = "ID de la reunión") @PathVariable Integer reunionId) {
        List<UsuarioXReunionDto> usuarios = usuarioXReunionMapper.toDTOList(
                usuarioXReunionService.findByReunionId(reunionId));
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Listar reuniones por usuario", description = "Obtiene todas las reuniones de un usuario específico")
    public ResponseEntity<List<UsuarioXReunionDto>> listarReunionesPorUsuario(
            @Parameter(description = "ID del usuario") @PathVariable Integer usuarioId) {
        List<UsuarioXReunionDto> reuniones = usuarioXReunionMapper.toDTOList(
                usuarioXReunionService.findByUsuarioId(usuarioId));
        return ResponseEntity.ok(reuniones);
    }

    @GetMapping("/usuario/{usuarioId}/ordenadas")
    @Operation(summary = "Listar reuniones por usuario ordenadas", description = "Obtiene todas las reuniones de un usuario ordenadas por fecha")
    public ResponseEntity<List<UsuarioXReunionDto>> listarReunionesPorUsuarioOrdenadas(
            @Parameter(description = "ID del usuario") @PathVariable Integer usuarioId) {
        List<UsuarioXReunionDto> reuniones = usuarioXReunionMapper.toDTOList(
                usuarioXReunionService.findByUsuarioIdOrderedByDate(usuarioId));
        return ResponseEntity.ok(reuniones);
    }

    @GetMapping("/asesor-alumno")
    @Operation(summary = "Listar las reuniones de un alumno con su asesor", description = "Obtiene todas las reuniones de un alumno con su asesor")
    public ResponseEntity<List<ReunionesXUsuariosDto>> listarReunionesPorAlumno() {
        return ResponseEntity.ok(usuarioXReunionService.findReunionesAlumnoAsesor());
    }

    @PostMapping("/crearReunionConUsuarios")
    public ResponseEntity<Reunion> crearReunionConUsuarios(
            @RequestBody Reunion reunion,
            @RequestParam List<Integer> usuarioIds) {
        try {
            List<Usuario> usuarios = usuarioIds.stream()
                    .map(id -> {
                        Usuario u = new Usuario();
                        u.setId(id);
                        return u;
                    })
                    .toList();

            Reunion guardada = reunionService.guardarConUsuarios(reunion, usuarios);
            return ResponseEntity.status(HttpStatus.OK).body(guardada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Reunion> actualizarReunion(
            @RequestParam Integer id,
            @RequestBody Reunion reunion) {
        try {
            Reunion actualizada = reunionService.update(id, reunion);
            return ResponseEntity.status(HttpStatus.OK).body(actualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> desactivarReunion(@RequestParam Integer id) {
        try {
            reunionService.delete(id);
            return ResponseEntity.status(HttpStatus.OK).body("Reunión desactivada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/updateEstadoAsistencia")
    public ResponseEntity<String> actualizarEstadoAsistencia(
            @RequestParam Integer usuarioReunionId,
            @RequestBody UsuarioXReunion usuarioXReunionActualizado) {
        try {
            usuarioXReunionService.update(usuarioReunionId, usuarioXReunionActualizado);
            return ResponseEntity.status(HttpStatus.OK).body("Estado de asistencia actualizado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
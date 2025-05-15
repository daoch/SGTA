package pucp.edu.pe.sgta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pucp.edu.pe.sgta.dto.EtapaFormativaDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaNombreDTO;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloDto;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;

import pucp.edu.pe.sgta.dto.EtapaFormativaListadoDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaDetalleDto;


@RestController
@RequestMapping("/etapas-formativas")
public class EtapaFormativaController {
    @Autowired
    EtapaFormativaService etapaFormativaService;

    @GetMapping("/listarPorInicializarByCoordinador/{corodinador_id}")
    public List<EtapaFormativaNombreDTO> obtenerPorInicializarPorCoordinador(@PathVariable("corodinador_id") Integer usuarioId) {
        return etapaFormativaService.findToInitializeByCoordinador(usuarioId);
    }

    @GetMapping("/listarActivas")
    public List<EtapaFormativaDto> obtenerEtapasFormativasActivas() {
        return etapaFormativaService.findAllActivas();
    }

    @GetMapping("/listarActivasPorCoordinador/{coordinador_id}")
    public List<EtapaFormativaDto> obtenerEtapasFormativasActivasPorCoordinador(@PathVariable("coordinador_id") Integer coordinadorId) {
        return etapaFormativaService.findAllActivasByCoordinador(coordinadorId);
    }

    @GetMapping
    public ResponseEntity<List<EtapaFormativaListadoDto>> listarEtapasFormativas() {
        List<EtapaFormativaListadoDto> etapas = etapaFormativaService.getSimpleList();
        return ResponseEntity.ok(etapas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EtapaFormativaDetalleDto> obtenerDetalleEtapaFormativa(@PathVariable Integer id) {
        EtapaFormativaDetalleDto etapa = etapaFormativaService.getDetalleById(id);
        if (etapa == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(etapa);
    }

    /**
     * Crea una nueva Etapa Formativa (solo ligada a Carrera).
     */
    @PostMapping ("/crear")
    public ResponseEntity<EtapaFormativaDto> crearEtapa(
        @RequestBody EtapaFormativaDto dto
    ) {
        EtapaFormativaDto created = etapaFormativaService.create(dto);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(created);
    }

    /*
     * Actualiza una etapa formativa existente.
     */
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<EtapaFormativaDto> actualizarEtapa(
        @PathVariable("id") Integer id,
        @RequestBody EtapaFormativaDto dto
    ) {
        // Asegura que el DTO traiga el mismo id de la ruta
        dto.setId(id);
        EtapaFormativaDto updated = etapaFormativaService.update(dto);
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(updated);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarEtapa(@PathVariable Integer id) {
        etapaFormativaService.delete(id);
        return ResponseEntity.noContent().build();
    }

}

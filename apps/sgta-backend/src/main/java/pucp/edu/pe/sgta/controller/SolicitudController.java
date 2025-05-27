package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pucp.edu.pe.sgta.dto.AprobarSolicitudCambioAsesorRequestDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudCambioAsesorResponseDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudRequestDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudCambioAsesorRequestDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudCambioAsesorResponseDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudRequestDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.SolicitudCambioAsesorDto;
import pucp.edu.pe.sgta.dto.SolicitudCeseDto;
import pucp.edu.pe.sgta.dto.temas.SolicitudTemaDto;
import pucp.edu.pe.sgta.service.inter.SolicitudService;

import java.util.List;

@RestController

@RequestMapping("/solicitudes")
public class SolicitudController {

	@Autowired
	private SolicitudService solicitudService;

	@GetMapping("/cessation-requests")
	public ResponseEntity<SolicitudCeseDto> getSolicitudesCese(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		return ResponseEntity.ok(solicitudService.findAllSolicitudesCese(page, size));
	}

	@PostMapping("/cessation-requests/{requestId}/reject")
	public ResponseEntity<RechazoSolicitudResponseDto> rechazarSolicitud(@PathVariable Integer requestId,
			@RequestBody RechazoSolicitudRequestDto requestDto) {

		RechazoSolicitudResponseDto response = solicitudService.rechazarSolicitud(requestId, requestDto.getResponse());
		return ResponseEntity.ok(response);
	}

	@PostMapping("/cessation-requests/{requestId}/approve")
	public ResponseEntity<AprobarSolicitudResponseDto> aprobarSolicitud(@PathVariable Integer requestId,
			@RequestBody AprobarSolicitudRequestDto requestDto) {

		AprobarSolicitudResponseDto response = solicitudService.aprobarSolicitud(requestId, requestDto.getResponse());
		return ResponseEntity.ok(response);
	}

	@GetMapping("/advisor-change-requests")
	public ResponseEntity<SolicitudCambioAsesorDto> getSolicitudesCambioAsesor(
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		return ResponseEntity.ok(solicitudService.findAllSolicitudesCambioAsesor(page, size));
	}

	@PostMapping("/advisor-change-requests/{requestId}/reject")
	public ResponseEntity<RechazoSolicitudCambioAsesorResponseDto> rechazarSolicitudCambioAsesor(
			@PathVariable Integer requestId, @RequestBody RechazoSolicitudCambioAsesorRequestDto requestDto) {

		RechazoSolicitudCambioAsesorResponseDto response = solicitudService.rechazarSolicitudCambioAsesor(requestId,
				requestDto.getResponse());
		return ResponseEntity.ok(response);
	}

	@PostMapping("/advisor-change-requests/{requestId}/approve")
	public ResponseEntity<AprobarSolicitudCambioAsesorResponseDto> aprobarSolicitudCambioAsesor(
			@PathVariable Integer requestId, @RequestBody AprobarSolicitudCambioAsesorRequestDto requestDto) {

		AprobarSolicitudCambioAsesorResponseDto response = solicitudService.aprobarSolicitudCambioAsesor(requestId,
				requestDto.getResponse());
		return ResponseEntity.ok(response);
	}

	AprobarSolicitudCambioAsesorResponseDto response = solicitudService.aprobarSolicitudCambioAsesor(requestId, requestDto.getResponse());return ResponseEntity.ok(response);
	}

	@GetMapping("/listSolicitudesByTema/{id}")
    public ResponseEntity<SolicitudTemaDto> getSolicitudesByTema(
            @PathVariable Integer id,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        return ResponseEntity.ok(solicitudService.findAllSolicitudesByTema(id, page, size));
    }

	@PostMapping("/atenderSolicitudTemaInscrito")
    public ResponseEntity<Void> atenderSolicitudTemaInscrito(@RequestBody SolicitudTemaDto solicitudAtendida) {
        try {
            solicitudService.atenderSolicitudTemaInscrito(solicitudAtendida);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.service.inter.TemaService;

import java.util.List;

@RestController

@RequestMapping("/temas")
public class TemaController {

	@Autowired
	TemaService temaService;

	@GetMapping("/findByUser") // finds topics by user
	public List<TemaDto> findByUser(@RequestParam(name = "idUsuario") Integer idUsuario) {
		return temaService.findByUsuario(idUsuario);
	}

	@GetMapping("/findById") // finds a topic by id
	public TemaDto findById(@RequestParam(name = "idTema") Integer idTema) {
		return temaService.findById(idTema);
	}

    @PostMapping("/createPropuesta")
    public void createTema(@RequestBody TemaDto dto,
                           @RequestParam(name = "idUsuarioCreador") Integer idUsuarioCreador) {
        temaService.createTemaPropuesta(dto, idUsuarioCreador);
    }

    @PostMapping("/createInscripcion") // Inscripcion de tema oficial por asesor
    public void createInscripcion(
            @RequestBody TemaDto dto,
            @RequestParam(name = "idUsuarioCreador") Integer idUsuarioCreador) {
        temaService.createInscripcionTema(dto, idUsuarioCreador);
    }

	@GetMapping("/listarTemasPropuestosAlAsesor/{asesorId}")
	public List<TemaDto> listarTemasPropuestosAlAsesor(@PathVariable Integer asesorId) {
		return temaService.listarTemasPropuestosAlAsesor(asesorId);
	}

	@GetMapping("/listarTemasPropuestosPorSubAreaConocimiento")
	public List<TemaDto> listarTemasPropuestosPorSubAreaConocimiento(@RequestParam List<Integer> subareaIds) {
		return temaService.listarTemasPropuestosPorSubAreaConocimiento(subareaIds);
	}

	@PostMapping("/postularAsesorTemaPropuesto")
	public void postularAsesorTemaPropuesto(
			@RequestParam(name = "idUsuario") Integer idUsuario,
			@RequestParam(name = "idTema") Integer idTema) {

		temaService.postularAsesorTemaPropuesto(idUsuario, idTema);
	}
    @GetMapping("/listarTemasPorUsuarioRolEstado/{usuarioId}")
    public List<TemaDto> listarTemasPorUsuarioRolEstado(
            @PathVariable("usuarioId") Integer usuarioId,
            @RequestParam("rolNombre")   String rolNombre,
            @RequestParam("estadoNombre")String estadoNombre) {
        return temaService.listarTemasPorUsuarioEstadoYRol(usuarioId, rolNombre, estadoNombre);
    }
}

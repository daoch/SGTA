package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.service.inter.TemaService;

import java.util.List;
import java.util.Map;

@RestController

@RequestMapping("/temas")
public class TemaController {

	@Autowired
	TemaService temaService;

	@GetMapping("/findByUser") // finds topics by user
	public List<TemaDto> findByUser(@RequestParam(name = "idUsuario") Integer idUsuario) {
		return temaService.findByUsuario(idUsuario);
	}

    @PostMapping("/createPropuesta")
    public void createTema(@RequestBody TemaDto dto,
                           @RequestParam(name = "idUsuarioCreador") Integer idUsuarioCreador,
						   @RequestParam(name = "tipoPropuesta", defaultValue = "0") Integer tipoPropuesta) {
        temaService.createTemaPropuesta(dto, idUsuarioCreador, tipoPropuesta);
    }
    @GetMapping("/findById") //finds a topic by id
    public TemaDto findById(@RequestParam(name = "idTema") Integer idTema) {
        return temaService.findById(idTema);
    }

    @PostMapping("/createInscripcion") // Inscripcion de tema oficial por asesor
    public void createInscripcion(
            @RequestBody TemaDto dto,
            @RequestParam(name = "idUsuarioCreador") Integer idUsuarioCreador) {
        temaService.createInscripcionTema(dto, idUsuarioCreador);
    }

	@PutMapping("/update") // updates a topic
	public void update(@RequestBody TemaDto dto) {
		temaService.update(dto);
	}
	@GetMapping("/listarTemasPropuestosAlAsesor/{asesorId}")
	public List<TemaDto> listarTemasPropuestosAlAsesor(@PathVariable Integer asesorId) {
		return temaService.listarTemasPropuestosAlAsesor(asesorId);
	}

	@GetMapping("/listarTemasPropuestosPorSubAreaConocimiento")
	public List<TemaDto> listarTemasPropuestosPorSubAreaConocimiento(@RequestParam List<Integer> subareaIds) {
		return temaService.listarTemasPropuestosPorSubAreaConocimiento(subareaIds);
	}

	@PostMapping("/postularAsesorTemaPropuestoGeneral")
	public void postularAsesorTemaPropuestoGeneral(
			@RequestParam(name = "idAlumno") Integer idAlumno,
			@RequestParam(name = "idAsesor") Integer idAsesor,
			@RequestParam(name = "idTema") Integer idTema,
			@RequestParam(name = "comentario") String comentario) {

		temaService.postularAsesorTemaPropuestoGeneral(idAlumno, idAsesor, idTema, comentario);


	}

	@PostMapping("/enlazarTesistasATemaPropuestDirecta")
	public void enlazarTesistasATemaPropuestDirecta(@RequestBody Map<String, Object> body) {

		List<Integer> usuariosIdList = (List<Integer>) body.get("usuariosId");
		Integer[] usuariosId = usuariosIdList.toArray(new Integer[0]);
		Integer temaId = (Integer) body.get("temaId");
		Integer profesorId = (Integer) body.get("profesorId");
		String comentario = (String) body.getOrDefault("comentario", ""); // por defecto vacío

		temaService.enlazarTesistasATemaPropuestDirecta(usuariosId, temaId, profesorId, comentario);
	}
    @GetMapping("/listarTemasPorUsuarioRolEstado/{usuarioId}")
    public List<TemaDto> listarTemasPorUsuarioRolEstado(
            @PathVariable("usuarioId") Integer usuarioId,
            @RequestParam("rolNombre")   String rolNombre,
            @RequestParam("estadoNombre")String estadoNombre) {
        return temaService.listarTemasPorUsuarioEstadoYRol(usuarioId, rolNombre, estadoNombre);
    }

	@PostMapping("/rechazarTemaPropuestaDirecta")
	public void rechazarTema(
			@RequestParam("alumnoId") Integer alumnoId,
			@RequestParam("comentario") String comentario,
			@RequestParam("temaId") Integer temaId) {

		temaService.rechazarTemaPropuestaDirecta(alumnoId, comentario, temaId);

	}


}



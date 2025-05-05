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
			@RequestParam(name = "idUsuarioCreador") Integer idUsuarioCreador) {
		temaService.createTemaPropuesta(dto, idUsuarioCreador);
	}

	@GetMapping("/findById") // finds a topic by id
	public TemaDto findById(@RequestParam(name = "idTema") Integer idTema) {
		return temaService.findById(idTema);
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




}

package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import pucp.edu.pe.sgta.dto.asesores.InfoTemaPerfilDto;
import pucp.edu.pe.sgta.dto.TemaConAsesorJuradoDTO;
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

	@GetMapping("/findById") // finds a topic by id
	public TemaDto findById(@RequestParam(name = "idTema") Integer idTema) {
		return temaService.findById(idTema);
	}

    @PostMapping("/createPropuesta")
    public void createTema(@RequestBody TemaDto dto,
                           @RequestParam(name = "idUsuarioCreador") Integer idUsuarioCreador,
						   @RequestParam(name = "tipoPropuesta", defaultValue = "0") Integer tipoPropuesta) {
        temaService.createTemaPropuesta(dto, idUsuarioCreador, tipoPropuesta);
    }

    @PostMapping("/createInscripcion") // Inscripcion de tema oficial por asesor
    public void createInscripcion(
            @RequestBody @Valid TemaDto dto
            //@RequestParam(name = "idUsuarioCreador") Integer idUsuarioCreador
			) {
        temaService.createInscripcionTema(dto);
    }

	@PutMapping("/update") // updates a topic
	public void update(@RequestBody TemaDto dto) {
		temaService.update(dto);
	}

	@GetMapping("/listarTemasPropuestosAlAsesor/{asesorId}")
	public List<TemaDto> listarTemasPropuestosAlAsesor(
			@PathVariable Integer asesorId,
			@RequestParam(required = false) String titulo, // Parámetro opcional de título
			@RequestParam(defaultValue = "10") Integer limit, // Parámetro de límite, con valor por defecto de 10
			@RequestParam(defaultValue = "0") Integer offset // Parámetro de desplazamiento, con valor por defecto de 0
	) {

		return temaService.listarTemasPropuestosAlAsesor(asesorId, titulo, limit, offset);
	}


	@GetMapping("/listarTemasPropuestosPorSubAreaConocimiento")
	public List<TemaDto> listarTemasPropuestosPorSubAreaConocimiento(
			@RequestParam List<Integer> subareaIds,
			@RequestParam(name = "asesorId") Integer asesorId,
			@RequestParam(name = "titulo", required = false) String titulo,
			@RequestParam(value = "limit", defaultValue = "10") Integer limit,
			@RequestParam(value = "offset", defaultValue = "0") Integer offset
	) {

		return temaService.listarTemasPropuestosPorSubAreaConocimiento(subareaIds, asesorId, titulo, limit, offset);
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

	@GetMapping("/listarPropuestasPorTesista/{tesistaId}")
	public List<TemaDto> listarPropuestasPorTesista(@PathVariable("tesistaId") Integer tesistaId) {
		return temaService.listarPropuestasPorTesista(tesistaId);
	}

	@GetMapping("/listarTemasCicloActualXEtapaFormativa/{etapaFormativaId}")
	public List<TemaConAsesorJuradoDTO>listarTemasCicloActualXEtapaFormativa(@PathVariable("etapaFormativaId") Integer etapaFormativaId) {
		return temaService.listarTemasCicloActualXEtapaFormativa(etapaFormativaId);
	}

	@GetMapping("/listarPostulacionesDirectasAMisPropuestas/{tesistaId}")
	public List<TemaDto> listarPostulacionesDirectasAMisPropuestas(@PathVariable("tesistaId") Integer tesistaId) {
		return temaService.listarPostulacionesDirectasAMisPropuestas(tesistaId);
	}



	@GetMapping("/listarTemasAsesorInvolucrado/{asesorId}")
	public List<InfoTemaPerfilDto> listarTemasAsesorInvolucrado(@PathVariable("asesorId") Integer asesorId) {
		return temaService.listarTemasAsesorInvolucrado(asesorId);
	}
	@GetMapping("/listarPostulacionesGeneralesAMisPropuestas/{tesistaId}")
	public List<TemaDto> listarPostulacionesGeneralesAMisPropuestas(@PathVariable("tesistaId") Integer tesistaId) {
		return temaService.listarPostulacionesGeneralesAMisPropuestas(tesistaId);
	}
}



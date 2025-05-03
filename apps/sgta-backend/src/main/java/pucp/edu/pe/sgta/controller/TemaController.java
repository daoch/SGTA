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

    @PostMapping("/createPropuesta")
    public void createTema(@RequestBody TemaDto dto,
                           @RequestParam(name = "idUsuarioCreador") Integer idUsuarioCreador) {
        temaService.createTemaPropuesta(dto, idUsuarioCreador);
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
}

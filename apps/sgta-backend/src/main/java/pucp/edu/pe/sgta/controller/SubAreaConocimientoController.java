package pucp.edu.pe.sgta.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.SubAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.asesores.InfoSubAreaConocimientoDto;
import pucp.edu.pe.sgta.service.inter.SubAreaConocimientoService;

import java.util.List;

@RestController
@RequestMapping("/subAreaConocimiento")
public class SubAreaConocimientoController {

	@Autowired
	SubAreaConocimientoService subAreaConocimientoService;

    @GetMapping("/listarPorNombre")
    public List<InfoSubAreaConocimientoDto> listarInfoPorNombre(@RequestParam(name = "nombre") String nombre) {
        return subAreaConocimientoService.listarInfoPorNombre(nombre);
    }

    @PostMapping("/create")
	public SubAreaConocimientoDto createSubAreaConocimiento(@RequestBody SubAreaConocimientoDto dto) {
		return subAreaConocimientoService.create(dto);
	}

    @GetMapping("/list")
    public List<SubAreaConocimientoDto> listSubAreaConocimiento() {
        return subAreaConocimientoService.getAll();
    }

    @PostMapping("/delete/{id}")
    public void deleteSubAreaConocimiento(@PathVariable Integer id) {
        subAreaConocimientoService.delete(id);
    }

    //listar por area
    @GetMapping("/list/{idArea}")
    public List<SubAreaConocimientoDto> listSubAreaConocimientoByArea(@PathVariable Integer idArea) {
        return subAreaConocimientoService.getAllByArea(idArea);
    }

    @GetMapping("/findById") // finds a topic by id
    public SubAreaConocimientoDto findById(@RequestParam(name = "idSubArea") Integer idSubArea) {
        return subAreaConocimientoService.findById(idSubArea);
    }

    @GetMapping("/listarPorUsuario") // finds a topic by id
    public List<SubAreaConocimientoDto> listarPorUsuario(@RequestParam(name = "usuarioId") Integer usuarioId) {
        return subAreaConocimientoService.listarPorUsuario(usuarioId);
    }

    @GetMapping("/listarTodasParaPerfilAsesor") // finds a topic by id
    public List<InfoSubAreaConocimientoDto> listarPorCarrerasUsuarioParaPerfil(@RequestParam(name = "usuarioId") Integer usuarioId) {
        return subAreaConocimientoService.listarPorCarrerasUsuarioParaPerfil(usuarioId);
    }

}

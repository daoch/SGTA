package pucp.edu.pe.sgta.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pucp.edu.pe.sgta.dto.AreaConocimientoDto;
import pucp.edu.pe.sgta.dto.asesores.InfoAreaConocimientoDto;
import pucp.edu.pe.sgta.service.inter.AreaConocimientoService;
import pucp.edu.pe.sgta.service.inter.JwtService;

import java.util.List;

@RestController
@RequestMapping("/areaConocimiento")
public class AreaConocimientoController {

    @Autowired
    AreaConocimientoService areaConocimientoService;

    @Autowired
    JwtService jwtService;

	@PostMapping("/create")
	public AreaConocimientoDto createAreaConocimiento(@RequestBody AreaConocimientoDto dto) {
        return areaConocimientoService.create(dto);
    }

    @GetMapping("/list")
    public List<AreaConocimientoDto> listAreaConocimiento() {
        return areaConocimientoService.getAll();
    }

    @PostMapping("/delete/{id}")
    public void deleteAreaConocimiento(@PathVariable Integer id) {
        areaConocimientoService.delete(id);
    }

    // list areas por carrera
    @GetMapping("/list/{idCarrera}")
    public List<AreaConocimientoDto> listAreaConocimientoByCarrera(@PathVariable Integer idCarrera) {
        return areaConocimientoService.getAllByCarrera(idCarrera);
    }

    @GetMapping("/listarPorNombre")
    public List<InfoAreaConocimientoDto> listarInfoPorNombre(@RequestParam(name = "nombre") String nombre) {
        return areaConocimientoService.listarInfoPorNombre(nombre);
    }

    @GetMapping("/listarPorUsuario") // finds a topic by id
    public List<AreaConocimientoDto> listarPorUsuario(@RequestParam(name = "usuarioId") Integer usuarioId) {
        return areaConocimientoService.listarPorUsuario(usuarioId);
    }

    @GetMapping("/listarTodasParaPerfilAsesor") // finds a topic by id
    public List<InfoAreaConocimientoDto> listarPorCarrerasUsuarioParaPerfil(
            @RequestParam(name = "usuarioId") Integer usuarioId) {
        return areaConocimientoService.listarPorCarrerasUsuarioParaPerfil(usuarioId);
    }

    @GetMapping("/listarPorIdExpo/{idExpo}")
    public List<AreaConocimientoDto> listarPorIdExpo(@PathVariable Integer idExpo) {
        return areaConocimientoService.getAllByIdExpo(idExpo);
    }

    @GetMapping("/listarPorTemaId/{temaId}")
    public List<AreaConocimientoDto> listarPorTemaId(@PathVariable Integer temaId) {
        return areaConocimientoService.getAllByTemaId(temaId);
    }

}

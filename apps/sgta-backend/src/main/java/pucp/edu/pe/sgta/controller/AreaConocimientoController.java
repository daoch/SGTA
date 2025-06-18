package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pucp.edu.pe.sgta.dto.AreaConocimientoDto;
import pucp.edu.pe.sgta.dto.asesores.InfoAreaConocimientoDto;
import pucp.edu.pe.sgta.service.inter.AreaConocimientoService;
import pucp.edu.pe.sgta.service.inter.JwtService;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController

@RequestMapping("/areaConocimiento")
public class AreaConocimientoController {

    @Autowired
    AreaConocimientoService areaConocimientoService;

    @Autowired
    private JwtService jwtService;


    @PostMapping("/create")
    public AreaConocimientoDto createAreaConocimiento(@RequestBody AreaConocimientoDto dto, 
                                                      HttpServletRequest request) {
        String idCognito = jwtService.extractSubFromRequest(request);
        return areaConocimientoService.create(dto, idCognito);
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
    @GetMapping("/listCarrera")
    public List<AreaConocimientoDto> listAreaConocimientoByCarrera(HttpServletRequest request) {
        String idCognito = jwtService.extractSubFromRequest(request);
        return areaConocimientoService.getAllByCarrera(idCognito);
    }

    @GetMapping("/listarPorNombre")
    public List<InfoAreaConocimientoDto> listarInfoPorNombre(@RequestParam(name = "nombre") String nombre) {
        return areaConocimientoService.listarInfoPorNombre(nombre);
    }

    @GetMapping("/listarPorUsuario") // finds a topic by id
    public List<AreaConocimientoDto> listarPorUsuario(@RequestParam(name = "usuarioId") Integer usuarioId) {
        return areaConocimientoService.listarPorUsuario(usuarioId);
    }

    //For students, advisors, coordinators and reviewers
    @GetMapping("/listarPorUsuarioSub") // finds a topic by id
    public List<AreaConocimientoDto> listarPorUsuarioCognito(HttpServletRequest request) {
        try{
            String sub = jwtService.extractSubFromRequest(request);
            return areaConocimientoService.listarPorUsuarioSub(sub);
        }catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }

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

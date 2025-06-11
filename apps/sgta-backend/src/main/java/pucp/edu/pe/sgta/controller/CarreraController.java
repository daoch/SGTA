package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.CarreraDto;
import pucp.edu.pe.sgta.service.inter.CarreraService;
import pucp.edu.pe.sgta.service.inter.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/carrera")
public class CarreraController {

    @Autowired
    private CarreraService carreraService;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/listar")
    public List<CarreraDto> listCarreras() {
        return carreraService.getAll();
    }

    @GetMapping("/list-active")
    public List<CarreraDto> listActiveCarreras() {
        return carreraService.getAllActive();
    }

    @GetMapping("/list-by-usuario")
    public List<CarreraDto> listCarrerasByUsuario(@RequestParam(name = "usuarioId") Integer usuarioId) {
        return carreraService.getCarrerasByUsuario(usuarioId);
    }

    @GetMapping("/get/{id}")
    public CarreraDto getCarreraById(@PathVariable Integer id) {
        return carreraService.findById(id);
    }

    @GetMapping("/get-coordinador")
    public CarreraDto getCarreraCoordinador(HttpServletRequest request) {
        String idCognito = jwtService.extractSubFromRequest(request);
        return carreraService.getCarreraCoordinador(idCognito);
    }

    @GetMapping("/coordinada-por-usuario/{usuarioId}")
    public CarreraDto getCarreraCoordinadaPorUsuario(@PathVariable Integer usuarioId) {
        return carreraService.getCarreraCoordinadaPorUsuario(usuarioId);
    }

} 
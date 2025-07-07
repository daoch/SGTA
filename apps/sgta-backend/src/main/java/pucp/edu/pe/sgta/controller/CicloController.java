package pucp.edu.pe.sgta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import pucp.edu.pe.sgta.dto.CicloConEtapasDTO;
import pucp.edu.pe.sgta.dto.CicloDto;
import pucp.edu.pe.sgta.model.Ciclo;
import pucp.edu.pe.sgta.service.inter.CicloService;
import pucp.edu.pe.sgta.service.inter.JwtService;

@RestController
@RequestMapping("/ciclos")
public class CicloController {

    @Autowired
    private CicloService cicloService;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/listarCiclos")
    public List<Ciclo> listarCiclosOrdenados() {
        return cicloService.listarCiclosOrdenados();
    }

    @GetMapping("/listarCiclosConEtapas")
    public List<CicloConEtapasDTO> listarCiclosYetapasFormativas() {
        return cicloService.listarCiclosYetapasFormativas();
    }

    @GetMapping("/listarTodosLosCiclos")
    public List<CicloDto> listarTodosLosCiclos() {
        return cicloService.listarTodosLosCiclos();
    }

    @PostMapping("/create")
    public void create(HttpServletRequest request, @RequestBody CicloDto dto) {
        String idCognito = jwtService.extractSubFromRequest(request);
        this.cicloService.create(idCognito,dto);
    }

    @PutMapping("/update")
    public void update(HttpServletRequest request, @RequestBody CicloDto dto) {
        String idCognito = jwtService.extractSubFromRequest(request);
        cicloService.update(idCognito,dto);
    }

}

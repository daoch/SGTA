package pucp.edu.pe.sgta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.CicloConEtapasDTO;
import pucp.edu.pe.sgta.dto.CicloDto;
import pucp.edu.pe.sgta.model.Ciclo;
import pucp.edu.pe.sgta.service.inter.CicloService;

@RestController
@RequestMapping("/ciclos")
public class CicloController {

    @Autowired
    private CicloService cicloService;

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
    public void create(@RequestBody CicloDto dto) {
        this.cicloService.create(dto);
    }

    @PutMapping("/update")
    public void update(@RequestBody CicloDto dto) {
        cicloService.update(dto);
    }

}

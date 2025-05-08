package pucp.edu.pe.sgta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pucp.edu.pe.sgta.model.Ciclo;
import pucp.edu.pe.sgta.service.inter.CicloService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/ciclos")
public class CicloController {

    @Autowired
    private CicloService cicloService;

    @GetMapping("/listarCiclosOrdenados")
    public List<Ciclo> listarCiclosOrdenados() {
        return cicloService.listarCiclosOrdenados();
    }

}

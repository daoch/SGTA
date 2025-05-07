package pucp.edu.pe.sgta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pucp.edu.pe.sgta.dto.TipoExposicionDto;
import pucp.edu.pe.sgta.service.inter.TipoExposicionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/tipoExposicion")
public class TipoExposicionController {
    @Autowired
    private TipoExposicionService tipoExposicionService;

    @GetMapping("/getAll")
    public List<TipoExposicionDto> getAll() {
        return tipoExposicionService.getAll();
    }
}

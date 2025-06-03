package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.model.TipoRechazoTema;
import pucp.edu.pe.sgta.service.inter.TipoRechazoTemaService;

import java.util.List;

@RestController

@RequestMapping("/tipoRechazoTema")
public class TipoRechazoTemaController {

    @Autowired
    TipoRechazoTemaService tipoRechazoTemaService;

    @GetMapping("/listarTodos")
    public List<TipoRechazoTema> listarTodos() {
        return tipoRechazoTemaService.listarTodos();
    }

}

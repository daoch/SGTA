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

    @GetMapping("/findByUser") //finds topics by user
    public List<TemaDto> findByUser(@RequestParam(name = "idUsuario") Integer idUsuario) {
        return temaService.findByUsuario(idUsuario);
    }

    @PostMapping("/create") //creates a topic, the idUsuario belongs to the creator
    public void createTema(@RequestBody TemaDto dto, @RequestParam(name = "idUsuario") Integer idUsuario) {
        temaService.createTema(dto, idUsuario);
    }

}

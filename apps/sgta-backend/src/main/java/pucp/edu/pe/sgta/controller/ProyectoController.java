package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.asesores.InfoProyectoDto;
import pucp.edu.pe.sgta.model.Proyecto;
import pucp.edu.pe.sgta.service.inter.ProyectoService;

import java.util.List;

@RestController

@RequestMapping("/proyectos")
public class ProyectoController {
    @Autowired
    ProyectoService proyectoService;

    @GetMapping("/listarProyectosUsuarioInvolucrado/{idUsuario}")
    public List<InfoProyectoDto> listarProyectosUsuarioInvolucrado(@PathVariable(name = "idUsuario") Integer idUsuario) {
        return proyectoService.listarProyectosUsuarioInvolucrado(idUsuario);
    }
}

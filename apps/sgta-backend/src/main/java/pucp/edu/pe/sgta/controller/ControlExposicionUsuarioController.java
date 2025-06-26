package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.service.inter.CicloService;
import pucp.edu.pe.sgta.service.inter.ControlExposicionUsuarioTemaService;

@RestController
@RequestMapping("/control-exposicion")
public class ControlExposicionUsuarioController {

    @Autowired
    private ControlExposicionUsuarioTemaService controlService;
    @CrossOrigin(origins = "*")
    @GetMapping("/aceptar-invitacion-correo")
    public void aceptarInvitacionCorreo(@RequestParam String token) {
        controlService.aceptarExposicionDesdeCorreo(token);
    }
    @CrossOrigin(origins = "*")
    @GetMapping("/rechazar-invitacion-correo")
    public void rechazarInvitacionCorreo(@RequestParam String token) {
        controlService.rechazarExposicionDesdeCorreo(token);
    }
}

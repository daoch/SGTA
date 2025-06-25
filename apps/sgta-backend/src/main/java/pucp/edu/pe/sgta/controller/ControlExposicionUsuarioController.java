package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pucp.edu.pe.sgta.service.inter.CicloService;
import pucp.edu.pe.sgta.service.inter.ControlExposicionUsuarioTemaService;

@RestController
@RequestMapping("/control-exposicion")
public class ControlExposicionUsuarioController {

    @Autowired
    private ControlExposicionUsuarioTemaService controlService;

    @GetMapping("/aceptar-invitacion-correo")
    public void aceptarInvitacionCorreo(@RequestParam String token) {
        controlService.aceptarExposicionDesdeCorreo(token);
    }

    @GetMapping("/rechazar-invitacion-correo")
    public void rechazarInvitacionCorreo(@RequestParam String token) {
        controlService.rechazarExposicionDesdeCorreo(token);
    }
}

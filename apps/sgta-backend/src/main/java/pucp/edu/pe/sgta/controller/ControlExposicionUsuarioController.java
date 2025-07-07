package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.service.inter.CicloService;
import pucp.edu.pe.sgta.service.inter.ControlExposicionUsuarioTemaService;

@Controller
@RequestMapping("/control-exposicion")
public class ControlExposicionUsuarioController {

    @Autowired
    private ControlExposicionUsuarioTemaService controlService;
    @CrossOrigin(origins = "*")
    @GetMapping("/aceptar-invitacion-correo")
    public String  aceptarInvitacionCorreo(@RequestParam String token, Model model) {
        boolean exito  = controlService.aceptarExposicionDesdeCorreo(token);

            model.addAttribute("mensaje", exito
                    ? "Tu respuesta ha sido registrada correctamente."
                    : "Hubo un problema al registrar tu respuesta.");
            return "confirmacion";



    }
    @CrossOrigin(origins = "*")
    @GetMapping("/rechazar-invitacion-correo")
    public String rechazarInvitacionCorreo(@RequestParam String token,Model model) {
        boolean exito  = controlService.rechazarExposicionDesdeCorreo(token);
        model.addAttribute("mensaje", exito
                ? "Tu respuesta ha sido registrada correctamente."
                : "Hubo un problema al registrar tu respuesta.");
        return "confirmacion";
    }
}

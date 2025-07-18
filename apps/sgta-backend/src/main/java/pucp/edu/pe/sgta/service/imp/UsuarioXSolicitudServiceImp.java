package pucp.edu.pe.sgta.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.repository.AccionSolicitudRepository;
import pucp.edu.pe.sgta.repository.RolSolicitudRepository;
import pucp.edu.pe.sgta.repository.UsuarioXSolicitudRepository;
import pucp.edu.pe.sgta.util.AccionSolicitudEnum;
import pucp.edu.pe.sgta.util.RolSolicitudEnum;

@Service
public class UsuarioXSolicitudServiceImp {

    @Autowired
    private UsuarioXSolicitudRepository usuarioXSolicitudRepository;
    @Autowired
    private AccionSolicitudRepository accionSolicitudRepository;
    @Autowired
    private RolSolicitudRepository rolSolicitudRepository;

    public UsuarioXSolicitud agregarUsuarioSolicitud(Usuario usuario, Solicitud solicitud, AccionSolicitudEnum accionEnum, RolSolicitudEnum rolEnum) {
        AccionSolicitud accion = accionSolicitudRepository.findByNombre(accionEnum.name()).orElseThrow(() -> new RuntimeException("Accion no encontrada"));
        RolSolicitud rol = rolSolicitudRepository.findByNombre(rolEnum.name()).orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        UsuarioXSolicitud usuarioXSolicitud = new UsuarioXSolicitud();
        usuarioXSolicitud.setUsuario(usuario);
        usuarioXSolicitud.setSolicitud(solicitud);
        usuarioXSolicitud.setAccionSolicitud(accion);
        usuarioXSolicitud.setRolSolicitud(rol);
        usuarioXSolicitud.setDestinatario(false);

        usuarioXSolicitud = usuarioXSolicitudRepository.save(usuarioXSolicitud);

        return usuarioXSolicitud;
    }
}

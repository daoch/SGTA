package pucp.edu.pe.sgta.event;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import pucp.edu.pe.sgta.model.ControlExposicionUsuarioTema;
import pucp.edu.pe.sgta.model.ExposicionXTema;
import pucp.edu.pe.sgta.model.UsuarioXTema;
import pucp.edu.pe.sgta.repository.ControlExposicionUsuarioTemaRepository;
import pucp.edu.pe.sgta.repository.ExposicionXTemaRepository;
import pucp.edu.pe.sgta.repository.UsuarioXTemaRepository;
import pucp.edu.pe.sgta.util.EstadoExposicion;
import pucp.edu.pe.sgta.util.EstadoExposicionUsuario;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class EstadoControlExposicionListener {

    private final UsuarioXTemaRepository usuarioXTemaRepository;

    private final ControlExposicionUsuarioTemaRepository controlExposicionUsuarioTemaRepository;

    private final ExposicionXTemaRepository exposicionXTemaRepository;

    public EstadoControlExposicionListener(UsuarioXTemaRepository usuarioXTemaRepository, ControlExposicionUsuarioTemaRepository controlExposicionUsuarioTemaRepository, ExposicionXTemaRepository exposicionXTemaRepository) {
        this.usuarioXTemaRepository = usuarioXTemaRepository;
        this.controlExposicionUsuarioTemaRepository = controlExposicionUsuarioTemaRepository;
        this.exposicionXTemaRepository = exposicionXTemaRepository;
    }

    @EventListener
    public void handleEstadoActualizado(EstadoControlExposicionActualizadoEvent event){
        Integer exposicionTemaId = event.getExposicionTemaId();
        Integer temaId = event.getTemaId();
        List<Integer> rolesValidos = List.of(1, 2, 5);

        List<UsuarioXTema> usuariosValidos = usuarioXTemaRepository.findByTemaIdAndActivoTrue(temaId).stream()
                .filter(uxt -> rolesValidos.contains(uxt.getRol().getId()))
                .toList();

        boolean todosRespondieron = usuariosValidos.stream().allMatch(uxt -> {
            Optional<ControlExposicionUsuarioTema> controlUxt =
                    controlExposicionUsuarioTemaRepository.findByExposicionXTema_IdAndUsuario_Id(exposicionTemaId, uxt.getId());
            return controlUxt.isPresent() &&
                    (controlUxt.get().getEstadoExposicion() == EstadoExposicionUsuario.ACEPTADO ||
                            controlUxt.get().getEstadoExposicion() == EstadoExposicionUsuario.RECHAZADO);
        });

        if (todosRespondieron) {
            Optional<ExposicionXTema> optionalExposicionXTema = exposicionXTemaRepository.findById(exposicionTemaId);
            if (optionalExposicionXTema.isPresent()) {
                ExposicionXTema exposicion = optionalExposicionXTema.get();
                if (exposicion.getEstadoExposicion() == EstadoExposicion.ESPERANDO_RESPUESTA) {
                    exposicion.setEstadoExposicion(EstadoExposicion.ESPERANDO_APROBACION);
                    exposicionXTemaRepository.save(exposicion);
                }
            }
        }

    }
}

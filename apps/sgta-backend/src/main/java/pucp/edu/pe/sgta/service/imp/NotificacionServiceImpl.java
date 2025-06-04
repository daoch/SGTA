package pucp.edu.pe.sgta.service.imp;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pucp.edu.pe.sgta.dto.NotificacionDto;
import pucp.edu.pe.sgta.exception.ResourceNotFoundException;
import pucp.edu.pe.sgta.model.Modulo;
import pucp.edu.pe.sgta.model.Notificacion;
import pucp.edu.pe.sgta.model.TipoNotificacion;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.repository.ModuloRepository;
import pucp.edu.pe.sgta.repository.NotificacionRepository;
import pucp.edu.pe.sgta.repository.TipoNotificacionRepository;
import pucp.edu.pe.sgta.repository.UsuarioRepository;
import pucp.edu.pe.sgta.service.inter.NotificacionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class NotificacionServiceImpl implements NotificacionService {

    private static final Logger log = LoggerFactory.getLogger(NotificacionServiceImpl.class);

    @Autowired
    private NotificacionRepository notificacionRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ModuloRepository moduloRepository; // Necesitarás este repositorio
    @Autowired
    private TipoNotificacionRepository tipoNotificacionRepository; // Necesitarás este repositorio

    @Override
    @Transactional
    public Notificacion crearNotificacionParaUsuario(
            Integer usuarioDestinatarioId,
            String moduloNombre,
            String tipoNotificacionNombre,
            String mensaje,
            String canal,
            String enlaceRedireccion) {

        log.info("Creando notificación para usuario ID: {}, módulo: {}, tipo: {}",
                usuarioDestinatarioId, moduloNombre, tipoNotificacionNombre);

        Usuario destinatario = usuarioRepository.findById(usuarioDestinatarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario destinatario no encontrado con ID: " + usuarioDestinatarioId));

        Modulo modulo = moduloRepository.findByNombre(moduloNombre)
                .orElseThrow(() -> new ResourceNotFoundException("Módulo no encontrado con nombre: " + moduloNombre));

        TipoNotificacion tipoNotificacion = tipoNotificacionRepository.findByNombre(tipoNotificacionNombre)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de Notificación no encontrado con nombre: " + tipoNotificacionNombre));

        Notificacion notificacion = new Notificacion();
        notificacion.setUsuario(destinatario);
        notificacion.setModulo(modulo);
        notificacion.setTipoNotificacion(tipoNotificacion);
        notificacion.setMensaje(mensaje);
        notificacion.setCanal(canal); // Ej: "SISTEMA" para notificaciones in-app
        notificacion.setEnlaceRedireccion(enlaceRedireccion);
        // fechaCreacion, activo, etc., se manejan por @PrePersist o defaults

        Notificacion notificacionGuardada = notificacionRepository.save(notificacion);
        log.info("Notificación guardada con ID: {}", notificacionGuardada.getId());

        // Aquí podrías añadir lógica para enviar la notificación por otros canales (email, push)
        // if ("EMAIL".equalsIgnoreCase(canal)) { /* Lógica de envío de email */ }
        // if ("PUSH".equalsIgnoreCase(canal)) { /* Lógica de envío de push notification */ }

        return notificacionGuardada;
    }

    @Override
    public Page<Notificacion> getNotificacionesParaUsuario(Integer usuarioId, Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + usuarioId));
        return notificacionRepository.findByUsuarioAndActivoTrueOrderByFechaCreacionDesc(usuario, pageable);
    }

    @Override
    public Page<Notificacion> getNotificacionesNoLeidasParaUsuario(Integer usuarioId, Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + usuarioId));
        return notificacionRepository.findByUsuarioAndFechaLecturaIsNullAndActivoTrueOrderByFechaCreacionDesc(usuario, pageable);
    }

    @Override
    public long countNotificacionesNoLeidasParaUsuario(Integer usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + usuarioId));
        return notificacionRepository.contarNoLeidasPorUsuario(usuario);
    }

    @Override
    @Transactional
    public NotificacionDto marcarNotificacionComoLeida(Integer notificacionId, String usuarioCognitoSub) { // TIPO DE RETORNO CAMBIADO
        log.info("Usuario CognitoSub {} marcando notificación ID {} como leída.", usuarioCognitoSub, notificacionId);
        Usuario usuario = usuarioRepository.findByIdCognito(usuarioCognitoSub)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con CognitoSub: " + usuarioCognitoSub));

        Notificacion notificacion = notificacionRepository.findById(notificacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Notificación no encontrada con ID: " + notificacionId));

        // Validar que la notificación pertenezca al usuario autenticado
        // ASUMO que en tu entidad Notificacion el campo es getUsuarioDestinatario()
        if (!notificacion.getUsuario().getId().equals(usuario.getId())) {
            log.warn("Usuario ID {} (CognitoSub {}) intentó marcar como leída una notificación ID {} que no le pertenece. Dueño: {}",
                    usuario.getId(), usuarioCognitoSub, notificacionId, notificacion.getUsuario().getId());
            throw new SecurityException("No tiene permiso para modificar esta notificación.");
        }

        if (notificacion.getFechaLectura() != null) {
            log.info("Notificación ID {} ya estaba marcada como leída.", notificacionId);
            return convertToDto(notificacion); // Devolver el DTO de la notificación ya leída
        }

        notificacion.setFechaLectura(OffsetDateTime.now());
        Notificacion notificacionActualizada = notificacionRepository.save(notificacion);
        log.info("Notificación ID {} marcada como leída.", notificacionId);
        return convertToDto(notificacionActualizada);
    }

    @Override
    @Transactional
    public int marcarTodasComoLeidas(Integer usuarioIdAutenticado) {
        Usuario usuario = usuarioRepository.findById(usuarioIdAutenticado)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + usuarioIdAutenticado));

        List<Notificacion> noLeidas = notificacionRepository.findByUsuarioAndFechaLecturaIsNullAndActivoTrue(usuario);
        if (noLeidas.isEmpty()) {
            log.info("No hay notificaciones no leídas para marcar para el usuario ID {}.", usuarioIdAutenticado);
            return 0;
        }

        for (Notificacion notificacion : noLeidas) {
            notificacion.setFechaLectura(OffsetDateTime.now());
        }
        notificacionRepository.saveAll(noLeidas); // Guardar todas las modificaciones en lote
        log.info("{} notificaciones marcadas como leídas para el usuario ID {}.", noLeidas.size(), usuarioIdAutenticado);
        return noLeidas.size();
    }

    @Override
    @Transactional(readOnly = true)
    public long countNotificacionesNoLeidasByUsuarioCognitoSub(String usuarioCognitoSub) {
        log.debug("Contando notificaciones no leídas para usuario CognitoSub: {}", usuarioCognitoSub);
        Usuario usuario = usuarioRepository.findByIdCognito(usuarioCognitoSub)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con CognitoSub: " + usuarioCognitoSub));

        return notificacionRepository.countByUsuarioAndFechaLecturaIsNullAndActivoTrue(usuario);
    }

    @Override
    @Transactional
    public int marcarTodasComoLeidasByUsuarioCognitoSub(String usuarioCognitoSub) {
        log.info("Usuario CognitoSub {} marcando todas sus notificaciones como leídas.", usuarioCognitoSub);
        Usuario usuario = usuarioRepository.findByIdCognito(usuarioCognitoSub)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con CognitoSub: " + usuarioCognitoSub));

        List<Notificacion> noLeidas = notificacionRepository.findByUsuarioAndFechaLecturaIsNullAndActivoTrue(usuario);

        if (noLeidas.isEmpty()) {
            log.info("No hay notificaciones no leídas para marcar para el usuario ID {}.", usuario.getId());
            return 0;
        }

        for (Notificacion notificacion : noLeidas) {
            notificacion.setFechaLectura(OffsetDateTime.now());
        }
        notificacionRepository.saveAll(noLeidas);
        log.info("{} notificaciones marcadas como leídas para el usuario ID {}.", noLeidas.size(), usuario.getId());
        return noLeidas.size();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificacionDto> findAllByUsuarioCognitoSub(String usuarioCognitoSub, Boolean soloNoLeidas, Pageable pageable) {
        log.debug("Buscando notificaciones para usuario CognitoSub: {}, soloNoLeidas: {}", usuarioCognitoSub, soloNoLeidas);
        Usuario usuario = usuarioRepository.findByIdCognito(usuarioCognitoSub)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con CognitoSub: " + usuarioCognitoSub));

        Page<Notificacion> paginaNotificaciones;
        if (Boolean.FALSE.equals(soloNoLeidas)) { // Si soloNoLeidas es false o null, obtener todas (leídas y no leídas)
            paginaNotificaciones = notificacionRepository.findByUsuarioAndActivoTrueOrderByFechaCreacionDesc(usuario, pageable);
        } else { // Si soloNoLeidas es true, obtener solo las no leídas
            paginaNotificaciones = notificacionRepository.findByUsuarioAndFechaLecturaIsNullAndActivoTrueOrderByFechaCreacionDesc(usuario, pageable);
        }

        return paginaNotificaciones.map(this::convertToDto); // Mapear Page<Notificacion> a Page<NotificacionDto>
    }

    // --- Método Helper para convertir Entidad a DTO ---
    private NotificacionDto convertToDto(Notificacion notificacion) {
        if (notificacion == null) return null;
        return new NotificacionDto(
                notificacion.getId(),
                notificacion.getMensaje(),
                notificacion.getCanal(),
                notificacion.getFechaCreacion(),
                notificacion.getFechaLectura(),
                notificacion.getActivo(),
                notificacion.getModulo() != null ? notificacion.getModulo().getNombre() : null,
                notificacion.getTipoNotificacion() != null ? notificacion.getTipoNotificacion().getNombre() : null,
                notificacion.getTipoNotificacion() != null ? notificacion.getTipoNotificacion().getPrioridad() : null,
                notificacion.getEnlaceRedireccion()
        );
    }
}
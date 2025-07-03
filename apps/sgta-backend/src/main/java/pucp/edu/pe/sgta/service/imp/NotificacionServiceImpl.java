package pucp.edu.pe.sgta.service.imp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pucp.edu.pe.sgta.dto.NotificacionDto;
import pucp.edu.pe.sgta.dto.OverdueAlertDto;
import pucp.edu.pe.sgta.exception.ResourceNotFoundException;
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.repository.*;
import pucp.edu.pe.sgta.service.inter.NotificacionService;
import pucp.edu.pe.sgta.service.inter.EmailService;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificacionServiceImpl implements NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final ModuloRepository moduloRepository;
    private final TipoNotificacionRepository tipoNotificacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final EntregableRepository entregableRepository;
    private final EntregableXTemaRepository entregableXTemaRepository;
    private final UsuarioXTemaRepository usuarioXTemaRepository;
    private final ReunionRepository reunionRepository;
    private final UsuarioXReunionRepository usuarioXReunionRepository;
    private final ConfiguracionRecordatorioRepository configRepo;
    private final EmailService emailService;

    private static final String MODULO_REPORTES = "Reportes";
    private static final String TIPO_RECORDATORIO = "recordatorio";
    private static final String TIPO_ERROR = "error";
    private static final String CANAL_UI = "UI";

    private final Object notificacionLock = new Object();
    // private static final Map<String, Boolean> cacheMensajesProcesados = new ConcurrentHashMap<>();

    @Override
    @Transactional(readOnly = true)
    public List<NotificacionDto> getUnreadNotifications(Integer usuarioId, Integer moduloId) {
        List<Notificacion> notificaciones = notificacionRepository.findUnreadByUsuarioAndModulo(usuarioId, moduloId);
        return convertirADto(notificaciones);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificacionDto> getAllUnreadNotifications(Integer usuarioId) {
        List<Notificacion> notificaciones = notificacionRepository.findAllUnreadByUsuario(usuarioId);
        return convertirADto(notificaciones);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificacionDto> getAllNotifications(Integer usuarioId, Integer moduloId) {
        List<Notificacion> notificaciones = notificacionRepository.findAllByUsuarioAndModulo(usuarioId, moduloId);
        return convertirADto(notificaciones);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificacionDto> getAllNotifications(Integer usuarioId) {
        List<Notificacion> notificaciones = notificacionRepository.findAllByUsuario(usuarioId);
        return convertirADto(notificaciones);
    }

    @Override
    @Transactional(readOnly = true)
    public int countUnreadNotifications(Integer usuarioId, Integer moduloId) {
        return notificacionRepository.countUnreadByUsuarioAndModulo(usuarioId, moduloId);
    }

    @Override
    @Transactional(readOnly = true)
    public int countAllUnreadNotifications(Integer usuarioId) {
        return notificacionRepository.countAllUnreadByUsuario(usuarioId);
    }

    @Override
    @Transactional
    public void markAsRead(Integer notificacionId, Integer usuarioId) {
        Optional<Notificacion> notificacionOpt = notificacionRepository.findById(notificacionId);
        if (notificacionOpt.isPresent()) {
            Notificacion notificacion = notificacionOpt.get();
            if (notificacion.getUsuario().getId().equals(usuarioId)) {
                notificacion.setFechaLectura(OffsetDateTime.now());
                notificacionRepository.save(notificacion);
                log.info("Notificación {} marcada como leída por usuario {}", notificacionId, usuarioId);
            } else {
                log.warn("Usuario {} intentó marcar como leída una notificación que no le pertenece: {}", 
                        usuarioId, notificacionId);
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public OverdueAlertDto getOverdueSummary(Integer usuarioId) {
        OffsetDateTime ahora = OffsetDateTime.now();
        List<EntregableXTema> entregablesVencidos = entregableXTemaRepository.findNoEnviadosVencidos(ahora);
        
        // Filtrar solo los entregables del usuario actual
        List<EntregableXTema> entregablesUsuario = entregablesVencidos.stream()
                .filter(ext -> {
                    List<UsuarioXTema> usuariosDelTema = usuarioXTemaRepository.findByTemaIdAndActivoTrue(ext.getTema().getId());
                    return usuariosDelTema.stream()
                            .anyMatch(ut -> ut.getUsuario().getId().equals(usuarioId) && 
                                          ut.getRol().getNombre().equals("Tesista"));
                })
                .toList();

        List<String> mensajes = new ArrayList<>();
        List<OverdueAlertDto.EntregableVencidoDto> entregablesVencidosDto = new ArrayList<>();

        for (EntregableXTema ext : entregablesUsuario) {
            Entregable entregable = ext.getEntregable();
            long diasAtraso = ChronoUnit.DAYS.between(entregable.getFechaFin(), ahora);
            
            String fechaFormateada = entregable.getFechaFin().format(
                    DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            
            entregablesVencidosDto.add(new OverdueAlertDto.EntregableVencidoDto(
                    entregable.getId(),
                    entregable.getNombre(),
                    fechaFormateada,
                    (int) diasAtraso,
                    ext.getTema().getTitulo(),
                    ext.getTema().getId()
            ));
        }

        if (!entregablesUsuario.isEmpty()) {
            StringBuilder sb = new StringBuilder();
            sb.append("Tienes ")
              .append(entregablesUsuario.size())
              .append(entregablesUsuario.size() == 1 ? " entrega con retraso: " : " entregas con retraso: ");
            
            for (int i = 0; i < Math.min(3, entregablesUsuario.size()); i++) {
                EntregableXTema ext = entregablesUsuario.get(i);
                long diasAtraso = ChronoUnit.DAYS.between(ext.getEntregable().getFechaFin(), ahora);
                sb.append("\"")
                  .append(ext.getEntregable().getNombre())
                  .append("\" (")
                  .append(diasAtraso)
                  .append(" días)");
                if (i < Math.min(3, entregablesUsuario.size()) - 1) {
                    sb.append(", ");
                }
            }
            if (entregablesUsuario.size() > 3) {
                sb.append(", … y ").append(entregablesUsuario.size() - 3).append(" más.");
            } else {
                sb.append(".");
            }
            mensajes.add(sb.toString());
        }

        return new OverdueAlertDto(entregablesUsuario.size(), mensajes, entregablesVencidosDto);
    }

    @Override
    @Transactional
    public void crearNotificacionRecordatorio(Integer usuarioId, String nombreEntregable, 
                                             String fechaVencimiento, int diasRestantes) {
        String mensaje = String.format("En %d %s vence tu entregable \"%s\" (fecha: %s).",
                diasRestantes,
                diasRestantes == 1 ? "día" : "días",
                nombreEntregable,
                fechaVencimiento);
        
        crearNotificacion(usuarioId, TIPO_RECORDATORIO, mensaje, CANAL_UI);
    }

    @Override
    @Transactional
    public void crearNotificacionError(Integer usuarioId, String nombreEntregable, 
                                     String fechaVencimiento, int diasAtraso) {
        String mensaje = String.format("Tu entregable \"%s\" debió presentarse el %s (%d %s de retraso).",
                nombreEntregable,
                fechaVencimiento,
                diasAtraso,
                diasAtraso == 1 ? "día" : "días");
        
        crearNotificacion(usuarioId, TIPO_ERROR, mensaje, CANAL_UI);
    }
    
    @Override
    @Transactional
    public void generarRecordatoriosAutomaticos() {
        log.info("Iniciando generación de recordatorios automáticos con configuración personalizada");
        OffsetDateTime ahora = OffsetDateTime.now().truncatedTo(ChronoUnit.DAYS);

        // Buscar todos los entregables próximos a vencer (en los próximos 8 días)
        List<Entregable> entregables = entregableRepository.findByFechaFinBetween(
            ahora, ahora.plusDays(8)
        );
        log.info("Encontrados {} entregables próximos a vencer", entregables.size());

        int notificacionesCreadas = 0;

        for (Entregable entregable : entregables) {
            // Buscar todos los EntregableXTema no enviados para este entregable
            List<EntregableXTema> entregablesNoEnviados = entregableXTemaRepository.findNoEnviadosByEntregableId(entregable.getId());

            for (EntregableXTema ext : entregablesNoEnviados) {
                // Obtener el usuario tesista del tema
                List<UsuarioXTema> usuariosDelTema = usuarioXTemaRepository.findByTemaIdAndActivoTrue(ext.getTema().getId());
                Optional<UsuarioXTema> tesistaOpt = usuariosDelTema.stream()
                    .filter(ut -> ut.getRol().getNombre().equals("Tesista"))
                    .findFirst();

                if (tesistaOpt.isPresent()) {
                    Integer usuarioId = tesistaOpt.get().getUsuario().getId();

                    // Obtener configuración de recordatorio del usuario
                    ConfiguracionRecordatorio config = configRepo.findByUsuarioId(usuarioId)
                        .orElseGet(() -> getDefaultConfig(usuarioId));

                    if (Boolean.FALSE.equals(config.getActivo())) {
                        log.debug("Usuario {} tiene recordatorios desactivados, saltando", usuarioId);
                        continue;
                    }

                    // Calcular días de anticipación
                    long diasRestantes = ChronoUnit.DAYS.between(ahora, entregable.getFechaFin().truncatedTo(ChronoUnit.DAYS));
                    
                    // Verificar si debe notificarse en este día específico
                    if (Arrays.asList(config.getDiasAnticipacion()).contains((int) diasRestantes)) {
                        // Verificar si ya existe una notificación de recordatorio hoy para este usuario y entregable
                        if (!yaExisteNotificacionRecordatorioHoy(usuarioId, entregable.getId())) {
                            String fechaFormateada = entregable.getFechaFin().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                            String mensaje = String.format("En %d %s vence tu entregable \"%s\" (fecha: %s).",
                                diasRestantes,
                                diasRestantes == 1 ? "día" : "días",
                                entregable.getNombre(),
                                fechaFormateada
                            );

                            // Enviar notificación por los canales elegidos
                            if (Boolean.TRUE.equals(config.getCanalSistema())) {
                                crearNotificacion(usuarioId, TIPO_RECORDATORIO, mensaje, CANAL_UI);
                                notificacionesCreadas++;
                                log.debug("Recordatorio creado para usuario {} - entregable {} ({} días)", 
                                        usuarioId, entregable.getNombre(), diasRestantes);
                            }
                            
                            // Enviar por correo si está configurado
                            if (Boolean.TRUE.equals(config.getCanalCorreo())) {
                                try {
                                    Usuario usuario = tesistaOpt.get().getUsuario();
                                    String nombreCompleto = usuario.getNombreDisplay();
                                    String correoElectronico = usuario.getCorreoElectronico();
                                    
                                    emailService.enviarRecordatorioEntregable(
                                        correoElectronico,
                                        nombreCompleto,
                                        entregable.getNombre(),
                                        fechaFormateada,
                                        (int) diasRestantes
                                    );
                                    
                                    log.info("Recordatorio enviado por correo a {} para entregable {}", 
                                            correoElectronico, entregable.getNombre());
                                } catch (Exception e) {
                                    log.error("Error al enviar recordatorio por correo para usuario {}: {}", 
                                            usuarioId, e.getMessage(), e);
                                }
                            }
                        } else {
                            log.debug("Ya existe recordatorio hoy para usuario {} y entregable {}", 
                                    usuarioId, entregable.getId());
                        }
                    }
                }
            }
        }
        log.info("Finalizada generación de recordatorios automáticos. {} notificaciones creadas", notificacionesCreadas);
    }

    // Método auxiliar para valores por defecto
    private ConfiguracionRecordatorio getDefaultConfig(Integer usuarioId) {
        ConfiguracionRecordatorio config = new ConfiguracionRecordatorio();
        config.setUsuario(usuarioRepository.findById(usuarioId).orElseThrow());
        config.setActivo(true);
        config.setDiasAnticipacion(new Integer[]{7, 3, 1, 0}); // 7, 3, 1 días antes y el día de vencimiento
        config.setCanalCorreo(true);
        config.setCanalSistema(true);
        return config;
    }

    @Override
    @Transactional
    public void generarAlertasVencidos() {
        log.info("Iniciando generación de alertas para entregables vencidos");
        OffsetDateTime ahora = OffsetDateTime.now();
        
        List<EntregableXTema> entregablesVencidos = entregableXTemaRepository.findNoEnviadosVencidos(ahora);
        log.info("Encontrados {} entregables vencidos sin enviar", entregablesVencidos.size());
        
        int alertasCreadas = 0;
        
        for (EntregableXTema ext : entregablesVencidos) {
            // Obtener el usuario tesista del tema
            List<UsuarioXTema> usuariosDelTema = usuarioXTemaRepository.findByTemaIdAndActivoTrue(ext.getTema().getId());
            Optional<UsuarioXTema> tesistaOpt = usuariosDelTema.stream()
                    .filter(ut -> ut.getRol().getNombre().equals("Tesista"))
                    .findFirst();
            
            if (tesistaOpt.isPresent()) {
                Integer usuarioId = tesistaOpt.get().getUsuario().getId();
                
                // Verificar si ya existe una notificación de error hoy para este usuario
                if (!yaExisteNotificacionHoy(usuarioId, TIPO_ERROR)) {
                    Entregable entregable = ext.getEntregable();
                    long diasAtraso = ChronoUnit.DAYS.between(entregable.getFechaFin(), ahora);
                    String fechaFormateada = entregable.getFechaFin().format(
                            DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                    
                    crearNotificacionError(usuarioId, entregable.getNombre(), 
                                         fechaFormateada, (int) diasAtraso);
                    
                    // Enviar alerta por correo si el usuario tiene configurado el canal de correo
                    try {
                        ConfiguracionRecordatorio config = configRepo.findByUsuarioId(usuarioId)
                            .orElseGet(() -> getDefaultConfig(usuarioId));
                        
                        if (Boolean.TRUE.equals(config.getCanalCorreo())) {
                            Usuario usuario = tesistaOpt.get().getUsuario();
                            String nombreCompleto = usuario.getNombreDisplay();
                            String correoElectronico = usuario.getCorreoElectronico();
                            
                            emailService.enviarAlertaEntregableVencido(
                                correoElectronico,
                                nombreCompleto,
                                entregable.getNombre(),
                                fechaFormateada,
                                (int) diasAtraso
                            );
                            
                            log.info("Alerta de vencimiento enviada por correo a {} para entregable {}", 
                                    correoElectronico, entregable.getNombre());
                        }
                    } catch (Exception e) {
                        log.error("Error al enviar alerta por correo para usuario {}: {}", 
                                usuarioId, e.getMessage(), e);
                    }
                    
                    alertasCreadas++;
                    log.info("Alerta de vencimiento creada para usuario {} - entregable {} ({} días de atraso)", 
                            usuarioId, entregable.getNombre(), diasAtraso);
                }
            }
        }
        log.info("Finalizada generación de alertas para entregables vencidos. {} alertas creadas", alertasCreadas);
    }

    /**
     * Método principal unificado para crear notificaciones
     */
    private void crearNotificacion(Integer usuarioId, String tipoNotificacion, String mensaje, String canal) {
        try {
            Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);
            Optional<Modulo> moduloOpt = moduloRepository.findByNombre(MODULO_REPORTES);
            Optional<TipoNotificacion> tipoOpt = tipoNotificacionRepository.findByNombre(tipoNotificacion);
            
            if (usuarioOpt.isPresent() && moduloOpt.isPresent() && tipoOpt.isPresent()) {
                Notificacion notificacion = new Notificacion();
                notificacion.setUsuario(usuarioOpt.get());
                notificacion.setModulo(moduloOpt.get());
                notificacion.setTipoNotificacion(tipoOpt.get());
                notificacion.setMensaje(mensaje);
                notificacion.setCanal(canal);
                notificacion.setActivo(true);
                
                notificacionRepository.save(notificacion);
                log.debug("Notificación creada: {} para usuario {}", mensaje, usuarioId);
            } else {
                log.error("No se pudo crear la notificación. Usuario: {}, Módulo: {}, Tipo: {}", 
                         usuarioOpt.isPresent(), moduloOpt.isPresent(), tipoOpt.isPresent());
            }
        } catch (Exception e) {
            log.error("Error al crear notificación para usuario {}: {}", usuarioId, e.getMessage(), e);
        }
    }

    private boolean yaExisteNotificacionHoy(Integer usuarioId, String tipoNotificacion) {
        try {
            Optional<Modulo> moduloOpt = moduloRepository.findByNombre(MODULO_REPORTES);
            Optional<TipoNotificacion> tipoOpt = tipoNotificacionRepository.findByNombre(tipoNotificacion);
            
            if (moduloOpt.isPresent() && tipoOpt.isPresent()) {
                return notificacionRepository.existsByUsuarioModuloTipoFecha(
                        usuarioId,
                        moduloOpt.get().getId(),
                        tipoOpt.get().getId(),
                        OffsetDateTime.now()
                );
            }
        } catch (Exception e) {
            log.error("Error al verificar existencia de notificación: {}", e.getMessage(), e);
        }
        return false;
    }

    /**
     * Verificación específica para recordatorios por entregable para evitar spam
     */
    private boolean yaExisteNotificacionRecordatorioHoy(Integer usuarioId, Integer entregableId) {
        try {
            Optional<Modulo> moduloOpt = moduloRepository.findByNombre(MODULO_REPORTES);
            Optional<TipoNotificacion> tipoOpt = tipoNotificacionRepository.findByNombre(TIPO_RECORDATORIO);
            
            if (moduloOpt.isPresent() && tipoOpt.isPresent()) {
                // Buscar notificaciones del usuario hoy que contengan el nombre del entregable
                OffsetDateTime hoy = OffsetDateTime.now().truncatedTo(ChronoUnit.DAYS);
                OffsetDateTime finDelDia = hoy.plusDays(1).minusSeconds(1);
                
                List<Notificacion> notificacionesHoy = notificacionRepository.findByUsuarioAndTipoAndFechaBetween(
                        usuarioId, tipoOpt.get().getId(), hoy, finDelDia);
                
                // Verificar si alguna es para este entregable específico
                Optional<Entregable> entregableOpt = entregableRepository.findById(entregableId);
                if (entregableOpt.isPresent()) {
                    String nombreEntregable = entregableOpt.get().getNombre();
                    return notificacionesHoy.stream()
                            .anyMatch(n -> n.getMensaje().contains("\"" + nombreEntregable + "\""));
                }
            }
        } catch (Exception e) {
            log.error("Error al verificar existencia de recordatorio: {}", e.getMessage(), e);
        }
        return false;
    }

    private List<NotificacionDto> convertirADto(List<Notificacion> notificaciones) {
        List<NotificacionDto> dtos = new ArrayList<>();
        for (Notificacion n : notificaciones) {
            NotificacionDto dto = new NotificacionDto();
            dto.setNotificacionId(n.getId());
            dto.setMensaje(n.getMensaje());
            dto.setCanal(n.getCanal());
            dto.setFechaCreacion(n.getFechaCreacion());
            dto.setFechaLectura(n.getFechaLectura());
            dto.setActivo(n.getActivo());
            dto.setTipoNotificacion(n.getTipoNotificacion().getNombre());
            dto.setPrioridad(n.getTipoNotificacion().getPrioridad());
            dto.setModulo(n.getModulo().getNombre());
            dto.setUsuarioId(n.getUsuario().getId());
            dto.setNombreUsuario(n.getUsuario().getNombreDisplay());
            dtos.add(dto);
        }
        return dtos;
    }

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
        // fechaCreacion, activo, etc., se manejan por @PrePersist o defaults

        Notificacion notificacionGuardada = notificacionRepository.save(notificacion);
        log.info("Notificación guardada con ID: {}", notificacionGuardada.getId());

        return notificacionGuardada;
    }

    private boolean yaExisteNotificacionEventoHoy(Integer usuarioId, String tipoNotificacion, String tituloEvento,
                                                String fechaInicio, String horaFin, int minutosRestantes) {
        try {
            Optional<Modulo> moduloOpt = moduloRepository.findByNombre("Gestion");
            Optional<TipoNotificacion> tipoOpt = tipoNotificacionRepository.findByNombre(tipoNotificacion);
            
            if (moduloOpt.isPresent() && tipoOpt.isPresent()) {
                OffsetDateTime ahoraLima = OffsetDateTime.now(ZoneId.of("America/Lima"));

                String encabezado = "";
                if (minutosRestantes >= 1440) {
                    encabezado = "Dentro de 1 día:";
                } else if (minutosRestantes >= 30) {
                    encabezado = "Próximo evento en 30 minutos:";
                } else if (minutosRestantes >= 5){
                    encabezado = "Próximo evento en 5 minutos:";
                }

                String mensaje = String.format(
                    "%s\nReunión: %s\n%s - %s",
                    encabezado,
                    tituloEvento,
                    fechaInicio,
                    horaFin
                );

                // que espere un segundo
                Thread.sleep(1000);
                log.info("Verificando existencia de notificación de evento: {} para usuario {}", mensaje, usuarioId);
                log.info("Resultado de verificación: {}", notificacionRepository.existsByUsuarioModuloEventoTipoFecha(usuarioId,moduloOpt.get().getId(),tipoOpt.get().getId(),mensaje));

                return notificacionRepository.existsByUsuarioModuloEventoTipoFecha(
                        usuarioId,
                        moduloOpt.get().getId(),
                        tipoOpt.get().getId(),
                        mensaje
                );
            }
        } catch (Exception e) {
            log.error("Error al verificar existencia de notificación de evento: {}", e.getMessage(), e);
        }
        return false;
    }

    private void crearNotificacionEvento(Integer usuarioId, String tipoNotificacion, String mensaje) {
        try {
            Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);
            Optional<Modulo> moduloOpt = moduloRepository.findByNombre("Gestion");
            Optional<TipoNotificacion> tipoOpt = tipoNotificacionRepository.findByNombre(tipoNotificacion);

            // String claveUnica = usuarioId + "-" + tipoNotificacion + "-" + mensaje;
            // if (cacheMensajesProcesados.putIfAbsent(claveUnica, true) != null) {
            //     log.warn("Mensaje ya en proceso: {}", claveUnica);
            //     return; // ya alguien más lo está procesando
            // }
            
            if (usuarioOpt.isPresent() && moduloOpt.isPresent() && tipoOpt.isPresent()) {
                //Doble verificación justo antes de guardar
                boolean yaExiste = notificacionRepository.existsByUsuarioModuloEventoTipoFecha(
                    usuarioId,
                    moduloOpt.get().getId(),
                    tipoOpt.get().getId(),
                    mensaje
                );

                if (yaExiste) {
                    log.info("Notificación ya existente para usuario {}. No se crea duplicado.", usuarioId);
                    return;
                }
                
                Notificacion notificacion = new Notificacion();
                notificacion.setUsuario(usuarioOpt.get());
                notificacion.setModulo(moduloOpt.get());
                notificacion.setTipoNotificacion(tipoOpt.get());
                notificacion.setMensaje(mensaje);
                notificacion.setCanal(CANAL_UI);
                notificacion.setActivo(true);
                
                notificacionRepository.save(notificacion);
                // cacheMensajesProcesados.remove(claveUnica);
                log.info("Notificación de evento creada: {} para usuario {}", mensaje, usuarioId);
            } else {
                // cacheMensajesProcesados.remove(claveUnica);
                log.error("No se pudo crear la notificación de evento. Usuario: {}, Módulo: {}, Tipo: {}", 
                         usuarioOpt.isPresent(), moduloOpt.isPresent(), tipoOpt.isPresent());
            }
        } catch (Exception e) {
            log.error("Error al crear notificación de evento para usuario {}: {}", usuarioId, e.getMessage(), e);
        }
    }

    @Transactional
    public void crearNotificacionRecordatorioEvento(Integer usuarioId, String tituloEvento,
                                                    String fechaInicio, String horaFin, int minutosRestantes) {
        String encabezado = "";
        if (minutosRestantes >= 1440) {
            encabezado = "Dentro de 1 día:";
        } else if (minutosRestantes >= 30) {
            encabezado = "Próximo evento en 30 minutos:";
        } else if(minutosRestantes >= 5){
            encabezado = "Próximo evento en 5 minutos:";
        }

        String mensaje = String.format(
            "%s\nReunión: %s\n%s - %s",
            encabezado,
            tituloEvento,
            fechaInicio,
            horaFin
        );

        crearNotificacionEvento(usuarioId, TIPO_RECORDATORIO, mensaje);
    }


    @Transactional
    public void generarRecordatoriosAutomaticosEventos() {
        log.info("Iniciando generación de recordatorios automáticos de eventos");
        ZoneId zonaLima = ZoneId.of("America/Lima");
        OffsetDateTime ahoraLima = OffsetDateTime.now(ZoneId.of("America/Lima"));
        
        // Recordatorios para 1 día, 30 minutos y 5 minutos antes
        int[] minutosAntes = {1440, 30, 5};
        
        for (int min : minutosAntes) {
           
            OffsetDateTime inicio = ahoraLima.plusMinutes(min - 2);
            OffsetDateTime fin = ahoraLima.plusMinutes(min + 2);

            
            List<Reunion> reuniones = reunionRepository.findByActivoTrueOrderByFechaHoraInicioDesc();
            log.info("Encontrados {} eventos", reuniones.size());
            
            for (Reunion reunion : reuniones) {
                List<UsuarioXReunion> usuarioXreunion = usuarioXReunionRepository.findByReunionIdAndActivoTrue(reunion.getId());

                for (UsuarioXReunion uxr : usuarioXreunion) {
                    Integer usuarioId = uxr.getUsuario().getId();
                    OffsetDateTime fechaHoraInicio = reunion.getFechaHoraInicio().atZoneSameInstant(zonaLima).toOffsetDateTime();
                    String fechaInicioFormateada = fechaHoraInicio.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
                    OffsetDateTime fechaHoraFin = reunion.getFechaHoraFin().atZoneSameInstant(zonaLima).toOffsetDateTime();
                    String fechaFinFormateada = fechaHoraFin.format(DateTimeFormatter.ofPattern("HH:mm"));

                    synchronized (notificacionLock) {
                        if(!yaExisteNotificacionEventoHoy(usuarioId, TIPO_RECORDATORIO, reunion.getTitulo(), fechaInicioFormateada, fechaFinFormateada, min)) {
                                                
                            if (fechaHoraInicio.isAfter(inicio) && fechaHoraInicio.isBefore(fin)) {
                                crearNotificacionRecordatorioEvento(usuarioId, reunion.getTitulo(), fechaInicioFormateada, fechaFinFormateada, min);
                                
                            }
                        }
                    }
                    
                }
            }
        }
        log.info("Finalizada generación de recordatorios automáticos de eventos");
    }
}
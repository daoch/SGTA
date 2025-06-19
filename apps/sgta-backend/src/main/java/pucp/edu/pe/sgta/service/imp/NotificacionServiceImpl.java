package pucp.edu.pe.sgta.service.imp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pucp.edu.pe.sgta.dto.NotificacionDto;
import pucp.edu.pe.sgta.dto.OverdueAlertDto;
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.repository.*;
import pucp.edu.pe.sgta.service.inter.NotificacionService;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

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
    private final ConfiguracionRecordatorioRepository configRepo;

    private static final String MODULO_REPORTES = "Reportes";
    private static final String TIPO_RECORDATORIO = "recordatorio";
    private static final String TIPO_ERROR = "error";
    private static final String CANAL_UI = "UI";

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
        
        crearNotificacion(usuarioId, TIPO_RECORDATORIO, mensaje);
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
        
        crearNotificacion(usuarioId, TIPO_ERROR, mensaje);
    }
    
    //Generar recordatorios automáticos
    @Override
    @Transactional
    public void generarRecordatoriosAutomaticos() {
        OffsetDateTime ahora = OffsetDateTime.now().truncatedTo(ChronoUnit.DAYS);

        // 1. Buscar todos los entregables próximos a vencer (por ejemplo, en los próximos 8 días)
        List<Entregable> entregables = entregableRepository.findByFechaFinBetween(
            ahora, ahora.plusDays(8)
        );

        for (Entregable entregable : entregables) {
            // 2. Buscar todos los EntregableXTema no enviados para este entregable
            List<EntregableXTema> entregablesNoEnviados = entregableXTemaRepository.findNoEnviadosByEntregableId(entregable.getId());

            for (EntregableXTema ext : entregablesNoEnviados) {
                // 3. Obtener el usuario tesista del tema
                List<UsuarioXTema> usuariosDelTema = usuarioXTemaRepository.findByTemaIdAndActivoTrue(ext.getTema().getId());
                Optional<UsuarioXTema> tesistaOpt = usuariosDelTema.stream()
                    .filter(ut -> ut.getRol().getNombre().equals("Tesista"))
                    .findFirst();

                if (tesistaOpt.isPresent()) {
                    Integer usuarioId = tesistaOpt.get().getUsuario().getId();

                    // 4. Obtener configuración de recordatorio del usuario
                    ConfiguracionRecordatorio config = configRepo.findByUsuarioId(usuarioId)
                        .orElseGet(() -> getDefaultConfig(usuarioId)); // Usa valores por defecto si no hay

                    if (Boolean.FALSE.equals(config.getActivo())) continue; // Si está desactivado, saltar

                    // 5. Calcular días de anticipación
                    long diasRestantes = ChronoUnit.DAYS.between(ahora, entregable.getFechaFin().truncatedTo(ChronoUnit.DAYS));
                    if (Arrays.asList(config.getDiasAnticipacion()).contains((int) diasRestantes)) {
                        // 6. Enviar notificación por los canales elegidos
                        String fechaFormateada = entregable.getFechaFin().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                        String mensaje = String.format("En %d %s vence tu entregable \"%s\" (fecha: %s).",
                            diasRestantes,
                            diasRestantes == 1 ? "día" : "días",
                            entregable.getNombre(),
                            fechaFormateada
                        );

                        if (Boolean.TRUE.equals(config.getCanalSistema())) {
                            crearNotificacion(usuarioId, mensaje, "UI");
                        }
                        /*if (Boolean.TRUE.equals(config.getCanalCorreo())) {
                            enviarCorreo(usuarioId, mensaje);
                        }*/
                    }
                }
            }
        }
    }

    // Método auxiliar para valores por defecto
    private ConfiguracionRecordatorio getDefaultConfig(Integer usuarioId) {
        ConfiguracionRecordatorio config = new ConfiguracionRecordatorio();
        config.setUsuario(usuarioRepository.findById(usuarioId).orElseThrow());
        config.setActivo(true);
        config.setDiasAnticipacion(new Integer[]{7, 3, 1, 0});
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
                    log.info("Alerta de vencimiento creada para usuario {} - entregable {} ({} días de atraso)", 
                            usuarioId, entregable.getNombre(), diasAtraso);
                }
            }
        }
        log.info("Finalizada generación de alertas para entregables vencidos");
    }

    private void crearNotificacion(Integer usuarioId, String tipoNotificacion, String mensaje) {
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
                notificacion.setCanal(CANAL_UI);
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
} 
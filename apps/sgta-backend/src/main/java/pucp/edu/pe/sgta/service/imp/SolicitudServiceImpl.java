package pucp.edu.pe.sgta.service.imp;

// MERGE-NOTE: Combina imports de ambas versiones, eliminando duplicados.
import java.time.OffsetDateTime; // De local e incoming
import java.time.ZoneId; // De incoming
import java.time.format.DateTimeFormatter; // De local
import java.util.ArrayList; // De incoming (y usado en local)
import java.util.Collections; // De incoming (y usado en local)
import java.util.List; // De incoming (y usado en local)
import java.util.Optional; // Usado en local
import java.util.Base64; // De local
import java.util.stream.Collectors; // De local e incoming

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
// MERGE-NOTE: @Lazy no estaba en incoming, si no es estrictamente necesario, se puede quitar. Lo mantengo por ahora.
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page; // De local
import org.springframework.data.domain.PageRequest; // De local
import org.springframework.data.domain.Pageable; // De local
import org.springframework.data.domain.Sort; // De local
import org.springframework.security.access.AccessDeniedException; // De local
import org.springframework.security.core.userdetails.UsernameNotFoundException; // De local
import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.config.SgtaConstants; // De local
import pucp.edu.pe.sgta.dto.*; // De incoming (y local usa algunos)
import pucp.edu.pe.sgta.dto.AprobarSolicitudCambioAsesorResponseDto.AprobarCambioAsesorAsignacionDto; // De local e incoming
import pucp.edu.pe.sgta.dto.RechazoSolicitudCambioAsesorResponseDto.CambioAsignacionDto; // De local e incoming
import pucp.edu.pe.sgta.dto.AprobarSolicitudResponseDto.AprobarAsignacionDto; // De local e incoming
import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto.AsignacionDto; // De local e incoming
import pucp.edu.pe.sgta.dto.asesores.DetalleSolicitudCambioAsesorDto; // De incoming
import pucp.edu.pe.sgta.dto.asesores.SolicitudCambioAsesorResumenDto; // De incoming
import pucp.edu.pe.sgta.dto.asesores.UsuarioSolicitudCambioAsesorDto; // De incoming
import pucp.edu.pe.sgta.dto.asesores.SolicitudCeseDetalleDto; // De local
// MERGE-NOTE: SolicitudCambioAsesorDto ya está cubierto por pucp.edu.pe.sgta.dto.*, pero si hay DTOs específicos con ese nombre en subpaquetes, se mantienen.
// import pucp.edu.pe.sgta.dto.SolicitudCambioAsesorDto; // De local, ya cubierto por dto.*
import pucp.edu.pe.sgta.exception.ResourceNotFoundException; // De local
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.dto.temas.SolicitudTemaDto; // De local e incoming
import pucp.edu.pe.sgta.repository.*;
import pucp.edu.pe.sgta.service.inter.SolicitudService;
import pucp.edu.pe.sgta.service.inter.TemaService;
import pucp.edu.pe.sgta.util.*; // De incoming (puede incluir Enums usados por incoming)
import pucp.edu.pe.sgta.util.TipoUsuarioEnum; // De local


@Service
public class SolicitudServiceImpl implements SolicitudService {
    private static final Logger log = LoggerFactory.getLogger(SolicitudServiceImpl.class);

    @PersistenceContext
    private EntityManager entityManager;

    // MERGE-NOTE: Combinar todos los repositorios.
    @Autowired
    private SolicitudRepository solicitudRepository;
    @Autowired
    private UsuarioXSolicitudRepository usuarioXSolicitudRepository;
    @Autowired
    private UsuarioXTemaRepository usuarioXTemaRepository;
    @Autowired
    private SubAreaConocimientoXTemaRepository subAreaConocimientoXTemaRepository;
    @Autowired
    private EstadoTemaRepository estadoTemaRepository;
    @Autowired
    private TemaRepository temaRepository;
    @Autowired
    private UsuarioXCarreraRepository usuarioXCarreraRepository; // Ambas versiones, una con nombre 'usuarioCarreraRepository'
    @Autowired
    @Lazy // MERGE-NOTE: Mantenido de local, si no es necesario, evaluar remover.
    private TemaService temaService;
    @Autowired
    private TipoSolicitudRepository tipoSolicitudRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private EstadoSolicitudRepository estadoSolicitudRepository;
    @Autowired
    private RolSolicitudRepository rolSolicitudRepository;
    @Autowired
    private AccionSolicitudRepository accionSolicitudRepository; // De incoming
    @Autowired
    private UsuarioXRolRepository usuarioXRolRepository; // De incoming
    @Autowired
    private RolRepository rolRepository; // De local
    @Autowired
    private UsuarioSolicitudRepository usuarioSolicitudRepository;
    @Autowired
    private UsuarioXCarreraRepository usuarioCarreraRepository;


    // MERGE-NOTE: Método de la versión LOCAL. Es más completo y usa Cognito.
    // La versión de 'incoming' 'findAllSolicitudesCese(int coordinatorId, ...)' se podría considerar obsoleta
    // o mantenerse si la interfaz lo requiere o si hay usos específicos. Por ahora, se omite la de incoming.
    // Si se necesita la versión de incoming (findAllSolicitudesCese con int coordinatorId), se debe añadir aquí.
    @Override
    public SolicitudCeseDto findAllSolicitudesCeseByCoordinatorCognitoSub(String coordinatorCognitoSub,
                                                                          int page, int size, String status) {
        log.info("findAllSolicitudesCese - page: {}, size: {}, status: {} para coordinador CognitoSub: '{}'",
                page, size, status, coordinatorCognitoSub);

        Usuario coordinador = usuarioRepository.findByIdCognito(coordinatorCognitoSub)
                .orElseThrow(() -> new UsernameNotFoundException("Coordinador no encontrado con ID de Cognito: " + coordinatorCognitoSub));

        List<UsuarioXCarrera> coordinadorCarreras = usuarioXCarreraRepository.findByUsuarioIdAndActivoTrue(coordinador.getId());
        if (coordinadorCarreras.isEmpty()) {
            log.warn("Coordinador ID {} no tiene carreras activas asignadas.", coordinador.getId());
            return new SolicitudCeseDto(Collections.emptyList(), 0);
        }

        List<Integer> idsCarrerasDelCoordinador = coordinadorCarreras.stream()
                .map(uc -> uc.getCarrera().getId())
                .distinct()
                .collect(Collectors.toList());
        log.info("IDs de Carrera para el Coordinador {}: {}", coordinador.getId(), idsCarrerasDelCoordinador);

        List<String> targetStatusNames = new ArrayList<>();
        if (status != null && !status.trim().isEmpty()) {
            if ("pending".equalsIgnoreCase(status)) {
                targetStatusNames.add(SgtaConstants.ESTADO_SOLICITUD_PENDIENTE);
            } else if ("history".equalsIgnoreCase(status)) {
                targetStatusNames.add(SgtaConstants.ESTADO_SOLICITUD_APROBADA);
                targetStatusNames.add(SgtaConstants.ESTADO_SOLICITUD_RECHAZADA);
            } else if ("approved".equalsIgnoreCase(status)) {
                targetStatusNames.add(SgtaConstants.ESTADO_SOLICITUD_APROBADA);
            } else if ("rejected".equalsIgnoreCase(status)) {
                targetStatusNames.add(SgtaConstants.ESTADO_SOLICITUD_RECHAZADA);
            }
        }
        if (targetStatusNames.isEmpty() && (status == null || status.trim().isEmpty())) {
            log.info("No se especificó filtro de estado o fue inválido. Se cargarán todos los estados (o según lógica de findSinFiltroEstado).");
        }

        log.info("Buscando solicitudes de tipo: '{}' para las carreras: {} y estados: {}",
                SgtaConstants.TIPO_SOLICITUD_NOMBRE_CESE, idsCarrerasDelCoordinador, targetStatusNames);

        Pageable pageable = PageRequest.of(page, size, Sort.by("fechaCreacion").descending());

        Page<Solicitud> pageOfSolicitudes;
        if (!targetStatusNames.isEmpty()) {
            pageOfSolicitudes = solicitudRepository.findConFiltroEstado(
                    idsCarrerasDelCoordinador, SgtaConstants.TIPO_SOLICITUD_NOMBRE_CESE, targetStatusNames, pageable);
        } else {
            pageOfSolicitudes = solicitudRepository.findSinFiltroEstado(
                    idsCarrerasDelCoordinador, SgtaConstants.TIPO_SOLICITUD_NOMBRE_CESE, pageable);
        }

        log.info("Solicitudes encontradas en BD: {} (Total elementos: {})", pageOfSolicitudes.getNumberOfElements(), pageOfSolicitudes.getTotalElements());

        List<SolicitudCeseDto.RequestTermination> requestList = pageOfSolicitudes.getContent().stream().map(solicitud -> {
            Usuario asesorSolicitante = solicitud.getUsuarioCreador();

            SolicitudCeseDto.Assessor assessorDto = null;
            if (asesorSolicitante != null) {
                Integer activeProjectsCount = usuarioXTemaRepository.countByUsuarioAndRol_NombreAndActivoTrue(asesorSolicitante, SgtaConstants.ROL_NOMBRE_ASESOR);
                assessorDto = new SolicitudCeseDto.Assessor(
                        asesorSolicitante.getId(),
                        asesorSolicitante.getNombres(),
                        asesorSolicitante.getPrimerApellido(),
                        asesorSolicitante.getCorreoElectronico(),
                        activeProjectsCount != null ? activeProjectsCount : 0,
                        asesorSolicitante.getFotoPerfil()
                );
            }

            List<SolicitudCeseDto.Estudiante> studentsDto = new ArrayList<>();
            Tema temaDeSolicitud = solicitud.getTema();
            if (temaDeSolicitud != null) {
                Rol rolTesista = rolRepository.findByNombre(SgtaConstants.ROL_NOMBRE_TESISTA).orElse(null);
                if (rolTesista != null) {
                    List<UsuarioXTema> estudiantesRelacion = usuarioXTemaRepository.findByTema_IdAndRol_IdAndActivoTrue(temaDeSolicitud.getId(), rolTesista.getId());
                    studentsDto = estudiantesRelacion.stream()
                            .filter(er -> er.getUsuario() != null)
                            .map(er -> {
                                Usuario usuarioEstudiante = er.getUsuario();
                                return new SolicitudCeseDto.Estudiante(
                                        usuarioEstudiante.getId(),
                                        usuarioEstudiante.getNombres(),
                                        usuarioEstudiante.getPrimerApellido(),
                                        new SolicitudCeseDto.TemaAnidadoEnEstudiante(temaDeSolicitud.getTitulo())
                                );
                            }).collect(Collectors.toList());
                }
            }

            String estadoSolicitudStr = "unknown";
            if (solicitud.getEstadoSolicitud() != null && solicitud.getEstadoSolicitud().getNombre() != null) {
                estadoSolicitudStr = solicitud.getEstadoSolicitud().getNombre().toLowerCase();
            } else if (solicitud.getEstado() != null) {
                estadoSolicitudStr = switch (solicitud.getEstado()) {
                    case 0 -> "aprobada"; // MERGE-NOTE: Confirmar mapeo de int estado
                    case 1 -> "pendiente";
                    case 2 -> "rechazada";
                    default -> "unknown";
                };
            }

            String registerTimeString = (solicitud.getFechaCreacion() != null) ?
                    solicitud.getFechaCreacion().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : null;
            String responseTimeString = (solicitud.getFechaResolucion() != null) ?
                    solicitud.getFechaResolucion().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : null;

            SolicitudCeseDto.TemaPrincipalDto temaPrincipalDto = null;
            if (temaDeSolicitud != null) {
                temaPrincipalDto = new SolicitudCeseDto.TemaPrincipalDto(
                        temaDeSolicitud.getId(),
                        temaDeSolicitud.getTitulo()
                );
            }

            return new SolicitudCeseDto.RequestTermination(
                    solicitud.getId(),
                    registerTimeString,
                    estadoSolicitudStr,
                    solicitud.getDescripcion(),
                    solicitud.getRespuesta(),
                    responseTimeString,
                    assessorDto,
                    studentsDto,
                    temaPrincipalDto
            );
        }).collect(Collectors.toList());

        return new SolicitudCeseDto(requestList, pageOfSolicitudes.getTotalPages());
    }

    // MERGE-NOTE: Método de la versión LOCAL. Es más completo y usa Cognito.
    @Override
    @Transactional
    public void rejectSolicitudCese(Integer solicitudId, String responseText, String coordinatorCognitoSub) {
        log.info("Intentando rechazar solicitud ID: {} por coordinador Cognito Sub: {}", solicitudId, coordinatorCognitoSub);

        Usuario coordinador = usuarioRepository.findByIdCognito(coordinatorCognitoSub)
                .orElseThrow(() -> {
                    log.warn("Coordinador no encontrado con Cognito Sub: {}", coordinatorCognitoSub);
                    return new UsernameNotFoundException("Coordinador no encontrado con ID de Cognito: " + coordinatorCognitoSub);
                });

        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> {
                    log.warn("Solicitud no encontrada con ID: {}", solicitudId);
                    return new ResourceNotFoundException("Solicitud no encontrada con ID: " + solicitudId);
                });
        
        // Validar permiso de carrera (simplificado, adaptar si es necesario)
        boolean perteneceACarreraDelCoordinador = false;
        if (solicitud.getTema() != null && solicitud.getTema().getCarrera() != null) {
            Integer carreraDeLaSolicitudId = solicitud.getTema().getCarrera().getId();
            perteneceACarreraDelCoordinador = usuarioXCarreraRepository.findByUsuarioIdAndActivoTrue(coordinador.getId())
                    .stream()
                    .anyMatch(uc -> uc.getCarrera() != null && uc.getCarrera().getId().equals(carreraDeLaSolicitudId));
        }
        if (!perteneceACarreraDelCoordinador) {
             log.warn("Coordinador ID {} (Cognito Sub: {}) intentó rechazar solicitud ID {} que no pertenece a sus carreras.",
                    coordinador.getId(), coordinatorCognitoSub, solicitudId);
            throw new AccessDeniedException("No tiene permisos para gestionar esta solicitud.");
        }


        EstadoSolicitud estadoActual = solicitud.getEstadoSolicitud();
        if (estadoActual == null || !SgtaConstants.ESTADO_SOLICITUD_PENDIENTE.equalsIgnoreCase(estadoActual.getNombre())) {
            String currentStatusName = (estadoActual != null) ? estadoActual.getNombre() : "DESCONOCIDO/NULL";
            log.warn("Intento de rechazar solicitud ID {} que no está PENDIENTE. Estado actual: {}", solicitudId, currentStatusName);
            throw new IllegalStateException("La solicitud solo puede ser rechazada si está en estado PENDIENTE. Estado actual: " + currentStatusName);
        }

        EstadoSolicitud estadoRechazada = estadoSolicitudRepository.findByNombre(SgtaConstants.ESTADO_SOLICITUD_RECHAZADA)
                .orElseThrow(() -> {
                    log.error("Estado '{}' no encontrado en la configuración de la base de datos.", SgtaConstants.ESTADO_SOLICITUD_RECHAZADA);
                    return new RuntimeException("Configuración interna del sistema: Estado RECHAZADA no encontrado.");
                });

        solicitud.setEstadoSolicitud(estadoRechazada);
        solicitud.setEstado(2); // MERGE-NOTE: 2 para RECHAZADA, confirmar este mapeo.
        solicitud.setRespuesta(responseText);
        solicitud.setFechaResolucion(OffsetDateTime.now());
        solicitud.setFechaModificacion(OffsetDateTime.now()); // Actualizar también fecha_modificacion

        solicitudRepository.save(solicitud);

        log.info("Solicitud ID {} RECHAZADA exitosamente por coordinador ID {} (Cognito Sub: {})",
                solicitudId, coordinador.getId(), coordinatorCognitoSub);
        // TODO: Lógica de notificación.
    }
    
    // MERGE-NOTE: Método de la versión LOCAL (findSolicitudCeseDetailsById).
    // La versión de 'incoming' 'getDetalleSolicitudCese(Integer solicitudId)' es diferente.
    // Se mantiene la de local por ser más específica y usar Cognito.
    // Si 'getDetalleSolicitudCese(Integer solicitudId)' también es necesaria, se debe fusionar o añadir.
    @Override
    public SolicitudCeseDetalleDto findSolicitudCeseDetailsById(Integer solicitudId, String coordinatorCognitoSub) {
        log.info("Buscando detalles para solicitud ID: {} por coordinador Cognito Sub: {}", solicitudId, coordinatorCognitoSub);

        Usuario coordinador = usuarioRepository.findByIdCognito(coordinatorCognitoSub)
                .orElseThrow(() -> new UsernameNotFoundException("Coordinador no encontrado con ID de Cognito: " + coordinatorCognitoSub));

        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada con ID: " + solicitudId));

        // --- Validación de Permiso ---
        boolean perteneceACarreraDelCoordinador = false;
        if (solicitud.getTema() != null && solicitud.getTema().getCarrera() != null) {
            Integer carreraDeLaSolicitudId = solicitud.getTema().getCarrera().getId();
            // Asegúrate que coordinador.getId() devuelve el ID numérico y no el Cognito Sub
            perteneceACarreraDelCoordinador = usuarioXCarreraRepository.findByUsuarioIdAndActivoTrue(coordinador.getId())
                    .stream()
                    .anyMatch(uc -> uc.getCarrera() != null && uc.getCarrera().getId().equals(carreraDeLaSolicitudId));
        }

        if (!perteneceACarreraDelCoordinador) {
            log.warn("Coordinador ID {} (Cognito Sub: {}) intentó acceder a detalles de solicitud ID {} que no pertenece a sus carreras.",
                    coordinador.getId(), coordinatorCognitoSub, solicitudId);
            throw new AccessDeniedException("No tiene permisos para ver los detalles de esta solicitud.");
        }

        // --- Mapeo a DTO de Detalle ---
        Usuario asesorSolicitante = null;

        RolSolicitud rolAsesorSolicitanteCese = rolSolicitudRepository.findByNombre("ASESOR_SOLICITANTE_CESE")
                .orElseThrow(() -> {
                    log.error("Configuración: Rol de solicitud 'ASESOR_SOLICITANTE_CESE' no encontrado en la BD.");
                    return new RuntimeException("Error de configuración interna: Rol ASESOR_SOLICITANTE_CESE no definido.");
                });

        // Usar el método que devuelve Optional y luego mapear, o manejar lista.
        Optional<UsuarioSolicitud> optUsuarioSolicitud = usuarioSolicitudRepository
                .findFirstBySolicitudIdAndRolSolicitud(solicitud.getId(), rolAsesorSolicitanteCese);
        // Asegúrate que este método exista en UsuarioSolicitudRepository y acepte (Integer, RolSolicitud)

        if (optUsuarioSolicitud.isPresent()) {
            asesorSolicitante = optUsuarioSolicitud.get().getUsuario();
        }

        SolicitudCeseDetalleDto.AssessorDetails asesorDto = null;

        if (asesorSolicitante != null) {
            long numProyectosAsesor = usuarioXTemaRepository.countByUsuarioIdAndRolNombreAndActivoTrue(
                    asesorSolicitante.getId(), "Asesor"
            );
            String urlPhotoBase64 = null;
            if (asesorSolicitante.getFotoPerfil() != null && asesorSolicitante.getFotoPerfil().length > 0) {
                urlPhotoBase64 = "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(asesorSolicitante.getFotoPerfil());
                // Considera el tipo de imagen, PNG o JPEG
            }
            asesorDto = new SolicitudCeseDetalleDto.AssessorDetails(
                    asesorSolicitante.getId(),
                    asesorSolicitante.getNombres(),
                    asesorSolicitante.getPrimerApellido(),
                    asesorSolicitante.getCorreoElectronico(),
                    (int) numProyectosAsesor,
                    urlPhotoBase64
            );
        } else {
            log.warn("No se encontró un asesor solicitante para la solicitud ID: {}. El DTO de asesor será null.", solicitudId);
        }


        List<SolicitudCeseDetalleDto.EstudianteDetails> studentsDto = new ArrayList<>();
        if (solicitud.getTema() != null) {
            // Asegúrate de que las entidades referenciadas (Usuario, Tema) no sean null antes de acceder a sus propiedades
            List<UsuarioXTema> estudiantesRelacion = usuarioXTemaRepository.findByTemaIdAndRolNombreAndActivoTrue(
                    solicitud.getTema().getId(), "Tesista"
            );
            studentsDto = estudiantesRelacion.stream()
                    .filter(er -> er.getUsuario() != null)
                    .map(er -> {
                        Usuario uEstudiante = er.getUsuario();
                        return new SolicitudCeseDetalleDto.EstudianteDetails(
                                uEstudiante.getId(),
                                uEstudiante.getNombres(),
                                uEstudiante.getPrimerApellido(),
                                uEstudiante.getCodigoPucp(),
                                uEstudiante.getCorreoElectronico(),
                                (solicitud.getTema() != null ? new SolicitudCeseDetalleDto.TemaDetails(solicitud.getTema().getTitulo()) : null)
                        );
                    }).collect(Collectors.toList());
        }

        String estadoSolicitudStr = "desconocido";
        if (solicitud.getEstadoSolicitud() != null && solicitud.getEstadoSolicitud().getNombre() != null) {
            estadoSolicitudStr = solicitud.getEstadoSolicitud().getNombre().toLowerCase();
        } else if (solicitud.getEstado() != null) {
            estadoSolicitudStr = switch (solicitud.getEstado()) {
                case 0 -> "aprobada";
                case 1 -> "pendiente";
                case 2 -> "rechazada";
                default -> "desconocido";
            };
        }

        String registerTimeString = solicitud.getFechaCreacion() != null ?
                solicitud.getFechaCreacion().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : null;
        String responseTimeString = solicitud.getFechaResolucion() != null ?
                solicitud.getFechaResolucion().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : null;

        return new SolicitudCeseDetalleDto(
                solicitud.getId(),
                registerTimeString,
                estadoSolicitudStr,
                solicitud.getDescripcion(),
                solicitud.getRespuesta(),
                responseTimeString,
                asesorDto, // Ahora debería ser visible
                studentsDto
        );
    }

    public SolicitudCambioAsesorDto findAllSolicitudesCambioAsesor(int page, int size) {
        List<Solicitud> allSolicitudes = solicitudRepository.findByTipoSolicitudNombre("Cambio Asesor");

        int totalElements = allSolicitudes.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);

        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, totalElements);

        if (fromIndex >= totalElements) {
            return new SolicitudCambioAsesorDto(Collections.emptyList(), totalPages);
        }

        List<Solicitud> solicitudesPage = allSolicitudes.subList(fromIndex, toIndex);

        List<SolicitudCambioAsesorDto.RequestChange> requestList = solicitudesPage.stream().map(solicitud -> {
            List<UsuarioXSolicitud> relaciones = usuarioXSolicitudRepository.findBySolicitud(solicitud);

            var asesor = relaciones.stream()
                    .filter(uxs -> Boolean.FALSE.equals(uxs.getDestinatario()))
                    .map(uxs -> uxs.getUsuario())
                    .map(u -> new SolicitudCambioAsesorDto.Assessor(
                            u.getId(),
                            u.getNombres(),
                            u.getPrimerApellido(),
                            u.getCorreoElectronico(),
                            u.getFotoPerfil() // URL foto
                    ))
                    .toList();

            var students = relaciones.stream()
                    .filter(uxs -> Boolean.TRUE.equals(uxs.getDestinatario()))
                    .findFirst()
                    .map(uxs -> new SolicitudCambioAsesorDto.Estudiante(
                            uxs.getUsuario().getId(),
                            uxs.getUsuario().getNombres(),
                            uxs.getUsuario().getPrimerApellido(),
                            uxs.getUsuario().getCorreoElectronico(),
                            uxs.getUsuario().getFotoPerfil(),
                            new SolicitudCambioAsesorDto.Tema(
                                    solicitud.getTema().getId(),
                                    solicitud.getTema().getTitulo(),
                                    new SolicitudCambioAsesorDto.AreaConocimiento(
                                            subAreaConocimientoXTemaRepository
                                                    .findFirstByTemaIdAndActivoTrue(solicitud.getTema().getId())
                                                    .getSubAreaConocimiento().getId(),
                                            subAreaConocimientoXTemaRepository
                                                    .findFirstByTemaIdAndActivoTrue(solicitud.getTema().getId())
                                                    .getSubAreaConocimiento().getNombre()))))
                    .orElse(null);

            String estado = switch (solicitud.getEstado()) {
                case 0 -> "approved";
                case 1 -> "pending";
                case 2 -> "rejected";
                default -> "unknown";
            };

            return new SolicitudCambioAsesorDto.RequestChange(
                    solicitud.getId(),
                    solicitud.getFechaCreacion().toLocalDate(),
                    estado,
                    solicitud.getDescripcion(),
                    solicitud.getRespuesta(),
                    solicitud.getFechaModificacion() != null ? solicitud.getFechaModificacion().toLocalDate() : null,
                    asesor,
                    students);
        }).toList();

        return new SolicitudCambioAsesorDto(requestList, totalPages);
    }

    // MERGE-NOTE: rechazarSolicitudCambioAsesor.
    // CORRECCIÓN CRÍTICA: estado 0 era para RECHAZADO en ambas, DEBE ser 2 (o el valor correcto).
    // Se usa EstadoSolicitud.
    @Override
    public RechazoSolicitudCambioAsesorResponseDto rechazarSolicitudCambioAsesor(Integer solicitudId, String response) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with ID: " + solicitudId));

        if (solicitud.getEstadoSolicitud() == null || !SgtaConstants.ESTADO_SOLICITUD_PENDIENTE.equalsIgnoreCase(solicitud.getEstadoSolicitud().getNombre())) {
            throw new IllegalStateException("Request is not in pending status");
        }

        if (solicitud.getTipoSolicitud() == null || !SgtaConstants.TIPO_SOLICITUD_CAMBIO_ASESOR.equalsIgnoreCase(solicitud.getTipoSolicitud().getNombre())) {
            throw new IllegalStateException("Request is not of advisor change type");
        }
        
        EstadoSolicitud estadoRechazada = estadoSolicitudRepository.findByNombre(SgtaConstants.ESTADO_SOLICITUD_RECHAZADA)
            .orElseThrow(() -> new RuntimeException("Estado '" + SgtaConstants.ESTADO_SOLICITUD_RECHAZADA + "' no encontrado."));

        solicitud.setEstadoSolicitud(estadoRechazada);
        solicitud.setEstado(2); // MERGE-NOTE: CORREGIDO a 2 para Rechazado (confirmar mapeo numérico si aún se usa)
        solicitud.setRespuesta(response);
        solicitud.setFechaResolucion(OffsetDateTime.now());
        solicitud.setFechaModificacion(OffsetDateTime.now());
        solicitudRepository.save(solicitud);

        // MERGE-NOTE: La lógica de `findFirstBySolicitudAndDestinatarioTrue/False` es de incoming.
        // Esta lógica es ambigua. Es mejor usar roles.
        // Asumiendo: Destinatario=TRUE es el Coordinador (quien aprueba/rechaza), Destinatario=FALSE es el Remitente (Tesista).
        // El "asesor" en el DTO de respuesta probablemente se refiere al ASESOR_ACTUAL o ASESOR_ENTRADA.
        // Para el DTO de rechazo, se necesita el ID del tesista y el ID del asesor actual.
        Usuario tesista = null;
        Usuario asesorActual = null;

        RolSolicitud rolRemitente = rolSolicitudRepository.findByNombre(RolSolicitudEnum.REMITENTE.name()).orElse(null);
        RolSolicitud rolAsesorActual = rolSolicitudRepository.findByNombre(RolSolicitudEnum.ASESOR_ACTUAL.name()).orElse(null);

        List<UsuarioXSolicitud> relaciones = usuarioXSolicitudRepository.findBySolicitud(solicitud);
        for(UsuarioXSolicitud uxs : relaciones){
            if(uxs.getRolSolicitud().equals(rolRemitente)) tesista = uxs.getUsuario();
            if(uxs.getRolSolicitud().equals(rolAsesorActual)) asesorActual = uxs.getUsuario();
        }

        if (tesista == null || asesorActual == null) {
            throw new RuntimeException("No se pudo determinar el tesista o el asesor actual para la solicitud " + solicitudId);
        }
        
        CambioAsignacionDto asignacion = new CambioAsignacionDto(
                tesista.getId(),
                asesorActual.getId());

        RechazoSolicitudCambioAsesorResponseDto dto = new RechazoSolicitudCambioAsesorResponseDto();
        dto.setIdRequest(solicitud.getId());
        dto.setStatus("rejected");
        dto.setResponse(response);
        dto.setAssignation(asignacion);

        return dto;
    }

    // MERGE-NOTE: aprobarSolicitudCambioAsesor.
    // CORRECCIÓN CRÍTICA: estado 2 era para APROBADO en ambas, DEBE ser 0 (o el valor correcto).
    // Se usa EstadoSolicitud.
    @Override
    public AprobarSolicitudCambioAsesorResponseDto aprobarSolicitudCambioAsesor(Integer solicitudId, String response) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with ID: " + solicitudId));

        if (solicitud.getEstadoSolicitud() == null || !SgtaConstants.ESTADO_SOLICITUD_PENDIENTE.equalsIgnoreCase(solicitud.getEstadoSolicitud().getNombre())) {
            throw new IllegalStateException("Request is not in pending status");
        }

        if (solicitud.getTipoSolicitud() == null || !SgtaConstants.TIPO_SOLICITUD_CAMBIO_ASESOR.equalsIgnoreCase(solicitud.getTipoSolicitud().getNombre())) {
            throw new IllegalStateException("Request is not of advisor change type");
        }

        EstadoSolicitud estadoAprobada = estadoSolicitudRepository.findByNombre(SgtaConstants.ESTADO_SOLICITUD_APROBADA)
            .orElseThrow(() -> new RuntimeException("Estado '" + SgtaConstants.ESTADO_SOLICITUD_APROBADA + "' no encontrado."));
        
        solicitud.setEstadoSolicitud(estadoAprobada);
        solicitud.setEstado(0); // MERGE-NOTE: CORREGIDO a 0 para Aprobado (confirmar mapeo numérico si aún se usa)
        solicitud.setRespuesta(response);
        solicitud.setFechaResolucion(OffsetDateTime.now());
        solicitud.setFechaModificacion(OffsetDateTime.now());
        solicitudRepository.save(solicitud);

        // MERGE-NOTE: Misma lógica de roles que en rechazar para obtener tesista y asesor (nuevo en este caso).
        Usuario tesista = null;
        Usuario asesorNuevo = null; // En aprobación, el DTO espera el ASESOR_ENTRADA

        RolSolicitud rolRemitente = rolSolicitudRepository.findByNombre(RolSolicitudEnum.REMITENTE.name()).orElse(null);
        RolSolicitud rolAsesorEntrada = rolSolicitudRepository.findByNombre(RolSolicitudEnum.ASESOR_ENTRADA.name()).orElse(null);

        List<UsuarioXSolicitud> relaciones = usuarioXSolicitudRepository.findBySolicitud(solicitud);
        for(UsuarioXSolicitud uxs : relaciones){
            if(uxs.getRolSolicitud().equals(rolRemitente)) tesista = uxs.getUsuario();
            if(uxs.getRolSolicitud().equals(rolAsesorEntrada)) asesorNuevo = uxs.getUsuario();
        }

        if (tesista == null || asesorNuevo == null) {
            throw new RuntimeException("No se pudo determinar el tesista o el asesor de entrada para la solicitud " + solicitudId);
        }

        // TODO: Lógica de cambio de asesor en UsuarioXTema (desactivar antiguo, activar nuevo).
        // Esta lógica es crucial y estaba implícita en `aprobarRechazarSolicitudCambioAsesor` (procedure).
        // Si este método va a reemplazar la llamada al procedure para este caso, esa lógica debe replicarse aquí.

        AprobarCambioAsesorAsignacionDto asignacion = new AprobarCambioAsesorAsignacionDto(
                tesista.getId(),
                asesorNuevo.getId());

        AprobarSolicitudCambioAsesorResponseDto dto = new AprobarSolicitudCambioAsesorResponseDto();
        dto.setIdRequest(solicitud.getId());
        dto.setStatus("approved");
        dto.setResponse(response);
        dto.setAssignation(asignacion);

        return dto;
    }

    // MERGE-NOTE: findAllSolicitudesByTema. Ambas versiones muy similares.
    // Se toma la de INCOMING como base. Local usaba (Date) row[x], incoming también.
    @Override
    public SolicitudTemaDto findAllSolicitudesByTema(Integer temaId, int page, int size) {
        int offset = page * size;
        List<Object[]> solicitudesData = solicitudRepository.findSolicitudesByTemaWithProcedure(temaId, offset, size);
        Integer totalElements = solicitudRepository.countSolicitudesByTema(temaId);
        int totalPages = (int) Math.ceil((double) totalElements / size);

        if (solicitudesData.isEmpty()) {
            return new SolicitudTemaDto(Collections.emptyList(), totalPages);
        }

        List<SolicitudTemaDto.RequestChange> requestList = solicitudesData.stream().map(row -> {
            Integer solicitudId = (Integer) row[0];
            // MERGE-NOTE: La versión de INCOMING usa java.sql.Date para fechaCreacion/Modificacion.
            // Local usaba LocalDate directamente en el DTO, pero el casteo era (Date).
            // Se mantiene el casteo a java.sql.Date y luego .toLocalDate()
            java.time.LocalDate fechaCreacion = row[1] != null ? ((java.sql.Date) row[1]).toLocalDate() : null;
            Integer estado = (Integer) row[2]; // Este es el estado numérico de la solicitud
            String descripcion = (String) row[3];
            String respuesta = (String) row[4];
            java.time.LocalDate fechaModificacion = row[5] != null ? ((java.sql.Date) row[5]).toLocalDate() : null;
            
            Integer tipoSolicitudId = (Integer) row[6];
            String tipoSolicitudNombre = (String) row[7];
            String tipoSolicitudDescripcion = (String) row[8];

            Integer usuarioId = (Integer) row[9];
            String usuarioNombres = (String) row[10];
            String usuarioPrimerApellido = (String) row[11];
            String usuarioSegundoApellido = (String) row[12];
            String usuarioCorreo = (String) row[13];
            // MERGE-NOTE: fotoPerfil no se usaba en el DTO de `Usuario` en incoming.
            // String usuarioFotoPerfil = (String) row[x]; // Si el procedure lo devuelve y el DTO lo necesita.

            String estadoStr;
             // MERGE-NOTE: Aquí 'estado' es el numérico. Se mapea.
             // Si el procedure devolviera el nombre del EstadoSolicitud, se podría usar eso.
            estadoStr = switch (estado) {
                case 0 -> "approved"; // Mapeo de Solicitud.estado (int)
                case 1 -> "pending";
                case 2 -> "rejected";
                default -> "unknown";
            };
            
            var tipoSolicitudDto = new SolicitudTemaDto.TipoSolicitud(
                    tipoSolicitudId, tipoSolicitudNombre, tipoSolicitudDescripcion);

            var usuarioDto = new SolicitudTemaDto.Usuario( // Este usuario es el que generó la solicitud
                    usuarioId, usuarioNombres, usuarioPrimerApellido, usuarioSegundoApellido, usuarioCorreo, null /* foto */);

            SolicitudTemaDto.Asesor asesorDto = null; // No viene del procedure actual.

            boolean solicitudCompletada = (Boolean) row[14]; // Viene del procedure
            boolean aprobado = determinarAprobadoFromData(estado); // Determinado del estado numérico

            // MERGE-NOTE: La creación de Tesista y Tema aquí es genérica en incoming.
            // Si se necesita info real del tema/tesista, debe venir del procedure o buscarse.
            SolicitudTemaDto.Tema temaDto = new SolicitudTemaDto.Tema("Tema de Tesis (Placeholder)", "Resumen (Placeholder)");
            SolicitudTemaDto.Tesista tesistaDto = new SolicitudTemaDto.Tesista(
                    usuarioId, usuarioNombres, usuarioPrimerApellido, temaDto);
            List<SolicitudTemaDto.Tesista> students = Collections.singletonList(tesistaDto);

            return new SolicitudTemaDto.RequestChange(
                    solicitudId, fechaCreacion, estadoStr, descripcion, respuesta, fechaModificacion,
                    solicitudCompletada, aprobado, tipoSolicitudDto, usuarioDto, asesorDto, students);
        }).toList();

        return new SolicitudTemaDto(requestList, totalPages);
    }

    // MERGE-NOTE: atenderSolicitudTemaInscrito. Ambas versiones muy similares.
    // Se toma la de INCOMING como base.
    @Override
    @Transactional
    public void atenderSolicitudTemaInscrito(SolicitudTemaDto solicitudAtendida) {
        if (solicitudAtendida == null || solicitudAtendida.getChangeRequests() == null
                || solicitudAtendida.getChangeRequests().isEmpty()) {
            throw new RuntimeException("Request doesn't contain valid information");
        }

        for (SolicitudTemaDto.RequestChange requestChange : solicitudAtendida.getChangeRequests()) {
            if (requestChange == null || requestChange.getId() == null) {
                throw new RuntimeException("Invalid request change data");
            }

            // Get the request ID
            Integer solicitudId = requestChange.getId();

            // Get the response message if available
            String response = requestChange.getResponse();

            // Retrieve the full solicitud to determine its type
            Solicitud solicitud = solicitudRepository.findById(solicitudId)
                    .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

            // Check if it's in pending status
            if (solicitud.getEstado() != 1) {
                log.error("Request is not in pending status");
                continue;
            }

            // Get the tipo de solicitud to determine if it's a title or summary change
            // request
            String tipoSolicitudNombre = solicitud.getTipoSolicitud().getNombre();

            // Handle the solicitud based on its type
            if ("Solicitud de cambio de título".equals(tipoSolicitudNombre)) {
                // Get title from DTO
                String title = null;
                if (requestChange.getStudents() != null && !requestChange.getStudents().isEmpty() &&
                        requestChange.getStudents().get(0).getTopic() != null) {
                    title = requestChange.getStudents().get(0).getTopic().getTitulo();

                    // Handle empty string
                    if (title != null && title.isEmpty()) {
                        title = null;
                    }
                }

                // Call TemaService to update the title and handle the solicitud
                temaService.updateTituloTemaSolicitud(solicitudId, title, response);

            }

            else if ("Solicitud de cambio de resumen".equals(tipoSolicitudNombre)) {
                // Get summary from DTO
                String summary = null;
                if (requestChange.getStudents() != null && !requestChange.getStudents().isEmpty() &&
                        requestChange.getStudents().get(0).getTopic() != null) {
                    summary = requestChange.getStudents().get(0).getTopic().getResumen();

                    // Handle empty string
                    if (summary != null && summary.isEmpty()) {
                        summary = null;
                    }
                }

                // Call TemaService to update the summary and handle the solicitud
                temaService.updateResumenTemaSolicitud(solicitudId, summary, response);

            } else {
                // For other types of solicitudes, use the general method
                // You can decide what to do here
                log.warn("Unhandled solicitud type: {}", tipoSolicitudNombre);
                throw new RuntimeException("Unsupported request type: " + tipoSolicitudNombre);
            }

            log.info("Processed request {}", solicitudId);
        }
    }

    @Transactional
    @Override
    public pucp.edu.pe.sgta.dto.asesores.SolicitudCambioAsesorDto registrarSolicitudCambioAsesor(
            pucp.edu.pe.sgta.dto.asesores.SolicitudCambioAsesorDto solicitud) {
        if (!validarExistenEstadosAccionesRoles())
            throw new RuntimeException("Faltan registrar estados, roles o acciones");
        boolean validacion;
        // Validar que el tema exista
        validacion = Utils.validarTrueOrFalseDeQuery(
                temaRepository.validarTemaExisteYSePuedeCambiarAsesor(solicitud.getTemaId()));
        if (!validacion)
            throw new RuntimeException("Tema no valido para cambio de asesor");
        // Validar los roles
        validacion = (Utils
                .validarTrueOrFalseDeQuery(usuarioXRolRepository.esProfesorAsesor(solicitud.getNuevoAsesorId()))
                && Utils.validarTrueOrFalseDeQuery(
                usuarioXRolRepository.esProfesorAsesor(solicitud.getAsesorActualId())));
        if (!validacion)
            throw new RuntimeException("Asesor elegido no valido para cambio de asesor");

        validacion = Utils.validarTrueOrFalseDeQuery(usuarioXRolRepository.esUsuarioAlumno(solicitud.getAlumnoId()));
        if (!validacion)
            throw new RuntimeException("Alumno no valido para cambio de asesor");

        int idCoordinador = (int) usuarioRepository.obtenerIdCoordinadorPorUsuario(solicitud.getAlumnoId()).get(0)[0];
        if (idCoordinador == -1)
            throw new RuntimeException(
                    "Coordinador de la carrera inexistente para el alumno " + solicitud.getAlumnoId());
        // Tipo Solicitud
        TipoSolicitud tipoSolicitud = tipoSolicitudRepository
                .findByNombre("Cambio de asesor (por asesor)")
                .orElseThrow(
                        () -> new RuntimeException("Tipo de solicitud no configurado: Cambio de asesor (por asesor)"));
        // Estado solicitud
        EstadoSolicitud estadoSolicitud = estadoSolicitudRepository
                .findByNombre(EstadoSolicitudEnum.PENDIENTE.name())
                .orElseThrow(() -> new RuntimeException("Estado de solicitud no encontrado"));

        // Tema
        Tema tema = temaRepository
                .findById(solicitud.getTemaId())
                .orElseThrow(() -> new RuntimeException("Tema no encontrado"));

        // Solicitud
        Solicitud nuevaSolicitud = new Solicitud();
        nuevaSolicitud.setDescripcion(solicitud.getMotivo());
        nuevaSolicitud.setTipoSolicitud(tipoSolicitud);
        nuevaSolicitud.setTema(tema);
        nuevaSolicitud.setEstadoSolicitud(estadoSolicitud);
        nuevaSolicitud.setFechaCreacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        solicitudRepository.save(nuevaSolicitud);

        // Llenamos el idSolicitud
        solicitud.setSolicitudId(nuevaSolicitud.getId());

        // Tabla UsuarioSolicitud
        Usuario alumno = usuarioRepository
                .findById(solicitud.getAlumnoId())
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
        Usuario asesorActual = usuarioRepository
                .findById(solicitud.getAsesorActualId())
                .orElseThrow(() -> new RuntimeException("Asesor actual no encontrado"));
        Usuario asesorNuevo = usuarioRepository
                .findById(solicitud.getNuevoAsesorId())
                .orElseThrow(() -> new RuntimeException("Asesor entrante no encontrado"));
        Usuario coordinador = usuarioRepository
                .findById(idCoordinador)
                .orElseThrow(() -> new RuntimeException("Coordinador de la carrera inexistente"));
        AccionSolicitud accionPendiente = accionSolicitudRepository
                .findByNombre(AccionSolicitudEnum.PENDIENTE_ACCION.name())
                .orElseThrow(() -> new RuntimeException("Accion pendiente_aprobacion no encontrado"));
        AccionSolicitud sinAccion = accionSolicitudRepository
                .findByNombre(AccionSolicitudEnum.SIN_ACCION.name())
                .orElseThrow(() -> new RuntimeException("Accion sin_accion no encontrado"));
        RolSolicitud rolRemitente = rolSolicitudRepository
                .findByNombre(RolSolicitudEnum.REMITENTE.name())
                .orElseThrow(() -> new RuntimeException("Rol remitente no encontrado"));
        RolSolicitud rolDestinatario = rolSolicitudRepository
                .findByNombre(RolSolicitudEnum.DESTINATARIO.name())
                .orElseThrow(() -> new RuntimeException("Rol destinatario no encontrado"));
        RolSolicitud rolAsesorEntrada = rolSolicitudRepository
                .findByNombre(RolSolicitudEnum.ASESOR_ENTRADA.name())
                .orElseThrow(() -> new RuntimeException("Rol destinatario no encontrado"));
        RolSolicitud rolAsesorActual = rolSolicitudRepository
                .findByNombre(RolSolicitudEnum.ASESOR_ACTUAL.name())
                .orElseThrow(() -> new RuntimeException("Rol destinatario no encontrado"));

        UsuarioXSolicitud nuevoRemitente = new UsuarioXSolicitud();
        nuevoRemitente.setUsuario(alumno);
        nuevoRemitente.setSolicitud(nuevaSolicitud);
        nuevoRemitente.setAccionSolicitud(sinAccion);
        nuevoRemitente.setRolSolicitud(rolRemitente);
        nuevoRemitente.setDestinatario(false);

        UsuarioXSolicitud nuevoDestinatario = new UsuarioXSolicitud();
        nuevoDestinatario.setUsuario(coordinador);
        nuevoDestinatario.setSolicitud(nuevaSolicitud);
        nuevoDestinatario.setAccionSolicitud(accionPendiente);
        nuevoDestinatario.setRolSolicitud(rolDestinatario);
        nuevoDestinatario.setDestinatario(true);

        UsuarioXSolicitud nuevoAsesor = new UsuarioXSolicitud();
        nuevoAsesor.setUsuario(asesorNuevo);
        nuevoAsesor.setSolicitud(nuevaSolicitud);
        nuevoAsesor.setAccionSolicitud(accionPendiente);
        nuevoAsesor.setRolSolicitud(rolAsesorEntrada);
        nuevoAsesor.setDestinatario(false);

        UsuarioXSolicitud actualAsesor = new UsuarioXSolicitud();
        actualAsesor.setUsuario(asesorActual);
        actualAsesor.setSolicitud(nuevaSolicitud);
        actualAsesor.setAccionSolicitud(sinAccion);
        actualAsesor.setRolSolicitud(rolAsesorActual);
        actualAsesor.setDestinatario(false);

        usuarioXSolicitudRepository.save(nuevoRemitente);
        usuarioXSolicitudRepository.save(nuevoDestinatario);
        usuarioXSolicitudRepository.save(nuevoAsesor);
        usuarioXSolicitudRepository.save(actualAsesor);

        return solicitud;
    }

    @Override
    public List<SolicitudCambioAsesorResumenDto> listarResumenSolicitudCambioAsesorUsuario(Integer idUsuario, String rolSolicitudNombre) { // MERGE-NOTE: rolSolicitud es el nombre
        List<Object[]> queryResult = solicitudRepository.listarResumenSolicitudCambioAsesorUsuario(idUsuario, rolSolicitudNombre);
        return queryResult.stream()
                .map(SolicitudCambioAsesorResumenDto::fromResultQuery)
                .collect(Collectors.toList());
    }

    @Override
    public DetalleSolicitudCambioAsesorDto listarDetalleSolicitudCambioAsesorUsuario(Integer idSolicitud) {
        List<Object[]> queryResult = solicitudRepository.listarDetalleSolicitudCambioAsesor(idSolicitud);
        if (queryResult.isEmpty()) return null; // O lanzar ResourceNotFoundException

        Object[] result = queryResult.get(0);
        DetalleSolicitudCambioAsesorDto detalle = DetalleSolicitudCambioAsesorDto.fromResultQuery(result);

        // IDs de los usuarios desde el resultado del query
        int idRemitente = (result[6] instanceof Number) ? ((Number) result[6]).intValue() : 0;
        int idAsesorActual = (result[7] instanceof Number) ? ((Number) result[7]).intValue() : 0;
        int idAsesorEntrada = (result[8] instanceof Number) ? ((Number) result[8]).intValue() : 0;
        int idDestinatario = (result[9] instanceof Number) ? ((Number) result[9]).intValue() : 0; // Coordinador

        // MERGE-NOTE: El método getUsuarioSolicitudFromId podría ser privado o parte de este flujo.
        detalle.setSolicitante(getUsuarioSolicitudFromId(idRemitente, idSolicitud));
        detalle.setAsesorActual(getUsuarioSolicitudFromId(idAsesorActual, idSolicitud));
        detalle.setAsesorNuevo(getUsuarioSolicitudFromId(idAsesorEntrada, idSolicitud));
        detalle.setCoordinador(getUsuarioSolicitudFromId(idDestinatario, idSolicitud));

        return detalle;
    }

    // MERGE-NOTE: Método auxiliar de INCOMING
    private UsuarioSolicitudCambioAsesorDto getUsuarioSolicitudFromId(int idUsuario, int idSolicitud) {
        if (idUsuario == 0) return null; // Si el ID no es válido (ej. de un cast fallido)
        List<Object[]> queryResult = solicitudRepository.listarDetalleUsuarioSolicitudCambioAsesor(idUsuario, idSolicitud);
        if (queryResult.isEmpty()) {
             log.warn("No se encontró detalle de usuario {} para solicitud {}", idUsuario, idSolicitud);
             return null; // O lanzar excepción
        }
        return UsuarioSolicitudCambioAsesorDto.fromQueryResult(queryResult.get(0));
    }

    @Override
    public DetalleSolicitudCeseDto getDetalleSolicitudCese(Integer solicitudId){
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        UsuarioXTema asesorRelacion = usuarioXTemaRepository.findFirstByTemaIdAndRolNombreAndActivoTrue(solicitud.getTema().getId(), "Asesor");
        List<UsuarioXTema> estudiantesRelacion = usuarioXTemaRepository.findByTemaIdAndRolNombreAndActivoTrue(solicitud.getTema().getId(), "Tesista");

        var asesor = new DetalleSolicitudCeseDto.Assessor(
                asesorRelacion.getUsuario().getId(),
                asesorRelacion.getUsuario().getNombres(),
                asesorRelacion.getUsuario().getPrimerApellido(),
                asesorRelacion.getUsuario().getCorreoElectronico(),
                usuarioXTemaRepository.findByUsuarioIdAndRolNombreAndActivoTrue(asesorRelacion.getUsuario().getId(), "asesor").size(),
                asesorRelacion.getUsuario().getFotoPerfil() // URL foto
        );

        List<DetalleSolicitudCeseDto.Estudiante> students = new ArrayList<>();

        for (UsuarioXTema estudianteRelacion : estudiantesRelacion) {
            students.add(new DetalleSolicitudCeseDto.Estudiante(
                    estudianteRelacion.getUsuario().getId(),
                    estudianteRelacion.getUsuario().getNombres(),
                    estudianteRelacion.getUsuario().getPrimerApellido(),
                    estudianteRelacion.getUsuario().getCorreoElectronico(),
                    estudianteRelacion.getUsuario().getFotoPerfil(),
                    new DetalleSolicitudCeseDto.Tema(solicitud.getTema().getTitulo())
            ));
        }

        String estado = switch (solicitud.getEstado()) {
            case 0 -> "approved";
            case 1 -> "pending";
            case 2 -> "rejected";
            default -> "unknown";
        };

        return new DetalleSolicitudCeseDto(
                solicitud.getId(),
                solicitud.getFechaCreacion().toLocalDate(),
                estado,
                solicitud.getDescripcion(),
                solicitud.getRespuesta(), // respuesta
                solicitud.getFechaModificacion() != null ? solicitud.getFechaModificacion().toLocalDate() : null,
                asesor,
                students
        );
    }

    @Transactional
    @Override
    public void aprobarRechazarSolicitudCambioAsesor(Integer idSolicitud, Integer idUsuario, String rolSolicitudNombre, boolean aprobar) { // MERGE-NOTE: rolSolicitud es el nombre
        // Validar que la solicitud exista y esté pendiente
        if (!solicitudRepository.existsSolicitudByIdAndEstadoSolicitud_Nombre(idSolicitud, EstadoSolicitudEnum.PENDIENTE.name()))
            throw new IllegalStateException("Solicitud no puede ser modificada o no está pendiente.");

        // Validar que el usuario con ese rol puede modificar la solicitud
        // MERGE-NOTE: El procedure `puedeUsuarioCambiarSolicitud` debe existir y funcionar.
        List<Object[]> result = usuarioXSolicitudRepository.puedeUsuarioCambiarSolicitud(idUsuario, rolSolicitudNombre, idSolicitud);
        if (!Utils.validarTrueOrFalseDeQuery(result))
            throw new AccessDeniedException("El usuario no tiene permisos para modificar esta solicitud con el rol " + rolSolicitudNombre);
        
        // Llamada al procedure que maneja la lógica de aprobación/rechazo y actualización de estados/entidades.
        // MERGE-NOTE: El procedure `procesarSolicitudCambio` debe existir y manejar toda la lógica.
        usuarioXSolicitudRepository.procesarSolicitudCambio(idUsuario, rolSolicitudNombre, idSolicitud, aprobar);
        log.info("Solicitud de cambio de asesor ID {} procesada. Usuario: {}, Rol: {}, Aprobada: {}", idSolicitud, idUsuario, rolSolicitudNombre, aprobar);
    }


    // MERGE-NOTE: determinarSolicitudCompletadaFromData y determinarAprobadoFromData.
    // Ambas versiones idénticas. Se mantienen.
    // Estos métodos parecen específicos para `findAllSolicitudesByTema` que usa el estado numérico.
    private boolean determinarSolicitudCompletadaFromData(Integer estadoNumerico) {
        // MERGE-NOTE: El estado 0 (approved) y 2 (rejected) marcan la solicitud como completada.
        return estadoNumerico != null && (estadoNumerico == 0 || estadoNumerico == 2);
    }

    private boolean determinarAprobadoFromData(Integer estadoNumerico) {
        // MERGE-NOTE: Solo el estado 0 (approved) significa aprobado.
        return estadoNumerico != null && estadoNumerico == 0;
    }

    /**
     * Crea una solicitud de aprobación de tema y la asigna a todos los
     * coordinadores
     * activos de la carrera asociada.
     *
     * @param tema Tema recién creado al que se asociará la solicitud.
     */
    public void crearSolicitudAprobacionTema(Tema tema) {
        // 1) Obtener el tipo de solicitud
        TipoSolicitud tipoSolicitud = tipoSolicitudRepository
                .findByNombre("Aprobación de tema (por coordinador)")
                .orElseThrow(() -> new RuntimeException(
                        "Tipo de solicitud no configurado: Aprobación de tema (por coordinador)"));

        // 2) Construir y guardar la solicitud
        Solicitud solicitud = new Solicitud();
        solicitud.setDescripcion("Solicitud de aprobación de tema por coordinador");
        solicitud.setTipoSolicitud(tipoSolicitud);
        solicitud.setTema(tema);
        solicitud.setEstado(0); // Ajusta según tu convención (p.ej. 0 = PENDIENTE)
        Solicitud savedSolicitud = solicitudRepository.save(solicitud);

        // 3) Buscar los usuarios-coordinador de la carrera del tema
        List<UsuarioXSolicitud> asignaciones = usuarioCarreraRepository
                .findByCarreraIdAndActivoTrue(tema.getCarrera().getId()).stream()
                .map(rel -> rel.getUsuario())
                .filter(u -> TipoUsuarioEnum.coordinador.name().equalsIgnoreCase(u.getTipoUsuario().getNombre()))
                .map(coord -> {
                    UsuarioXSolicitud us = new UsuarioXSolicitud();
                    us.setUsuario(coord);
                    us.setSolicitud(savedSolicitud);
                    us.setDestinatario(true);
                    us.setAprobado(false);
                    us.setSolicitudCompletada(false);
                    return us;
                })
                .collect(Collectors.toList());

        if (asignaciones.isEmpty()) {
            throw new RuntimeException(
                    "No hay coordinador activo para la carrera con id " + tema.getCarrera().getId());
        }

        // 4) Guardar todas las asignaciones de la solicitud
        usuarioXSolicitudRepository.saveAll(asignaciones);
    }

    // MERGE-NOTE: Método de INCOMING.
    private boolean validarExistenEstadosAccionesRoles() {
        // Este método valida la existencia de configuraciones base en la BD.
        // Es útil al inicio o para diagnósticos.
        boolean existenTodos = true;
        for (EstadoSolicitudEnum estado : EstadoSolicitudEnum.values()) {
            if (!estadoSolicitudRepository.existsByNombre(estado.name())) {
                log.error("Falta configuración base: EstadoSolicitud '{}'", estado.name());
                existenTodos = false;
            }
        }
        for (AccionSolicitudEnum accion : AccionSolicitudEnum.values()) {
            if (!accionSolicitudRepository.existsByNombre(accion.name())) {
                log.error("Falta configuración base: AccionSolicitud '{}'", accion.name());
                existenTodos = false;
            }
        }
        for (RolSolicitudEnum rol : RolSolicitudEnum.values()) {
            if (!rolSolicitudRepository.existsByNombre(rol.name())) {
                log.error("Falta configuración base: RolSolicitud '{}'", rol.name());
                existenTodos = false;
            }
        }
        for (EstadoTemaEnum estadoTema : EstadoTemaEnum.values()) {
            if (!estadoTemaRepository.existsByNombre(estadoTema.name())) {
                log.error("Falta configuración base: EstadoTema '{}'", estadoTema.name());
                existenTodos = false;
            }
        }
        // MERGE-NOTE: Podrías añadir validación para Tipos de Solicitud clave (usando SgtaConstants).
        // Ejemplo:
        // if (!tipoSolicitudRepository.existsByNombre(SgtaConstants.TIPO_SOLICITUD_NOMBRE_CESE)) {
        //     log.error("Falta configuración base: TipoSolicitud '{}'", SgtaConstants.TIPO_SOLICITUD_NOMBRE_CESE);
        //     existenTodos = false;
        // }

        if (!existenTodos) {
            log.warn("Algunas configuraciones base (Estados, Acciones, Roles) faltan en la base de datos. El sistema podría no funcionar correctamente.");
        }
        return existenTodos;
    }


}
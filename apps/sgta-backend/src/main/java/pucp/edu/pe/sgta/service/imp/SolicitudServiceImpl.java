package pucp.edu.pe.sgta.service.imp;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.AprobarSolicitudCambioAsesorResponseDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudCambioAsesorResponseDto.AprobarCambioAsesorAsignacionDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudCambioAsesorResponseDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudCambioAsesorResponseDto.CambioAsignacionDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudResponseDto.AprobarAsignacionDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.SolicitudCambioAsesorDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto.AsignacionDto;
import pucp.edu.pe.sgta.dto.SolicitudCeseDto;
import pucp.edu.pe.sgta.model.Solicitud;
import pucp.edu.pe.sgta.model.Tema;
import pucp.edu.pe.sgta.model.TipoSolicitud;
import pucp.edu.pe.sgta.model.UsuarioXSolicitud;
import pucp.edu.pe.sgta.model.UsuarioXTema;
import pucp.edu.pe.sgta.repository.SolicitudRepository;
import pucp.edu.pe.sgta.repository.SubAreaConocimientoXTemaRepository;
import pucp.edu.pe.sgta.repository.TipoSolicitudRepository;
import pucp.edu.pe.sgta.repository.UsuarioXCarreraRepository;
import pucp.edu.pe.sgta.repository.UsuarioXSolicitudRepository;
import pucp.edu.pe.sgta.repository.UsuarioXTemaRepository;
import pucp.edu.pe.sgta.service.inter.SolicitudService;
import pucp.edu.pe.sgta.util.TipoUsuarioEnum;

@Service
public class SolicitudServiceImpl implements SolicitudService {
    @Autowired
    private SolicitudRepository solicitudRepository;
    @Autowired
    private UsuarioXSolicitudRepository usuarioXSolicitudRepository;
    @Autowired
    private UsuarioXTemaRepository usuarioXTemaRepository;
    @Autowired
    private SubAreaConocimientoXTemaRepository subAreaConocimientoXTemaRepository;
    @Autowired 
    private TipoSolicitudRepository tipoSolicitudRepository;
    @Autowired 
    private UsuarioXCarreraRepository usuarioCarreraRepository;
    

    public SolicitudCeseDto findAllSolicitudesCese(int page, int size) {
        List<Solicitud> allSolicitudes = solicitudRepository.findByTipoSolicitudNombre("Cese Asesoria");

        int totalElements = allSolicitudes.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);

        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, totalElements);

        if (fromIndex >= totalElements) {
            return new SolicitudCeseDto(Collections.emptyList(), totalPages);
        }

        List<Solicitud> solicitudesPage = allSolicitudes.subList(fromIndex, toIndex);

        List<SolicitudCeseDto.RequestTermination> requestList = solicitudesPage.stream().map(solicitud -> {
            List<UsuarioXSolicitud> relaciones = usuarioXSolicitudRepository.findBySolicitud(solicitud);

            var asesor = relaciones.stream()
                .filter(uxs -> Boolean.FALSE.equals(uxs.getDestinatario()))
                .map(uxs -> uxs.getUsuario())
                .findFirst()
                .map(u -> new SolicitudCeseDto.Assessor(
                    u.getId(),
                    u.getNombres(),
                    u.getPrimerApellido(),
                    u.getCorreoElectronico(),
                    usuarioXTemaRepository.findByUsuarioIdAndRolNombreAndActivoTrue(u.getId(), "asesor").size(),
                    u.getFotoPerfil() // URL foto
                ))
                .orElse(null);
        
            var students = relaciones.stream()
                .filter(uxs -> Boolean.TRUE.equals(uxs.getDestinatario()))
                .map(uxs -> new SolicitudCeseDto.Estudiante(
                    uxs.getUsuario().getId(),
                    uxs.getUsuario().getNombres(),
                    uxs.getUsuario().getPrimerApellido(),
                    new SolicitudCeseDto.Tema(solicitud.getTema().getTitulo())
                ))
                .toList();
        
            String estado = switch (solicitud.getEstado()) {
                case 0 -> "approved";
                case 1 -> "pending";
                case 2 -> "rejected";
                default -> "unknown";
            };
        
            return new SolicitudCeseDto.RequestTermination(
                solicitud.getId(),
                solicitud.getFechaCreacion().toLocalDate(),
                estado,
                solicitud.getDescripcion(),
                solicitud.getRespuesta(), // respuesta
                solicitud.getFechaModificacion() != null ? solicitud.getFechaModificacion().toLocalDate() : null,
                asesor,
                students
            );
        }).toList();
        
        return new SolicitudCeseDto(requestList, totalPages);
    }

    @Override
    public RechazoSolicitudResponseDto rechazarSolicitud(Integer solicitudId, String response) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        // Verificar que la solicitud esté en estado pendiente (1)
        if (solicitud.getEstado() != 1) {
            throw new RuntimeException("La solicitud no está en estado pendiente");
        }

        // Verificar que la solicitud sea de tipo cese (tipoSolicitud.nombre == Cese Asesoria)
        if (solicitud.getTipoSolicitud() == null || solicitud.getTipoSolicitud().getNombre() != "Cese Asesoria") {
            throw new RuntimeException("La solicitud no es de tipo cese");
        }

        solicitud.setRespuesta(response);
        solicitud.setEstado(2); // Rechazado
        solicitud.setFechaModificacion(OffsetDateTime.now());
        solicitudRepository.save(solicitud);

        List<UsuarioXTema> asesoresActivos = usuarioXTemaRepository.findByTemaIdAndRolNombreAndActivoTrue( solicitud.getTema().getId(), "Asesor");
        List<UsuarioXTema> tesistasActivos = usuarioXTemaRepository.findByTemaIdAndRolNombreAndActivoTrue(solicitud.getTema().getId(), "Tesista");

        List<AsignacionDto> asignaciones = new ArrayList<>();

        for (UsuarioXTema tesista : tesistasActivos) {
            for (UsuarioXTema asesor : asesoresActivos) {
                asignaciones.add(new AsignacionDto(
                        tesista.getUsuario().getId(),
                        asesor.getUsuario().getId()
                ));
            }
        }
        
        RechazoSolicitudResponseDto dto = new RechazoSolicitudResponseDto();
        dto.setIdRequest(solicitud.getId());
        dto.setStatus("rejected");
        dto.setResponse(response); // se usa lo que viene del request
        dto.setAssignations(asignaciones);

        return dto;
    }

    @Override
    public AprobarSolicitudResponseDto aprobarSolicitud(Integer solicitudId, String response) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        if (solicitud.getEstado() != 1) {
            throw new RuntimeException("La solicitud no está en estado pendiente");
        }

        // Verificar que la solicitud sea de tipo cese (tipoSolicitud.nombre == Cese Asesoria)
        if (solicitud.getTipoSolicitud() == null || solicitud.getTipoSolicitud().getNombre() != "Cese Asesoria") {
            throw new RuntimeException("La solicitud no es de tipo cese");
        }

        solicitud.setRespuesta(response);
        solicitud.setEstado(0); // Aprobado
        solicitud.setFechaModificacion(OffsetDateTime.now());
        solicitudRepository.save(solicitud);

        // Simular asignaciones
        List<UsuarioXTema> asesoresActivos = usuarioXTemaRepository.findByTemaIdAndRolNombreAndActivoTrue( solicitud.getTema().getId(), "Asesor");
        List<UsuarioXTema> tesistasActivos = usuarioXTemaRepository.findByTemaIdAndRolNombreAndActivoTrue(solicitud.getTema().getId(), "Tesista");
        
        List<AprobarAsignacionDto> asignaciones = new ArrayList<>();

        for (UsuarioXTema tesista : tesistasActivos) {
            for (UsuarioXTema asesor : asesoresActivos) {
                asignaciones.add(new AprobarAsignacionDto(
                        tesista.getUsuario().getId(),
                        asesor.getUsuario().getId()
                ));
            }
        }

        for (UsuarioXTema usuarioXTema : asesoresActivos) {
            usuarioXTema.setActivo(false);
            usuarioXTemaRepository.save(usuarioXTema);
        }
        for (UsuarioXTema usuarioXTema : tesistasActivos) {
            usuarioXTema.setActivo(false);
            usuarioXTemaRepository.save(usuarioXTema);
        }

        AprobarSolicitudResponseDto dto = new AprobarSolicitudResponseDto();
        dto.setIdRequest(solicitud.getId());
        dto.setStatus("approved");
        dto.setResponse(response);
        dto.setAssignations(asignaciones);

        return dto;
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
                            subAreaConocimientoXTemaRepository.findFirstByTemaIdAndActivoTrue(solicitud.getTema().getId()).getSubAreaConocimiento().getId(),
                            subAreaConocimientoXTemaRepository.findFirstByTemaIdAndActivoTrue(solicitud.getTema().getId()).getSubAreaConocimiento().getNombre()
                        ))
                ))
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
                students
            );
        }).toList();
        
        return new SolicitudCambioAsesorDto(requestList, totalPages);
    }
    
    @Override
    public RechazoSolicitudCambioAsesorResponseDto rechazarSolicitudCambioAsesor(Integer solicitudId, String response) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        // Verificar que la solicitud esté en estado pendiente (1)
        if (solicitud.getEstado() != 1) {
            throw new RuntimeException("La solicitud no está en estado pendiente");
        }

        // Verificar que la solicitud sea de tipo cese (tipoSolicitud.nombre == Cambio Asesor)
        if (solicitud.getTipoSolicitud() == null || solicitud.getTipoSolicitud().getNombre() != "Cambio Asesor") {
            throw new RuntimeException("La solicitud no es de tipo cambio de asesor");
        }

        solicitud.setRespuesta(response);
        solicitud.setEstado(0); // Rechazado
        solicitud.setFechaModificacion(OffsetDateTime.now());
        solicitudRepository.save(solicitud);

        UsuarioXSolicitud asesor = usuarioXSolicitudRepository.findFirstBySolicitudAndDestinatarioTrue(solicitud);
        UsuarioXSolicitud tesista = usuarioXSolicitudRepository.findFirstBySolicitudAndDestinatarioFalse(solicitud);

        CambioAsignacionDto asignacion = new CambioAsignacionDto(
                tesista.getUsuario().getId(),
                asesor.getUsuario().getId()
        );

        
        RechazoSolicitudCambioAsesorResponseDto dto = new RechazoSolicitudCambioAsesorResponseDto();
        dto.setIdRequest(solicitud.getId());
        dto.setStatus("rejected");
        dto.setResponse(response); // se usa lo que viene del request
        dto.setAssignation(asignacion);

        return dto;
    }

    @Override
    public AprobarSolicitudCambioAsesorResponseDto aprobarSolicitudCambioAsesor(Integer solicitudId, String response) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        // Verificar que la solicitud esté en estado pendiente (1)
        if (solicitud.getEstado() != 1) {
            throw new RuntimeException("La solicitud no está en estado pendiente");
        }

        // Verificar que la solicitud sea de tipo cese (tipoSolicitud.nombre == Cambio Asesor)
        if (solicitud.getTipoSolicitud() == null || solicitud.getTipoSolicitud().getNombre() != "Cambio Asesor") {
            throw new RuntimeException("La solicitud no es de tipo cambio de asesor");
        }

        solicitud.setRespuesta(response);
        solicitud.setEstado(2); // Aprobado
        solicitud.setFechaModificacion(OffsetDateTime.now());
        solicitudRepository.save(solicitud);

        UsuarioXSolicitud asesor = usuarioXSolicitudRepository.findFirstBySolicitudAndDestinatarioTrue(solicitud);
        UsuarioXSolicitud tesista = usuarioXSolicitudRepository.findFirstBySolicitudAndDestinatarioFalse(solicitud);

        AprobarCambioAsesorAsignacionDto asignacion = new AprobarCambioAsesorAsignacionDto(
                tesista.getUsuario().getId(),
                asesor.getUsuario().getId()
        );

        
        AprobarSolicitudCambioAsesorResponseDto dto = new AprobarSolicitudCambioAsesorResponseDto();
        dto.setIdRequest(solicitud.getId());
        dto.setStatus("approved");
        dto.setResponse(response); // se usa lo que viene del request
        dto.setAssignation(asignacion);

        return dto;
    }


        /**
     * Crea una solicitud de aprobación de tema y la asigna a todos los coordinadores
     * activos de la carrera asociada.
     *
     * @param tema Tema recién creado al que se asociará la solicitud.
     */
    public void crearSolicitudAprobacionTema(Tema tema) {
        // 1) Obtener el tipo de solicitud
        TipoSolicitud tipoSolicitud = tipoSolicitudRepository
            .findByNombre("Aprobación de tema (por coordinador)")
            .orElseThrow(() ->
                new RuntimeException("Tipo de solicitud no configurado: Aprobación de tema (por coordinador)"));

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
                us.setAprovado(false);
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


}

package pucp.edu.pe.sgta.service.imp;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.springdoc.core.converters.models.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pucp.edu.pe.sgta.dto.AprobarSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudResponseDto.AprobarAsignacionDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.SolicitudCambioAsesorDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto.AsignacionDto;
import pucp.edu.pe.sgta.dto.SolicitudCeseDto;
import pucp.edu.pe.sgta.model.Solicitud;
import pucp.edu.pe.sgta.model.UsuarioXSolicitud;
import pucp.edu.pe.sgta.model.UsuarioXTema;
import pucp.edu.pe.sgta.repository.SolicitudRepository;
import pucp.edu.pe.sgta.repository.SubAreaConocimientoXTemaRepository;
import pucp.edu.pe.sgta.repository.UsuarioXSolicitudRepository;
import pucp.edu.pe.sgta.repository.UsuarioXTemaRepository;
import pucp.edu.pe.sgta.service.inter.SolicitudService;

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
}

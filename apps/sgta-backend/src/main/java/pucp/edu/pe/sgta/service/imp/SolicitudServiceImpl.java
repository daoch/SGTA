package pucp.edu.pe.sgta.service.imp;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.springdoc.core.converters.models.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.SolicitudCeseDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.mapper.TemaMapper;
import pucp.edu.pe.sgta.mapper.UsuarioMapper;
import pucp.edu.pe.sgta.model.Solicitud;
import pucp.edu.pe.sgta.model.UsuarioXSolicitud;
import pucp.edu.pe.sgta.repository.SolicitudRepository;
import pucp.edu.pe.sgta.repository.UsuarioXSolicitudRepository;
import pucp.edu.pe.sgta.service.inter.SolicitudService;

@Service
public class SolicitudServiceImpl implements SolicitudService {
    @Autowired
    private SolicitudRepository solicitudRepository;
    @Autowired
    private UsuarioXSolicitudRepository usuarioXSolicitudRepository;

    public SolicitudCeseDto findAllSolicitudesCese(int page, int size) {
        List<Solicitud> allSolicitudes = solicitudRepository.findByTipoSolicitudId(2);

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
                    10, // cantidad de proyectos actuales
                    "" // URL foto
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
                "", // respuesta
                solicitud.getFechaModificacion() != null ? solicitud.getFechaModificacion().toLocalDate() : null,
                asesor,
                students
            );
        }).toList();
        
        return new SolicitudCeseDto(requestList, totalPages);
    }
}

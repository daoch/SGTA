package pucp.edu.pe.sgta.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import pucp.edu.pe.sgta.dto.ObservacionesRevisionDTO;
import pucp.edu.pe.sgta.dto.revision.CommentDto;
import pucp.edu.pe.sgta.dto.revision.ContentDto;
import pucp.edu.pe.sgta.dto.revision.HighlightDto;
import pucp.edu.pe.sgta.dto.revision.PositionDto;
import pucp.edu.pe.sgta.dto.revision.ScaledDto;
import pucp.edu.pe.sgta.model.BoundingRect;
import pucp.edu.pe.sgta.model.Observacion;
import pucp.edu.pe.sgta.model.Rect;
import pucp.edu.pe.sgta.model.RevisionDocumento;
import pucp.edu.pe.sgta.model.RevisionXDocumento;
import pucp.edu.pe.sgta.model.TipoObservacion;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.repository.ObservacionRepository;
import pucp.edu.pe.sgta.repository.RevisionDocumentoRepository;
import pucp.edu.pe.sgta.repository.RevisionXDocumentoRepository;
import pucp.edu.pe.sgta.repository.TipoObservacionRepository;
import pucp.edu.pe.sgta.repository.UsuarioRepository;
import pucp.edu.pe.sgta.service.inter.ObservacionService;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ObservacionServiceImpl implements ObservacionService {

    @Autowired
    private ObservacionRepository observacionRepository;

    @Autowired
    private RevisionDocumentoRepository revisionDocumentoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private TipoObservacionRepository tipoObservacionRepository;

    @Transactional
    public Integer guardarObservaciones(Integer revisionId, HighlightDto h, Integer usuarioId) {
        RevisionDocumento revision = revisionDocumentoRepository.findById(revisionId)
                .orElseThrow(() -> new RuntimeException("Revisión no encontrada"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String nombreTipo = h.getComment().getEmoji(); // Cambia esto si el campo es otro
        Integer tipoId = getTipoObservacionIdByNombre(nombreTipo);

        TipoObservacion tipoObservacion = tipoObservacionRepository.findById(tipoId)
                .orElseThrow(() -> new RuntimeException("Tipo de observación no encontrado"));
        Observacion obs = new Observacion();
        obs.setRevisionDocumento(revision);
        obs.setUsuarioCreacion(revision.getUsuario());
        obs.setComentario(h.getComment().getText());
        obs.setNumeroPaginaInicio(h.getPosition().getPageNumber());
        obs.setNumeroPaginaFin(h.getPosition().getPageNumber());
        obs.setFechaCreacion(ZonedDateTime.now());
        obs.setContenido(h.getContent().getText());
        obs.setActivo(true);
        obs.setFechaModificacion(ZonedDateTime.now());
        obs.setTipoObservacion(tipoObservacion);
        // Mapear boundingRect
        if (h.getPosition().getBoundingRect() != null) {
            var b = h.getPosition().getBoundingRect();
            BoundingRect boundingRect = new BoundingRect();
            boundingRect.setX1(b.getX1());
            boundingRect.setY1(b.getY1());
            boundingRect.setX2(b.getX2());
            boundingRect.setY2(b.getY2());
            boundingRect.setWidth(b.getWidth());
            boundingRect.setHeight(b.getHeight());
            boundingRect.setPageNumber(b.getPageNumber());
            obs.setBoundingRect(boundingRect);
        }

        // Mapear rects
        List<Rect> rects = new ArrayList<>();
        if (h.getPosition().getRects() != null) {
            for (var r : h.getPosition().getRects()) {
                Rect rect = new Rect();
                rect.setX1(r.getX1());
                rect.setY1(r.getY1());
                rect.setX2(r.getX2());
                rect.setY2(r.getY2());
                rect.setWidth(r.getWidth());
                rect.setHeight(r.getHeight());
                rect.setPageNumber(r.getPageNumber());
                rects.add(rect);
            }
        }
        obs.setRects(rects);

        obs.setFechaModificacion(ZonedDateTime.now());
        observacionRepository.saveAndFlush(obs);
        System.out.println("Observación guardada: " + obs.getObservacionId());
        return obs.getObservacionId(); // Retorna el ID de la observación guardada
    }

    public List<Observacion> obtenerObservacionesPorRevision(Integer revisionId) {
        return observacionRepository.findByRevisionDocumento_Id(revisionId);
    }

    public List<HighlightDto> obtenerHighlightsPorRevision(Integer revisionId) {
        List<Observacion> observaciones = observacionRepository.findByRevisionDocumento_Id(revisionId);
        List<HighlightDto> dtos = new ArrayList<>();
        for (Observacion obs : observaciones) {
            HighlightDto dto = mapObservacionToHighlightDto(obs);
            dtos.add(dto);
        }
        return dtos;
    }

    private HighlightDto mapObservacionToHighlightDto(Observacion obs) {
        // Mapear PositionDto
        PositionDto.PositionDtoBuilder positionBuilder = PositionDto.builder()
                .pageNumber(obs.getNumeroPaginaInicio());

        // Mapear BoundingRect si existe
        if (obs.getBoundingRect() != null) {
            BoundingRect b = obs.getBoundingRect();
            positionBuilder.boundingRect(
                    ScaledDto.builder()
                            .x1(b.getX1())
                            .y1(b.getY1())
                            .x2(b.getX2())
                            .y2(b.getY2())
                            .width(b.getWidth())
                            .height(b.getHeight())
                            .pageNumber(b.getPageNumber())
                            .build());
        }

        // Mapear rects si existen
        if (obs.getRects() != null && !obs.getRects().isEmpty()) {
            List<ScaledDto> scaledDtos = new ArrayList<>();
            for (Rect r : obs.getRects()) {
                scaledDtos.add(ScaledDto.builder()
                        .x1(r.getX1())
                        .y1(r.getY1())
                        .x2(r.getX2())
                        .y2(r.getY2())
                        .width(r.getWidth())
                        .height(r.getHeight())
                        .pageNumber(r.getPageNumber())
                        .build());
            }
            positionBuilder.rects(scaledDtos);
        }

        // Mapear ContentDto
        ContentDto contentDto = ContentDto.builder()
                .text(obs.getContenido())
                .build();

        // Mapear CommentDto
        CommentDto commentDto = CommentDto.builder()
                .text(obs.getComentario())
                .emoji(obs.getTipoObservacion() != null ? obs.getTipoObservacion().getNombreTipo() : null)
                .build();

        // Construir HighlightDto
        return HighlightDto.builder()
                .id(obs.getObservacionId())
                .position(positionBuilder.build())
                .content(contentDto)
                .comment(commentDto)
                .corregido(obs.getCorregido() != null ? obs.getCorregido() : false)
                .build();
    }

    private Integer getTipoObservacionIdByNombre(String nombre) {
        return switch (nombre) {
            case "Contenido" -> 1;
            case "Similitud" -> 2;
            case "Citado" -> 3;
            case "Inteligencia Artificial" -> 4;
            default -> 1; // Por defecto, Contenido
        };
    }

    @Override
    public List<ObservacionesRevisionDTO> obtenerObservacionesPorEntregableYTema(Integer entregableId, Integer temaId) {
        List<Object[]> result = observacionRepository.listarObservacionesPorEntregableYTema(entregableId, temaId);
        List<ObservacionesRevisionDTO> dtoList = new ArrayList<>();

        for (Object[] row : result) {
            ObservacionesRevisionDTO dto = new ObservacionesRevisionDTO();

            dto.setObservacionId((Integer) row[0]);
            dto.setComentario((String) row[1]);
            dto.setContenido((String) row[2]);
            dto.setNumeroPaginaInicio((Integer) row[3]);
            dto.setNumeroPaginaFin((Integer) row[4]);
            dto.setFechaCreacion(row[5] != null ? ((Instant) row[5]).atOffset(ZoneOffset.UTC) : null);
            dto.setTipoObservacionId((Integer) row[6]);
            dto.setRevisionId((Integer) row[7]);
            dto.setUsuarioCreacionId((Integer) row[8]);
            dto.setNombres((String) row[9]);
            dto.setPrimerApellido((String) row[10]);
            dto.setSegundoApellido((String) row[11]);
            dto.setRolesUsuario((String) row[12]);
            dto.setCorregido((Boolean) row[13]);

            dtoList.add(dto);
        }

        return dtoList;
    }

    public void borradoLogicoObservacion(Integer observacionId) {
        Observacion obs = observacionRepository.findById(observacionId)
                .orElseThrow(() -> new RuntimeException("Observación no encontrada"));
        obs.setActivo(false); // O el campo que uses para el borrado lógico
        observacionRepository.save(obs);
    }

    @Override
    @Transactional
    public void actualizarEstadoCorregido(Integer observacionId, boolean corregido) {
        observacionRepository.actualizarCorregidoPorId(observacionId, corregido);
    }
}

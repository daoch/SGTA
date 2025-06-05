package pucp.edu.pe.sgta.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pucp.edu.pe.sgta.dto.ObservacionesRevisionDTO;
import pucp.edu.pe.sgta.dto.revision.HighlightDto;
import pucp.edu.pe.sgta.model.BoundingRect;
import pucp.edu.pe.sgta.model.Observacion;
import pucp.edu.pe.sgta.model.Rect;
import pucp.edu.pe.sgta.model.RevisionDocumento;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.repository.ObservacionRepository;
import pucp.edu.pe.sgta.repository.RevisionDocumentoRepository;
import pucp.edu.pe.sgta.repository.UsuarioRepository;
import pucp.edu.pe.sgta.service.inter.ObservacionService;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.sql.Timestamp;

@Service
public class ObservacionServiceImpl implements ObservacionService {

    @Autowired
    private ObservacionRepository observacionRepository;

    @Autowired
    private RevisionDocumentoRepository revisionDocumentoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public void guardarObservaciones(Integer revisionId, List<HighlightDto> highlights, Integer usuarioId) {
        RevisionDocumento revision = revisionDocumentoRepository.findById(revisionId)
                .orElseThrow(() -> new RuntimeException("Revisión no encontrada"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        for (HighlightDto h : highlights) {
            Observacion obs = new Observacion();
            obs.setRevisionDocumento(revision);
            obs.setUsuarioCreacion(usuario);
            obs.setComentario(h.getComment().getText());
            obs.setNumeroPaginaInicio(h.getPosition().getPageNumber());
            obs.setNumeroPaginaFin(h.getPosition().getPageNumber());
            obs.setFechaCreacion(ZonedDateTime.now());
            obs.setActivo(true);

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

            observacionRepository.save(obs);
        }
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

            dtoList.add(dto);
        }

        return dtoList;
    }
}
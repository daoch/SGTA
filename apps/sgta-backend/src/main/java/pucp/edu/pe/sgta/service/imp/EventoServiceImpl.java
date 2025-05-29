package pucp.edu.pe.sgta.service.imp;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.ArrayList;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.EventoDto;
import pucp.edu.pe.sgta.model.Reunion;
import pucp.edu.pe.sgta.model.UsuarioXReunion;
import pucp.edu.pe.sgta.repository.EntregableRepository;
import pucp.edu.pe.sgta.repository.ExposicionRepository;
import pucp.edu.pe.sgta.repository.UsuarioXReunionRepository;
import pucp.edu.pe.sgta.repository.UsuarioXTemaRepository;
import pucp.edu.pe.sgta.service.inter.EventoService;
import pucp.edu.pe.sgta.util.TipoEventoEnum;

@Service
public class EventoServiceImpl implements EventoService {

    private final UsuarioXReunionRepository usuarioXReunionRepo;
    private final ExposicionRepository exposicionRepo;
    private final EntregableRepository entregableRepo;

    public EventoServiceImpl(UsuarioXReunionRepository usuarioXReunionRepo, UsuarioXTemaRepository usuarioXTemaRepo, EntregableRepository entregableRepo, ExposicionRepository exposicionRepo) {
        this.usuarioXReunionRepo = usuarioXReunionRepo;
        this.entregableRepo = entregableRepo;
        this.exposicionRepo = exposicionRepo;
    }

    @Override
    public List<EventoDto> listarEventosXUsuario(Integer usuarioId) {
        List<EventoDto> eventos = new ArrayList<>();

        // 1. Reuniones
        List<UsuarioXReunion> reuniones = usuarioXReunionRepo.findByUsuarioIdAndActivoTrue(usuarioId);
        for (UsuarioXReunion ur : reuniones) {
            Reunion reunion = ur.getReunion();
            if (reunion.getActivo()) {
                eventos.add(new EventoDto(
                        reunion.getId(),
                        reunion.getTitulo(),
                        reunion.getDescripcion(),
                        TipoEventoEnum.REUNION,
                        reunion.getFechaHoraInicio(),
                        reunion.getFechaHoraFin(),
                        true
                ));
            }
        }

        // 2. Entregables
        List<Object[]> entregables = entregableRepo.listarEntregablesXUsuario(usuarioId);
        for (Object[] obj : entregables) {
            Integer entregableId = (Integer) obj[0];
            String nombre = (String) obj[1];
            String descripcion = (String) obj[2];
            OffsetDateTime fechaInicio = OffsetDateTime.ofInstant((Instant) obj[3], ZoneId.systemDefault());
            OffsetDateTime fechaFin = OffsetDateTime.ofInstant((Instant) obj[4], ZoneId.systemDefault());

            EventoDto evento = new EventoDto();
            evento.setId(entregableId);
            evento.setNombre(nombre);
            evento.setDescripcion(descripcion);
            evento.setTipo(TipoEventoEnum.ENTREGABLE);
            evento.setFechaInicio(fechaInicio);
            evento.setFechaFin(fechaFin);
            evento.setActivo(true);

            eventos.add(evento);
        }

        // 3. Exposiciones (si se relacionan a través de la misma EtapaFormativaXCiclo)
        List<Object[]> exposiciones = exposicionRepo.listarExposicionesXUsuario(usuarioId);
        for (Object[] obj : exposiciones) {
            Integer exposicionId = (Integer) obj[0];
            String nombre = (String) obj[1];
            String descripcion = (String) obj[2];
            OffsetDateTime fechaInicio = OffsetDateTime.ofInstant((Instant) obj[3], ZoneId.systemDefault());
            OffsetDateTime fechaFin = OffsetDateTime.ofInstant((Instant) obj[4], ZoneId.systemDefault());

            EventoDto evento = new EventoDto();
            evento.setId(exposicionId);
            evento.setNombre(nombre);
            evento.setDescripcion(descripcion);
            evento.setTipo(TipoEventoEnum.EXPOSICION);
            evento.setFechaInicio(fechaInicio);
            evento.setFechaFin(fechaFin);
            evento.setActivo(true);

            eventos.add(evento);
        }

        return eventos;
    }
}

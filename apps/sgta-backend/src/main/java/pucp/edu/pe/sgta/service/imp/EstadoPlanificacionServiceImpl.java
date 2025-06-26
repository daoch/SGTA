package pucp.edu.pe.sgta.service.imp;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.EstadoPlanificacionDto;
import pucp.edu.pe.sgta.mapper.EstadoPlanificacionMapper;
import pucp.edu.pe.sgta.model.EstadoPlanificacion;
import pucp.edu.pe.sgta.repository.EstadoPlanificacionRepository;
import pucp.edu.pe.sgta.service.inter.EstadoPlanificacionService;

@Service
public class EstadoPlanificacionServiceImpl implements EstadoPlanificacionService {
    private final EstadoPlanificacionRepository estadoPlanificacionRepository;

    public EstadoPlanificacionServiceImpl(EstadoPlanificacionRepository estadoPlanificacionRepository) {
        this.estadoPlanificacionRepository = estadoPlanificacionRepository;
    }

    @Override
    public List<EstadoPlanificacionDto> getAll() {
        return estadoPlanificacionRepository.findAll().stream()
                .map(EstadoPlanificacionMapper::toDto)
                .toList();
    }

    @Override
    public EstadoPlanificacionDto findById(Integer id) {
        EstadoPlanificacion estadoPlanificacion = estadoPlanificacionRepository.findById(id).orElse(null);
        if (estadoPlanificacion != null) {
            return EstadoPlanificacionMapper.toDto(estadoPlanificacion);
        }
        return null;
    }

    @Override
    public void create(EstadoPlanificacionDto dto) {
    }

    @Override
    public void update(EstadoPlanificacionDto dto) {
    }

    @Override
    public void delete(Integer id) {
    }

    @Override
    public EstadoPlanificacionDto getByIdExposicion(Integer id) {

        List<Object[]> results = estadoPlanificacionRepository.getByIdExposicion(id);
        if (results == null || results.size() > 1)
            return null;

        Object[] obj = results.get(0);

        EstadoPlanificacionDto dto = new EstadoPlanificacionDto();
        dto.setId((Integer) obj[0]);
        dto.setNombre((String) obj[1]);
        dto.setFechaCreacion(obj[2] != null
                ? ((Instant) obj[2]).atZone(ZoneId.of("America/Lima")).toOffsetDateTime()
                : null);
        dto.setFechaModificacion(obj[3] != null
                ? ((Instant) obj[3]).atZone(ZoneId.of("America/Lima")).toOffsetDateTime()
                : null);
        dto.setActivo((Boolean) obj[4]);

        return dto;
    }
}

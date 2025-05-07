package pucp.edu.pe.sgta.service.imp;

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
        return List.of();
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
}

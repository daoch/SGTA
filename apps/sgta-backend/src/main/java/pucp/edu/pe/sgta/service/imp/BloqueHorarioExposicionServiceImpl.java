package pucp.edu.pe.sgta.service.imp;

import java.util.List;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.BloqueHorarioExposicionDto;
import pucp.edu.pe.sgta.mapper.BloqueHorarioExposicionMapper;
import pucp.edu.pe.sgta.model.BloqueHorarioExposicion;
import pucp.edu.pe.sgta.repository.BloqueHorarioExposicionRepository;
import pucp.edu.pe.sgta.service.inter.BloqueHorarioExposicionService;

@Service
public class BloqueHorarioExposicionServiceImpl implements BloqueHorarioExposicionService {

    private final BloqueHorarioExposicionRepository bloqueHorarioExposicionRepository;

    public BloqueHorarioExposicionServiceImpl(BloqueHorarioExposicionRepository bloqueHorarioExposicionRepository) {
        this.bloqueHorarioExposicionRepository = bloqueHorarioExposicionRepository;
    }

    @Override
    public List<BloqueHorarioExposicionDto> getAll() {
        return List.of();
    }

    @Override
    public BloqueHorarioExposicionDto findById(Integer id) {
        BloqueHorarioExposicion bloqueHorarioExposicion = bloqueHorarioExposicionRepository.findById(id).orElse(null);
        if (bloqueHorarioExposicion != null) {
            return BloqueHorarioExposicionMapper.toDTO(bloqueHorarioExposicion);
        }
        return null;
    }

    @Override
    public void create(BloqueHorarioExposicionDto dto) {

    }

    @Override
    public void update(BloqueHorarioExposicionDto dto) {

    }

    @Override
    public void delete(Integer id) {

    }
}

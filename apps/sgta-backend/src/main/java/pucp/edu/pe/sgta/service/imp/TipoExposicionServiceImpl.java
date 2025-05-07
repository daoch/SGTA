package pucp.edu.pe.sgta.service.imp;

import java.util.List;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.TipoExposicionDto;
import pucp.edu.pe.sgta.mapper.TipoExposicionMapper;
import pucp.edu.pe.sgta.model.TipoExposicion;
import pucp.edu.pe.sgta.repository.TipoExposicionRepository;
import pucp.edu.pe.sgta.service.inter.TipoExposicionService;

@Service
public class TipoExposicionServiceImpl implements TipoExposicionService {
    private final TipoExposicionRepository tipoExposicionRepository;

    public TipoExposicionServiceImpl(TipoExposicionRepository tipoExposicionRepository) {
        this.tipoExposicionRepository = tipoExposicionRepository;
    }

    @Override
    public List<TipoExposicionDto> getAll() {
        return tipoExposicionRepository.findAll()
                .stream()
                .map(TipoExposicionMapper::toDto)
                .toList();
    }

    @Override
    public TipoExposicionDto findById(Integer id) {
        TipoExposicion tipoExposicion = tipoExposicionRepository.findById(id).orElse(null);
        if (tipoExposicion != null) {
            return TipoExposicionMapper.toDto(tipoExposicion);
        }
        return null;
    }

    @Override
    public void create(TipoExposicionDto dto) {
    }

    @Override
    public void update(TipoExposicionDto dto) {
    }

    @Override
    public void delete(Integer id) {
    }

}

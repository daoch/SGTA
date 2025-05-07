package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.TipoExposicionXEfXCDto;
import pucp.edu.pe.sgta.mapper.TipoExposicionXEfXCMapper;
import pucp.edu.pe.sgta.model.TipoExposicionXEfXC;
import pucp.edu.pe.sgta.repository.TipoExposicionXEfXCRepository;
import pucp.edu.pe.sgta.service.inter.TipoExposicionXEfXCService;

import java.util.List;

@Service
public class TipoExposicionXEfXCServiceImpl implements TipoExposicionXEfXCService {

    private final TipoExposicionXEfXCRepository tipoExposicionXEfXCRepository;

    public TipoExposicionXEfXCServiceImpl(TipoExposicionXEfXCRepository tipoExposicionXEfXCRepository) {
        this.tipoExposicionXEfXCRepository = tipoExposicionXEfXCRepository;
    }

    @Override
    public List<TipoExposicionXEfXCDto> getAll() {
        return List.of();
    }

    @Override
    public TipoExposicionXEfXCDto findById(Integer id) {
        TipoExposicionXEfXC tipoExposicionXEfXC = tipoExposicionXEfXCRepository.findById(id).orElse(null);
        if (tipoExposicionXEfXC != null) {
            return TipoExposicionXEfXCMapper.toDto(tipoExposicionXEfXC);
        }
        return null;
    }

    @Override
    public void create(TipoExposicionXEfXCDto dto) {

    }

    @Override
    public void update(TipoExposicionXEfXCDto dto) {

    }

    @Override
    public void delete(Integer id) {

    }

}

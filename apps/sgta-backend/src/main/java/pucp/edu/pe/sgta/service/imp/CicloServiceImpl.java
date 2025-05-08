package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.CicloDto;
import pucp.edu.pe.sgta.mapper.CicloMapper;
import pucp.edu.pe.sgta.model.Ciclo;
import pucp.edu.pe.sgta.repository.CicloRepository;
import pucp.edu.pe.sgta.service.inter.CicloService;

import java.util.List;

@Service
public class CicloServiceImpl implements CicloService {

    private final CicloRepository cicloRepository;

    public CicloServiceImpl(CicloRepository cicloRepository) {
        this.cicloRepository = cicloRepository;
    }

    @Override
    public List<CicloDto> getAll() {
        return List.of();
    }

    @Override
    public CicloDto findById(Integer id) {
        Ciclo ciclo = cicloRepository.findById(id).orElse(null);
        if (ciclo != null) {
            return CicloMapper.toDto(ciclo);
        }
        return null;
    }

    @Override
    public void create(CicloDto dto) {

    }

    @Override
    public void update(CicloDto dto) {

    }

    @Override
    public void delete(Integer id) {

    }

    @Override
    public List<Ciclo> listarCiclosOrdenados() {
        return cicloRepository.findAllOrderByActivoAndFechaInicioDesc();
    }
}

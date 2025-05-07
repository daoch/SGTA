package pucp.edu.pe.sgta.service.imp;

import java.util.List;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.CriterioExposicionDto;
import pucp.edu.pe.sgta.mapper.CriterioExposicionMapper;
import pucp.edu.pe.sgta.model.CriterioExposicion;
import pucp.edu.pe.sgta.repository.CriterioExposicionRepository;
import pucp.edu.pe.sgta.service.inter.CriterioExposicionService;

@Service
public class CriterioExposicionServiceImpl implements CriterioExposicionService {
    private final CriterioExposicionRepository criterioExposicionRepository;

    public CriterioExposicionServiceImpl(CriterioExposicionRepository criterioExposicionRepository) {
        this.criterioExposicionRepository = criterioExposicionRepository;
    }

    @Override
    public List<CriterioExposicionDto> getAll() {
        return List.of();
    }

    @Override
    public CriterioExposicionDto findById(Integer id) {
        CriterioExposicion criterioExposicion = criterioExposicionRepository.findById(id).orElse(null);
        if (criterioExposicion != null) {
            return CriterioExposicionMapper.toDTO(criterioExposicion);
        }
        return null;
    }

    @Override
    public void create(CriterioExposicionDto dto) {

    }

    @Override
    public void update(CriterioExposicionDto dto) {

    }

    @Override
    public void delete(Integer id) {

    }
}

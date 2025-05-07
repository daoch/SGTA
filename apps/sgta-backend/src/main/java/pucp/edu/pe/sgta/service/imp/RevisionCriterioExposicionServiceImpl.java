package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.RevisionCriterioExposicionDto;
import pucp.edu.pe.sgta.mapper.RevisionCriterioExposicionMapper;
import pucp.edu.pe.sgta.model.RevisionCriterioExposicion;
import pucp.edu.pe.sgta.repository.RevisionCriterioExposicionRepository;
import pucp.edu.pe.sgta.service.inter.RevisionCriterioExposicionService;

import java.util.List;

@Service
public class RevisionCriterioExposicionServiceImpl implements RevisionCriterioExposicionService {

    private final RevisionCriterioExposicionRepository revisionCriterioExposicionRepository;

    public RevisionCriterioExposicionServiceImpl(
            RevisionCriterioExposicionRepository revisionCriterioExposicionRepository) {
        this.revisionCriterioExposicionRepository = revisionCriterioExposicionRepository;
    }

    @Override
    public List<RevisionCriterioExposicionDto> getAll() {
        return List.of();
    }

    @Override
    public RevisionCriterioExposicionDto findById(Integer id) {
        RevisionCriterioExposicion revisionCriterioExposicion = revisionCriterioExposicionRepository.findById(id)
                .orElse(null);
        if (revisionCriterioExposicion != null) {
            return RevisionCriterioExposicionMapper.toDto(revisionCriterioExposicion);
        }
        return null;
    }

    @Override
    public void create(RevisionCriterioExposicionDto dto) {

    }

    @Override
    public void update(RevisionCriterioExposicionDto dto) {

    }

    @Override
    public void delete(Integer id) {

    }

}

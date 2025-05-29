package pucp.edu.pe.sgta.service.imp;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pucp.edu.pe.sgta.model.Reunion;
import pucp.edu.pe.sgta.repository.ReunionRepository;
import pucp.edu.pe.sgta.service.inter.ReunionService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReunionServiceImpl implements ReunionService {

    private final ReunionRepository reunionRepository;

    @Override
    public List<Reunion> findAll() {
        return reunionRepository.findByActivoTrue();
    }

    @Override
    public Optional<Reunion> findById(Integer id) {
        return reunionRepository.findByIdAndActivoTrue(id);
    }

    @Override
    public List<Reunion> findAllOrderedByDate() {
        return reunionRepository.findByActivoTrueOrderByFechaHoraInicioDesc();
    }

}
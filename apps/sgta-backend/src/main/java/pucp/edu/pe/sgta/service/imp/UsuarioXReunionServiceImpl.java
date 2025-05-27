package pucp.edu.pe.sgta.service.imp;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pucp.edu.pe.sgta.model.UsuarioXReunion;
import pucp.edu.pe.sgta.repository.UsuarioXReunionRepository;
import pucp.edu.pe.sgta.service.inter.UsuarioXReunionService;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UsuarioXReunionServiceImpl implements UsuarioXReunionService {

    private final UsuarioXReunionRepository usuarioXReunionRepository;

    @Override
    public List<UsuarioXReunion> findAll() {
        return usuarioXReunionRepository.findByActivoTrue();
    }

    @Override
    public List<UsuarioXReunion> findByUsuarioId(Integer usuarioId) {
        return usuarioXReunionRepository.findByUsuarioIdAndActivoTrue(usuarioId);
    }

    @Override
    public List<UsuarioXReunion> findByReunionId(Integer reunionId) {
        return usuarioXReunionRepository.findByReunionIdAndActivoTrue(reunionId);
    }

    @Override
    public List<UsuarioXReunion> findByUsuarioIdOrderedByDate(Integer usuarioId) {
        return usuarioXReunionRepository.findByUsuarioIdAndActivoTrueOrderByReunionFechaHoraInicioDesc(usuarioId);
    }

}
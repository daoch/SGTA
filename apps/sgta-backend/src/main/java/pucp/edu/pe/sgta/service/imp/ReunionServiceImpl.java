package pucp.edu.pe.sgta.service.imp;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pucp.edu.pe.sgta.model.Reunion;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.model.UsuarioXReunion;
import pucp.edu.pe.sgta.repository.ReunionRepository;
import pucp.edu.pe.sgta.repository.UsuarioXReunionRepository;
import pucp.edu.pe.sgta.service.inter.ReunionService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReunionServiceImpl implements ReunionService {

    private final ReunionRepository reunionRepository;
    private final UsuarioXReunionRepository usuarioXReunionRepository;

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

    @Override
    @Transactional
    public Reunion save(Reunion reunion) {
        return reunionRepository.save(reunion);
    }

    @Override
    @Transactional
    public Reunion update(Integer id, Reunion reunionActualizada) throws Exception {
        Reunion reunionExistente = reunionRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new Exception("Reunión no encontrada con ID: " + id));

        reunionExistente.setTitulo(reunionActualizada.getTitulo());
        reunionExistente.setDescripcion(reunionActualizada.getDescripcion());
        reunionExistente.setFechaHoraInicio(reunionActualizada.getFechaHoraInicio());
        reunionExistente.setFechaHoraFin(reunionActualizada.getFechaHoraFin());
        reunionExistente.setUrl(reunionActualizada.getUrl());
        reunionExistente.setDisponible(reunionActualizada.getDisponible());

        return reunionRepository.save(reunionExistente);
    }

    @Override
    @Transactional
    public void delete(Integer id) throws Exception {
        Reunion reunion = reunionRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new Exception("Reunión no encontrada con ID: " + id));
        reunion.setActivo(false);
        reunionRepository.save(reunion);
    }

    @Override
    @Transactional
    public Reunion guardarConUsuarios(Reunion reunion, List<Usuario> usuarios) {
        Reunion reunionGuardada = reunionRepository.save(reunion);

        // asociar usuarios a la reunión
        for (Usuario usuario : usuarios) {
            UsuarioXReunion usuarioXReunion = new UsuarioXReunion();
            usuarioXReunion.setReunion(reunionGuardada);
            usuarioXReunion.setUsuario(usuario);
            usuarioXReunion.setEstadoAsistencia("PENDIENTE");
            usuarioXReunion.setActivo(true);
            usuarioXReunionRepository.save(usuarioXReunion);
        }

        return reunionGuardada;
    }
}
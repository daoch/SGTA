package pucp.edu.pe.sgta.service.imp;


import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.mapper.TemaMapper;
import pucp.edu.pe.sgta.mapper.UsuarioMapper;
import pucp.edu.pe.sgta.model.Tema;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.model.UsuarioXTema;
import pucp.edu.pe.sgta.repository.TemaRepository;
import pucp.edu.pe.sgta.repository.UsuarioRepository;
import pucp.edu.pe.sgta.repository.UsuarioXTemaRepository;
import pucp.edu.pe.sgta.service.inter.TemaService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TemaServiceImpl implements TemaService {
    private final TemaRepository temaRepository;
    private final UsuarioXTemaRepository usuarioXTemaRepository;

    @Autowired
    private UsuarioService usuarioService;

    public TemaServiceImpl(TemaRepository temaRepository, UsuarioXTemaRepository usuarioXTemaRepository,
                           UsuarioService usuarioService) {
        this.temaRepository = temaRepository;
        this.usuarioXTemaRepository = usuarioXTemaRepository;
    }


    @Override
    public List<TemaDto> getAll() {
        List<Tema> temas = temaRepository.findAll();
        List<TemaDto> temasDto = temas.stream()
                .map(TemaMapper::toDto)
                .toList(); //we map to DTO
        return temasDto;
    }

    @Override
    public TemaDto findById(Integer id) {
        Tema tema = temaRepository.findById(id).orElse(null);
        if (tema != null) {
            return TemaMapper.toDto(tema);
        }
        return null;
    }

    @Override
    @Transactional
    public void createTema(TemaDto dto, Integer idUsuario) { //This method atomically creates a Tema with its creator (user)
        // Convert DTO to entity
        dto.setId(null);
        Tema tema = TemaMapper.toEntity(dto);

        // Save the Tema first to generate its ID
        temaRepository.save(tema);

        // Create and set up UsuarioXTema

        UsuarioXTema usuarioXTema = new UsuarioXTema();
        usuarioXTema.setId(null);
        usuarioXTema.setTema(tema);

        UsuarioDto usuarioDto = usuarioService.findUsuarioById(idUsuario);

        if (usuarioDto == null) {
            throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
        }

        usuarioXTema.setUsuario(UsuarioMapper.toEntity(usuarioDto));

        usuarioXTema.setAsignado(true);
        usuarioXTema.setActivo(true);
        usuarioXTema.setFechaCreacion(OffsetDateTime.now());

        usuarioXTemaRepository.save(usuarioXTema);
    }

    @Override
    public void update(TemaDto dto) {
        Tema tema = TemaMapper.toEntity(dto);
        temaRepository.save(tema);
    }

    @Override
    public void delete(Integer id) {
        Tema tema = temaRepository.findById(id).orElse(null);
        if (tema != null) {
            tema.setActivo(false);
            temaRepository.save(tema); // Set activo to false instead of deleting
        }
    }

    @Override
    public List<TemaDto> findByUsuario(Integer idUsuario) {
        List<UsuarioXTema> relations = usuarioXTemaRepository.findByUsuarioIdAndActivoTrue(idUsuario);

        if (!relations.isEmpty()) {
            return relations.stream()
                    .map(ux -> TemaMapper.toDto(ux.getTema()))
                    .collect(Collectors.toList());
        }
        return List.of(); // Return an empty list if no relations found

    }
}
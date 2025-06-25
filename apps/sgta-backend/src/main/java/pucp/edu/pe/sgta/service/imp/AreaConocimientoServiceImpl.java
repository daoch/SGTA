package pucp.edu.pe.sgta.service.imp;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.AreaConocimientoDto;
import pucp.edu.pe.sgta.mapper.AreaConocimientoMapper;
import pucp.edu.pe.sgta.model.AreaConocimiento;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.repository.AreaConocimientoRepository;
import pucp.edu.pe.sgta.dto.asesores.InfoAreaConocimientoDto;
import pucp.edu.pe.sgta.mapper.InfoAreaConocimientoMapper;
import pucp.edu.pe.sgta.repository.CarreraRepository;
import pucp.edu.pe.sgta.service.inter.AreaConocimientoService;

import pucp.edu.pe.sgta.model.Carrera;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import pucp.edu.pe.sgta.repository.UsuarioXCarreraRepository;
import pucp.edu.pe.sgta.repository.UsuarioRepository;
import pucp.edu.pe.sgta.model.UsuarioXCarrera;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;


@Service
public class AreaConocimientoServiceImpl implements AreaConocimientoService {

    private final AreaConocimientoRepository areaConocimientoRepository;
    private final CarreraRepository carreraRepository;
    private final UsuarioXCarreraRepository usuarioCarreraRepository;
    private final UsuarioRepository usuarioRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private UsuarioService usuarioService;

    

    public AreaConocimientoServiceImpl(AreaConocimientoRepository areaConocimientoRepository,
            CarreraRepository carreraRepository,
            UsuarioXCarreraRepository usuarioCarreraRepository,
            UsuarioRepository usuarioRepository) {
        this.areaConocimientoRepository = areaConocimientoRepository;
        this.carreraRepository = carreraRepository;
        this.usuarioCarreraRepository = usuarioCarreraRepository;
        this.usuarioRepository = usuarioRepository;
        this.usuarioService = usuarioService;
    }

    // create
    @Override
    public AreaConocimientoDto create(AreaConocimientoDto dto, String idCognito) {

        UsuarioDto usuario = usuarioService.findByCognitoId(idCognito);
        List<Object[]> results = carreraRepository.obtenerCarreraCoordinador(usuario.getId());
        if (results != null && !results.isEmpty()) {
            Object[] result = results.get(0);
            Carrera carrera = new Carrera();
            carrera.setId((Integer) result[0]);
            // fecha Creacion
            dto.setFechaCreacion(OffsetDateTime.now());
            AreaConocimiento areaConocimiento = AreaConocimientoMapper.toEntity(dto);
            areaConocimiento.setCarrera(carrera);
            AreaConocimiento savedArea = areaConocimientoRepository.save(areaConocimiento);

            return AreaConocimientoMapper.toDto(savedArea);
        } else {
            throw new NoSuchElementException("No se encontró la carrera para el usuario con id: " + usuario.getId());
        }
        
    }

    @Override
    public AreaConocimientoDto findById(Integer id) {
        AreaConocimiento areaConocimiento = areaConocimientoRepository.findById(id).orElse(null);
        if (areaConocimiento != null) {
            return AreaConocimientoMapper.toDto(areaConocimiento);
        }
        return null;
    }

    @Override
    public List<AreaConocimientoDto> listarPorUsuario(Integer usuarioId) {

        List<AreaConocimientoDto> lista = new ArrayList<>();

        List<Object[]> resultados = entityManager
                .createNativeQuery("SELECT * FROM listar_areas_conocimiento_por_usuario(:usuarioId)")
                .setParameter("usuarioId", usuarioId)
                .getResultList();

        for (Object[] fila : resultados) {
            AreaConocimientoDto dto = new AreaConocimientoDto();
            dto.setId((Integer) fila[0]); // area_id
            dto.setIdCarrera((Integer) fila[3]);
            dto.setNombre((String) fila[1]); // area_nombre
            dto.setDescripcion((String) fila[2]);
            dto.setActivo(true);// descripcion
            lista.add(dto);
        }

        return lista;

    }

    @Override
    public List<AreaConocimientoDto> listarPorUsuarioSub(String usuarioId) {
        Optional<Usuario> usuario = usuarioRepository.findByIdCognito(usuarioId);
        if (usuario.isPresent()) {
           List<UsuarioXCarrera> relaciones = usuarioCarreraRepository
                    .findByUsuarioIdAndActivoTrue(usuario.get().getId());
            List<AreaConocimientoDto> dtos = new ArrayList<>();
            for (UsuarioXCarrera uxc : relaciones) {
                List<AreaConocimiento> areasConocimiento = areaConocimientoRepository
                        .findAllByCarreraIdAndActivoTrue(uxc.getCarrera().getId());
                 dtos.addAll(areasConocimiento.stream()
                         .map(AreaConocimientoMapper::toDto)
                         .toList());
            }
            return dtos;
        } else {
            throw new NoSuchElementException("No se encontró el usuario con idCognito: " + usuarioId);
        }
    }

    @Override
    public List<InfoAreaConocimientoDto> listarInfoPorNombre(String nombre) {
        return areaConocimientoRepository.findByNombreContainingIgnoreCaseAndActivoIsTrue(nombre)
                .stream()
                .map(InfoAreaConocimientoMapper::toDto).toList();
    }

    public void delete(Integer id) {
        AreaConocimiento areaConocimiento = areaConocimientoRepository.findById(id).orElse(null);
        if (areaConocimiento != null) {
            areaConocimiento.setActivo(false);
            areaConocimientoRepository.save(areaConocimiento);
        }
    }

    @Override
    public List<AreaConocimientoDto> getAll() {
        List<AreaConocimiento> areasConocimiento = areaConocimientoRepository.findAllByActivoTrue();
        List<AreaConocimientoDto> dtos = areasConocimiento.stream()
                .map(AreaConocimientoMapper::toDto)
                .toList();
        return dtos;
    }

    @Override
    public List<AreaConocimientoDto> getAllByCarrera(String idCognito) {
        UsuarioDto usuario = usuarioService.findByCognitoId(idCognito);
        List<Object[]> results = carreraRepository.obtenerCarreraCoordinador(usuario.getId());
        if (results != null && !results.isEmpty()) {
            Object[] result = results.get(0);
            Carrera carrera = new Carrera();
            carrera.setId((Integer) result[0]);
            carrera.setNombre((String) result[1]);
        
            Integer carreraId = carrera.getId();
            List<AreaConocimiento> areasConocimiento = areaConocimientoRepository
                .findAllByCarreraIdAndActivoTrue(carreraId);
            List<AreaConocimientoDto> dtos = areasConocimiento.stream()
                .map(AreaConocimientoMapper::toDto)
                .toList();
        return dtos;
        } else {
            throw new NoSuchElementException("No se encontró la carrera para el usuario con id: " + usuario.getId());
        }  

        
    }

    @Override
    public List<AreaConocimientoDto> getAllByIdExpo(Integer idExpo) {
        Integer idCarrera = carreraRepository.obtenerIdCarreraPorIdExpo(idExpo);
        List<AreaConocimiento> areasConocimiento = areaConocimientoRepository
                .findAllByCarreraIdAndActivoTrue(idCarrera);
        List<AreaConocimientoDto> dtos = areasConocimiento.stream()
                .map(AreaConocimientoMapper::toDto)
                .toList();
        return dtos;
    }

    @Override
    public void update(AreaConocimientoDto dto) {

    }

    @Override
    public List<InfoAreaConocimientoDto> listarPorCarrerasUsuarioParaPerfil(Integer idUsuario) {
        List<Integer> idCarrerasUsuario = new ArrayList<>();
        List<Object[]> resultCarreras = carreraRepository.listarCarrerasPorIdUsusario(idUsuario);
        for (Object[] row : resultCarreras) {
            idCarrerasUsuario.add((Integer) row[0]);
        }
        return areaConocimientoRepository.findByCarreraIdInAndActivoTrue(idCarrerasUsuario)
                .stream()
                .map(InfoAreaConocimientoMapper::toDto)
                .toList();
    }

    @Override
    public List<AreaConocimientoDto> getAllByTemaId(Integer temaId) {
        List<AreaConocimiento> areasConocimiento = areaConocimientoRepository.findByTemaId(temaId);
        return areasConocimiento.stream()
                .map(AreaConocimientoMapper::toDto)
                .toList();
    }


}

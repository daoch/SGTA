package pucp.edu.pe.sgta.service.imp;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.AreaConocimientoDto;
import pucp.edu.pe.sgta.mapper.AreaConocimientoMapper;
import pucp.edu.pe.sgta.model.AreaConocimiento;
import pucp.edu.pe.sgta.repository.AreaConocimientoRepository;
import pucp.edu.pe.sgta.dto.asesores.InfoAreaConocimientoDto;
import pucp.edu.pe.sgta.mapper.InfoAreaConocimientoMapper;
import pucp.edu.pe.sgta.repository.CarreraRepository;
import pucp.edu.pe.sgta.service.inter.AreaConocimientoService;

import pucp.edu.pe.sgta.model.Carrera;
import java.util.ArrayList;
import java.util.List;

@Service
public class AreaConocimientoServiceImpl implements AreaConocimientoService {

    private final AreaConocimientoRepository areaConocimientoRepository;
    private final CarreraRepository carreraRepository;
    @PersistenceContext
    private EntityManager entityManager;

    public AreaConocimientoServiceImpl(AreaConocimientoRepository areaConocimientoRepository,
            CarreraRepository carreraRepository) {
        this.areaConocimientoRepository = areaConocimientoRepository;
        this.carreraRepository = carreraRepository;
    }

    // create
    @Override
    public AreaConocimientoDto create(AreaConocimientoDto dto) {
        if (dto.getIdCarrera() == null) {
            throw new IllegalArgumentException("El id de la carrera no puede ser nulo");
        }
        // fecha Creacion
        dto.setFechaCreacion(java.time.OffsetDateTime.now());
        Carrera carrera = new Carrera();
        carrera.setId(dto.getIdCarrera());
        AreaConocimiento areaConocimiento = AreaConocimientoMapper.toEntity(dto);
        areaConocimiento.setCarrera(carrera);
        AreaConocimiento savedArea = areaConocimientoRepository.save(areaConocimiento);

        return AreaConocimientoMapper.toDto(savedArea);
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
            dto.setNombre((String) fila[1]); // area_nombre
            dto.setDescripcion((String) fila[2]);
            dto.setActivo(true);// descripcion
            lista.add(dto);
        }

        return lista;

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
    public List<AreaConocimientoDto> getAllByCarrera(Integer idCarrera) {
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

}

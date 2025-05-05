package pucp.edu.pe.sgta.service.imp;


import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.AreaConocimientoDto;
import pucp.edu.pe.sgta.mapper.AreaConocimientoMapper;
import pucp.edu.pe.sgta.mapper.SubAreaConocimientoMapper;
import pucp.edu.pe.sgta.model.AreaConocimiento;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;
import pucp.edu.pe.sgta.repository.AreaConocimientoRepository;
import pucp.edu.pe.sgta.service.inter.AreaConocimientoService;

import java.util.ArrayList;
import java.util.List;

@Service
public class AreaConocimientoServiceImpl implements AreaConocimientoService {

    private final AreaConocimientoRepository areaConocimientoRepository;
    @PersistenceContext
    private EntityManager entityManager;

    public AreaConocimientoServiceImpl(AreaConocimientoRepository areaConocimientoRepository) {
        this.areaConocimientoRepository = areaConocimientoRepository;
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
            dto.setId((Integer) fila[0]);          // area_id
            dto.setNombre((String) fila[1]);       // area_nombre
            dto.setDescripcion((String) fila[2]);      // descripcion
            lista.add(dto);
        }

        return lista;
    }



}

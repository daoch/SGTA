package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.MiembroJuradoDto;

import java.util.List;

public interface AutorService {

    public List<MiembroJuradoDto> obtenerUsuarioTemaInfo();
    public List<Object[]> findAreaConocimientoByUsuarioId(Integer usuarioId);
    public List<MiembroJuradoDto> obtenerUsuariosPorEstado(Boolean activoParam);

    public List<MiembroJuradoDto> obtenerUsuariosPorAreaConocimiento(Integer areaConocimientoId);
}

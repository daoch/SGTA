package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.ReunionesXUsuariosDto;
import pucp.edu.pe.sgta.dto.UsuarioNombresDTO;
import pucp.edu.pe.sgta.model.UsuarioXReunion;

import java.util.List;
import java.util.Collection;
import java.util.Optional;

public interface UsuarioXReunionService {

    // Listar todas las relaciones activas
    List<UsuarioXReunion> findAll();

    // Listar reuniones de un usuario específico
    List<UsuarioXReunion> findByUsuarioId(Integer usuarioId);

    // Listar usuarios de una reunión específica
    List<UsuarioXReunion> findByReunionId(Integer reunionId);

    // Listar reuniones de un usuario ordenadas por fecha
    List<UsuarioXReunion> findByUsuarioIdOrderedByDate(Integer usuarioId);

    List<UsuarioNombresDTO> getAsesoresxAlumno(String idAlumno);

    List<ReunionesXUsuariosDto> findReunionesAlumnoAsesor();

    UsuarioXReunion save(UsuarioXReunion usuarioXReunion);

    UsuarioXReunion update(Integer id, UsuarioXReunion usuarioXReunionActualizada) throws Exception;

    void delete(Integer id) throws Exception;

    Optional<UsuarioXReunion> findByReunionIdAndUsuarioId(Integer reunionId,String usuarioId);

    //Agregada
    Optional<UsuarioXReunion> findById(Integer id);

}